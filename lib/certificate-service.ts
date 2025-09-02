"use server";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { createClient } from "@/utils/supabase/server";
import { CertificatePlaceholder } from "@/components/section/master/events/CertificateDesigner";
import sharp from "sharp";

/**
 * Service to handle certificate generation
 */
export class CertificateService {
  /**
   * Generate a certificate for a user based on template and placeholders
   */
  static async generateCertificate({
    templateUrl,
    placeholders,
    userData,
    eventName,
  }: {
    templateUrl: string;
    placeholders: CertificatePlaceholder[];
    userData: Record<string, string>;
    eventName: string;
  }) {
    try {
      // Get the template file from storage
      const supabase = await createClient();

      // Parse the URL to get the bucket and path
      let bucketPath = templateUrl;
      if (bucketPath.startsWith('/')) {
        bucketPath = bucketPath.substring(1);
      }

      // Download template from Supabase storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("event-certificates")
        .download(bucketPath);

      if (downloadError) {
        throw new Error(`Error downloading template: ${downloadError.message}`);
      }

      // Check if the template is an image (PNG/JPG) or PDF
      const fileExtension = bucketPath.split('.').pop()?.toLowerCase();
      let pdfDoc: PDFDocument;

      if (fileExtension === 'pdf') {
        // If it's a PDF, just load it
        pdfDoc = await PDFDocument.load(await fileData.arrayBuffer());
      } else {
        // If it's an image, embed it into a new PDF
        pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([842, 595]); // A4 landscape

        // Convert image to PNG if needed using sharp
        const pngBuffer = await sharp(await fileData.arrayBuffer())
          .toFormat('png')
          .toBuffer();

        // Embed the PNG image
        const image = await pdfDoc.embedPng(pngBuffer);
        const { width, height } = image.size();

        // Calculate scaling to fit the page
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const scale = Math.min(pageWidth / width, pageHeight / height);

        // Center the image on the page
        const x = (pageWidth - width * scale) / 2;
        const y = (pageHeight - height * scale) / 2;

        page.drawImage(image, {
          x,
          y,
          width: width * scale,
          height: height * scale,
        });
      }

      // Get the first page to draw text on
      const page = pdfDoc.getPages()[0];

      // Load fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      const courier = await pdfDoc.embedFont(StandardFonts.Courier);

      // Map of fonts
      const fontMap = {
        'Helvetica': helveticaFont,
        'Arial': helveticaFont, // Use Helvetica as substitute for Arial
        'Times New Roman': timesRoman,
        'Courier New': courier,
        'Verdana': helveticaFont, // Use Helvetica as substitute for Verdana
        'Georgia': timesRoman, // Use Times as substitute for Georgia
      };

      // Draw all placeholders on the PDF
      for (const placeholder of placeholders) {
        // Get the actual value from userData or use the label as fallback
        const value = userData[placeholder.key] || placeholder.label;

        // Parse color (hex to rgb)
        const hex = placeholder.color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        // Select font
        const font = fontMap[placeholder.fontFamily as keyof typeof fontMap] || helveticaFont;

        // Draw text
        page.drawText(value, {
          x: placeholder.x,
          y: page.getHeight() - placeholder.y, // PDF coordinate system is bottom-up
          size: placeholder.fontSize,
          font,
          color: rgb(r, g, b),
        });
      }

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();
      return pdfBytes;
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  }
}
