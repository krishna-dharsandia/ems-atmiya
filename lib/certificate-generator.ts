import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface PlaceholderConfig {
  key: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export class CertificateService {
  /**
   * Generate a certificate from a template with placeholders
   * @param templateUrl URL of the certificate template (PNG, JPG, or PDF)
   * @param placeholders Array of placeholder configurations
   * @param userData Object containing data to replace placeholders
   * @returns PDF document as Uint8Array
   */
  static async generateCertificate(
    templateUrl: string,
    placeholders: PlaceholderConfig[],
    userData: Record<string, string>
  ): Promise<Uint8Array> {
    const templateResponse = await fetch(templateUrl);
    const templateArrayBuffer = await templateResponse.arrayBuffer();
    const fileType = templateUrl.split('.').pop()?.toLowerCase();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    let page;

    // Process template based on file type
    if (fileType === 'pdf') {
      // If template is a PDF, use its first page
      const templatePdf = await PDFDocument.load(templateArrayBuffer);
      const [templatePage] = await pdfDoc.copyPages(templatePdf, [0]);
      page = pdfDoc.addPage(templatePage);
    } else {
      // For images (PNG/JPG)
      const { width, height } = { width: 842, height: 595 }; // A4 landscape
      page = pdfDoc.addPage([width, height]);

      if (fileType === 'png') {
        const pngImage = await pdfDoc.embedPng(templateArrayBuffer);
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
      } else if (fileType === 'jpg' || fileType === 'jpeg') {
        const jpgImage = await pdfDoc.embedJpg(templateArrayBuffer);
        page.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: page.getWidth(),
          height: page.getHeight(),
        });
      }
    }

    // Add text for each placeholder
    for (const placeholder of placeholders) {
      const value = userData[placeholder.key] || '';

      // Convert color hex to RGB (e.g. #FF0000 -> { r: 1, g: 0, b: 0 })
      const hexColor = placeholder.color.replace('#', '');
      const r = parseInt(hexColor.substr(0, 2), 16) / 255;
      const g = parseInt(hexColor.substr(2, 2), 16) / 255;
      const b = parseInt(hexColor.substr(4, 2), 16) / 255;

      // Use StandardFonts (pdf-lib has limited built-in fonts)
      let fontToUse = StandardFonts.Helvetica;
      if (placeholder.fontFamily.includes('Times')) fontToUse = StandardFonts.TimesRoman;
      else if (placeholder.fontFamily.includes('Courier')) fontToUse = StandardFonts.Courier;

      const font = await pdfDoc.embedFont(fontToUse);

      page.drawText(value, {
        x: placeholder.x,
        y: placeholder.y,
        size: placeholder.fontSize,
        font,
        color: rgb(r, g, b),
      });
    }

    // Finalize the PDF and return it
    return await pdfDoc.save();
  }
}
