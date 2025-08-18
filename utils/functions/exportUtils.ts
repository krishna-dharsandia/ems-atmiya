import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import EventExportPDF from '@/components/export/EventExportPDF';
import HackathonExportPDF from '@/components/export/HackathonExportPDF';

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
  attended: boolean;
  isTeamAdmin: boolean;
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
      csvContent = Papa.unparse(csvData);
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    } else if (type === 'feedbacks' && data.feedbacks) {
      const worksheet = XLSX.utils.json_to_sheet(data.feedbacks);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedbacks');
    } else if (type === 'teams' && data.teams) {
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
      
      // Create detailed members sheet with team admin first
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
  type: 'registrations' | 'feedbacks' | 'teams' | 'both',
  eventName?: string
) => {
  try {
    if (typeof window === 'undefined') {
      throw new Error('PDF export is only available in browser environment');
    }

    let MyDocument;

    // Choose the appropriate PDF component based on export type
    if (type === 'teams' || (type === 'both' && data.teams && !data.registrations && !data.feedbacks)) {
      // Use HackathonExportPDF for team data
      MyDocument = () => React.createElement(HackathonExportPDF, {
        hackathonName: eventName || 'Hackathon',
        teams: data.teams,
        exportType: 'teams'
      });
    } else {
      // Use EventExportPDF for event data (registrations/feedbacks)
      MyDocument = () => React.createElement(EventExportPDF, {
        eventName: eventName || 'Event',
        registrations: data.registrations,
        feedbacks: data.feedbacks,
        exportType: type as 'registrations' | 'feedbacks' | 'both'
      });
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

/**
 * Format team data for export
 */
export const formatTeamData = (teams: Record<string, unknown>[]): TeamExportData[] => {
  return teams.map(team => {
    const teamMembers = (team.members as Array<{
      id?: string;
      student?: {
        id?: string;
        user?: { firstName?: string; lastName?: string; email?: string };
        department?: { name?: string };
        enrollment?: string;
      };
      attended?: boolean;
    }>) || [];

    // Sort members to put team admin (first member) first
    const sortedMembers = [...teamMembers].sort((a, b) => {
      // In most cases, the first member to join is the team admin (team creator)
      // We'll use the member ID or creation order as proxy for this
      return (a.id || '').localeCompare(b.id || '');
    });

    // Format individual member data
    const members: TeamMemberData[] = sortedMembers.map((member, index) => ({
      name: `${member.student?.user?.firstName || ''} ${member.student?.user?.lastName || ''}`.trim() || 'N/A',
      email: member.student?.user?.email || 'N/A',
      department: member.student?.department?.name || 'N/A',
      enrollment: member.student?.enrollment || 'N/A',
      attended: member.attended || false,
      isTeamAdmin: index === 0 // First member is considered team admin
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
