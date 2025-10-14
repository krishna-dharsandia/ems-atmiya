import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import EventExportPDF from '@/components/export/EventExportPDF';
import HackathonExportPDF from '@/components/export/HackathonExportPDF';
import { HackthonICARD } from '@/components/export/HackthonICARD';
import { HackthonICARDBunch } from '@/components/export/HacktthonICARDBunch';
import HackathonSignatureExportPDF from '@/components/export/HackthonSignatureSheet';

export interface ExportData {
  registrations?: RegistrationExportData[];
  feedbacks?: FeedbackExportData[];
  teams?: TeamExportData[];
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

export interface TeamMemberData {
  name: string;
  email: string;
  department: string;
  enrollment: string;
  phoneNumber?: string;
  attended: boolean;
  isTeamAdmin: boolean;
  university: string;
}

export interface TeamExportData {
  teamName: string;
  teamId: string;
  problemStatement: string;
  problemCode: string;
  memberCount: number;
  members: TeamMemberData[];
  memberNames: string;
  memberEmails: string;
  memberDepartments: string;
  memberEnrollments: string;
  submissionUrl: string;
  hasSubmission: string;
  attendedMembers: string;
}

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: ExportData, filename: string, type: 'registrations' | 'feedbacks' | 'teams' | 'both') => {
  try {
    let csvData: unknown[] = [];
    let csvContent = '';

    if (type === 'registrations' && data.registrations) {
      csvData = data.registrations;
      
      // Add summary information for incomplete profiles
      const incompleteProfiles = data.registrations.filter(reg => 
        reg.department === 'Profile incomplete' || 
        reg.program === 'Profile incomplete' || 
        reg.registrationNumber === 'Profile incomplete'
      ).length;
      
      if (incompleteProfiles > 0) {
        csvContent = `Note: ${incompleteProfiles} out of ${data.registrations.length} registrations have incomplete profiles (missing department, program, or registration number).\n\n`;
      }
      
      csvContent += Papa.unparse(csvData);
    } else if (type === 'feedbacks' && data.feedbacks) {
      csvData = data.feedbacks;
      csvContent = Papa.unparse(csvData);
    } else if (type === 'teams' && data.teams) {
      // Create individual rows for each team member with team information
      const teamMemberRows: Record<string, unknown>[] = [];
      
      data.teams.forEach(team => {
        if (team.members && team.members.length > 0) {
          team.members.forEach(member => {
            teamMemberRows.push({
              'Team ID': team.teamId,
              'Team Name': team.teamName,
              'Problem Code': team.problemCode,
              'Problem Statement': team.problemStatement,
              'Member Name': member.name,
              'Member Email': member.email,
              'Department': member.department,
              'Enrollment': member.enrollment,
              'Role': member.isTeamAdmin ? 'Team Admin' : 'Member',
              'Attended': member.attended ? 'Yes' : 'No',
              'Team Size': team.memberCount,
              'Has Submission': team.hasSubmission,
              'Submission URL': team.submissionUrl
            });
          });
        } else {
          // Fallback for teams without members
          teamMemberRows.push({
            'Team ID': team.teamId,
            'Team Name': team.teamName,
            'Problem Code': team.problemCode,
            'Problem Statement': team.problemStatement,
            'Member Name': 'No members',
            'Member Email': 'N/A',
            'Department': 'N/A',
            'Enrollment': 'N/A',
            'Role': 'N/A',
            'Attended': 'N/A',
            'Team Size': 0,
            'Has Submission': team.hasSubmission,
            'Submission URL': team.submissionUrl
          });
        }
      });
      
      csvContent = Papa.unparse(teamMemberRows);
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
        csvContent += "\n\n";
      }
      if (data.teams) {
        csvContent += "TEAMS\n";
        const teamMemberRows: Record<string, unknown>[] = [];
        
        data.teams.forEach(team => {
          if (team.members && team.members.length > 0) {
            team.members.forEach(member => {
              teamMemberRows.push({
                'Team ID': team.teamId,
                'Team Name': team.teamName,
                'Problem Code': team.problemCode,
                'Problem Statement': team.problemStatement,
                'Member Name': member.name,
                'Member Email': member.email,
                'Department': member.department,
                'Enrollment': member.enrollment,
                'Role': member.isTeamAdmin ? 'Team Admin' : 'Member',
                'Attended': member.attended ? 'Yes' : 'No',
                'Team Size': team.memberCount,
                'Has Submission': team.hasSubmission,
                'Submission URL': team.submissionUrl
              });
            });
          }
        });
        
        csvContent += Papa.unparse(teamMemberRows);
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
export const exportToXLSX = (data: ExportData, filename: string, type: 'registrations' | 'feedbacks' | 'teams' | 'both') => {
  try {
    const workbook = XLSX.utils.book_new();

    if (type === 'registrations' && data.registrations) {
      const worksheet = XLSX.utils.json_to_sheet(data.registrations);
      
      // Add summary information for incomplete profiles
      const incompleteProfiles = data.registrations.filter(reg => 
        reg.department === 'Profile incomplete' || 
        reg.program === 'Profile incomplete' || 
        reg.registrationNumber === 'Profile incomplete'
      ).length;
      
      if (incompleteProfiles > 0) {
        // Add a summary sheet
        const summaryData = [
          { 'Summary': 'Total Registrations', 'Count': data.registrations.length },
          { 'Summary': 'Incomplete Profiles', 'Count': incompleteProfiles },
          { 'Summary': 'Note', 'Count': 'Users with incomplete profiles may need to complete their onboarding process' }
        ];
        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');
      }
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    } else if (type === 'feedbacks' && data.feedbacks) {
      const worksheet = XLSX.utils.json_to_sheet(data.feedbacks);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedbacks');
    } else if (type === 'teams' && data.teams) {
      // Create team overview sheet
      const teamOverview = data.teams.map(team => ({
        'Team ID': team.teamId,
        'Team Name': team.teamName,
        'Member Count': team.memberCount,
        'Attended Members': team.attendedMembers,
        'Has Submission': team.hasSubmission,
        'Submission URL': team.submissionUrl
      }));
      const teamWs = XLSX.utils.json_to_sheet(teamOverview);
      XLSX.utils.book_append_sheet(workbook, teamWs, 'Team Overview');
      
      // Create detailed members sheet with team admin first
      const memberDetails: Record<string, unknown>[] = [];
      data.teams.forEach(team => {
        if (team.members && team.members.length > 0) {
          team.members.forEach(member => {
            memberDetails.push({
              'Team ID': team.teamId,
              'Team Name': team.teamName,
              'Member Name': member.name,
              'Phone Number': member.phoneNumber || 'N/A',
              'Role': member.isTeamAdmin ? 'Team Leader' : 'Member',
              'University': member.university || 'N/A',
              'Attended': member.attended ? 'Yes' : 'No'
            });
          });
        }
      });
      const memberWs = XLSX.utils.json_to_sheet(memberDetails);
      XLSX.utils.book_append_sheet(workbook, memberWs, 'Team Members');
    } else if (type === 'both') {
      if (data.registrations) {
        const regWorksheet = XLSX.utils.json_to_sheet(data.registrations);
        XLSX.utils.book_append_sheet(workbook, regWorksheet, 'Registrations');
      }
      if (data.feedbacks) {
        const feedbackWorksheet = XLSX.utils.json_to_sheet(data.feedbacks);
        XLSX.utils.book_append_sheet(workbook, feedbackWorksheet, 'Feedbacks');
      }
      if (data.teams) {
        // Create team overview sheet
        const teamOverview = data.teams.map(team => ({
          'Team ID': team.teamId,
          'Team Name': team.teamName,
          'Problem Code': team.problemCode,
          'Problem Statement': team.problemStatement,
          'Member Count': team.memberCount,
          'Attended Members': team.attendedMembers,
          'Has Submission': team.hasSubmission,
          'Submission URL': team.submissionUrl
        }));
        const teamWs = XLSX.utils.json_to_sheet(teamOverview);
        XLSX.utils.book_append_sheet(workbook, teamWs, 'Team Overview');
        
        // Create detailed members sheet
        const memberDetails: Record<string, unknown>[] = [];
        data.teams.forEach(team => {
          if (team.members && team.members.length > 0) {
            team.members.forEach(member => {
              memberDetails.push({
                'Team ID': team.teamId,
                'Team Name': team.teamName,
                'Problem Code': team.problemCode,
                'Member Name': member.name,
                'Member Email': member.email,
                'Department': member.department,
                'Enrollment': member.enrollment,
                'Role': member.isTeamAdmin ? 'Team Admin' : 'Member',
                'Attended': member.attended ? 'Yes' : 'No'
              });
            });
          }
        });
        const memberWs = XLSX.utils.json_to_sheet(memberDetails);
        XLSX.utils.book_append_sheet(workbook, memberWs, 'Team Members');
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
  type: 'registrations' | 'signature-sheet' | 'feedbacks' | 'teams' | 'both',
  eventName?: string
) => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }    let MyDocument;   

    if(type === 'signature-sheet') {
      const HackathonSignatureDocument = () => React.createElement(HackathonSignatureExportPDF, {
        hackathonName: eventName || 'Hackathon',
        teams: data.teams,
        exportType: 'teams'
      });
      HackathonSignatureDocument.displayName = 'HackathonSignatureDocument';
      MyDocument = HackathonSignatureDocument;
    }
    // Choose the appropriate PDF component based on export type
    else if (type === 'teams' || (type === 'both' && data.teams && !data.registrations && !data.feedbacks)) {
      // Use HackathonExportPDF for team data
      const HackathonDocument = () => React.createElement(HackathonExportPDF, {
        hackathonName: eventName || 'Hackathon',
        teams: data.teams,
        exportType: 'teams'
      });
      HackathonDocument.displayName = 'HackathonDocument';
      MyDocument = HackathonDocument;

    } else {
      // Use EventExportPDF for event data (registrations/feedbacks)
      const EventDocument = () => React.createElement(EventExportPDF, {
        eventName: eventName || 'Event',
        registrations: data.registrations,
        feedbacks: data.feedbacks,
        exportType: type as 'registrations' | 'feedbacks' | 'both'
      });
      EventDocument.displayName = 'EventDocument';
      MyDocument = EventDocument;
    }

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
 * Export hackathon ID card to PDF
 */
export const exportIdCardToPDF = async (
  name: string,
  teamName: string,
  teamId: string | null,
  participantId: string,
  participantRole: string,
  userType: string,
  qrCode: string,
  hackathonName: string
) => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    // Create the ID card document (HackthonICARD already returns a Document)
    const IdCardDocument = HackthonICARD({
      name,
      teamName,
      teamId,
      participantId,
      participantRole,
      userType,
      qrCode
    });

    // Generate PDF blob
    const blob = await pdf(IdCardDocument).toBlob();
    
    // Create filename
    const fileName = `${hackathonName.replace(/\s+/g, '_')}_ID_Card_${name.replace(/\s+/g, '_')}.pdf`;
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exporting ID card to PDF:', error);
    throw new Error('Failed to export ID card PDF');
  }
};

/**
 * Bulk export multiple hackathon ID cards as separate PDF files
 */
export const bulkExportIdCardsToPDF = async (
  members: Array<{
    id: string;
    name: string;
    participantRole: string;
    qrCode: string;
  }>,
  teamName: string,
  teamId: string,
  userType: string,
  hackathonName: string,
  onProgress?: (current: number, total: number) => void
) => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    const total = members.length;
    
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      
      // Call progress callback if provided
      onProgress?.(i + 1, total);
      
      // Export individual ID card
      await exportIdCardToPDF(
        member.name,
        teamName,
        teamId,
        member.id,
        member.participantRole,
        userType,
        member.qrCode,
        hackathonName
      );
      
      // Add a small delay between downloads to prevent browser blocking
      if (i < members.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
  } catch (error) {
    console.error('Error bulk exporting ID cards to PDF:', error);
    throw new Error('Failed to bulk export ID cards');
  }
};

/**
 * Export batch hackathon ID cards (up to 10 per page) to PDF - Single PDF with multiple pages
 */
export const exportBatchIdCardsToPDF = async (
  participants: Array<{
    name: string;
    teamName: string;
    teamId: string | null;
    participantId: string;
    participantRole: string;
    userType: string;
    qrCode: string;
  }>,
  hackathonName: string,
  onProgress?: (current: number, total: number) => void
) => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    if (!participants || participants.length === 0) {
      throw new Error('No participants provided for ID card export');
    }

    // Calculate total pages (10 participants per page)
    const totalPages = Math.ceil(participants.length / 10);
    
    // Call progress callback if provided
    onProgress?.(1, 1); // Single PDF generation

    // Create the batch ID card document with all participants
    // The component will automatically create multiple pages as needed
    const BatchIdCardDocument = HackthonICARDBunch({
      participants: participants
    });

    // Generate PDF blob
    const blob = await pdf(BatchIdCardDocument).toBlob();
    
    // Create filename
    const fileName = `${hackathonName.replace(/\s+/g, '_')}_ID_Cards_${participants.length}_participants_${totalPages}_pages.pdf`;
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exporting batch ID cards to PDF:', error);
    throw new Error('Failed to export batch ID cards PDF');
  }
};

