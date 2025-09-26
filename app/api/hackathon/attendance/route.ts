import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { QRCodeService } from '@/lib/qr-code';
import { PrismaClient } from "@prisma/client";

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get QR code data from request body
    const body = await request.json();
    const { qrCodeData } = body;

    if (!qrCodeData) {
      return NextResponse.json({ error: 'QR code data is required' }, { status: 400 });
    }

    // Parse and verify QR code
    const qrData = QRCodeService.parseQRCodeData(qrCodeData);
    if (!qrData) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 400 });
    }

    // Check if this is a team member QR code
    if (qrData.type !== 'teamMember' || !qrData.userId || !qrData.teamId || !qrData.hackathonId) {
      return NextResponse.json({ error: 'Invalid QR code type or missing data' }, { status: 400 });
    }

    // Get the admin's or master's role
    const adminUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      select: { role: true }
    });

    // Ensure the user scanning is an admin or master
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'MASTER')) {
      return NextResponse.json({ error: 'Only admins or masters can mark attendance' }, { status: 403 });
    }

    // Update team member attendance
    const teamMember = await prisma.hackathonTeamMember.findFirst({
      where: {
        studentId: qrData.userId,
        teamId: qrData.teamId,
        team: {
          hackathonId: qrData.hackathonId
        }
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Mark the team member as attended
    await prisma.hackathonTeamMember.update({
      where: { id: teamMember.id },
      data: { attended: true }
    });

    return NextResponse.json({
      message: 'Attendance marked successfully',
      student: {
        firstName: teamMember.student.user.firstName,
        lastName: teamMember.student.user.lastName,
        email: teamMember.student.user.email
      }
    });

  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { error: 'Failed to mark attendance' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
