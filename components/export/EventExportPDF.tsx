import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { RegistrationExportData, FeedbackExportData } from '@/utils/functions/exportUtils';
import { commonPDFStyles, PDFFooter, PDFCheckbox } from './CommonPDFComponents';
import { Table, TR, TH, TD } from '@ag-media/react-pdf-table';

// Professional A4 stylesheet
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
    },
    table: {
        marginBottom: 20,
    },
    tableHeader: {
        backgroundColor: '#f3f4f6',
    },
    tableHeaderCell: {
        padding: 6,
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
    summary: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 6,
    },
    summaryTitle: {
        fontSize: 14,
        fontWeight: 600,
        color: '#1e293b',
        marginBottom: 12,
    },
    summaryItem: {
        fontSize: 10,
        color: '#475569',
        marginBottom: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryLabel: {
        fontWeight: 500,
    },
    summaryValue: {
        fontWeight: 600,
        color: '#1e293b',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#9ca3af',
        borderTop: '1px solid #e5e7eb',
        paddingTop: 10,
    },
    noData: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 10,
        fontStyle: 'italic',
        padding: 20,
    },
});

interface EventExportPDFProps {
    eventName: string;
    registrations?: RegistrationExportData[];
    feedbacks?: FeedbackExportData[];
    exportType: 'registrations' | 'feedbacks' | 'both';
}



const RegistrationsTable: React.FC<{ data: RegistrationExportData[] }> = ({ data }) => (
    <View style={styles.table}>
        <Table>
            <TR style={styles.tableHeader}>
                <TD style={[styles.tableHeaderCell, { flex: 1.8 }]}>Name</TD>
                <TD style={[styles.tableHeaderCell, { flex: 1.5 }]}>Reg#</TD>
                <TD style={[styles.tableHeaderCell, { flex: 1.2 }]}>Dept</TD>
                <TD style={[styles.tableHeaderCell, { flex: 1.2 }]}>Program</TD>
                <TD style={[styles.tableHeaderCell, { flex: 0.3 }]}>Sem</TD>
                <TD style={[styles.tableHeaderCell, { flex: 1.2 }]}>Date</TD>
                <TD style={[styles.tableHeaderCell, { flex: 0.2 }]}></TD>
            </TR>
            {data.map((reg, index) => (
                <TR key={index} style={index % 2 === 1 ? styles.tableRowEven : styles.tableRow}>
                    <TD style={[styles.tableCell, { flex: 1.8 }]}>
                        {`${reg.firstName} ${reg.lastName}`.substring(0, 18)}
                    </TD>
                    <TD style={[styles.tableCell, { flex: 1.5, fontSize: 7 }]}>
                        {reg.registrationNumber || 'N/A'}
                    </TD>
                    <TD style={[styles.tableCell, { flex: 1.2 }]}>
                        {(reg.department || 'N/A').substring(0, 12)}
                    </TD>
                    <TD style={[styles.tableCell, { flex: 1.2 }]}>
                        {(reg.program || 'N/A').substring(0, 12)}
                    </TD>
                    <TD style={[styles.tableCell, { flex: 0.3, textAlign: 'center' }]}>
                        {reg.semester || 'N/A'}
                    </TD>
                    <TD style={[styles.tableCell, { flex: 1.2 }]}>
                        {reg.registrationDate}
                    </TD>
                    <TD style={[styles.tableCell, { flex: 0.2, textAlign: 'center' }]}>
                        <PDFCheckbox checked={reg.attended === 'Yes'} size={12} />
                    </TD>
                </TR>
            ))}
        </Table>
    </View>
);

const FeedbacksTable: React.FC<{ data: FeedbackExportData[] }> = ({ data }) => (
    <View style={styles.table}>
        <Table>
            <TR style={styles.tableHeader}>
                <TD style={[styles.tableHeaderCell, { flex: 2 }]}>Name</TD>
                <TD style={[styles.tableHeaderCell, { flex: 2.5 }]}>Email</TD>
                <TD style={[styles.tableHeaderCell, { flex: 0.8 }]}>Rating</TD>
                <TD style={[styles.tableHeaderCell, { flex: 1.5 }]}>Date</TD>
            </TR>
            {data.map((feedback, index) => (
                <TR key={index} style={index % 2 === 1 ? styles.tableRowEven : styles.tableRow}>
                    <TD style={[styles.tableCell, { flex: 2 }]}>
                        {`${feedback.firstName} ${feedback.lastName}`.substring(0, 25)}
                    </TD>
                    <TD style={[styles.tableCell, { flex: 2.5 }]}>
                        {feedback.email.substring(0, 30)}
                    </TD>
                    <TD style={[styles.tableCell, { flex: 0.8, textAlign: 'center' }]}>
                        {feedback.rating}/5 ⭐
                    </TD>
                    <TD style={[styles.tableCell, { flex: 1.5 }]}>
                        {feedback.feedbackDate}
                    </TD>
                </TR>
            ))}
        </Table>
    </View>
);

