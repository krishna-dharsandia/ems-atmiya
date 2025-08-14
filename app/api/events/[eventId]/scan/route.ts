import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params;
    
    // Create a URL for the event check-in page
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const checkInUrl = `${baseUrl}/events/${eventId}/check-in`;
    
    // Redirect to the event check-in page
    return NextResponse.redirect(checkInUrl);
}
