import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { QRCodeService } from '@/lib/qr-code';
import { PrismaClient } from "@prisma/client";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ registrationId: string }> }
) {
    const prisma = new PrismaClient();
    try {
        const { registrationId } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the registration details
        const registration = await prisma.eventRegistration.findUnique({
            where: { id: registrationId },
            include: {
                event: {
                    select: { id: true, name: true, start_date: true }
                },
                user: {
                    select: { supabaseId: true, firstName: true, lastName: true }
                }
            }
        });

        if (!registration) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        // Check if the current user owns this registration
        if (registration.user.supabaseId !== user.id) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            );
        }

        // Check if QR code already exists
        if (registration.qrCode) {
            return NextResponse.json({
                message: 'QR code already exists',
                qrCode: registration.qrCode,
                qrCodeData: registration.qrCodeData
            });
        }

        // Generate QR code for the registration
        const { qrCode, qrCodeData } = await QRCodeService.generateEventRegistrationQRCode(
            user.id,
            registration.eventId,
            registrationId
        );

        // Update registration with QR code
        await prisma.eventRegistration.update({
            where: { id: registrationId },
            data: {
                qrCode,
                qrCodeData
            }
        });

        return NextResponse.json({
            message: 'QR code generated successfully',
            qrCode,
            qrCodeData,
            event: {
                name: registration.event.name,
                date: registration.event.start_date
            }
        });

    } catch (error) {
        console.error('Error generating registration QR code:', error);
        return NextResponse.json(
            { error: 'Failed to generate QR code' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ registrationId: string }> }
) {
    const prisma = new PrismaClient();
    try {
        const { registrationId } = await params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the registration with QR code
        const registration = await prisma.eventRegistration.findUnique({
            where: { id: registrationId },
            include: {
                event: {
                    select: {
                        id: true,
                        name: true,
                        start_date: true,
                        end_date: true,
                        start_time: true,
                        end_time: true,
                        address: true,
                        mode: true
                    }
                },
                user: {
                    select: {
                        supabaseId: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        if (!registration) {
            return NextResponse.json(
                { error: 'Registration not found' },
                { status: 404 }
            );
        }

        // Check if the current user owns this registration
        if (registration.user.supabaseId !== user.id) {
            return NextResponse.json(
                { error: 'Access denied' },
                { status: 403 }
            );
        }

        if (!registration.qrCode) {
            return NextResponse.json(
                { error: 'QR code not found. Please generate one first.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            qrCode: registration.qrCode,
            qrCodeData: registration.qrCodeData,
            registration: {
                id: registration.id,
                attended: registration.attended,
                checkedInAt: registration.checkedInAt,
                createdAt: registration.createdAt
            },
            event: registration.event,
            user: {
                firstName: registration.user.firstName,
                lastName: registration.user.lastName,
                email: registration.user.email
            }
        });

    } catch (error) {
        console.error('Error fetching registration QR code:', error);
        return NextResponse.json(
            { error: 'Failed to fetch QR code' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
