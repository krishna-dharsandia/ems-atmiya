import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { TeamExportData } from '@/utils/functions/exportUtils';
import { commonPDFStyles, PDFFooter } from './CommonPDFComponents';

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
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderBottom: 'none',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 9,
    fontWeight: 600,
    color: '#374151',
    borderRight: '1px solid #d1d5db',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    border: '1px solid #d1d5db',
    borderTop: 'none',
  },
  tableRowEven: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    padding: 6,
    fontSize: 8,
    color: '#374151',
    borderRight: '1px solid #d1d5db',
    textAlign: 'left',
    overflow: 'hidden',
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

// Column widths for team table
const teamColumns = [
  { header: 'Team Name', width: '15%' },
  { header: 'Team ID', width: '10%' },
  { header: 'Problem', width: '20%' },
  { header: 'Members', width: '8%' },
  { header: 'Names', width: '18%' },
  { header: 'Departments', width: '12%' },
  { header: 'Submission', width: '9%' },
  { header: 'Attended', width: '8%' },
];

const TeamsTable: React.FC<{ data: TeamExportData[] }> = ({ data }) => (
  <View style={styles.table} minPresenceAhead={100}>
    <View style={styles.tableHeader} wrap={false}>
      {teamColumns.map((col, index) => (
        <Text
          key={col.header}
          style={[
            styles.tableHeaderCell,
            { width: col.width },
            ...(index === teamColumns.length - 1 ? [{ borderRight: 'none' }] : []),
          ]}
          wrap={false}
        >
          {col.header}
        </Text>
      ))}
    </View>
    {data.map((team, index) => (
      <View
        key={index}
        style={[
          styles.tableRow,
          ...(index % 2 === 1 ? [styles.tableRowEven] : []),
        ]}
        wrap={false}
        minPresenceAhead={30}
      >
        <Text style={[styles.tableCell, { width: '15%' }]} wrap={false}>
          {team.teamName.substring(0, 20)}
        </Text>
        <Text style={[styles.tableCell, { width: '10%' }]} wrap={false}>
          {team.teamId.substring(0, 12)}
        </Text>
        <Text style={[styles.tableCell, { width: '20%' }]} wrap={false}>
          {`${team.problemCode}: ${team.problemStatement}`.substring(0, 30)}
        </Text>
        <Text style={[styles.tableCell, { width: '8%', textAlign: 'center' }]} wrap={false}>
          {team.memberCount}
        </Text>
        <Text style={[styles.tableCell, { width: '18%' }]} wrap={false}>
          {team.memberNames.substring(0, 25)}
        </Text>
        <Text style={[styles.tableCell, { width: '12%' }]} wrap={false}>
          {team.memberDepartments.substring(0, 15)}
        </Text>
        <Text style={[styles.tableCell, { width: '9%', textAlign: 'center' }]} wrap={false}>
          {team.hasSubmission}
        </Text>
        <Text style={[styles.tableCell, { width: '8%', textAlign: 'center', borderRight: 'none' }]} wrap={false}>
          {team.attendedMembers}
        </Text>
      </View>
    ))}
  </View>
);

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

        {/* Teams Table */}
        {exportType === 'teams' && (
          <View>
            <Text style={styles.sectionHeader}>Team Details</Text>
            {teams && teams.length > 0 ? (
              <TeamsTable data={teams} />
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
