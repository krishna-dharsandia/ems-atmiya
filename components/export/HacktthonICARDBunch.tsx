/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

type ParticipantData = {
    name: string;
    teamName: string;
    teamId: string | null;
    participantId: string;
    participantRole: string;
    userType: string;
    qrCode: string;
}

// Helper function to get dynamic font size based on text length - prioritize small font over line breaks
const getDynamicFontSize = (text: string, baseSize: number = 10, maxLength: number = 20): number => {
    if (text.length <= maxLength) {
        return baseSize;
    }

    // More aggressive reduction to keep everything on one line
    const overflowRatio = text.length / maxLength;
    const reductionFactor = Math.max(0.4, 0.9 / overflowRatio);

    return Math.max(4, Math.round(baseSize * reductionFactor)); // Minimum font size of 4 (smaller minimum)
};

type HackthonICARDBunchProps = {
    participants: ParticipantData[]; // Array of participants (unlimited)
}

export const HackthonICARDBunch = ({ participants }: HackthonICARDBunchProps) => {
    // Split participants into chunks of 10 (max per page)
    const chunks = [];
    for (let i = 0; i < participants.length; i += 10) {
        chunks.push(participants.slice(i, i + 10));
    }

    return (
        <Document author='ADSC Atmiya' title='Hackathon ID Cards Batch' creator='ADSC Atmiya' subject='Hackathon ID Cards'>
            {chunks.map((chunk, chunkIndex) => (
                <Page key={chunkIndex} size={["18in", "12in"]} style={styles.page}>
                    {/* First Row - 5 cards */}
                    <View style={styles.row}>
                        {chunk.slice(0, 5).map((participant, index) => (
                            <View key={index} style={styles.idCard}>
                                <IDCardContent {...participant} />
                            </View>
                        ))}
                    </View>

                    {/* Second Row - 5 cards */}
                    <View style={styles.row}>
                        {chunk.slice(5, 10).map((participant, index) => (
                            <View key={index} style={styles.idCard}>
                                <IDCardContent {...participant} />
                            </View>
                        ))}
                    </View>
                </Page>
            ))}
        </Document>
    );
};

const IDCardContent = ({
    name,
    participantId,
    participantRole,
    teamId = "TM000",
    teamName,
    userType,
    qrCode,
}: ParticipantData) => (
    <View style={styles.cardContent}>
        {/* Header - Two Logos */}
        <View style={styles.headerLogos}>
            {/* ADSC Logo - Left */}
            <View style={[styles.logoPlaceholder, { marginLeft: -10 }]}>
                <Image
                    src="/images/adsc-logo.png"
                    style={styles.headerLogoImage}
                />
            </View>

            {/* Carnival Logo - Right */}
            <View style={styles.logoPlaceholder}>
                <Image
                    src="/images/code-carnival-logo.png"
                    style={styles.headerLogoImage}
                />
            </View>
        </View>

        <View style={{ paddingBottom: 0, marginTop: 0 }}>
            {/* ALL-ACCESS */}
            <View style={styles.allAccessSection}>
                <Text style={styles.allAccessText}>{userType}</Text>
            </View>
            <View style={styles.twoColumnRow}>
                {/* Team Name */}
                <View style={styles.columnLeft}>
                    <Text style={styles.quantumLabel}>TEAM NAME</Text>
                    <Text style={[styles.infoValueText, { fontSize: getDynamicFontSize(teamName, 12, 20) }]}>
                        {teamName}
                    </Text>
                </View>

                {/* Team ID */}
                <View style={styles.columnRight}>
                    <Text style={styles.quantumLabel}>TEAM ID</Text>
                    <Text style={[styles.infoValueText, { fontSize: getDynamicFontSize(teamName, 12, 20) }]}>{teamId}</Text>
                </View>
            </View>
        </View>

        <View style={styles.divider} />
        <View style={{ paddingTop: 6, rowGap: 0 }}>
            {/* Student Name */}
            <View>
                <Text style={styles.quantumLabel}>STUDENT NAME</Text>
                <Text style={[styles.nameText, { fontSize: getDynamicFontSize(name, 14, 20) }]}>
                    {name}
                </Text>
            </View>

            {/* Participant ID */}
            <View style={[styles.twoColumnRow, { alignItems: 'flex-start' }]}>
                <View>
                    <View>
                        <Text style={styles.quantumLabel}>ROLE</Text>
                        <Text style={styles.infoValueText}>{participantRole}</Text>
                    </View>
                    {/* QR Code and Reference ID */}
                    <View style={styles.qrSection}>
                        <View style={styles.qrCode}>
                            <View style={styles.qrPattern} />
                            <Image
                                src={qrCode}
                                style={styles.qrImage}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.userTypeContainer}>
                    {userType === 'Participant' && (
                        <View style={styles.symbolContainer}>
                            <View style={styles.circleSymbol} />
                        </View>
                    )}
                </View>
            </View>
        </View>

        {/* Bottom - 4 Organization Logos */}
        <View style={styles.bottomLogos}>
            <View style={styles.orgLogoBox}>
                <Image
                    src="/images/au_logo.png"
                    style={styles.orgLogoImage}
                />
            </View>
        </View>
    </View>
);

