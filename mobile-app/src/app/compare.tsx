import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { LoanModal } from '@/components/LoanModal';

type LoanCategory = 'Home Loan' | 'Personal Loan' | 'Business Loan';

export default function CompareScreen() {
  const [filterType, setFilterType] = useState<LoanCategory>('Home Loan');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState('Shree Finance Direct');

  const ratesData = [
    // Home Loans
    {
      bank: 'Shree Finance Direct',
      code: 'SF',
      type: 'Home Loan',
      rate: 8.35,
      fee: 'Nil Processing Fee',
      tenure: 'Up to 30 Yrs',
      special: 'Lowest Rate Guarantee',
      isDirect: true,
      color: '#0284c7',
    },
    {
      bank: 'State Bank of India (SBI)',
      code: 'SBI',
      type: 'Home Loan',
      rate: 8.40,
      fee: 'Nil for Women',
      tenure: 'Up to 30 Yrs',
      special: 'Public Sector Trust',
      isDirect: false,
      color: '#1e3a8a',
    },
    {
      bank: 'YES Bank',
      code: 'YB',
      type: 'Home Loan',
      rate: 8.40,
      fee: '₹4,999 Flat',
      tenure: 'Up to 30 Yrs',
      special: '100% Digital Approval',
      isDirect: false,
      color: '#0369a1',
    },
    {
      bank: 'HDFC Bank',
      code: 'HDFC',
      type: 'Home Loan',
      rate: 8.50,
      fee: '0.50% + GST',
      tenure: 'Up to 30 Yrs',
      special: 'Instant Pre-approval',
      isDirect: false,
      color: '#004c8f',
    },
    {
      bank: 'ICICI Bank',
      code: 'ICICI',
      type: 'Home Loan',
      rate: 8.55,
      fee: '0.25% + GST',
      tenure: 'Up to 30 Yrs',
      special: 'Minimal Docs',
      isDirect: false,
      color: '#b91c1c',
    },

    // Personal Loans
    {
      bank: 'Shree Finance Direct',
      code: 'SF',
      type: 'Personal Loan',
      rate: 10.25,
      fee: 'Nil Fee',
      tenure: '1-6 Yrs',
      special: 'Disbursal in 24 Hrs',
      isDirect: true,
      color: '#0284c7',
    },
    {
      bank: 'YES Bank',
      code: 'YB',
      type: 'Personal Loan',
      rate: 10.50,
      fee: 'Up to 1.5%',
      tenure: '1-6 Yrs',
      special: 'Instant Paperless',
      isDirect: false,
      color: '#0369a1',
    },
    {
      bank: 'HDFC Bank',
      code: 'HDFC',
      type: 'Personal Loan',
      rate: 10.50,
      fee: 'Up to 2.5%',
      tenure: '1-6 Yrs',
      special: 'Existing Customer Perk',
      isDirect: false,
      color: '#004c8f',
    },
    {
      bank: 'ICICI Bank',
      code: 'ICICI',
      type: 'Personal Loan',
      rate: 10.75,
      fee: 'Up to 2.25%',
      tenure: '1-6 Yrs',
      special: 'Pre-approved Limit',
      isDirect: false,
      color: '#b91c1c',
    },
    {
      bank: 'Axis Bank',
      code: 'AXIS',
      type: 'Personal Loan',
      rate: 10.99,
      fee: 'Up to 2.0%',
      tenure: '1-5 Yrs',
      special: 'Flexible Tenures',
      isDirect: false,
      color: '#9d174d',
    },

    // Business Loans
    {
      bank: 'Shree Finance Direct',
      code: 'SF',
      type: 'Business Loan',
      rate: 13.99,
      fee: '0.50%',
      tenure: '1-7 Yrs',
      special: 'Collateral-Free',
      isDirect: true,
      color: '#0284c7',
    },
    {
      bank: 'YES Bank',
      code: 'YB',
      type: 'Business Loan',
      rate: 14.50,
      fee: '1.00%',
      tenure: '1-5 Yrs',
      special: 'MSME Fastrack',
      isDirect: false,
      color: '#0369a1',
    },
  ];

  const filtered = ratesData.filter((item) => item.type === filterType);

  const handleApply = (bankName: string) => {
    setSelectedBank(bankName);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader onOpenApply={() => setModalVisible(true)} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.badgeRow}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>VERIFIED 2026 RATES</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>Compare Bank Rates</Text>
          <Text style={styles.headerSub}>
            Transparent comparison across India&apos;s leading lending partners with no hidden charges.
          </Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['Home Loan', 'Personal Loan', 'Business Loan'] as LoanCategory[]).map(
            (cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterBtn,
                  filterType === cat && styles.filterBtnActive,
                ]}
                onPress={() => setFilterType(cat)}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    filterType === cat && styles.filterBtnTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Rate Cards List */}
        <View style={styles.cardsList}>
          {filtered.map((item, idx) => (
            <View
              key={`${item.bank}-${idx}`}
              style={[
                styles.bankRateCard,
                item.isDirect && styles.directBankRateCard,
              ]}
            >
              {item.isDirect && (
                <View style={styles.preferredRibbon}>
                  <Text style={styles.preferredRibbonText}>
                    ★ IN-HOUSE PREFERRED PARTNER
                  </Text>
                </View>
              )}

              {/* Bank Info Header */}
              <View style={styles.bankHeaderRow}>
                <View style={styles.bankNameCol}>
                  <View
                    style={[
                      styles.bankAvatar,
                      { backgroundColor: item.color },
                    ]}
                  >
                    <Text style={styles.bankAvatarText}>{item.code}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankName}>{item.bank}</Text>
                    <Text style={styles.bankAdvantage}>{item.special}</Text>
                  </View>
                </View>

                {/* Rate Highlight */}
                <View style={styles.rateHighlightBox}>
                  <Text style={styles.rateVal}>{item.rate.toFixed(2)}%</Text>
                  <Text style={styles.rateLabel}>Interest Rate</Text>
                </View>
              </View>

              {/* Details Grid */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLbl}>Processing Fee</Text>
                  <Text style={styles.detailVal}>{item.fee}</Text>
                </View>
                <View style={styles.detailDivider} />
                <View style={styles.detailItem}>
                  <Text style={styles.detailLbl}>Max Tenure</Text>
                  <Text style={styles.detailVal}>{item.tenure}</Text>
                </View>
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.applyBtn,
                  item.isDirect && styles.applyBtnDirect,
                ]}
                onPress={() => handleApply(item.bank)}
                activeOpacity={0.8}
              >
                <Text style={styles.applyBtnText}>
                  Apply to {item.bank.split(' ')[0]}
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Advisory Callout */}
        <View style={styles.advisoryCard}>
          <Ionicons name="information-circle" size={24} color="#38bdf8" />
          <View style={{ flex: 1 }}>
            <Text style={styles.advisoryTitle}>Need Assistance Choosing?</Text>
            <Text style={styles.advisoryText}>
              Our loan specialists compare 40+ sanction terms to find the lowest APR for your credit score.
            </Text>
          </View>
        </View>
      </ScrollView>

      <LoanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        defaultLoanType={filterType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBox: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BrandColors.primaryBg,
    borderColor: BrandColors.primaryLight,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.primary,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: BrandColors.primaryDark,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 17,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginVertical: 12,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterBtnActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
  },
  filterBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  filterBtnTextActive: {
    color: '#ffffff',
  },
  cardsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bankRateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    elevation: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
  },
  directBankRateCard: {
    borderColor: BrandColors.primary,
    backgroundColor: '#f0f9ff',
  },
  preferredRibbon: {
    backgroundColor: BrandColors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  preferredRibbonText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bankHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankNameCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  bankAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankAvatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  bankName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0f172a',
  },
  bankAdvantage: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  rateHighlightBox: {
    alignItems: 'flex-end',
  },
  rateVal: {
    fontSize: 19,
    fontWeight: '900',
    color: BrandColors.primary,
  },
  rateLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLbl: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  detailDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0b1329',
    paddingVertical: 11,
    borderRadius: 12,
  },
  applyBtnDirect: {
    backgroundColor: BrandColors.primary,
  },
  applyBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  advisoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0b1329',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 20,
    padding: 16,
  },
  advisoryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  advisoryText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 16,
  },
});
