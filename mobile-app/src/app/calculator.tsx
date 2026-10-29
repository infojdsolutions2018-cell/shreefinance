import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { LoanModal } from '@/components/LoanModal';

type CalcTab = 'emi' | 'sip' | 'fd' | 'rd';

export default function CalculatorScreen() {
  const [activeTab, setActiveTab] = useState<CalcTab>('emi');
  const [modalVisible, setModalVisible] = useState(false);

  // EMI State
  const [emiAmount, setEmiAmount] = useState(1500000);
  const [emiRate, setEmiRate] = useState(9.5);
  const [emiTenure, setEmiTenure] = useState(15);

  // SIP State
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // FD State
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(7.1);
  const [fdYears, setFdYears] = useState(5);

  // Calculations
  const emiResult = useMemo(() => {
    const r = emiRate / 12 / 100;
    const n = emiTenure * 12;
    if (r === 0) {
      return { emi: emiAmount / n, totalInterest: 0, totalPayment: emiAmount };
    }
    const emi = (emiAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - emiAmount;
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  }, [emiAmount, emiRate, emiTenure]);

  const sipResult = useMemo(() => {
    const i = sipRate / 12 / 100;
    const n = sipYears * 12;
    const fv = sipMonthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = sipMonthly * n;
    return {
      invested: Math.round(invested),
      returns: Math.round(fv - invested),
      total: Math.round(fv),
    };
  }, [sipMonthly, sipRate, sipYears]);

  const fdResult = useMemo(() => {
    const maturity = fdPrincipal * Math.pow(1 + fdRate / 400, 4 * fdYears);
    return {
      principal: fdPrincipal,
      interest: Math.round(maturity - fdPrincipal),
      total: Math.round(maturity),
    };
  }, [fdPrincipal, fdRate, fdYears]);

  const formatINR = (val: number) => {
    return '₹' + Math.max(0, val).toLocaleString('en-IN');
  };

  const tabs: { id: CalcTab; label: string; icon: any }[] = [
    { id: 'emi', label: 'Loan EMI', icon: 'home' },
    { id: 'sip', label: 'SIP Wealth', icon: 'trending-up' },
    { id: 'fd', label: 'Fixed Deposit', icon: 'wallet' },
    { id: 'rd', label: 'Recurring', icon: 'cash' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader onOpenApply={() => setModalVisible(true)} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.headerBox}>
          <Text style={styles.headerTitle}>Financial Calculators</Text>
          <Text style={styles.headerSub}>
            Accurate EMI & wealth forecasting with bank-verified logic
          </Text>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons
                name={tab.icon}
                size={14}
                color={activeTab === tab.id ? '#ffffff' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === tab.id && styles.tabBtnTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* EMI Section */}
        {activeTab === 'emi' && (
          <View style={styles.calcCard}>
            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Loan Amount</Text>
                <Text style={styles.fieldValue}>{formatINR(emiAmount)}</Text>
              </View>

              {/* Amount Quick Presets */}
              <View style={styles.presetWrap}>
                {[500000, 1000000, 2500000, 5000000, 10000000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[
                      styles.presetChip,
                      emiAmount === amt && styles.presetChipActive,
                    ]}
                    onPress={() => setEmiAmount(amt)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        emiAmount === amt && styles.presetChipTextActive,
                      ]}
                    >
                      {amt >= 10000000
                        ? `₹${amt / 10000000}Cr`
                        : `₹${amt / 100000}L`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Steppers */}
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setEmiAmount(Math.max(50000, emiAmount - 100000))}
                >
                  <Text style={styles.stepBtnText}>- ₹1 Lakh</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setEmiAmount(emiAmount + 100000)}
                >
                  <Text style={styles.stepBtnText}>+ ₹1 Lakh</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Interest Rate */}
            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Interest Rate (% p.a.)</Text>
                <Text style={styles.fieldValue}>{emiRate.toFixed(1)}%</Text>
              </View>
              <View style={styles.stepperRow}>
                {[8.35, 9.25, 10.5, 12.0, 14.5].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.presetChip,
                      emiRate === r && styles.presetChipActive,
                    ]}
                    onPress={() => setEmiRate(r)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        emiRate === r && styles.presetChipTextActive,
                      ]}
                    >
                      {r}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setEmiRate(Math.max(1, +(emiRate - 0.25).toFixed(2)))}
                >
                  <Text style={styles.stepBtnText}>- 0.25%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setEmiRate(+(emiRate + 0.25).toFixed(2))}
                >
                  <Text style={styles.stepBtnText}>+ 0.25%</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tenure */}
            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Tenure (Years)</Text>
                <Text style={styles.fieldValue}>{emiTenure} Years</Text>
              </View>
              <View style={styles.stepperRow}>
                {[3, 5, 10, 15, 20, 25, 30].map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={[
                      styles.presetChip,
                      emiTenure === y && styles.presetChipActive,
                    ]}
                    onPress={() => setEmiTenure(y)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        emiTenure === y && styles.presetChipTextActive,
                      ]}
                    >
                      {y}Y
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Result Summary */}
            <View style={styles.resultContainer}>
              <View style={styles.emiHighlight}>
                <Text style={styles.emiHighlightLabel}>MONTHLY EMI</Text>
                <Text style={styles.emiHighlightVal}>{formatINR(emiResult.emi)}</Text>
                <Text style={styles.emiHighlightSub}>Per month payment</Text>
              </View>

              <View style={styles.resultRows}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultRowLabel}>Principal Amount</Text>
                  <Text style={styles.resultRowVal}>{formatINR(emiAmount)}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultRowLabel}>Total Interest Payable</Text>
                  <Text style={[styles.resultRowVal, { color: BrandColors.primary }]}>
                    +{formatINR(emiResult.totalInterest)}
                  </Text>
                </View>
                <View style={[styles.resultRow, styles.resultTotalRow]}>
                  <Text style={styles.resultTotalLabel}>Total Amount Payable</Text>
                  <Text style={styles.resultTotalVal}>
                    {formatINR(emiResult.totalPayment)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.applyForLoanBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.applyForLoanBtnText}>Apply for this EMI</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* SIP Section */}
        {activeTab === 'sip' && (
          <View style={styles.calcCard}>
            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Monthly Investment</Text>
                <Text style={styles.fieldValue}>{formatINR(sipMonthly)}</Text>
              </View>
              <View style={styles.presetWrap}>
                {[1000, 2500, 5000, 10000, 25000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[
                      styles.presetChip,
                      sipMonthly === amt && styles.presetChipActive,
                    ]}
                    onPress={() => setSipMonthly(amt)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        sipMonthly === amt && styles.presetChipTextActive,
                      ]}
                    >
                      {formatINR(amt)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Expected Return (% p.a.)</Text>
                <Text style={styles.fieldValue}>{sipRate}%</Text>
              </View>
              <View style={styles.stepperRow}>
                {[10, 12, 14, 15, 18].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.presetChip,
                      sipRate === r && styles.presetChipActive,
                    ]}
                    onPress={() => setSipRate(r)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        sipRate === r && styles.presetChipTextActive,
                      ]}
                    >
                      {r}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Time Period (Years)</Text>
                <Text style={styles.fieldValue}>{sipYears} Years</Text>
              </View>
              <View style={styles.stepperRow}>
                {[3, 5, 10, 15, 20, 25].map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={[
                      styles.presetChip,
                      sipYears === y && styles.presetChipActive,
                    ]}
                    onPress={() => setSipYears(y)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        sipYears === y && styles.presetChipTextActive,
                      ]}
                    >
                      {y}Y
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.resultContainer}>
              <View style={styles.emiHighlight}>
                <Text style={styles.emiHighlightLabel}>EXPECTED MATURITY VALUE</Text>
                <Text style={[styles.emiHighlightVal, { color: BrandColors.emerald }]}>
                  {formatINR(sipResult.total)}
                </Text>
              </View>

              <View style={styles.resultRows}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultRowLabel}>Invested Amount</Text>
                  <Text style={styles.resultRowVal}>{formatINR(sipResult.invested)}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultRowLabel}>Estimated Wealth Gain</Text>
                  <Text style={[styles.resultRowVal, { color: BrandColors.emerald }]}>
                    +{formatINR(sipResult.returns)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* FD / RD Section */}
        {(activeTab === 'fd' || activeTab === 'rd') && (
          <View style={styles.calcCard}>
            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Deposit Amount</Text>
                <Text style={styles.fieldValue}>{formatINR(fdPrincipal)}</Text>
              </View>
              <View style={styles.presetWrap}>
                {[50000, 100000, 200000, 500000, 1000000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[
                      styles.presetChip,
                      fdPrincipal === amt && styles.presetChipActive,
                    ]}
                    onPress={() => setFdPrincipal(amt)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        fdPrincipal === amt && styles.presetChipTextActive,
                      ]}
                    >
                      {formatINR(amt)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Interest Rate (% p.a.)</Text>
                <Text style={styles.fieldValue}>{fdRate}%</Text>
              </View>
              <View style={styles.stepperRow}>
                {[6.5, 7.1, 7.5, 8.0, 8.5].map((r) => (
                  <TouchableOpacity
                    key={r}
                    style={[
                      styles.presetChip,
                      fdRate === r && styles.presetChipActive,
                    ]}
                    onPress={() => setFdRate(r)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        fdRate === r && styles.presetChipTextActive,
                      ]}
                    >
                      {r}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldBox}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>Tenure (Years)</Text>
                <Text style={styles.fieldValue}>{fdYears} Years</Text>
              </View>
              <View style={styles.stepperRow}>
                {[1, 2, 3, 5, 10].map((y) => (
                  <TouchableOpacity
                    key={y}
                    style={[
                      styles.presetChip,
                      fdYears === y && styles.presetChipActive,
                    ]}
                    onPress={() => setFdYears(y)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        fdYears === y && styles.presetChipTextActive,
                      ]}
                    >
                      {y}Y
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.resultContainer}>
              <View style={styles.emiHighlight}>
                <Text style={styles.emiHighlightLabel}>TOTAL MATURITY VALUE</Text>
                <Text style={[styles.emiHighlightVal, { color: BrandColors.primary }]}>
                  {formatINR(fdResult.total)}
                </Text>
              </View>

              <View style={styles.resultRows}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultRowLabel}>Principal Deposited</Text>
                  <Text style={styles.resultRowVal}>{formatINR(fdResult.principal)}</Text>
                </View>
                <View style={styles.resultRow}>
                  <Text style={styles.resultRowLabel}>Interest Earned</Text>
                  <Text style={[styles.resultRowVal, { color: BrandColors.emerald }]}>
                    +{formatINR(fdResult.interest)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <LoanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        defaultLoanType="Personal Loan"
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
    paddingBottom: 10,
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
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginVertical: 10,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabBtnActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  calcCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
  },
  fieldBox: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 10,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '900',
    color: BrandColors.primary,
  },
  presetWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetChipActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  presetChipTextActive: {
    color: '#ffffff',
  },
  stepBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  stepBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284c7',
  },
  resultContainer: {
    backgroundColor: BrandColors.primaryBg,
    borderColor: BrandColors.primaryLight,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  emiHighlight: {
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.3)',
  },
  emiHighlightLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: BrandColors.primaryDark,
    letterSpacing: 1,
  },
  emiHighlightVal: {
    fontSize: 26,
    fontWeight: '900',
    color: BrandColors.primary,
    marginTop: 2,
  },
  emiHighlightSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  resultRows: {
    gap: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultRowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  resultRowVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  resultTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(56, 189, 248, 0.3)',
  },
  resultTotalLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0f172a',
  },
  resultTotalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: BrandColors.primary,
  },
  applyForLoanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: BrandColors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  applyForLoanBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
