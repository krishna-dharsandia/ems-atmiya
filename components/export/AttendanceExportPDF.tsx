import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { commonPDFStyles, PDFCheckbox, PDFFooter } from './CommonPDFComponents';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';
import { format } from 'date-fns';

interface AttendanceExportData {
    hackathon: {
        name: string;
        start_date: string;
    };
    schedule: {
        day: number;
        checkInTime: string;
        description?: string;
    };
    stats: {
        totalMembers: number;
        presentCount: number;
        absentCount: number;
        attendancePercentage: number;
        totalTeams?: number;
        presentTeams?: number;
        absentTeams?: number;
    }; attendanceList: Array<{
        teamName: string;
        teamId: string;
        studentName: string;
        phoneNumber: string;
        email: string;
        status: 'Present' | 'Absent';
        checkInTime?: string;
        checkedBy?: string;
        isTeamLeader?: boolean;
    }>;
}

const styles = StyleSheet.create({
    ...commonPDFStyles,
    header: {
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: '#1f2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 4,
    },
    scheduleInfo: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    generatedDate: {
        fontSize: 10,
        color: '#9ca3af',
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f9fafb',
        padding: 15,
        marginBottom: 20,
        borderRadius: 8,
        border: '1px solid #e5e7eb',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 700,
        color: '#1f2937',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 10,
        color: '#6b7280',
        textAlign: 'center',
    },
    presentValue: {
        color: '#059669',
    },
    absentValue: {
        color: '#dc2626',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 600,
        color: '#374151',
        marginBottom: 15,
        paddingBottom: 5,
        borderBottom: '1px solid #d1d5db',
    }, table: {
        marginBottom: 20,
    },
    tableHeader: {
        backgroundColor: '#f3f4f6',
    },
    tableHeaderCell: {
        padding: 6,
        fontSize: 8,
        fontWeight: 600,
        color: '#374151',
        textAlign: 'center',
    },
    tableRow: {
        minHeight: 24
    },
    tableCell: {
        padding: 6,
        fontSize: 8,
        color: '#374151',
        textAlign: 'left',
        flex: 1,
    },
    statusPresent: {
        backgroundColor: '#dcfce7',
        color: '#166534',
        padding: 4,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: 600,
    },
    statusAbsent: {
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        padding: 4,
        borderRadius: 4,
        fontSize: 8,
        fontWeight: 600,
    },
    studentNameCell: {
        textAlign: 'left',
        fontSize: 8,
        fontWeight: 500,
    },
    teamNameCell: {
        textAlign: 'left',
        fontSize: 8,
    },
    summary: {
        backgroundColor: '#eff6ff',
        padding: 12,
        marginTop: 20,
        borderRadius: 8,
        border: '1px solid #bfdbfe',
    },
    summaryTitle: {
        fontSize: 12,
        fontWeight: 600,
        color: '#1e40af',
        marginBottom: 8,
    }, summaryText: {
        fontSize: 10,
        color: '#1e40af',
        lineHeight: 1.4,
    },
    noData: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 10,
        fontStyle: 'italic',
        padding: 20,
    },
});

interface AttendanceExportPDFProps {
    data: AttendanceExportData;
}

