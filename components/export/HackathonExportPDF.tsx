import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { TeamExportData, TeamMemberData } from '@/utils/functions/exportUtils';
import { commonPDFStyles, PDFFooter, PDFCheckbox } from './CommonPDFComponents';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';

// Professional A4 stylesheet using common components
const styles = StyleSheet.create({
  ...commonPDFStyles,
  header: {
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  generatedDate: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: '1px solid #d1d5db',
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 9,
    fontWeight: 600,
    color: '#374151',
    textAlign: 'center',
  },
  tableRow: {
  },
  tableRowEven: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    padding: 6,
    fontSize: 8,
    color: '#374151',
    textAlign: 'left',
    flex: 1,
  },
  summarySection: {
    backgroundColor: '#f9fafb',
    padding: 15,
    marginBottom: 20,
    border: '1px solid #e5e7eb',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 10,
    color: '#374151',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1px solid #e5e7eb',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 500,
    color: '#1f2937',
  },
  noData: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 10,
    fontStyle: 'italic',
    padding: 20,
  },
});

interface HackathonExportPDFProps {
  hackathonName: string;
  teams?: TeamExportData[];
  exportType: 'teams';
}



const TeamMembersTable: React.FC<{ data: TeamExportData[] }> = ({ data }) => {
  // Flatten all team members into a single array with team info
  const allMembers: Array<{ team: TeamExportData; member: TeamMemberData }> = [];

  data.forEach(team => {
    if (team.members && team.members.length > 0) {
      team.members.forEach(member => {
        allMembers.push({ team, member });
      });
    }
  });

  return (
    <View style={styles.table}>
      <Table>
        <TR style={styles.tableHeader}>
          <TD style={[styles.tableHeaderCell, { flex: 0.8 }]}>Team ID</TD>
          <TD style={[styles.tableHeaderCell, { flex: 1.5 }]}>Team Name</TD>
          <TD style={[styles.tableHeaderCell, { flex: 1.8 }]}>Member Name</TD>
          <TD style={[styles.tableHeaderCell, { flex: 2 }]}>Email</TD>
          <TD style={[styles.tableHeaderCell, { flex: 1.2 }]}>Department</TD>
          <TD style={[styles.tableHeaderCell, { flex: 0.8 }]}>Role</TD>
          <TD style={[styles.tableHeaderCell, { flex: 0.8 }]}>Attended</TD>
        </TR>
        {allMembers.map((item, index) => {
          const { team, member } = item;
          const isTeamAdmin = member.isTeamAdmin;

          return (
            <TR
              key={index}
              style={[
                index % 2 === 1 ? styles.tableRowEven : styles.tableRow,
                ...(isTeamAdmin ? [{ backgroundColor: '#e5e7eb' }] : []) // Darker background for team admin
              ]}
            >
              <TD style={[styles.tableCell, { flex: 0.8 }]}>
                {team.teamId}
              </TD>
              <TD style={[styles.tableCell, { flex: 1.5 }]}>
                {team.teamName.substring(0, 15)}
              </TD>
              <TD style={[
                styles.tableCell,
                { flex: 1.8 },
                ...(isTeamAdmin ? [{ fontWeight: 600 }] : []) // Bold for team admin
              ]}>
                {member.name.substring(0, 18)}
              </TD>
              <TD style={[styles.tableCell, { flex: 2 }]}>
                {member.email.substring(0, 20)}
              </TD>
              <TD style={[styles.tableCell, { flex: 1.2 }]}>
                {member.department.substring(0, 10)}
              </TD>
              <TD style={[
                styles.tableCell,
                { flex: 0.8, textAlign: 'center' },
                ...(isTeamAdmin ? [{ fontWeight: 600 }] : []) // Bold for team admin
              ]}>
                {isTeamAdmin ? 'Admin' : 'Member'}
              </TD>
              <TD style={[styles.tableCell, { flex: 0.8, textAlign: 'center' }]}>
                <PDFCheckbox checked={member.attended} size={8} />
              </TD>
            </TR>
          );
        })}
      </Table>
    </View>
  );
};

const HackathonExportPDF: React.FC<HackathonExportPDFProps> = ({
  hackathonName,
  teams = [],
  exportType,
}) => {
  const exportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalTeams = teams.length;
  const totalParticipants = teams.reduce((acc, team) => acc + team.memberCount, 0);
  const teamsWithSubmissions = teams.filter(team => team.hasSubmission === 'Yes').length;
  const averageTeamSize = totalTeams > 0 ? (totalParticipants / totalTeams).toFixed(1) : '0';

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="portrait">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{hackathonName}</Text>
          <Text style={styles.subtitle}>Hackathon Team Export Report</Text>
          <Text style={styles.generatedDate}>
            Generated on {exportDate} | {totalTeams} Teams | {totalParticipants} Participants
          </Text>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Summary Statistics</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Teams:</Text>
            <Text style={styles.summaryValue}>{totalTeams}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Participants:</Text>
            <Text style={styles.summaryValue}>{totalParticipants}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Teams with Submissions:</Text>
            <Text style={styles.summaryValue}>{teamsWithSubmissions}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Average Team Size:</Text>
            <Text style={styles.summaryValue}>{averageTeamSize}</Text>
          </View>
        </View>

        {/* Team Overview */}
        {exportType === 'teams' && teams && teams.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionHeader}>Team Overview</Text>
            {teams.map((team, index) => (
              <View
                key={index}
                style={{
                  marginBottom: 15,
                  padding: 10,
                  border: '1px solid #d1d5db',
                  backgroundColor: index % 2 === 0 ? '#f9fafb' : '#ffffff'
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 10, fontWeight: 600 }}>{team.teamName}</Text>
                  <Text style={{ fontSize: 9, color: '#6b7280' }}>ID: {team.teamId}</Text>
                </View>
                <Text style={{ fontSize: 9, marginBottom: 3 }}>
                  Problem: {team.problemCode} - {team.problemStatement.substring(0, 50)}...
                </Text>
                <Text style={{ fontSize: 9 }}>
                  Members: {team.memberCount} | Attended: {team.attendedMembers} | Submission: {team.hasSubmission}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Teams Table */}
        {exportType === 'teams' && (
          <View>
            <Text style={styles.sectionHeader}>Team Member Details</Text>
            <Text style={[styles.subtitle, { marginBottom: 10, fontSize: 10 }]}>
              Team admins are highlighted with darker background and bold text
            </Text>
            {teams && teams.length > 0 ? (
              <TeamMembersTable data={teams} />
            ) : (
              <Text style={styles.noData}>No team data available</Text>
            )}
          </View>
        )}

        {/* Footer */}
        <PDFFooter />
      </Page>
    </Document>
  );
};

export default HackathonExportPDF;
