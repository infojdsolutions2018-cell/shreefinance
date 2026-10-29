import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';

type CalcType = 'emi' | 'sip' | 'fd' | 'rd' | 'lumpsum';
type EMISolveFor = 'emi' | 'principal' | 'rate' | 'tenure';

interface UniversalCalculatorSectionProps {
  onApplyForLoan?: (amount: number, tenure: number, type: string) => void;
}

export function UniversalCalculatorSection({ onApplyForLoan }: UniversalCalculatorSectionProps) {
  const [activeTab, setActiveTab] = useState<CalcType>('emi');

  // EMI State
  const [solveFor, setSolveFor] = useState<EMISolveFor>('emi');
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(15);
  const [targetEmi, setTargetEmi] = useState(9847);

  // SIP State
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // FD State
  const [fdPrincipal, setFdPrincipal] = useState(200000);
  const [fdRate, setFdRate] = useState(7.1);
  const [fdYears, setFdYears] = useState(5);

  // RD State
  const [rdMonthly, setRdMonthly] = useState(5000);
  const [rdRate, setRdRate] = useState(7.0);
  const [rdYears, setRdYears] = useState(5);

  // Lumpsum State
  const [lumpPrincipal, setLumpPrincipal] = useState(100000);
  const [lumpRate, setLumpRate] = useState(12);
  const [lumpYears, setLumpYears] = useState(10);

  const formatCurrency = (val: number) => {
    return '₹' + Math.round(val).toLocaleString('en-IN');
  };

  // EMI Calculations
  const emiResult = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;

    if (solveFor === 'emi') {
      if (r === 0) return { emi: amount / n, principal: amount, totalInterest: 0, totalPayment: amount };
      const e = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPay = e * n;
      return {
        emi: Math.round(e),
        principal: amount,
        totalInterest: Math.max(0, Math.round(totalPay - amount)),
        totalPayment: Math.round(totalPay),
      };
    }
    if (solveFor === 'principal') {
      if (r === 0) return { emi: targetEmi, principal: targetEmi * n, totalInterest: 0, totalPayment: targetEmi * n };
      const p = (targetEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
      const totalPay = targetEmi * n;
      return {
        emi: targetEmi,
        principal: Math.round(p),
        totalInterest: Math.max(0, Math.round(totalPay - p)),
        totalPayment: Math.round(totalPay),
      };
    }
    if (solveFor === 'tenure') {
      if (r === 0 || targetEmi <= 0) return { emi: targetEmi, principal: amount, totalInterest: 0, totalPayment: amount, tenureYears: 0 };
      const months = Math.log(targetEmi / (targetEmi - amount * r)) / Math.log(1 + r);
      const yrs = isFinite(months) ? Math.round((months / 12) * 10) / 10 : 0;
      const totalPay = Math.round(targetEmi * (months || 1));
      return {
        emi: targetEmi,
        principal: amount,
        totalInterest: Math.max(0, Math.round(totalPay - amount)),
        totalPayment: totalPay,
        tenureYears: yrs,
      };
    }
    // Solve for rate
    let guess = 0.01;
    for (let i = 0; i < 100; i++) {
      const gn = Math.pow(1 + guess, n);
      const f = (amount * guess * gn) / (gn - 1) - targetEmi;
      const dg =
        (amount * (gn * (1 + guess * n * Math.log(1 + guess)) * (gn - 1) - guess * gn * n * Math.pow(1 + guess, n - 1))) /
        Math.pow(gn - 1, 2);
      if (Math.abs(dg) < 1e-10) break;
      guess = guess - f / dg;
      if (guess < 0) guess = 0.001;
    }
    const annualRate = Math.round(guess * 12 * 10000) / 100;
    const totalPay = Math.round(targetEmi * n);
    return {
      emi: targetEmi,
      principal: amount,
      totalInterest: Math.max(0, Math.round(totalPay - amount)),
      totalPayment: totalPay,
      solvedRate: annualRate,
    };
  }, [solveFor, amount, rate, tenure, targetEmi]);

  // SIP Calculation
  const sipResult = useMemo(() => {
    const i = sipRate / 12 / 100;
    const n = sipYears * 12;
    const fv = sipMonthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = sipMonthly * n;
    return {
      invested,
      returns: Math.max(0, Math.round(fv - invested)),
      total: Math.round(fv),
    };
  }, [sipMonthly, sipRate, sipYears]);

  // FD Calculation (Quarterly Compounding)
  const fdResult = useMemo(() => {
    const maturity = fdPrincipal * Math.pow(1 + fdRate / 400, 4 * fdYears);
    return {
      principal: fdPrincipal,
      interest: Math.max(0, Math.round(maturity - fdPrincipal)),
      maturity: Math.round(maturity),
    };
  }, [fdPrincipal, fdRate, fdYears]);

  // RD Calculation
  const rdResult = useMemo(() => {
    const n = rdYears * 4;
    const r = rdRate / 400;
    const p = rdMonthly * 3;
    const maturity = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = rdMonthly * rdYears * 12;
    return {
      invested,
      interest: Math.max(0, Math.round(maturity - invested)),
      maturity: Math.round(maturity),
    };
  }, [rdMonthly, rdRate, rdYears]);

  // Lumpsum Calculation
  const lumpResult = useMemo(() => {
    const maturity = lumpPrincipal * Math.pow(1 + lumpRate / 100, lumpYears);
    return {
      principal: lumpPrincipal,
      returns: Math.max(0, Math.round(maturity - lumpPrincipal)),
      maturity: Math.round(maturity),
    };
  }, [lumpPrincipal, lumpRate, lumpYears]);

  const tabs: { id: CalcType; label: string; icon: string }[] = [
    { id: 'emi', label: 'EMI', icon: 'home-outline' },
    { id: 'sip', label: 'SIP', icon: 'trending-up-outline' },
    { id: 'fd', label: 'FD', icon: 'business-outline' },
    { id: 'rd', label: 'RD', icon: 'wallet-outline' },
    { id: 'lumpsum', label: 'Lumpsum', icon: 'cash-outline' },
  ];

  // Visual split percentage for EMI
  const principalPercent = emiResult.totalPayment > 0
    ? Math.round((emiResult.principal / emiResult.totalPayment) * 100)
    : 50;
  const interestPercent = 100 - principalPercent;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.calcBadge}>
            <Ionicons name="calculator" size={12} color={BrandColors.primary} />
            <Text style={styles.calcBadgeText}>FINANCIAL CALCULATOR SUITE</Text>
          </View>
        </View>
        <Text style={styles.title}>Calculate EMI & Returns</Text>
        <Text style={styles.subtitle}>
          Interactive loan installments, SIP growth, and fixed deposit returns
        </Text>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab.icon as any}
                size={14}
                color={isActive ? '#ffffff' : '#64748b'}
              />
              <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TAB CONTENT: EMI */}
      {activeTab === 'emi' && (
        <View style={styles.tabContent}>
          {/* Solve For Switcher */}
          <View style={styles.solveForRow}>
            <Text style={styles.inputHeading}>Solve For:</Text>
            <View style={styles.solveForChips}>
              {(['emi', 'principal', 'rate', 'tenure'] as EMISolveFor[]).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.solveChip, solveFor === opt && styles.solveChipActive]}
                  onPress={() => setSolveFor(opt)}
                >
                  <Text style={[styles.solveChipText, solveFor === opt && styles.solveChipTextActive]}>
                    {opt === 'emi' ? 'EMI' : opt === 'principal' ? 'Amount' : opt === 'rate' ? 'Rate %' : 'Tenure'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount Field & Presets */}
          {solveFor !== 'principal' && (
            <View style={styles.paramSection}>
              <View style={styles.paramRowHeader}>
                <Text style={styles.paramLabel}>Loan Amount</Text>
                <Text style={styles.paramValue}>{formatCurrency(amount)}</Text>
              </View>
              <View style={styles.presetsWrap}>
                {[200000, 500000, 1000000, 2500000, 5000000, 10000000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[styles.presetChip, amount === amt && styles.presetChipActive]}
                    onPress={() => setAmount(amt)}
                  >
                    <Text style={[styles.presetChipText, amount === amt && styles.presetChipTextActive]}>
                      {amt >= 10000000 ? `${amt / 10000000} Cr` : `${amt / 100000} Lakhs`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Rate Field */}
          {solveFor !== 'rate' && (
            <View style={styles.paramSection}>
              <View style={styles.paramRowHeader}>
                <Text style={styles.paramLabel}>Interest Rate (% p.a.)</Text>
                <Text style={styles.paramValue}>{rate}%</Text>
              </View>
              <View style={styles.presetsWrap}>
                {[8.35, 8.75, 9.25, 10.25, 12.5, 13.99].map((rVal) => (
                  <TouchableOpacity
                    key={rVal}
                    style={[styles.presetChip, rate === rVal && styles.presetChipActive]}
                    onPress={() => setRate(rVal)}
                  >
                    <Text style={[styles.presetChipText, rate === rVal && styles.presetChipTextActive]}>
                      {rVal}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Tenure Field */}
          {solveFor !== 'tenure' && (
            <View style={styles.paramSection}>
              <View style={styles.paramRowHeader}>
                <Text style={styles.paramLabel}>Loan Tenure</Text>
                <Text style={styles.paramValue}>{tenure} Years ({tenure * 12} Mos)</Text>
              </View>
              <View style={styles.presetsWrap}>
                {[1, 3, 5, 7, 10, 15, 20, 25, 30].map((yr) => (
                  <TouchableOpacity
                    key={yr}
                    style={[styles.presetChip, tenure === yr && styles.presetChipActive]}
                    onPress={() => setTenure(yr)}
                  >
                    <Text style={[styles.presetChipText, tenure === yr && styles.presetChipTextActive]}>
                      {yr} Yrs
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* If solving for other variables, allow entering Target Monthly EMI */}
          {solveFor !== 'emi' && (
            <View style={styles.paramSection}>
              <View style={styles.paramRowHeader}>
                <Text style={styles.paramLabel}>Target Monthly EMI (₹)</Text>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="numeric"
                  value={String(targetEmi)}
                  onChangeText={(v) => setTargetEmi(Number(v) || 1000)}
                />
              </View>
            </View>
          )}

          {/* Results Card */}
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultLabel}>
                {solveFor === 'emi' ? 'ESTIMATED MONTHLY EMI' : solveFor === 'principal' ? 'MAX LOAN SANCTION' : solveFor === 'rate' ? 'SOLVED INTEREST RATE' : 'REQUIRED TENURE'}
              </Text>
              <Text style={styles.resultHeroVal}>
                {solveFor === 'emi'
                  ? formatCurrency(emiResult.emi)
                  : solveFor === 'principal'
                  ? formatCurrency(emiResult.principal)
                  : solveFor === 'rate'
                  ? `${emiResult.solvedRate ?? rate}%`
                  : `${emiResult.tenureYears ?? tenure} Years`}
              </Text>
              <Text style={styles.resultSubNote}>Calculated across verified bank amortization terms</Text>
            </View>

            {/* Split Visual Bar */}
            <View style={styles.splitBarWrapper}>
              <View style={[styles.splitBarPrincipal, { flex: Math.max(1, principalPercent) }]} />
              <View style={[styles.splitBarInterest, { flex: Math.max(1, interestPercent) }]} />
            </View>
            <View style={styles.splitLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: BrandColors.primary }]} />
                <Text style={styles.legendText}>Principal: {principalPercent}%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.legendText}>Interest: {interestPercent}%</Text>
              </View>
            </View>

            {/* Breakdown Rows */}
            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Principal Amount:</Text>
                <Text style={styles.breakdownVal}>{formatCurrency(emiResult.principal)}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Total Interest Payable:</Text>
                <Text style={[styles.breakdownVal, { color: '#f59e0b' }]}>
                  + {formatCurrency(emiResult.totalInterest)}
                </Text>
              </View>
              <View style={styles.breakdownDivider} />
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabelBold}>Total Payment (Principal + Int):</Text>
                <Text style={styles.breakdownValBold}>{formatCurrency(emiResult.totalPayment)}</Text>
              </View>
            </View>

            {/* Apply CTA Button */}
            {onApplyForLoan && (
              <TouchableOpacity
                style={styles.applyCalcBtn}
                onPress={() => onApplyForLoan(emiResult.principal, tenure, 'Loan')}
                activeOpacity={0.85}
              >
                <Text style={styles.applyCalcBtnText}>Apply for this Loan</Text>
                <Ionicons name="arrow-forward" size={14} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* TAB CONTENT: SIP */}
      {activeTab === 'sip' && (
        <View style={styles.tabContent}>
          <View style={styles.paramSection}>
            <View style={styles.paramRowHeader}>
              <Text style={styles.paramLabel}>Monthly Investment</Text>
              <Text style={styles.paramValue}>{formatCurrency(sipMonthly)}</Text>
            </View>
            <View style={styles.presetsWrap}>
              {[1000, 2500, 5000, 10000, 25000, 50000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[styles.presetChip, sipMonthly === amt && styles.presetChipActive]}
                  onPress={() => setSipMonthly(amt)}
                >
                  <Text style={[styles.presetChipText, sipMonthly === amt && styles.presetChipTextActive]}>
                    ₹{(amt / 1000).toFixed(0)}k/mo
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.paramSection}>
            <View style={styles.paramRowHeader}>
              <Text style={styles.paramLabel}>Expected Return (% p.a)</Text>
              <Text style={styles.paramValue}>{sipRate}%</Text>
            </View>
            <View style={styles.presetsWrap}>
              {[10, 12, 14, 15, 18].map((rVal) => (
                <TouchableOpacity
                  key={rVal}
                  style={[styles.presetChip, sipRate === rVal && styles.presetChipActive]}
                  onPress={() => setSipRate(rVal)}
                >
                  <Text style={[styles.presetChipText, sipRate === rVal && styles.presetChipTextActive]}>
                    {rVal}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.paramSection}>
            <View style={styles.paramRowHeader}>
              <Text style={styles.paramLabel}>Time Period</Text>
              <Text style={styles.paramValue}>{sipYears} Years</Text>
            </View>
            <View style={styles.presetsWrap}>
              {[3, 5, 10, 15, 20, 25].map((yVal) => (
                <TouchableOpacity
                  key={yVal}
                  style={[styles.presetChip, sipYears === yVal && styles.presetChipActive]}
                  onPress={() => setSipYears(yVal)}
                >
                  <Text style={[styles.presetChipText, sipYears === yVal && styles.presetChipTextActive]}>
                    {yVal} Yrs
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>ESTIMATED FUTURE VALUE</Text>
            <Text style={styles.resultHeroVal}>{formatCurrency(sipResult.total)}</Text>

            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Invested Capital:</Text>
                <Text style={styles.breakdownVal}>{formatCurrency(sipResult.invested)}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Wealth Gain (Returns):</Text>
                <Text style={[styles.breakdownVal, { color: '#16a34a' }]}>
                  + {formatCurrency(sipResult.returns)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* TAB CONTENT: FD */}
      {activeTab === 'fd' && (
        <View style={styles.tabContent}>
          <View style={styles.paramSection}>
            <View style={styles.paramRowHeader}>
              <Text style={styles.paramLabel}>Deposit Amount</Text>
              <Text style={styles.paramValue}>{formatCurrency(fdPrincipal)}</Text>
            </View>
            <View style={styles.presetsWrap}>
              {[50000, 100000, 200000, 500000, 1000000].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[styles.presetChip, fdPrincipal === amt && styles.presetChipActive]}
                  onPress={() => setFdPrincipal(amt)}
                >
                  <Text style={[styles.presetChipText, fdPrincipal === amt && styles.presetChipTextActive]}>
                    {formatCurrency(amt)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.paramSection}>
            <View style={styles.paramRowHeader}>
              <Text style={styles.paramLabel}>Interest Rate (% p.a)</Text>
              <Text style={styles.paramValue}>{fdRate}%</Text>
            </View>
            <View style={styles.presetsWrap}>
              {[6.5, 7.0, 7.25, 7.75, 8.0].map((rVal) => (
                <TouchableOpacity
                  key={rVal}
                  style={[styles.presetChip, fdRate === rVal && styles.presetChipActive]}
                  onPress={() => setFdRate(rVal)}
                >
                  <Text style={[styles.presetChipText, fdRate === rVal && styles.presetChipTextActive]}>
                    {rVal}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>MATURITY VALUE (QUARTERLY COMPOUND)</Text>
            <Text style={styles.resultHeroVal}>{formatCurrency(fdResult.maturity)}</Text>
            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Initial Deposit:</Text>
                <Text style={styles.breakdownVal}>{formatCurrency(fdResult.principal)}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Interest Earned:</Text>
                <Text style={[styles.breakdownVal, { color: '#16a34a' }]}>
                  + {formatCurrency(fdResult.interest)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* TAB CONTENT: RD / LUMPSUM */}
      {(activeTab === 'rd' || activeTab === 'lumpsum') && (
        <View style={styles.tabContent}>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>
              {activeTab === 'rd' ? 'RECURRING DEPOSIT MATURITY' : 'LUMPSUM WEALTH GROWTH'}
            </Text>
            <Text style={styles.resultHeroVal}>
              {activeTab === 'rd' ? formatCurrency(rdResult.maturity) : formatCurrency(lumpResult.maturity)}
            </Text>
            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Total Investment:</Text>
                <Text style={styles.breakdownVal}>
                  {activeTab === 'rd' ? formatCurrency(rdResult.invested) : formatCurrency(lumpResult.principal)}
                </Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Returns Generated:</Text>
                <Text style={[styles.breakdownVal, { color: '#16a34a' }]}>
                  + {activeTab === 'rd' ? formatCurrency(rdResult.interest) : formatCurrency(lumpResult.returns)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
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
  calcBadge: {
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
  calcBadgeText: {
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 3,
    gap: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: BrandColors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  tabBtnTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    gap: 14,
  },
  solveForRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  solveForChips: {
    flexDirection: 'row',
    gap: 4,
  },
  solveChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  solveChipActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  solveChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  solveChipTextActive: {
    color: '#ffffff',
  },
  paramSection: {
    gap: 6,
  },
  paramRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paramLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  paramValue: {
    fontSize: 13,
    fontWeight: '900',
    color: BrandColors.primary,
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetChipActive: {
    backgroundColor: '#f0f9ff',
    borderColor: BrandColors.primary,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  presetChipTextActive: {
    color: BrandColors.primary,
  },
  numericInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '800',
    color: BrandColors.primary,
    width: 100,
    textAlign: 'right',
  },
  resultCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 12,
  },
  resultHeader: {
    alignItems: 'center',
    gap: 3,
  },
  resultLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  resultHeroVal: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  resultSubNote: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  splitBarWrapper: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  splitBarPrincipal: {
    backgroundColor: BrandColors.primary,
  },
  splitBarInterest: {
    backgroundColor: '#f59e0b',
  },
  splitLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  breakdownBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  breakdownVal: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: '800',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 2,
  },
  breakdownLabelBold: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: '900',
  },
  breakdownValBold: {
    fontSize: 13,
    color: BrandColors.primary,
    fontWeight: '900',
  },
  applyCalcBtn: {
    backgroundColor: BrandColors.primary,
    borderRadius: 14,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  applyCalcBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
