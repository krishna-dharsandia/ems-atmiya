import React from 'react';
import { Text, View, StyleSheet, Font, Svg, Path, Rect } from '@react-pdf/renderer';

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
    checkbox: {
        width: 12,
        height: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// Checkbox component for PDF exports
interface CheckboxProps {
  checked: boolean;
  size?: number;
}

export const PDFCheckbox: React.FC<CheckboxProps> = ({ checked, size = 14 }) => (
  <View style={[styles.checkbox, { width: size, height: size }]}>
    <Svg width={size} height={size} viewBox="0 0 16 16">
      {checked ? (
        // Checked state
        <>
          <Path
            d="M5 1h6c2.2 0 4 1.8 4 4v6c0 2.2-1.8 4-4 4H5c-2.2 0-4-1.8-4-4V5c0-2.2 1.8-4 4-4z"
            fill="#EFF6FF"
            stroke="#BFDBFE"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <Path
            d="M11 6L7 10L5 8"
            stroke="#2563EB"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      ) : (
        // Unchecked state
        <Path
          d="M5 1h6c2.2 0 4 1.8 4 4v6c0 2.2-1.8 4-4 4H5c-2.2 0-4-1.8-4-4V5c0-2.2 1.8-4 4-4z"
          fill="#FFFFFF"
          stroke="#D1D5DB"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  </View>
);

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
