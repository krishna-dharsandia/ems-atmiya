
import QRCode from 'qrcode';
import crypto from 'crypto';

export interface QRCodeData {
  id: string;
  type: 'user' | 'event' | 'teamMember';
  userId: string;
  eventId?: string;
  teamId?: string;
  hackathonId?: string;
  timestamp: number;
  signature: string; // For security verification
}

export class QRCodeService {
  private static readonly SECRET_KEY = process.env.QR_CODE_SECRET || 'default-secret-key';

  /**
   * Generate a secure signature for QR code data
   */
  private static generateSignature(data: Omit<QRCodeData, 'signature'>): string {
    const payload = JSON.stringify(data);
    return crypto
      .createHmac('sha256', this.SECRET_KEY)
      .update(payload)
      .digest('hex');
  }

  /**
   * Verify QR code signature
   */
  public static verifySignature(data: QRCodeData): boolean {
    const { signature, ...rest } = data;
    const expectedSignature = this.generateSignature(rest);
    return signature === expectedSignature;
  }

  /**
   * Generate QR code data for a user
   */
  public static createUserQRData(userId: string): QRCodeData {
    const data: Omit<QRCodeData, 'signature'> = {
      id: crypto.randomUUID(),
      type: 'user',
      userId,
      timestamp: Date.now(),
    };

    return {
      ...data,
      signature: this.generateSignature(data),
    };
  }
  /**
   * Generate QR code data for an event
   */
  public static createEventQRData(
    eventId: string,
    createdById: string
  ): QRCodeData {
    const data: Omit<QRCodeData, 'signature'> = {
      id: crypto.randomUUID(),
      type: 'event',
      userId: createdById,
      eventId: eventId,
      timestamp: Date.now(),
    };

    return {
      ...data,
      signature: this.generateSignature(data),
    };
  }
  /**
   * Generate QR code data for a team member
   */
  public static createTeamMemberQRData(
    studentId: string,
    teamId: string,
    hackathonId: string
  ): QRCodeData {
    const data: Omit<QRCodeData, 'signature'> = {
      id: crypto.randomUUID(),
      type: 'teamMember',
      userId: studentId,
      teamId: teamId,
      hackathonId: hackathonId,
      timestamp: Date.now(),
    };

    return {
      ...data,
      signature: this.generateSignature(data),
    };
  }
  /**
   * Generate QR code as base64 string
   */
  public static async generateQRCode(data: QRCodeData): Promise<string> {
    try {
      const jsonData = JSON.stringify(data);
      const qrCodeDataURL = await QRCode.toDataURL(jsonData, {
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 300,
      });

      // Remove the data:image/png;base64, prefix
      return qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code for user
   */
  public static async generateUserQRCode(userId: string): Promise<{
    qrCode: string;
    qrCodeData: string;
  }> {
    const qrData = this.createUserQRData(userId);
    const qrCode = await this.generateQRCode(qrData);

    return {
      qrCode,
      qrCodeData: JSON.stringify(qrData),
    };
  }
  /**
   * Generate QR code for event
   */
  public static async generateEventQRCode(
    eventId: string,
    createdById: string
  ): Promise<{
    qrCode: string;
    qrCodeData: string;
  }> {
    const qrData = this.createEventQRData(eventId, createdById);
    const qrCode = await this.generateQRCode(qrData);

    return {
      qrCode,
      qrCodeData: JSON.stringify(qrData),
    };
  }
  /**
   * Generate QR code for team member
   */
  public static async generateTeamMemberQRCode(
    studentId: string,
    teamId: string,
    hackathonId: string
  ): Promise<{
    qrCode: string;
    qrCodeData: string;
  }> {
    const qrData = this.createTeamMemberQRData(studentId, teamId, hackathonId);
    const qrCode = await this.generateQRCode(qrData);

    return {
      qrCode,
      qrCodeData: JSON.stringify(qrData),
    };
  }

  /**
   * Generate QR code for event with URL (for direct scanning to event page)
   */
  public static async generateEventURLQRCode(
    eventId: string
  ): Promise<{
    qrCode: string;
    qrCodeData: string;
  }> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const eventUrl = `${baseUrl}/events/${eventId}`;

    const qrCode = await this.generateDisplayQRCode(eventUrl);

    return {
      qrCode,
      qrCodeData: eventUrl,
    };
  }
  /**
   * Generate QR code for hackathon with URL (for direct scanning to hackathon page)
   */
  public static async generateHackathonURLQRCode(
    hackathonId: string
  ): Promise<{
    qrCode: string;
    qrCodeData: string;
  }> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const hackathonUrl = `${baseUrl}/hackathons/${hackathonId}`;

    const qrCode = await this.generateDisplayQRCode(hackathonUrl);

    return {
      qrCode,
      qrCodeData: hackathonUrl,
    };
  }
  /**
   * Parse and verify QR code data
   */
  public static parseQRCodeData(qrCodeString: string): QRCodeData | null {
    try {
      const data = JSON.parse(qrCodeString) as QRCodeData;

      // Verify the signature
      if (!this.verifySignature(data)) {
        console.error('Invalid QR code signature');
        return null;
      }

      // QR codes now have lifetime validity - no expiration check
      // The timestamp is kept for tracking purposes but not for expiration

      return data;
    } catch (error) {
      console.error('Error parsing QR code data:', error);
      return null;
    }
  }
  /**
   * Generate a simple display QR code (for showing user info)
   */
  public static async generateDisplayQRCode(text: string): Promise<string> {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(text, {
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 200,
      });

      return qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
    } catch (error) {
      console.error('Error generating display QR code:', error);
      throw new Error('Failed to generate display QR code');
    }
  }
}
