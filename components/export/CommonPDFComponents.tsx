import React from 'react';
import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.registerEmojiSource({
    format: 'png',
    url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

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

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        left: 64,
        right: 64,
        bottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#9CA3AF',
        paddingTop: 8,
    },
    footerText: {
        fontSize: 10,
        color: '#6B7280',
        fontStyle: 'italic',
        fontWeight: 700,
    },
    pageNumber: {
        fontSize: 8,
        color: '#6B7280',
    },
    bottomSpacer: {
        height: 10,
    },
    logo: {
        height: 42,
        maxHeight: 42,
        width: 'auto',
        objectFit: 'contain',
    },
});

export const PDFFooter = () => (
    <>
        <View style={styles.bottomSpacer} fixed />
        <View style={styles.footer} fixed>
            <Text style={styles.footerText}>
                {`Draft by EMS - Atmiya University`}
            </Text>
            <Text
                style={styles.pageNumber}
                render={({ pageNumber }) => `${pageNumber}`}
            />
        </View>
    </>
);

export const commonPDFStyles = StyleSheet.create({
    page: {
        fontFamily: 'Inter',
        paddingVertical: 20,
        paddingHorizontal: 64,
        fontSize: 9,
        backgroundColor: '#ffffff',
        color: '#000000',
        flexDirection: 'column',
        gap: 24,
    },
    sectionContent: {
        gap: 12,
    },
    section: {
        marginBottom: 20,
    },
});
