import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';

type LoanFilter = 'Home Loan' | 'Personal Loan' | 'Business Loan';

interface BankRateItem {
  bank: string;
  code: string;
  type: LoanFilter;
  rate: number;
  fee: string;
  tenure: string;
  special: string;
  isDirect: boolean;
  color: string;
}

const ratesData: BankRateItem[] = [
  { bank: 'Shree Finance Direct', code: 'SF', type: 'Home Loan', rate: 8.35, fee: 'Nil Processing Fee', tenure: 'Up to 30 Yrs', special: 'Lowest Rate Guarantee', isDirect: true, color: '#0284c7' },
  { bank: 'State Bank of India (SBI)', code: 'SBI', type: 'Home Loan', rate: 8.40, fee: 'Nil for Women', tenure: 'Up to 30 Yrs', special: 'Public Sector Trust', isDirect: false, color: '#1e3a8a' },
  { bank: 'YES Bank', code: 'YB', type: 'Home Loan', rate: 8.40, fee: '₹4,999 Flat', tenure: 'Up to 30 Yrs', special: '100% Digital Approval', isDirect: false, color: '#0369a1' },
  { bank: 'HDFC Bank', code: 'HDFC', type: 'Home Loan', rate: 8.50, fee: '0.50% + GST', tenure: 'Up to 30 Yrs', special: 'Instant Pre-Approval', isDirect: false, color: '#004c8f' },
  { bank: 'ICICI Bank', code: 'ICICI', type: 'Home Loan', rate: 8.55, fee: '0.25% + GST', tenure: 'Up to 30 Yrs', special: 'Minimal Docs', isDirect: false, color: '#b91c1c' },

  { bank: 'Shree Finance Direct', code: 'SF', type: 'Personal Loan', rate: 10.25, fee: 'Nil', tenure: '1-6 Yrs', special: 'Disbursal in 24 Hrs', isDirect: true, color: '#0284c7' },
  { bank: 'YES Bank', code: 'YB', type: 'Personal Loan', rate: 10.50, fee: 'Up to 1.5%', tenure: '1-6 Yrs', special: 'Instant Paperless', isDirect: false, color: '#0369a1' },
  { bank: 'HDFC Bank', code: 'HDFC', type: 'Personal Loan', rate: 10.50, fee: 'Up to 2.50%', tenure: '1-6 Yrs', special: 'Existing Customer Perk', isDirect: false, color: '#004c8f' },
  { bank: 'ICICI Bank', code: 'ICICI', type: 'Personal Loan', rate: 10.75, fee: 'Up to 2.25%', tenure: '1-6 Yrs', special: 'Pre-Approved Limit', isDirect: false, color: '#b91c1c' },
  { bank: 'Axis Bank', code: 'AXIS', type: 'Personal Loan', rate: 10.99, fee: 'Up to 2.0%', tenure: '1-5 Yrs', special: 'Flexible Tenures', isDirect: false, color: '#9d174d' },

  { bank: 'Shree Finance Direct', code: 'SF', type: 'Business Loan', rate: 13.99, fee: '0.50%', tenure: '1-7 Yrs', special: 'Collateral-Free', isDirect: true, color: '#0284c7' },
  { bank: 'YES Bank', code: 'YB', type: 'Business Loan', rate: 14.50, fee: '1.00%', tenure: '1-5 Yrs', special: 'MSME Special', isDirect: false, color: '#0369a1' },
];

interface RateComparisonSectionProps {
  onApplyForBank: (bankName: string, loanType: string) => void;
}

export function RateComparisonSection({ onApplyForBank }: RateComparisonSectionProps) {
  const [filterType, setFilterType] = useState<LoanFilter>('Home Loan');

  const filtered = ratesData.filter((item) => item.type === filterType);
  const sorted = [...filtered].sort((a, b) => a.rate - b.rate);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.rateBadge}>
            <Ionicons name="trending-down" size={12} color={BrandColors.primary} />
            <Text style={styles.rateBadgeText}>MULTI-BANK INTEREST MATRIX</Text>
          </View>
        </View>
        <Text style={styles.title}>Compare Live Interest Rates</Text>
        <Text style={styles.subtitle}>
          Transparent real-time comparison across top commercial banks & NBFCs with zero hidden charges.
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {(['Home Loan', 'Personal Loan', 'Business Loan'] as LoanFilter[]).map((tab) => {
          const isActive = filterType === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setFilterType(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Rates Cards List */}
      <View style={styles.listContainer}>
        {sorted.map((item, idx) => (
          <View
            key={`${item.bank}-${item.type}-${idx}`}
            style={[
              styles.rateCard,
              item.isDirect && styles.rateCardDirect,
            ]}
          >
            {/* Top Row: Logo, Name, Badge */}
            <View style={styles.cardTopRow}>
              <View style={styles.bankInfo}>
                <View style={[styles.logoBadge, { backgroundColor: item.color }]}>
                  <Text style={styles.logoBadgeText}>{item.code}</Text>
                </View>
                <View style={styles.bankNameCol}>
                  <Text style={styles.bankName}>{item.bank}</Text>
                  {item.isDirect && (
                    <Text style={styles.directTag}>★ In-House Preferred Partner</Text>
                  )}
                </View>
              </View>

              <View style={styles.rateCol}>
                <Text style={styles.rateValue}>{item.rate.toFixed(2)}%</Text>
                {idx === 0 && (
                  <View style={styles.lowestBadge}>
                    <Text style={styles.lowestBadgeText}>LOWEST</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Details Row: Processing fee, tenure, advantage */}
            <View style={styles.cardDetailsRow}>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Processing Fee</Text>
                <Text style={styles.detailVal}>{item.fee}</Text>
              </View>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Max Tenure</Text>
                <Text style={styles.detailVal}>{item.tenure}</Text>
              </View>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Special Perk</Text>
                <Text style={styles.detailValSpecial} numberOfLines={1}>{item.special}</Text>
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={[styles.applyBtn, item.isDirect && styles.applyBtnDirect]}
              onPress={() => onApplyForBank(item.bank, item.type)}
              activeOpacity={0.85}
            >
              <Text style={styles.applyBtnText}>
                {item.isDirect ? 'Apply In-House Sanction' : `Apply via ${item.code}`}
              </Text>
              <Ionicons name="arrow-forward" size={12} color="#ffffff" />
            </TouchableOpacity>
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
  rateBadge: {
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
  rateBadgeText: {
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
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 3,
    gap: 4,
    marginBottom: 14,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  filterTabActive: {
    backgroundColor: BrandColors.primary,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    gap: 10,
  },
  rateCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 10,
  },
  rateCardDirect: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  bankNameCol: {
    flex: 1,
  },
  bankName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  directTag: {
    fontSize: 9,
    fontWeight: '800',
    color: BrandColors.primary,
    marginTop: 1,
  },
  rateCol: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 17,
    fontWeight: '900',
    color: BrandColors.primary,
  },
  lowestBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    marginTop: 2,
  },
  lowestBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#15803d',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailVal: {
    fontSize: 11,
    color: '#1e293b',
    fontWeight: '800',
    marginTop: 1,
  },
  detailValSpecial: {
    fontSize: 10,
    color: '#0284c7',
    fontWeight: '800',
    marginTop: 1,
  },
  applyBtn: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  applyBtnDirect: {
    backgroundColor: BrandColors.primary,
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
