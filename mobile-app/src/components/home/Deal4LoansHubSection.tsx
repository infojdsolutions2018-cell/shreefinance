import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';

interface Deal4LoansHubSectionProps {
  onSelectProduct: (type: string) => void;
}

export function Deal4LoansHubSection({ onSelectProduct }: Deal4LoansHubSectionProps) {
  const router = useRouter();

  const hubs = [
    {
      id: 'read',
      title: 'Read About Loans',
      icon: 'book-outline',
      iconColor: '#0284c7',
      bgColor: '#e0f2fe',
      items: [
        { label: 'Personal Loan Guide', action: () => router.push('/loans/personal-loan' as any) },
        { label: 'Home Loan & PMAY Guide', action: () => router.push('/loans/home-loan' as any) },
        { label: 'Car Loan Documentation', action: () => router.push('/loans/car-loan' as any) },
        { label: 'Loan Against Property (LAP)', action: () => router.push('/loans/loan-against-property' as any) },
      ],
    },
    {
      id: 'calc',
      title: 'Calculate Your Loans',
      icon: 'calculator-outline',
      iconColor: '#10b981',
      bgColor: '#ecfdf5',
      items: [
        { label: 'EMI Installment Calculator', action: () => router.push('/calculator') },
        { label: 'Pre-Approval Eligibility Check', action: () => router.push('/loans' as any) },
        { label: 'Balance Transfer Savings', action: () => router.push('/compare') },
        { label: 'Track Existing Application', action: () => router.push('/track') },
      ],
    },
    {
      id: 'rates',
      title: 'Live Interest Rates',
      icon: 'trending-down-outline',
      iconColor: '#f59e0b',
      bgColor: '#fef3c7',
      items: [
        { label: 'Home Loan (from 8.35%*)', action: () => router.push('/loans/home-loan' as any) },
        { label: 'Personal Loan (from 10.25%*)', action: () => router.push('/loans/personal-loan' as any) },
        { label: 'Car Loan (from 8.75%*)', action: () => router.push('/loans/car-loan' as any) },
        { label: 'Business Loan (from 13.99%*)', action: () => router.push('/loans/business-loan' as any) },
      ],
    },
    {
      id: 'cards',
      title: 'Credit Card Offers',
      icon: 'card-outline',
      iconColor: '#8b5cf6',
      bgColor: '#f5f3ff',
      items: [
        { label: 'HDFC Bank Credit Cards', action: () => onSelectProduct('Credit Card Referral') },
        { label: 'SBI Card Travel Perks', action: () => onSelectProduct('Credit Card Referral') },
        { label: 'ICICI Lifetime Free Cards', action: () => onSelectProduct('Credit Card Referral') },
        { label: 'Axis Bank Magnus Rewards', action: () => onSelectProduct('Credit Card Referral') },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={12} color={BrandColors.primary} />
            <Text style={styles.badgeText}>FINANCIAL RESOURCE HUB</Text>
          </View>
        </View>
        <Text style={styles.title}>Finances News & Tools</Text>
        <Text style={styles.subtitle}>
          Instant access to loan calculators, verified rate matrices, cards, and banking guides.
        </Text>
      </View>

      {/* Hub Cards Grid */}
      <View style={styles.grid}>
        {hubs.map((hub) => (
          <View key={hub.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrap, { backgroundColor: hub.bgColor }]}>
                <Ionicons name={hub.icon as any} size={18} color={hub.iconColor} />
              </View>
              <Text style={styles.cardTitle}>{hub.title}</Text>
            </View>

            <View style={styles.itemsList}>
              {hub.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.itemRow}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={13} color="#94a3b8" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  header: {
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: BrandColors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 16,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  itemsList: {
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
});