const EventExportPDF: React.FC<EventExportPDFProps> = ({
    eventName,
    registrations,
    feedbacks,
    exportType,
}) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    // Calculate summary statistics
    const totalRegistrations = registrations?.length || 0;
    const attendedCount = registrations?.filter(r => r.attended === 'Yes').length || 0;
    const totalFeedbacks = feedbacks?.length || 0;
    const averageRating = feedbacks && feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : '0';

    // Calculate incomplete profiles
    const incompleteProfiles = registrations?.filter(reg =>
        reg.department === 'Profile incomplete' ||
        reg.program === 'Profile incomplete' ||
        reg.registrationNumber === 'Profile incomplete'
    ).length || 0;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{eventName} - Export Report</Text>
                    <Text style={styles.subtitle}>Event Management System Export</Text>
                    <Text style={styles.generatedDate}>Generated on: {currentDate}</Text>
                </View>

                {/* Registrations Section */}
                {(exportType === 'registrations' || exportType === 'both') && (
                    <View>
                        <Text style={styles.sectionHeader}>Event Registrations</Text>
                        {incompleteProfiles > 0 && (
                            <Text style={[styles.subtitle, { marginBottom: 10, fontSize: 10, color: '#dc2626' }]}>
                                ⚠️ Note: {incompleteProfiles} registrations have incomplete profiles (missing department, program, or registration number)
                            </Text>
                        )}
                        {registrations && registrations.length > 0 ? (
                            <RegistrationsTable data={registrations} />
                        ) : (
                            <Text style={styles.noData}>No registration data available</Text>
                        )}
                    </View>
                )}

                {/* Feedbacks Section */}
                {(exportType === 'feedbacks' || exportType === 'both') && (
                    <View>
                        <Text style={styles.sectionHeader}>Event Feedbacks</Text>
                        {feedbacks && feedbacks.length > 0 ? (
                            <FeedbacksTable data={feedbacks} />
                        ) : (
                            <Text style={styles.noData}>No feedback data available</Text>
                        )}
                    </View>
                )}

                {/* Summary Section */}
                <View style={styles.summary}>
                    <Text style={styles.summaryTitle}>Report Summary</Text>

                    {(exportType === 'registrations' || exportType === 'both') && (
                        <>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Total Registrations:</Text>
                                <Text style={styles.summaryValue}>{totalRegistrations}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Attended:</Text>
                                <Text style={styles.summaryValue}>{attendedCount}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Attendance Rate:</Text>
                                <Text style={styles.summaryValue}>
                                    {totalRegistrations > 0 ? `${((attendedCount / totalRegistrations) * 100).toFixed(1)}%` : '0%'}
                                </Text>
                            </View>
                            {incompleteProfiles > 0 && (
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Incomplete Profiles:</Text>
                                    <Text style={styles.summaryValue}>{incompleteProfiles}</Text>
                                </View>
                            )}
                        </>
                    )}

                    {(exportType === 'feedbacks' || exportType === 'both') && (
                        <>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Total Feedbacks:</Text>
                                <Text style={styles.summaryValue}>{totalFeedbacks}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Average Rating:</Text>
                                <Text style={styles.summaryValue}>{averageRating}/5</Text>
                            </View>
                            {totalRegistrations > 0 && totalFeedbacks > 0 && (
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Feedback Response Rate:</Text>
                                    <Text style={styles.summaryValue}>
                                        {((totalFeedbacks / totalRegistrations) * 100).toFixed(1)}%
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </View>

                {/* Footer */}
                <PDFFooter />
            </Page>
        </Document>
    );
};

export default EventExportPDF;
