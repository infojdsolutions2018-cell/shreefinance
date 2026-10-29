import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';

export function PartnerLogosSection() {
  const partnerBanks = [
    { code: 'SBI', name: 'State Bank of India', bg: '#1e3a8a' },
    { code: 'HDFC', name: 'HDFC Bank', bg: '#004c8f' },
    { code: 'ICICI', name: 'ICICI Bank', bg: '#b91c1c' },
    { code: 'AXIS', name: 'Axis Bank', bg: '#9d174d' },
    { code: 'YB', name: 'YES Bank', bg: '#0284c7' },
    { code: 'KOTAK', name: 'Kotak Mahindra', bg: '#dc2626' },
    { code: 'BOB', name: 'Bank of Baroda', bg: '#ea580c' },
    { code: 'PNB', name: 'Punjab National Bank', bg: '#ca8a04' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={14} color={BrandColors.primary} />
        <Text style={styles.headerText}>OFFICIAL LENDING NETWORK • 40+ PARTNER BANKS</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {partnerBanks.map((bank) => (
          <View key={bank.code} style={styles.bankPill}>
            <View style={[styles.codeBadge, { backgroundColor: bank.bg }]}>
              <Text style={styles.codeText}>{bank.code}</Text>
            </View>
            <Text style={styles.bankName}>{bank.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  scrollContent: {
    gap: 8,
  },
  bankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  codeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  bankName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
});
