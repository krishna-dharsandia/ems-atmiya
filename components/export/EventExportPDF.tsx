import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { RegistrationExportData, FeedbackExportData } from '@/utils/functions/exportUtils';
import { commonPDFStyles, PDFFooter } from './CommonPDFComponents';

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

// Column widths for different table types
const registrationColumns = [
    { header: 'Name', width: '16%' },     
    { header: 'Email', width: '18%' },     
    { header: 'Reg#', width: '12%' },     
    { header: 'Dept', width: '13%' },     
    { header: 'Program', width: '16%' },   
    { header: 'Sem', width: '7%' },      
    { header: 'Present', width: '8%' },   
    { header: 'Date', width: '10%' },
];

const feedbackColumns = [
    { header: 'Name', width: '25%' },
    { header: 'Email', width: '30%' },
    { header: 'Rating', width: '15%' },
    { header: 'Date', width: '30%' },
];

const RegistrationsTable: React.FC<{ data: RegistrationExportData[] }> = ({ data }) => (
    <View style={styles.table} minPresenceAhead={100}>
        <View style={styles.tableHeader} wrap={false}>
            {registrationColumns.map((col, index) => (
                <Text
                    key={col.header}
                    style={[
                        styles.tableHeaderCell,
                        { width: col.width },
                        ...(index === registrationColumns.length - 1 ? [{ borderRight: 'none' }] : []),
                    ]}
                    wrap={false}
                >
                    {col.header}
                </Text>
            ))}
        </View>
        {data.map((reg, index) => (
            <View
                key={index}
                style={[
                    styles.tableRow,
                    ...(index % 2 === 1 ? [styles.tableRowEven] : []),
                ]}
                wrap={false}
                minPresenceAhead={30}
            >
                <Text style={[styles.tableCell, { width: '16%' }]} wrap={false}>
                    {`${reg.firstName} ${reg.lastName}`.substring(0, 18)}
                </Text>
                <Text style={[styles.tableCell, { width: '18%' }]} wrap={false}>
                    {reg.email.substring(0, 20)}
                </Text>
                <Text style={[styles.tableCell, { width: '12%' }]} wrap={false}>
                    {reg.registrationNumber || 'N/A'}
                </Text>
                <Text style={[styles.tableCell, { width: '13%' }]} wrap={false}>
                    {(reg.department || 'N/A').substring(0, 12)}
                </Text>
                <Text style={[styles.tableCell, { width: '16%' }]} wrap={false}>
                    {(reg.program || 'N/A').substring(0, 12)}
                </Text>
                <Text style={[styles.tableCell, { width: '7%', textAlign: 'center' }]} wrap={false}>
                    {reg.semester || 'N/A'}
                </Text>
                <Text style={[styles.tableCell, { width: '8%', textAlign: 'center' }]} wrap={false}>
                    {reg.attended}
                </Text>
                <Text style={[styles.tableCell, { width: '10%', borderRight: 'none' }]} wrap={false}>
                    {reg.registrationDate}
                </Text>
            </View>
        ))}
    </View>
);

const FeedbacksTable: React.FC<{ data: FeedbackExportData[] }> = ({ data }) => (
    <View style={styles.table}>
        <View style={styles.tableHeader}>
            {feedbackColumns.map((col, index) => (
                <Text
                    key={col.header}
                    style={[
                        styles.tableHeaderCell,
                        { width: col.width },
                        ...(index === feedbackColumns.length - 1 ? [{ borderRight: 'none' }] : []),
                    ]}
                >
                    {col.header}
                </Text>
            ))}
        </View>
        {data.map((feedback, index) => (
            <View
                key={index}
                style={[
                    styles.tableRow,
                    ...(index % 2 === 1 ? [styles.tableRowEven] : []),
                ]}
            >
                <Text style={[styles.tableCell, { width: '25%' }]}>
                    {`${feedback.firstName} ${feedback.lastName}`.substring(0, 25)}
                </Text>
                <Text style={[styles.tableCell, { width: '30%' }]}>
                    {feedback.email.substring(0, 30)}
                </Text>
                <Text style={[styles.tableCell, { width: '15%', textAlign: 'center' }]}>
                    {feedback.rating}/5 ⭐
                </Text>
                <Text style={[styles.tableCell, { width: '30%', borderRight: 'none' }]}>
                    {feedback.feedbackDate}
                </Text>
            </View>
        ))}
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