/**
 * Export batch hackathon ID cards as separate PDF files (legacy behavior)
 */
export const exportBatchIdCardsToSeparatePDFs = async (
  participants: Array<{
    name: string;
    teamName: string;
    teamId: string | null;
    participantId: string;
    participantRole: string;
    userType: string;
    qrCode: string;
  }>,
  hackathonName: string,
  onProgress?: (current: number, total: number) => void
) => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    if (!participants || participants.length === 0) {
      throw new Error('No participants provided for ID card export');
    }

    // Split participants into chunks of 10 (max per page)
    const chunks = [];
    for (let i = 0; i < participants.length; i += 10) {
      chunks.push(participants.slice(i, i + 10));
    }

    const totalChunks = chunks.length;

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      
      // Call progress callback if provided
      onProgress?.(chunkIndex + 1, totalChunks);

      // Create the batch ID card document for this chunk only
      const BatchIdCardDocument = HackthonICARDBunch({
        participants: chunk
      });

      // Generate PDF blob
      const blob = await pdf(BatchIdCardDocument).toBlob();
      
      // Create filename with chunk number if multiple chunks
      const chunkSuffix = totalChunks > 1 ? `_batch_${chunkIndex + 1}_of_${totalChunks}` : '';
      const fileName = `${hackathonName.replace(/\s+/g, '_')}_ID_Cards${chunkSuffix}.pdf`;
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up URL
      URL.revokeObjectURL(url);

      // Add a small delay between downloads to prevent browser blocking multiple files
      if (chunkIndex < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
  } catch (error) {
    console.error('Error exporting batch ID cards to separate PDFs:', error);
    throw new Error('Failed to export batch ID cards to separate PDFs');
  }
};