const AttendanceTable: React.FC<{ data: AttendanceExportData['attendanceList'] }> = ({ data }) => {
    // Group and sort data by teams, with team leaders first
    const groupedData = data.reduce((acc, record) => {
        if (!acc[record.teamId]) {
            acc[record.teamId] = {
                teamName: record.teamName,
                teamId: record.teamId,
                members: []
            };
        }
        acc[record.teamId].members.push(record);
        return acc;
    }, {} as Record<string, { teamName: string; teamId: string; members: typeof data }>);    // Sort teams by teamId and members by role (team leaders first)
    const sortedTeams = Object.values(groupedData).sort((a, b) => a.teamId.localeCompare(b.teamId));

    // Flatten all members with team grouping
    const allMembers: Array<{ team: { teamName: string; teamId: string }; member: typeof data[0]; isTeamLeader: boolean }> = [];

    sortedTeams.forEach(team => {
        // Sort members so team leaders come first
        const sortedMembers = team.members.sort((a, b) => {
            const aIsLeader = a.isTeamLeader ? 0 : 1;
            const bIsLeader = b.isTeamLeader ? 0 : 1;
            return aIsLeader - bIsLeader;
        });

        sortedMembers.forEach((member) => {
            allMembers.push({
                team: { teamName: team.teamName, teamId: team.teamId },
                member,
                isTeamLeader: member.isTeamLeader || false
            });
        });
    });

    return (
        <View style={styles.table}>
            <Table>
                <TR style={styles.tableHeader}>
                    <TD style={[styles.tableHeaderCell, { flex: 0.5 }]}>No.</TD>
                    <TD style={[styles.tableHeaderCell, { flex: 0.8 }]}>Team ID</TD>
                    <TD style={[styles.tableHeaderCell, { flex: 1.5 }]}>Team Name</TD>
                    <TD style={[styles.tableHeaderCell, { flex: 1.8 }]}>Member Name</TD>
                    <TD style={[styles.tableHeaderCell, { flex: 1.2 }]}>Phone Number</TD>
                    <TD style={[styles.tableHeaderCell, { flex: 0.8 }]}>Role</TD>
                    <TD style={[styles.tableHeaderCell, { flex: 0.8 }]}>Attended</TD>
                </TR>

                {allMembers.map((item, index) => {
                    const { team, member, isTeamLeader } = item;
                    const isPresent = member.status === 'Present';

                    return (
                        <TR
                            key={index}
                            wrap={false}
                            style={[
                                styles.tableRow,
                                ...(isTeamLeader ? [{ backgroundColor: '#e5e7eb' }] : []) // Darker background for team leader
                            ]}
                            minPresenceAhead={25}
                        >
                            <TD style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>
                                {index + 1}
                            </TD>
                            <TD style={[styles.tableCell, { flex: 0.8 }]}>
                                {team.teamId}
                            </TD>
                            <TD style={[styles.tableCell, { flex: 1.5 }]}>
                                {team.teamName.substring(0, 15)}
                            </TD>
                            <TD style={[
                                styles.tableCell,
                                { flex: 1.8 },
                                ...(isTeamLeader ? [{ fontWeight: 600 }] : []) // Bold for team leader
                            ]}>
                                {member.studentName.substring(0, 18)}
                            </TD>
                            <TD style={[styles.tableCell, { flex: 1.2 }]}>
                                {member.phoneNumber || "-"}
                            </TD>
                            <TD style={[
                                styles.tableCell,
                                { flex: 0.8, textAlign: 'center' },
                                ...(isTeamLeader ? [{ fontWeight: 600 }] : []) // Bold for team leader
                            ]}>
                                {isTeamLeader ? 'Leader' : 'Member'}
                            </TD>
                            <TD style={[styles.tableCell, { flex: 0.8, textAlign: 'center', justifyContent: 'center', alignItems: 'center' }]}>
                                <PDFCheckbox checked={isPresent} size={22} />
                            </TD>
                        </TR>
                    );
                })}
            </Table>
        </View>
    );
};

export const AttendanceExportPDF: React.FC<AttendanceExportPDFProps> = ({ data }) => {
    const { hackathon, schedule, stats, attendanceList } = data;

    // Format the schedule date
    const scheduleDate = new Date(hackathon.start_date);
    scheduleDate.setDate(scheduleDate.getDate() + schedule.day - 1);
    const formattedDate = format(scheduleDate, 'EEEE, MMMM d, yyyy');
    const formattedTime = format(new Date(schedule.checkInTime), 'h:mm a');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Attendance Report</Text>
                    <Text style={styles.subtitle}>{hackathon.name}</Text>
                    <Text style={styles.scheduleInfo}>
                        Day {schedule.day} - {formattedDate}
                    </Text>
                    <Text style={styles.scheduleInfo}>
                        Schedule: {formattedTime}
                        {schedule.description && ` - ${schedule.description}`}
                    </Text>
                    <Text style={styles.generatedDate}>
                        Generated on: {format(new Date(), 'PPP p')}
                    </Text>
                </View>                {/* Statistics */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.totalTeams || 0}</Text>
                        <Text style={styles.statLabel}>Total{'\n'}Teams</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, styles.presentValue]}>{stats.presentTeams || 0}</Text>
                        <Text style={styles.statLabel}>Present{'\n'}Teams</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, styles.absentValue]}>{stats.absentTeams || 0}</Text>
                        <Text style={styles.statLabel}>Absent{'\n'}Teams</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.totalMembers}</Text>
                        <Text style={styles.statLabel}>Total{'\n'}Participants</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, styles.presentValue]}>{stats.presentCount}</Text>
                        <Text style={styles.statLabel}>Present{'\n'}Participants</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statValue, styles.absentValue]}>{stats.absentCount}</Text>
                        <Text style={styles.statLabel}>Absent{'\n'}Participants</Text>
                    </View>
                </View>

                {/* Attendance Table */}
                <Text style={styles.sectionHeader}>Attendance Details</Text>
                <Text style={[styles.subtitle, { marginBottom: 10, fontSize: 10 }]}>
                    Present participants are highlighted with green background
                </Text>
                {attendanceList && attendanceList.length > 0 ? (
                    <AttendanceTable data={attendanceList} />
                ) : (
                    <Text style={styles.noData}>No attendance data available</Text>
                )}

                {/* Summary */}                <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Summary</Text>
                    <Text style={styles.summaryText}>
                        Teams: {stats.totalTeams || 0} total | {stats.presentTeams || 0} present | {stats.absentTeams || 0} absent
                    </Text>
                    <Text style={styles.summaryText}>
                        Participants: {stats.totalMembers} total | {stats.presentCount} present ({stats.attendancePercentage}%) | {stats.absentCount} absent
                    </Text>
                    <Text style={styles.summaryText}>
                        This report was generated for {hackathon.name}, Day {schedule.day} attendance on {formattedDate}.
                    </Text>
                </View>

                <PDFFooter />
            </Page>
        </Document>
    );
};

export default AttendanceExportPDF;
