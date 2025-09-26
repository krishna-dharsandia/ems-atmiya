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

    const body = await request.json();
    const { teamId, hackathonId } = body;

    if (!teamId || !hackathonId) {
      return NextResponse.json({ error: 'Team ID and Hackathon ID are required' }, { status: 400 });
    }

    // Get the student associated with the user
    const student = await prisma.student.findUnique({
      where: { userId: user.id }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if the student is a member of the team
    const teamMember = await prisma.hackathonTeamMember.findUnique({
      where: {
        teamId_studentId: {
          teamId: teamId,
          studentId: student.id
        }
      }
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'You are not a member of this team' }, { status: 403 });
    }

    // Check if team member already has a QR code
    if (teamMember.qrCode) {
      return NextResponse.json({
        message: 'QR code already exists',
        qrCode: teamMember.qrCode,
        qrCodeData: teamMember.qrCodeData
      });
    }

    // Generate new QR code for the team member
    const { qrCode, qrCodeData } = await QRCodeService.generateTeamMemberQRCode(student.id, teamId, hackathonId);

    // Update team member with QR code
    await prisma.hackathonTeamMember.update({
      where: {
        id: teamMember.id
      },
      data: {
        qrCode,
        qrCodeData
      }
    });

    return NextResponse.json({
      message: 'QR code generated successfully',
      qrCode,
      qrCodeData
    });

  } catch (error) {
    console.error('Error generating team member QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get search params
    const url = new URL(request.url);
    const teamId = url.searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // Get the student associated with the user
    const student = await prisma.student.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Get team member's QR code
    const teamMember = await prisma.hackathonTeamMember.findUnique({
      where: {
        teamId_studentId: {
          teamId: teamId,
          studentId: student.id
        }
      }
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'You are not a member of this team' }, { status: 403 });
    }

    if (!teamMember.qrCode) {
      return NextResponse.json(
        { error: 'QR code not found. Please generate one first.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      qrCode: teamMember.qrCode,
      qrCodeData: teamMember.qrCodeData,
      user: {
        firstName: student.user.firstName,
        lastName: student.user.lastName,
        email: student.user.email
      }
    });

  } catch (error) {
    console.error('Error fetching team member QR code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
