import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { getLoanBySlug, ALL_LOANS_LIST, LoanDetail } from '@/constants/loansData';
import { LoanModal } from '@/components/LoanModal';
import { Deal4LoansDynamicForm, DynamicLoanCategory } from '@/components/forms/Deal4LoansDynamicForm';

interface LoanDetailScreenProps {
  slugOverride?: string;
}

export default function LoanDetailScreen({ slugOverride }: LoanDetailScreenProps) {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ id?: string; slug?: string }>();
  const activeSlug = slugOverride || searchParams.slug || searchParams.id || 'personal-loan';

  // Retrieve loan data based on slug/id param
  const loan: LoanDetail = useMemo(() => {
    return getLoanBySlug(activeSlug);
  }, [activeSlug]);

  // Quick state for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | undefined>(undefined);

  const scrollRef = React.useRef<any>(null);
  const [formY, setFormY] = useState(0);

  // Map slug to DynamicLoanCategory
  const categoryKey: DynamicLoanCategory = useMemo(() => {
    switch (loan.slug) {
      case 'home-loan':
        return 'home';
      case 'loan-against-property':
        return 'lap';
      case 'car-loan':
        return 'car';
      case 'business-loan':
        return 'business';
      case 'education-loan':
        return 'education';
      case 'government-schemes':
        return 'government';
      case 'mudra-loan':
        return 'mudra';
      case 'pmay':
        return 'pmay';
      default:
        return 'personal';
    }
  }, [loan.slug]);

  // Document active tab
  const [activeDocTab, setActiveDocTab] = useState<'identity' | 'income' | 'address' | 'other'>('identity');

  // Eligibility tab for Home Loan
  const [eligibilityTab, setEligibilityTab] = useState<'salaried' | 'self-employed' | 'nri'>('salaried');

  // FAQ accordion open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // EMI Calculator state for this loan
  const [calcAmount, setCalcAmount] = useState<number>(
    loan.slug === 'home-loan' || loan.slug === 'loan-against-property'
      ? 2500000
      : loan.slug === 'car-loan'
      ? 800000
      : loan.slug === 'education-loan'
      ? 1500000
      : loan.slug === 'business-loan'
      ? 1000000
      : 500000
  );
  const [calcTenureYears, setCalcTenureYears] = useState<number>(
    loan.slug === 'home-loan' ? 20 : loan.slug === 'loan-against-property' ? 15 : loan.slug === 'education-loan' ? 10 : 5
  );

  // Home Loan Balance Transfer (HLBT) Calculator State
  const [hlbtExistingAmount, setHlbtExistingAmount] = useState<number>(4500000);
  const [hlbtCurrentRate, setHlbtCurrentRate] = useState<number>(9.85);
  const [hlbtNewRate] = useState<number>(8.35); // Shree Finance partner rate
  const [hlbtTenureYears, setHlbtTenureYears] = useState<number>(18);

  // Sync default values when loan changes
  useEffect(() => {
    if (loan.slug === 'home-loan' || loan.slug === 'loan-against-property') {
      setCalcAmount(2500000);
      setCalcTenureYears(loan.slug === 'home-loan' ? 20 : 15);
    } else if (loan.slug === 'car-loan') {
      setCalcAmount(800000);
      setCalcTenureYears(5);
    } else if (loan.slug === 'education-loan') {
      setCalcAmount(1500000);
      setCalcTenureYears(10);
    } else if (loan.slug === 'business-loan') {
      setCalcAmount(1000000);
      setCalcTenureYears(5);
    } else {
      setCalcAmount(500000);
      setCalcTenureYears(Math.min(5, loan.maxTenureYears));
    }
  }, [loan.slug, loan.maxTenureYears]);

  // Calculate standard EMI
  const calculatedEmi = useMemo(() => {
    const principal = calcAmount;
    const annualRate = loan.rateValue;
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = calcTenureYears * 12;

    if (monthlyRate === 0 || totalMonths === 0) return 0;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(emi);
  }, [calcAmount, calcTenureYears, loan.rateValue]);

  const totalPayment = calculatedEmi * (calcTenureYears * 12);
  const totalInterest = Math.max(0, totalPayment - calcAmount);

  // Calculate HLBT Savings
  const hlbtCalculations = useMemo(() => {
    const P = hlbtExistingAmount;
    const N = hlbtTenureYears * 12;
    if (N === 0) return { currentEmi: 0, newEmi: 0, monthlySaving: 0, totalSaving: 0 };

    const rCurrent = hlbtCurrentRate / 12 / 100;
    const emiCurrent =
      (P * rCurrent * Math.pow(1 + rCurrent, N)) / (Math.pow(1 + rCurrent, N) - 1);

    const rNew = hlbtNewRate / 12 / 100;
    const emiNew = (P * rNew * Math.pow(1 + rNew, N)) / (Math.pow(1 + rNew, N) - 1);

    const monthlySaving = Math.max(0, Math.round(emiCurrent - emiNew));
    const totalSaving = monthlySaving * N;

    return {
      currentEmi: Math.round(emiCurrent),
      newEmi: Math.round(emiNew),
      monthlySaving,
      totalSaving,
    };
  }, [hlbtExistingAmount, hlbtCurrentRate, hlbtNewRate, hlbtTenureYears]);

  const handleApply = (bankName?: string) => {
    if (bankName) setSelectedBank(bankName);
    if (scrollRef.current && formY > 0) {
      scrollRef.current.scrollTo({ y: formY - 10, animated: true });
    } else {
      setModalVisible(true);
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+918830434945');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: `${loan.title} - Shree Finance`,
        message: `Check out ${loan.title} at Shree Finance. Starting rates from ${loan.startingRate} across 40+ partner banks! https://www.shreefinances.com/loans/${loan.slug}`,
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ─── TOP APP BAR ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/loans' as any);
            }
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {loan.title}
          </Text>
          <Text style={styles.topBarSubtitle}>40+ Banks Network • Multi-Bank Aggregator</Text>
        </View>

        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.topActionBtn} onPress={handleShare} activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={18} color="#475569" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topActionCallBtn} onPress={handleCall} activeOpacity={0.7}>
            <Ionicons name="call" size={16} color={BrandColors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── QUICK LOAN SWITCHER PILLS (All 7 Loans Horizontal Scroll) ─── */}
      <View style={styles.switcherContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.switcherScroll}
        >
          {ALL_LOANS_LIST.map((item) => {
            const isActive = item.slug === loan.slug;
            return (
              <TouchableOpacity
                key={item.slug}
                style={[
                  styles.switcherPill,
                  isActive && [styles.switcherPillActive, { borderColor: item.color }],
                ]}
                onPress={() => {
                  if (!isActive) {
                    router.push(`/loans/${item.slug}` as any);
                  }
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon as any}
                  size={14}
                  color={isActive ? item.color : '#64748b'}
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[
                    styles.switcherPillText,
                    isActive && [styles.switcherPillTextActive, { color: item.color }],
                  ]}
                >
                  {item.title}
                </Text>
                {item.startingRate && (
                  <View style={[styles.pillRateTag, isActive && { backgroundColor: item.bgLight }]}>
                    <Text style={[styles.pillRateTagText, isActive && { color: item.color }]}>
                      {item.startingRate.replace('*', '')}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 1. HERO SECTION (Mirroring https://www.shreefinances.com/ Hero) ─── */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={[styles.heroBadgePill, { backgroundColor: loan.bgLight, borderColor: loan.borderColor }]}>
              <Ionicons name="flash" size={13} color={loan.color} />
              <Text style={[styles.heroBadgeText, { color: loan.color }]}>{loan.badge}</Text>
            </View>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillLabel}>{loan.category}</Text>
            </View>
          </View>

          {/* Heading and Subtitle matching Website */}
          <Text style={styles.heroTagline}>{loan.tagline}</Text>
          <Text style={styles.heroSubtitle}>{loan.subtitle}</Text>

          {/* 3-Column Key Metric Counters (Starting APR, Max Tenure, Max Amount) */}
          <View style={styles.metricsBox}>
            {(loan.statCounters || [
              { label: 'Starting APR', value: loan.startingRate, color: loan.color },
              { label: 'Max Tenure', value: loan.maxTenure },
              { label: 'Max Amount', value: loan.maxAmount },
            ]).map((stat, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <View style={styles.metricDivider} />}
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>{stat.label}</Text>
                  <Text style={[styles.metricVal, stat.color ? { color: stat.color } : null]}>
                    {stat.value}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Disbursal Strip */}
          <View style={styles.disbursalStrip}>
            <Ionicons name="shield-checkmark" size={14} color="#0284c7" />
            <Text style={styles.disbursalText}>
              Approval: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{loan.approvalTime}</Text> • Disbursal: <Text style={{ fontWeight: '700', color: '#0f172a' }}>{loan.disbursalTime}</Text>
            </Text>
          </View>

          {/* Visual Hero Glass Card (Matching Web Visual Card) */}
          {loan.heroVisualCard && (
            <View style={styles.visualHeroCard}>
              <View style={styles.visualHeroHeader}>
                <View style={[styles.visualHeroIconWrap, { backgroundColor: loan.bgLight }]}>
                  <Ionicons name={loan.icon as any} size={20} color={loan.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.visualHeroTitle}>{loan.heroVisualCard.title}</Text>
                  <Text style={styles.visualHeroSub}>{loan.heroVisualCard.subtitle}</Text>
                </View>
                <View style={styles.visualHeroTagPill}>
                  <Text style={styles.visualHeroTagText}>{loan.heroVisualCard.tag}</Text>
                </View>
              </View>

              <View style={styles.visualHeroBullets}>
                {loan.heroVisualCard.bullets.map((bullet, idx) => (
                  <View key={idx} style={styles.visualHeroBulletRow}>
                    <Text style={styles.visualHeroBulletLabel}>{bullet.label}</Text>
                    <Text style={styles.visualHeroBulletVal}>{bullet.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Primary CTA */}
          <TouchableOpacity
            style={[styles.heroCtaBtn, { backgroundColor: loan.color }]}
            onPress={() => handleApply()}
            activeOpacity={0.85}
          >
            <Text style={styles.heroCtaText}>Apply Now</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* ─── 2. FAST TRACK 4 PROCESS STEPS (Mirroring Fast-Track Process on Web) ─── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.headingIconBg, { backgroundColor: '#f0f9ff' }]}>
              <Ionicons name="flash" size={18} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionHeadingTitle}>Fast Track Sanction Flow</Text>
              <Text style={styles.sectionHeadingSub}>Digital end-to-end loan journey</Text>
            </View>
          </View>

          <View style={styles.fastTrackGrid}>
            {[
              { num: '01', title: 'Apply Online', desc: 'Fill simple 2-min digital form', icon: 'document-text' },
              { num: '02', title: 'Instant Decision', desc: '40+ bank underwriting check', icon: 'speedometer' },
              { num: '03', title: 'Sanction Letter', desc: 'Pre-approved rate & term sheet', icon: 'checkmark-circle' },
              { num: '04', title: 'Cash in Bank', desc: 'Direct account credit in 24 hrs', icon: 'wallet' },
            ].map((step, idx) => (
              <View key={idx} style={styles.fastTrackCard}>
                <View style={styles.fastTrackTop}>
                  <View style={styles.fastTrackStepBadge}>
                    <Text style={styles.fastTrackStepNum}>{step.num}</Text>
                  </View>
                  <Ionicons name={step.icon as any} size={18} color={loan.color} />
                </View>
                <Text style={styles.fastTrackTitle}>{step.title}</Text>
                <Text style={styles.fastTrackDesc}>{step.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── 3. DEAL4LOANS DYNAMIC MULTI-STEP APPLICATION FORM ─── */}
        <View
          style={styles.dynamicFormSection}
          onLayout={(e) => setFormY(e.nativeEvent.layout.y)}
        >
          <Deal4LoansDynamicForm
            initialCategory={categoryKey}
            prefilledBank={selectedBank}
            showCategorySwitcher={false}
          />
        </View>

        {/* ─── 4. INTERACTIVE EMI CALCULATOR ─── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.headingIconBg, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="calculator" size={18} color="#10b981" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionHeadingTitle}>{loan.title} EMI Calculator</Text>
              <Text style={styles.sectionHeadingSub}>Starting rate: {loan.startingRate}</Text>
            </View>
          </View>

          {/* EMI Result Display */}
          <View style={styles.emiResultBox}>
            <Text style={styles.emiResultLabel}>Estimated Monthly EMI</Text>
            <Text style={styles.emiResultAmount}>₹{calculatedEmi.toLocaleString('en-IN')}</Text>
            <View style={styles.emiSummaryRow}>
              <View style={styles.emiSummaryCol}>
                <Text style={styles.emiSummaryLbl}>Principal</Text>
                <Text style={styles.emiSummaryVal}>₹{calcAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.emiSummaryDivider} />
              <View style={styles.emiSummaryCol}>
                <Text style={styles.emiSummaryLbl}>Total Interest</Text>
                <Text style={[styles.emiSummaryVal, { color: loan.color }]}>₹{totalInterest.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.emiSummaryDivider} />
              <View style={styles.emiSummaryCol}>
                <Text style={styles.emiSummaryLbl}>Total Payable</Text>
                <Text style={styles.emiSummaryVal}>₹{totalPayment.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          {/* Stepper Controls */}
          <View style={styles.calcControlRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.calcLabel}>Loan Amount</Text>
              <Text style={styles.calcCurrentVal}>₹{calcAmount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.stepperGroup}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setCalcAmount((prev) => Math.max(100000, prev - (loan.maxAmountValue > 5000000 ? 500000 : 100000)))}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={18} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setCalcAmount((prev) => Math.min(loan.maxAmountValue, prev + (loan.maxAmountValue > 5000000 ? 500000 : 100000)))}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.calcControlRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.calcLabel}>Tenure</Text>
              <Text style={styles.calcCurrentVal}>{calcTenureYears} Years</Text>
            </View>
            <View style={styles.stepperGroup}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setCalcTenureYears((prev) => Math.max(1, prev - 1))}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={18} color="#0f172a" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setCalcTenureYears((prev) => Math.min(loan.maxTenureYears, prev + 1))}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ─── 5. SPECIAL TOOL: HOME LOAN BALANCE TRANSFER (HLBT) CALCULATOR (Home Loan only) ─── */}
        {loan.specialCalculators?.hasBalanceTransfer && (
          <View style={styles.cardSection}>
            <View style={styles.sectionHeadingRow}>
              <View style={[styles.headingIconBg, { backgroundColor: '#fdf2f8' }]}>
                <Ionicons name="trending-down" size={18} color="#ec4899" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionHeadingTitle}>Home Loan Balance Transfer (HLBT)</Text>
                <Text style={styles.sectionHeadingSub}>Reduce existing interest rate & unlock top-up cash</Text>
              </View>
            </View>

            <View style={styles.hlbtResultCard}>
              <View style={styles.hlbtSavingsRow}>
                <View>
                  <Text style={styles.hlbtSavingsLbl}>Monthly EMI Reduction</Text>
                  <Text style={styles.hlbtSavingsAmt}>₹{hlbtCalculations.monthlySaving.toLocaleString('en-IN')}/mo</Text>
                </View>
                <View style={styles.hlbtTotalSavedBox}>
                  <Text style={styles.hlbtTotalSavedLbl}>Total Interest Saved</Text>
                  <Text style={styles.hlbtTotalSavedAmt}>₹{(hlbtCalculations.totalSaving / 100000).toFixed(1)} Lakhs</Text>
                </View>
              </View>

              <View style={styles.hlbtComparisonRow}>
                <View style={styles.hlbtComparisonCol}>
                  <Text style={styles.hlbtCompLbl}>Current EMI ({hlbtCurrentRate}%)</Text>
                  <Text style={styles.hlbtCompValOld}>₹{hlbtCalculations.currentEmi.toLocaleString('en-IN')}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color="#94a3b8" />
                <View style={styles.hlbtComparisonCol}>
                  <Text style={styles.hlbtCompLbl}>New EMI ({hlbtNewRate}%)</Text>
                  <Text style={styles.hlbtCompValNew}>₹{hlbtCalculations.newEmi.toLocaleString('en-IN')}</Text>
                </View>
              </View>
            </View>

            {/* Stepper controls for HLBT */}
            <View style={styles.calcControlRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.calcLabel}>Existing Loan Balance</Text>
                <Text style={styles.calcCurrentVal}>₹{hlbtExistingAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.stepperGroup}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setHlbtExistingAmount((prev) => Math.max(500000, prev - 500000))}
                >
                  <Ionicons name="remove" size={18} color="#0f172a" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setHlbtExistingAmount((prev) => Math.min(20000000, prev + 500000))}
                >
                  <Ionicons name="add" size={18} color="#0f172a" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.calcControlRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.calcLabel}>Current Interest Rate</Text>
                <Text style={styles.calcCurrentVal}>{hlbtCurrentRate.toFixed(2)}% p.a.</Text>
              </View>
              <View style={styles.stepperGroup}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setHlbtCurrentRate((prev) => Math.max(8.5, +(prev - 0.25).toFixed(2)))}
                >
                  <Ionicons name="remove" size={18} color="#0f172a" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setHlbtCurrentRate((prev) => Math.min(13.0, +(prev + 0.25).toFixed(2)))}
                >
                  <Ionicons name="add" size={18} color="#0f172a" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ─── 6. SPECIAL TOOL: TAX BENEFIT CALCULATOR (Home Loan only) ─── */}
        {loan.specialCalculators?.hasTaxBenefit && (
          <View style={styles.cardSection}>
            <View style={styles.sectionHeadingRow}>
              <View style={[styles.headingIconBg, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="shield-checkmark" size={18} color="#16a34a" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionHeadingTitle}>Home Loan Tax Benefits</Text>
                <Text style={styles.sectionHeadingSub}>Save up to ₹3.5 Lakhs annually on Income Tax</Text>
              </View>
            </View>

            <View style={styles.taxBenefitCardsRow}>
              <View style={styles.taxCard}>
                <Text style={styles.taxSectionName}>Section 24(b)</Text>
                <Text style={styles.taxSectionBenefit}>Up to ₹2,00,000</Text>
                <Text style={styles.taxSectionDesc}>Deduction on annual interest repayment for self-occupied property</Text>
              </View>
              <View style={styles.taxCard}>
                <Text style={styles.taxSectionName}>Section 80C</Text>
                <Text style={styles.taxSectionBenefit}>Up to ₹1,50,000</Text>
                <Text style={styles.taxSectionDesc}>Deduction on principal repayment + stamp duty and registration</Text>
              </View>
            </View>
          </View>
        )}

        {/* ─── 7. SPECIAL SECTION: FEATURED GOVERNMENT SCHEMES DIRECTORY (Government Schemes only) ─── */}
        {loan.featuredSchemes && loan.featuredSchemes.length > 0 && (
          <View style={styles.cardSection}>
            <View style={styles.sectionHeadingRow}>
              <View style={[styles.headingIconBg, { backgroundColor: '#fff7ed' }]}>
                <Ionicons name="ribbon" size={18} color="#ea580c" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionHeadingTitle}>National Subsidized Schemes</Text>
                <Text style={styles.sectionHeadingSub}>Central government grants, subsidies & CGTMSE guarantees</Text>
              </View>
            </View>

            <View style={styles.schemesGrid}>
              {loan.featuredSchemes.map((scheme, idx) => (
                <View key={idx} style={styles.schemeCard}>
                  <View style={styles.schemeHeaderRow}>
                    <View style={styles.schemeIconWrap}>
                      <Ionicons name={scheme.icon as any} size={20} color="#ea580c" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.schemeTitle}>{scheme.title}</Text>
                      <View style={styles.schemeBadge}>
                        <Text style={styles.schemeBadgeText}>{scheme.badge}</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.schemeDesc}>{scheme.desc}</Text>

                  <View style={styles.schemeMetricsRow}>
                    <View style={styles.schemeMetricCol}>
                      <Text style={styles.schemeMetricLbl}>Max Limit</Text>
                      <Text style={styles.schemeMetricVal}>{scheme.minAmount}</Text>
                    </View>
                    <View style={styles.schemeMetricCol}>
                      <Text style={styles.schemeMetricLbl}>Subsidy / Perk</Text>
                      <Text style={[styles.schemeMetricVal, { color: '#ea580c' }]}>{scheme.subsidy}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.schemeApplyBtn}
                    onPress={() => {
                      if (scheme.actionSlug) {
                        router.push(`/loans/${scheme.actionSlug}` as any);
                      } else {
                        handleApply(scheme.title);
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.schemeApplyText}>Check {scheme.title} Eligibility</Text>
                    <Ionicons name="arrow-forward" size={13} color="#ea580c" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ─── 8. "WHY CHOOSE [LOAN]?" NARRATIVE SECTION (Matching Web ContentSection) ─── */}
        {loan.whyChoose && (
          <View style={styles.cardSection}>
            <View style={styles.sectionHeadingRow}>
              <View style={[styles.headingIconBg, { backgroundColor: loan.bgLight }]}>
                <Ionicons name="sparkles" size={18} color={loan.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionHeadingTitle}>{loan.whyChoose.title}</Text>
                <Text style={styles.sectionHeadingSub}>Digital advantages of borrowing with Shree Finance</Text>
              </View>
            </View>

            <Text style={styles.whyChooseDesc}>{loan.whyChoose.desc}</Text>

            <View style={styles.whyChooseBullets}>
              {loan.whyChoose.bullets.map((bullet, idx) => (
                <View key={idx} style={styles.whyChooseBulletRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" style={{ marginTop: 2 }} />
                  <Text style={styles.whyChooseBulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ─── 9. KEY BENEFITS & FEATURES GRID ─── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.headingIconBg, { backgroundColor: loan.bgLight }]}>
              <Ionicons name="checkmark-done" size={18} color={loan.color} />
            </View>
            <Text style={styles.sectionHeadingTitle}>Key Benefits & Features</Text>
          </View>

          <View style={styles.highlightsGrid}>
            {loan.keyHighlights.map((highlight, idx) => (
              <View key={idx} style={styles.highlightCard}>
                <View style={styles.highlightCheck}>
                  <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                </View>
                <Text style={styles.highlightCardText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── 10. MULTI-BANK COMPARISON CARDS ─── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={styles.headingIconBg}>
              <Ionicons name="swap-horizontal" size={18} color={BrandColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionHeadingTitle}>Compare Top 40+ Bank Offers</Text>
              <Text style={styles.sectionHeadingSub}>Live rates & fees from certified lending partners</Text>
            </View>
          </View>

          <View style={styles.banksList}>
            {loan.bankOffers.map((offer, idx) => (
              <View key={idx} style={styles.bankCard}>
                <View style={styles.bankCardTop}>
                  <View style={[styles.bankLogoBadge, { backgroundColor: offer.color || '#004c8f' }]}>
                    <Text style={styles.bankLogoText}>{offer.code}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bankName}>{offer.bank}</Text>
                    <Text style={styles.bankPerk} numberOfLines={1}>{offer.specialPerk}</Text>
                  </View>
                </View>

                <View style={styles.bankMetricsRow}>
                  <View style={styles.bankMetricCol}>
                    <Text style={styles.bankMetricLbl}>Interest Rate</Text>
                    <Text style={styles.bankMetricVal}>{offer.rate}</Text>
                  </View>
                  <View style={styles.bankMetricCol}>
                    <Text style={styles.bankMetricLbl}>Processing Fee</Text>
                    <Text style={styles.bankMetricVal}>{offer.fee}</Text>
                  </View>
                  <View style={styles.bankMetricCol}>
                    <Text style={styles.bankMetricLbl}>Tenure</Text>
                    <Text style={styles.bankMetricVal}>{offer.tenure}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.bankApplyBtn}
                  onPress={() => handleApply(offer.bank)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bankApplyText}>Apply with {offer.code}</Text>
                  <Ionicons name="arrow-forward" size={13} color={BrandColors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* ─── 11. ELIGIBILITY CRITERIA (With Salaried / Self-Employed / NRI tabs for Home Loan) ─── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.headingIconBg, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="person-circle" size={18} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionHeadingTitle}>Eligibility Criteria</Text>
              <Text style={styles.sectionHeadingSub}>Standard guidelines across partner banks</Text>
            </View>
          </View>

          {/* Special tabs if Home Loan */}
          {loan.slug === 'home-loan' && (
            <View style={styles.eligibilityTabsRow}>
              {(['salaried', 'self-employed', 'nri'] as const).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.eligibilityTabPill, eligibilityTab === tab && styles.eligibilityTabPillActive]}
                  onPress={() => setEligibilityTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.eligibilityTabPillText, eligibilityTab === tab && styles.eligibilityTabPillTextActive]}>
                    {tab === 'salaried' ? 'Salaried' : tab === 'self-employed' ? 'Self-Employed' : 'NRI Borrowers'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.eligibilityList}>
            <View style={styles.eligibilityRow}>
              <View style={styles.eligibilityIcon}>
                <Ionicons name="calendar-outline" size={16} color={BrandColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eligibilityLabel}>Age Limit</Text>
                <Text style={styles.eligibilityValue}>{loan.eligibility.age}</Text>
              </View>
            </View>

            <View style={styles.eligibilityRow}>
              <View style={styles.eligibilityIcon}>
                <Ionicons name="cash-outline" size={16} color={BrandColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eligibilityLabel}>Minimum Income</Text>
                <Text style={styles.eligibilityValue}>{loan.eligibility.minIncome}</Text>
              </View>
            </View>

            <View style={styles.eligibilityRow}>
              <View style={styles.eligibilityIcon}>
                <Ionicons name="speedometer-outline" size={16} color={BrandColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eligibilityLabel}>CIBIL / Credit Score</Text>
                <Text style={styles.eligibilityValue}>{loan.eligibility.cibilScore}</Text>
              </View>
            </View>

            <View style={styles.eligibilityRow}>
              <View style={styles.eligibilityIcon}>
                <Ionicons name="briefcase-outline" size={16} color={BrandColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eligibilityLabel}>Employment Profile</Text>
                <Text style={styles.eligibilityValue}>{loan.eligibility.employmentType}</Text>
              </View>
            </View>

            <View style={styles.eligibilityRow}>
              <View style={styles.eligibilityIcon}>
                <Ionicons name="time-outline" size={16} color={BrandColors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eligibilityLabel}>Vintage / Experience</Text>
                <Text style={styles.eligibilityValue}>{loan.eligibility.experience}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ─── 12. REQUIRED DOCUMENTS TABS ─── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.headingIconBg, { backgroundColor: '#f3e8ff' }]}>
              <Ionicons name="document-text" size={18} color="#9333ea" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionHeadingTitle}>Documents Checklist</Text>
              <Text style={styles.sectionHeadingSub}>Keep these soft copies ready for quick e-KYC</Text>
            </View>
          </View>

          {/* Doc Tabs */}
          <View style={styles.docTabsRow}>
            <TouchableOpacity
              style={[styles.docTab, activeDocTab === 'identity' && styles.docTabActive]}
              onPress={() => setActiveDocTab('identity')}
            >
              <Text style={[styles.docTabText, activeDocTab === 'identity' && styles.docTabTextActive]}>
                Identity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.docTab, activeDocTab === 'income' && styles.docTabActive]}
              onPress={() => setActiveDocTab('income')}
            >
              <Text style={[styles.docTabText, activeDocTab === 'income' && styles.docTabTextActive]}>
                Income
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.docTab, activeDocTab === 'address' && styles.docTabActive]}
              onPress={() => setActiveDocTab('address')}
            >
              <Text style={[styles.docTabText, activeDocTab === 'address' && styles.docTabTextActive]}>
                Address
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.docTab, activeDocTab === 'other' && styles.docTabActive]}
              onPress={() => setActiveDocTab('other')}
            >
              <Text style={[styles.docTabText, activeDocTab === 'other' && styles.docTabTextActive]}>
                {loan.slug === 'education-loan' ? 'Academic' : loan.slug === 'car-loan' ? 'Vehicle' : 'Property / Proof'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Doc List Content */}
          <View style={styles.docListContent}>
            {activeDocTab === 'identity' &&
              loan.documents.identityProof.map((doc, i) => (
                <View key={i} style={styles.docRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}

            {activeDocTab === 'income' &&
              loan.documents.incomeProof.map((doc, i) => (
                <View key={i} style={styles.docRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}

            {activeDocTab === 'address' &&
              loan.documents.addressProof.map((doc, i) => (
                <View key={i} style={styles.docRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}

            {activeDocTab === 'other' &&
              loan.documents.otherDocs.map((doc, i) => (
                <View key={i} style={styles.docRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.docText}>{doc}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* ─── 13. FAQS ACCORDION ─── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeadingRow}>
            <View style={[styles.headingIconBg, { backgroundColor: '#f1f5f9' }]}>
              <Ionicons name="help-circle" size={18} color="#334155" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionHeadingTitle}>Frequently Asked Questions</Text>
              <Text style={styles.sectionHeadingSub}>Instant answers to common borrower questions</Text>
            </View>
          </View>

          <View style={styles.faqList}>
            {loan.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={styles.faqItem}
                  onPress={() => setOpenFaqIndex(isOpen ? null : idx)}
                  activeOpacity={0.8}
                >
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                    <Ionicons
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color="#64748b"
                    />
                  </View>
                  {isOpen && <Text style={styles.faqAnswer}>{faq.a}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── 14. PUNE CORPORATE HQ DESK ─── */}
        <View style={styles.hqCard}>
          <View style={styles.hqHeaderRow}>
            <View style={styles.hqIconBadge}>
              <Ionicons name="business" size={20} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hqTitle}>Pune Corporate Underwriting Desk</Text>
              <Text style={styles.hqSub}>Shree Finance Advisory Services Pvt. Ltd.</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.hqCallBtn} onPress={handleCall} activeOpacity={0.85}>
            <Ionicons name="call" size={15} color="#ffffff" />
            <Text style={styles.hqCallText}>Call Senior Desk: +91 88304 34945</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ─── STICKY BOTTOM BAR ─── */}
      <View style={styles.stickyBottomBar}>
        <View style={styles.stickyLeftCol}>
          <Text style={styles.stickyRateLbl}>Starting ROI</Text>
          <Text style={[styles.stickyRateVal, { color: loan.color }]}>{loan.startingRate}</Text>
        </View>

        <TouchableOpacity
          style={[styles.stickyApplyBtn, { backgroundColor: loan.color }]}
          onPress={() => handleApply()}
          activeOpacity={0.85}
        >
          <Text style={styles.stickyApplyBtnText}>Apply Now</Text>
          <Ionicons name="flash" size={14} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* ─── UNIFIED MODAL ─── */}
      <LoanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        defaultLoanType={loan.title}
        prefilledBank={selectedBank}
        prefilledAmount={calcAmount}
        prefilledTenure={calcTenureYears}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topBarCenter: {
    flex: 1,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  topBarSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  topActionCallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switcherContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 8,
  },
  switcherScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  switcherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  switcherPillActive: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
  },
  switcherPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  switcherPillTextActive: {
    fontWeight: '800',
  },
  pillRateTag: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  pillRateTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 90,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  categoryPillLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  heroTagline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 16,
  },
  metricsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  disbursalStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  disbursalText: {
    fontSize: 11,
    color: '#475569',
  },
  visualHeroCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginBottom: 16,
  },
  visualHeroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  visualHeroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualHeroTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  visualHeroSub: {
    fontSize: 10,
    color: '#64748b',
  },
  visualHeroTagPill: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  visualHeroTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284c7',
  },
  visualHeroBullets: {
    gap: 6,
  },
  visualHeroBulletRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visualHeroBulletLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  visualHeroBulletVal: {
    fontSize: 11,
    color: '#0f172a',
    fontWeight: '700',
  },
  heroCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  heroCtaText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardSection: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  headingIconBg: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionHeadingSub: {
    fontSize: 11,
    color: '#64748b',
  },
  fastTrackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fastTrackCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fastTrackTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fastTrackStepBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fastTrackStepNum: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284c7',
  },
  fastTrackTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  fastTrackDesc: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
  },
  dynamicFormSection: {
    marginBottom: 16,
  },
  emiResultBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  emiResultLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emiResultAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0284c7',
    marginVertical: 4,
  },
  emiSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  emiSummaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  emiSummaryLbl: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emiSummaryVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  emiSummaryDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
  },
  calcControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  calcLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  calcCurrentVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  stepperGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  hlbtResultCard: {
    backgroundColor: '#fdf2f8',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fbcfe8',
    marginBottom: 16,
  },
  hlbtSavingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
  },
  hlbtSavingsLbl: {
    fontSize: 10,
    color: '#9d174d',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  hlbtSavingsAmt: {
    fontSize: 20,
    fontWeight: '900',
    color: '#be185d',
  },
  hlbtTotalSavedBox: {
    alignItems: 'flex-end',
  },
  hlbtTotalSavedLbl: {
    fontSize: 10,
    color: '#9d174d',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  hlbtTotalSavedAmt: {
    fontSize: 18,
    fontWeight: '900',
    color: '#be185d',
  },
  hlbtComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hlbtComparisonCol: {
    flex: 1,
  },
  hlbtCompLbl: {
    fontSize: 10,
    color: '#64748b',
  },
  hlbtCompValOld: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textDecorationLine: 'line-through',
  },
  hlbtCompValNew: {
    fontSize: 14,
    fontWeight: '900',
    color: '#10b981',
  },
  taxBenefitCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  taxCard: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  taxSectionName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
  },
  taxSectionBenefit: {
    fontSize: 15,
    fontWeight: '900',
    color: '#15803d',
    marginVertical: 4,
  },
  taxSectionDesc: {
    fontSize: 10,
    color: '#166534',
    lineHeight: 14,
  },
  schemesGrid: {
    gap: 12,
  },
  schemeCard: {
    backgroundColor: '#fff7ed',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  schemeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  schemeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schemeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  schemeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffedd5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  schemeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ea580c',
  },
  schemeDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 10,
  },
  schemeMetricsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  schemeMetricCol: {
    flex: 1,
  },
  schemeMetricLbl: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  schemeMetricVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  schemeApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  schemeApplyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
  },
  whyChooseDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  whyChooseBullets: {
    gap: 8,
  },
  whyChooseBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  whyChooseBulletText: {
    flex: 1,
    fontSize: 12,
    color: '#0f172a',
    lineHeight: 17,
    fontWeight: '500',
  },
  highlightsGrid: {
    gap: 8,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  highlightCheck: {
    width: 24,
    alignItems: 'center',
  },
  highlightCardText: {
    flex: 1,
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
    lineHeight: 17,
  },
  banksList: {
    gap: 10,
  },
  bankCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bankCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  bankLogoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bankLogoText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 11,
  },
  bankName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  bankPerk: {
    fontSize: 10,
    color: '#64748b',
  },
  bankMetricsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  bankMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  bankMetricLbl: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  bankMetricVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 1,
  },
  bankApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  bankApplyText: {
    fontSize: 11,
    fontWeight: '800',
    color: BrandColors.primary,
  },
  eligibilityTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  eligibilityTabPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  eligibilityTabPillActive: {
    backgroundColor: '#0284c7',
  },
  eligibilityTabPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  eligibilityTabPillTextActive: {
    color: '#ffffff',
  },
  eligibilityList: {
    gap: 10,
  },
  eligibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  eligibilityIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eligibilityLabel: {
    fontSize: 10,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  eligibilityValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '700',
  },
  docTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  docTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 10,
  },
  docTabActive: {
    backgroundColor: '#ffffff',
  },
  docTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  docTabTextActive: {
    color: '#0f172a',
    fontWeight: '800',
  },
  docListContent: {
    gap: 8,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
  },
  docText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    paddingRight: 8,
  },
  faqAnswer: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  hqCard: {
    backgroundColor: '#0b1329',
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
  },
  hqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  hqIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hqTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  hqSub: {
    fontSize: 10,
    color: '#94a3b8',
  },
  hqCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0284c7',
    paddingVertical: 10,
    borderRadius: 12,
  },
  hqCallText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  stickyLeftCol: {
    flex: 1,
  },
  stickyRateLbl: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  stickyRateVal: {
    fontSize: 17,
    fontWeight: '900',
  },
  stickyApplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  stickyApplyBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
