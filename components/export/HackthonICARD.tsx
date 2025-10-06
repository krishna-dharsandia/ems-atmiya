/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

type HackthonICARDPros = {
    name: string;
    teamName: string;
    teamId: string;
    participantId: string;
    participantRole: string;
    userType: string;
    qrCode: string;
}

export const HackthonICARD = ({
    name,
    participantId,
    participantRole,
    teamId,
    teamName,
    userType,
    qrCode,
}: HackthonICARDPros) => (
    <Document>
        <Page size={[198.43, 297.64]} style={styles.page}>

            {/* Header - Two Logos */}
            <View style={styles.headerLogos}>
                {/* ADSC Logo - Left */}
                <View style={styles.logoPlaceholder}>
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

            <View style={{ paddingBottom: 10 }}>
                {/* ALL-ACCESS */}
                <View style={styles.allAccessSection}>
                    <Text style={styles.allAccessText}>{userType}</Text>
                </View>

                <View style={styles.twoColumnRow}>
                    {/* Team Name */}
                    <View style={styles.columnLeft}>
                        <Text style={styles.quantumLabel}>TEAM NAME</Text>
                        <Text style={styles.infoValueText}>{teamName}</Text>
                    </View>

                    {/* Team ID */}
                    <View style={styles.columnRight}>
                        <Text style={styles.quantumLabel}>TEAM ID</Text>
                        <Text style={styles.infoValueText}>{teamId.substring(0, 5)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={{ paddingTop: 10, rowGap: 6 }}>
                {/* Student Name */}
                <View>
                    <Text style={styles.quantumLabel}>STUDENT NAME</Text>
                    <Text style={styles.nameText}>{name}</Text>
                </View>

                {/* Participant ID */}
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

            {/* Bottom - 4 Organization Logos */}
            <View style={styles.bottomLogos}>
                <View style={styles.orgLogoBox}>
                    <Image
                        src="/images/ieee-logo.png"
                        style={styles.orgLogoImage}
                    />
                </View>
                <View style={styles.orgLogoBox}>
                    <Image
                        src="/images/iic-logo.png"
                        style={styles.orgLogoImage}
                    />
                </View>
                <View style={styles.orgLogoBox}>
                    <Image
                        src="/images/ssip-logo.png"
                        style={styles.orgLogoImage}
                    />
                </View>
                <View style={styles.orgLogoBox}>
                    <Image
                        src="/images/atmiya-rit-logo.png"
                        style={styles.orgLogoImage}
                    />
                </View>
            </View>
        </Page>
    </Document >
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
        width: '7cm',
        height: '10.5cm',
        backgroundColor: '#000000',
        padding: 0,
        position: 'relative',
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: 'Inter',
    },

    // Header Logos (Top)
    headerLogos: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 5,
    },
    logoPlaceholder: {
        width: 'auto',
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    headerLogoImage: {
        width: 'auto',
        height: 30,
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
        marginTop: 6,
        marginBottom: 4,
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
    },

    // Labels and Values
    quantumLabel: {
        color: '#6b7280',
        fontSize: 7,
        marginBottom: 2,
    },
    nameText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontFamily: 'Squids',
    },
    infoValueText: {
        color: '#ffffff',
        fontSize: 10,
    },

    // Two Column Layout
    twoColumnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

    // QR Code Section
    qrSection: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    qrCode: {
        width: 50,
        height: 50,
        backgroundColor: '#ffffff',
        marginRight: 10,
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
        right: 20,
        columnGap: 5,
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orgLogoBox: {
        width: 'auto',
        height: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        position: 'relative',
    },
    orgLogoImage: {
        width: 'auto',
        height: 20,
        objectFit: 'contain',
    },
});