Font.register({
    family: 'Inter',
    fonts: [
        {
            src: '/fonts/Inter/Inter_Regular.ttf',
            fontWeight: 400
        },
        {
            src: '/fonts/Inter/Inter_Medium.ttf',
            fontWeight: 500
        },
        {
            src: '/fonts/Inter/Inter_SemiBold.ttf',
            fontWeight: 600
        },
        {
            src: '/fonts/Inter/Inter_Italic.ttf',
            fontStyle: 'italic',
            fontWeight: 400
        },
    ]
});

Font.register({
    family: 'Squids',
    src: '/fonts/game-of-squids/Game-Of-Squids.ttf'
});

const styles = StyleSheet.create({
    page: {
        width: '18in',
        height: '12in',
        backgroundColor: '#ffffff',
        padding: 20,
        fontFamily: 'Inter',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '0.1mm',
        gap: '0.1mm',
    },

    idCard: {
        width: '3in',
        height: '4in',
        backgroundColor: '#000000',
        paddingLeft: 20,
        paddingRight: 20,
        position: 'relative',
        overflow: 'hidden',
    },

    cardContent: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },


    // Header Logos (Top)
    headerLogos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5,
        marginBottom: 5,
    },
    logoPlaceholder: {
        width: 'auto',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    headerLogoImage: {
        width: 'auto',
        height: 50,
        objectFit: 'contain',
    },
    placeholderText: {
        color: '#ec4899',
        fontSize: 8,
        fontWeight: 'bold',
        position: 'absolute',
    },

    // ALL-ACCESS Section
    allAccessSection: {
        marginTop: 2,
        marginBottom: 2,
    },
    allAccessText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
        fontFamily: 'Squids',
    },
    divider: {
        height: 1,
        backgroundColor: '#ec4899',
        marginTop: 4,
    },    // Labels and Values
    quantumLabel: {
        color: '#e5e7eb',
        fontSize: 8,
        marginBottom: 2,
    },
    nameText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily: 'Squids',
        overflow: 'hidden',
        lineHeight: 1.2,
        textAlign: 'left',
    },
    infoValueText: {
        color: '#ffffff',
        fontSize: 10,
        overflow: 'hidden',
        lineHeight: 1.2,
        textAlign: 'left',
    },

    // Two Column Layout
    twoColumnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 2,
    },
    columnLeft: {
        flex: 1,
        paddingRight: 5,
    },
    columnRight: {
        flex: 0.4,
        paddingLeft: 5,
    },
    userTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: -60,
    },
    symbolContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleSymbol: {
        width: 100,
        height: 100,
        borderRadius: 50,
        opacity: 0.4,
        backgroundColor: 'black',
        borderWidth: 14,
        borderColor: '#e5e7eb',
        marginTop: -10,
    },
    triangleSymbol: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 7,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#ffff00',
    },
    squareSymbol: {
        width: 8,
        height: 8,
        backgroundColor: '#ff0000',
    },
    symbolText: {
        color: '#ffffff',
        fontSize: 8,
        fontWeight: '600',
    },

    // QR Code Section
    qrSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    qrCode: {
        width: 80,
        height: 80,
        backgroundColor: '#ffffff',
        position: 'relative',
    },
    qrPattern: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
    },
    qrImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    referenceSection: {
        flex: 1,
    },

    // Bottom Organization Logos
    bottomLogos: {
        position: 'absolute',
        flex: 1,
        left: 20,
        right: 0,
        bottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    orgLogoBox: {
        width: 'auto',
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    orgLogoImage: {
        width: 'auto',
        height: 24,
        objectFit: 'contain',
    },
});
