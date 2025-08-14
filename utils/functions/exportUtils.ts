import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import EventExportPDF from '@/components/export/EventExportPDF';

export interface ExportData {
  registrations?: RegistrationExportData[];
  feedbacks?: FeedbackExportData[];
}

export interface RegistrationExportData {
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber?: string;
  department?: string;
  program?: string;
  semester?: string;
  year?: string;
  attended: string;
  registrationDate: string;
}

export interface FeedbackExportData {
  firstName: string;
  lastName: string;
  email: string;
  rating: number;
  feedbackDate: string;
}

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: ExportData, filename: string, type: 'registrations' | 'feedbacks' | 'both') => {
  try {
    let csvData: unknown[] = [];
    let csvContent = '';

    if (type === 'registrations' && data.registrations) {
      csvData = data.registrations;
      csvContent = Papa.unparse(csvData);
    } else if (type === 'feedbacks' && data.feedbacks) {
      csvData = data.feedbacks;
      csvContent = Papa.unparse(csvData);
    } else if (type === 'both') {
      // For both, create separate sections
      if (data.registrations) {
        csvContent += "REGISTRATIONS\n";
        csvContent += Papa.unparse(data.registrations);
        csvContent += "\n\n";
      }
      if (data.feedbacks) {
        csvContent += "FEEDBACKS\n";
        csvContent += Papa.unparse(data.feedbacks);
      }
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export CSV file');
  }
};

/**
 * Export data to XLSX format
 */
export const exportToXLSX = (data: ExportData, filename: string, type: 'registrations' | 'feedbacks' | 'both') => {
  try {
    const workbook = XLSX.utils.book_new();

    if (type === 'registrations' && data.registrations) {
      const worksheet = XLSX.utils.json_to_sheet(data.registrations);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    } else if (type === 'feedbacks' && data.feedbacks) {
      const worksheet = XLSX.utils.json_to_sheet(data.feedbacks);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedbacks');
    } else if (type === 'both') {
      if (data.registrations) {
        const regWorksheet = XLSX.utils.json_to_sheet(data.registrations);
        XLSX.utils.book_append_sheet(workbook, regWorksheet, 'Registrations');
      }
      if (data.feedbacks) {
        const feedbackWorksheet = XLSX.utils.json_to_sheet(data.feedbacks);
        XLSX.utils.book_append_sheet(workbook, feedbackWorksheet, 'Feedbacks');
      }
    }

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to XLSX:', error);
    throw new Error('Failed to export XLSX file');
  }
};

/**
 * Export data to PDF format using React-PDF
 */
export const exportToPDF = async (
  data: ExportData, 
  filename: string, 
  type: 'registrations' | 'feedbacks' | 'both',
  eventName?: string
) => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    // Create the PDF document using React.createElement
    const MyDocument = () => React.createElement(EventExportPDF, {
      eventName: eventName || 'Event',
      registrations: data.registrations,
      feedbacks: data.feedbacks,
      exportType: type
    });

    // Generate PDF blob
    const blob = await pdf(React.createElement(MyDocument)).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export PDF file');
  }
};

/**
 * Format registration data for export
 */
export const formatRegistrationData = (registrations: Record<string, unknown>[]): RegistrationExportData[] => {
  return registrations.map(reg => ({
    firstName: (reg.user as { firstName?: string })?.firstName || 'N/A',
    lastName: (reg.user as { lastName?: string })?.lastName || 'N/A',
    email: (reg.user as { email?: string })?.email || 'N/A',
    registrationNumber: (reg.user as { students?: Array<{ registrationNumber?: string }> })?.students?.[0]?.registrationNumber || 'N/A',
    department: (reg.user as { students?: Array<{ department?: { name?: string } }>, admins?: Array<{ department?: { name?: string } }> })?.students?.[0]?.department?.name || 
                (reg.user as { students?: Array<{ department?: { name?: string } }>, admins?: Array<{ department?: { name?: string } }> })?.admins?.[0]?.department?.name || 'N/A',
    program: (reg.user as { students?: Array<{ program?: { name?: string } }>, admins?: Array<{ program?: { name?: string } }> })?.students?.[0]?.program?.name || 
             (reg.user as { students?: Array<{ program?: { name?: string } }>, admins?: Array<{ program?: { name?: string } }> })?.admins?.[0]?.program?.name || 'N/A',
    semester: (reg.user as { students?: Array<{ currentSemester?: number }> })?.students?.[0]?.currentSemester?.toString() || 'N/A',
    year: (reg.user as { students?: Array<{ currentYear?: number }> })?.students?.[0]?.currentYear?.toString() || 'N/A',
    attended: (reg.attended as boolean) ? 'Yes' : 'No',
    registrationDate: new Date(reg.createdAt as string).toLocaleDateString('en-US')
  }));
};

/**
 * Format feedback data for export
 */
export const formatFeedbackData = (feedbacks: Record<string, unknown>[]): FeedbackExportData[] => {
  return feedbacks.map(feedback => ({
    firstName: (feedback.user as { firstName?: string })?.firstName || 'N/A',
    lastName: (feedback.user as { lastName?: string })?.lastName || 'N/A',
    email: (feedback.user as { email?: string })?.email || 'N/A',
    rating: (feedback.rating as number) || 0,
    feedbackDate: new Date(feedback.createdAt as string).toLocaleDateString('en-US')
  }));
};