/**
 * Format registration data for export
 */
export const formatRegistrationData = (registrations: Record<string, unknown>[]): RegistrationExportData[] => {
  return registrations.map(reg => {
    const user = reg.user as {
      firstName?: string;
      lastName?: string;
      email?: string;
      students?: {
        registrationNumber?: string;
        department?: { name?: string };
        program?: { name?: string };
        currentSemester?: number;
        currentYear?: number;
      };
      admins?: {
        department?: { name?: string };
        program?: { name?: string };
      };
    };

    // Check if user has student or admin profile
    const student = user.students;
    const admin = user.admins;

    // Determine if user has completed profile
    const hasStudentProfile = student && (student.department || student.program || student.registrationNumber);
    const hasAdminProfile = admin && (admin.department || admin.program);

    return {
      firstName: user.firstName || 'N/A',
      lastName: user.lastName || 'N/A',
      email: user.email || 'N/A',
      registrationNumber: hasStudentProfile ? (student?.registrationNumber || 'Not provided') : 'Profile incomplete',
      department: hasStudentProfile ? (student?.department?.name || 'Not provided') : 
                  hasAdminProfile ? (admin?.department?.name || 'Not provided') : 'Profile incomplete',
      program: hasStudentProfile ? (student?.program?.name || 'Not provided') : 
               hasAdminProfile ? (admin?.program?.name || 'Not provided') : 'Profile incomplete',
      semester: hasStudentProfile ? (student?.currentSemester?.toString() || 'Not provided') : 'Profile incomplete',
      year: hasStudentProfile ? (student?.currentYear?.toString() || 'Not provided') : 'Profile incomplete',
      attended: (reg.attended as boolean) ? 'Yes' : 'No',
      registrationDate: new Date(reg.createdAt as string).toLocaleDateString('en-US')
    };
  });
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

/**
 * Format team data for export
 */
export const formatTeamData = (teams: Record<string, unknown>[]): TeamExportData[] => {
  return teams.map(team => {   
    const teamMembers = (team.members as Array<{
      id?: string;
      student?: {
        id?: string;
        user?: { firstName?: string; lastName?: string; email?: string , phone?: string };
        department?: { name?: string };
        enrollment?: string;
        university: string;
      };
      attended?: boolean;
    }>) || [];// Get the team leader ID from the team data
    const teamLeaderId = (team as any).leaderId;

    // Sort members to put team admin (leader) first
    const sortedMembers = [...teamMembers].sort((a, b) => {
      // Put the team leader first, then sort others by ID
      const aIsLeader = a.student?.id === teamLeaderId;
      const bIsLeader = b.student?.id === teamLeaderId;
      
      if (aIsLeader && !bIsLeader) return -1;
      if (!aIsLeader && bIsLeader) return 1;
      
      return (a.id || '').localeCompare(b.id || '');
    });    
    
    // Format individual member data
    const members: TeamMemberData[] = sortedMembers.map((member) => ({
      name: `${member.student?.user?.firstName || ''} ${member.student?.user?.lastName || ''}`.trim() || 'N/A',
      email: member.student?.user?.email || 'N/A',
      phoneNumber: member.student?.user?.phone || 'N/A',
      university: member.student?.university || 'N/A',
      department: member.student?.department?.name || 'N/A',
      enrollment: member.student?.enrollment || 'N/A',
      attended: member.attended || false,
      isTeamAdmin: member.student?.id === teamLeaderId // Check against leaderId
    }));

    // Legacy concatenated strings for backward compatibility
    const memberNames = members.map(m => m.name).join(', ');
    const memberEmails = members.map(m => m.email).join(', ');
    const memberDepartments = members.map(m => m.department).join(', ');
    const memberEnrollments = members.map(m => m.enrollment).join(', ');

    const attendedMembers = members.filter(m => m.attended).length;

    return {
      teamName: (team.teamName as string) || 'N/A',
      teamId: (team.teamId as string) || 'N/A',
      problemStatement: (team.problemStatement as { title?: string })?.title || 'Not selected',
      problemCode: (team.problemStatement as { code?: string })?.code || 'N/A',
      memberCount: members.length,
      members,
      memberNames,
      memberEmails,
      memberDepartments,
      memberEnrollments,
      submissionUrl: (team.submissionUrl as string) || 'No submission',
      hasSubmission: (team.submissionUrl as string) ? 'Yes' : 'No',
      attendedMembers: `${attendedMembers}/${members.length}`
    };
  });
};

/**
 * Analyze registration data and provide recommendations for incomplete profiles
 */
export const analyzeRegistrationData = (registrations: Record<string, unknown>[]) => {
  const analysis = {
    totalRegistrations: registrations.length,
    incompleteProfiles: 0,
    missingDepartment: 0,
    missingProgram: 0,
    missingRegistrationNumber: 0,
    missingSemester: 0,
    missingYear: 0,
    recommendations: [] as string[]
  };

  registrations.forEach(reg => {
    const user = reg.user as {
      students?: {
        department?: { name?: string };
        program?: { name?: string };
        registrationNumber?: string;
        currentSemester?: number;
        currentYear?: number;
      };
      admins?: {
        department?: { name?: string };
        program?: { name?: string };
      };
    };

    const student = user.students;
    const admin = user.admins;
    const hasStudentProfile = student && (student.department || student.program || student.registrationNumber);
    const hasAdminProfile = admin && (admin.department || admin.program);

    if (!hasStudentProfile && !hasAdminProfile) {
      analysis.incompleteProfiles++;
      analysis.missingDepartment++;
      analysis.missingProgram++;
      analysis.missingRegistrationNumber++;
      analysis.missingSemester++;
      analysis.missingYear++;
    } else if (hasStudentProfile) {
      if (!student.department?.name) analysis.missingDepartment++;
      if (!student.program?.name) analysis.missingProgram++;
      if (!student.registrationNumber) analysis.missingRegistrationNumber++;
      if (!student.currentSemester) analysis.missingSemester++;
      if (!student.currentYear) analysis.missingYear++;
    }
  });

  // Generate recommendations
  if (analysis.incompleteProfiles > 0) {
    analysis.recommendations.push(
      `${analysis.incompleteProfiles} users have completely incomplete profiles. These users may need to complete their onboarding process.`
    );
  }
  
  if (analysis.missingDepartment > 0) {
    analysis.recommendations.push(
      `${analysis.missingDepartment} users are missing department information.`
    );
  }
  
  if (analysis.missingProgram > 0) {
    analysis.recommendations.push(
      `${analysis.missingProgram} users are missing program information.`
    );
  }
  
  if (analysis.missingRegistrationNumber > 0) {
    analysis.recommendations.push(
      `${analysis.missingRegistrationNumber} users are missing registration numbers.`
    );
  }

  return analysis;
};
