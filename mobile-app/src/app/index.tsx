import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { LoanModal } from '@/components/LoanModal';

// Homepage Sections exactly mirroring https://www.shreefinances.com/
import { HomeEligibilitySection } from '@/components/home/HomeEligibilitySection';
import { UniversalCalculatorSection } from '@/components/home/UniversalCalculatorSection';
import { Deal4LoansHubSection } from '@/components/home/Deal4LoansHubSection';
import { RateComparisonSection } from '@/components/home/RateComparisonSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { PartnerLogosSection } from '@/components/home/PartnerLogosSection';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  // Application & CIBIL Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState('Personal Loan');
  const [selectedBank, setSelectedBank] = useState<string | undefined>(undefined);
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>(undefined);
  const [selectedTenure, setSelectedTenure] = useState<number | undefined>(undefined);
  const [isCibil, setIsCibil] = useState(false);

  // Hero Carousel State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const openLoanModal = (type = 'Personal Loan', bank?: string, amount?: number, tenure?: number) => {
    setSelectedLoanType(type);
    setSelectedBank(bank);
    setSelectedAmount(amount);
    setSelectedTenure(tenure);
    setIsCibil(false);
    setModalVisible(true);
  };

  const openCibilModal = () => {
    setIsCibil(true);
    setSelectedBank(undefined);
    setModalVisible(true);
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Check your loan eligibility, compare live 40+ bank rates & get free CIBIL score with Shree Finance! Call +91 88304 34945 or visit https://www.shreefinances.com/',
      });
    } catch {}
  };

  // Hero Loan Carousel Slides (matching LOAN_SLIDER_ITEMS on shreefinances.com)
  const heroSlides = [
    {
      id: 'home-loan',
      category: 'Home Loan',
      rate: '8.35% p.a.',
      title: 'Dream Home Financing',
      desc: 'Zero processing fee deals starting 8.35% p.a. with 40+ Partner Banks including SBI, HDFC & ICICI',
      amountText: 'Up to ₹10 Crore',
      tenure: '30 Years',
      icon: 'home',
      color: '#0284c7',
      bgLight: '#e0f2fe',
      type: 'Home Loan',
    },
    {
      id: 'personal-loan',
      category: 'Personal Loan',
      rate: '10.25% p.a.',
      title: 'Instant Cash Loan In 24 Hours',
      desc: '100% digital KYC & immediate account disbursal up to ₹50 Lakhs with nil foreclosure charges',
      amountText: 'Up to ₹50 Lakhs',
      tenure: '5 Years',
      icon: 'cash',
      color: '#10b981',
      bgLight: '#ecfdf5',
      type: 'Personal Loan',
    },
    {
      id: 'business-loan',
      category: 'Business Loan',
      rate: '13.99% p.a.',
      title: 'Scale Your Business Growth',
      desc: 'Collateral-free working capital & machinery term loans up to ₹75 Lakhs for MSMEs & traders',
      amountText: 'Up to ₹75 Lakhs',
      tenure: '5 Years',
      icon: 'briefcase',
      color: '#06b6d4',
      bgLight: '#ecfeff',
      type: 'Business Loan',
    },
    {
      id: 'partner-program',
      category: 'Partner Program',
      rate: 'Up to 2.5% Payout',
      title: 'Join ShreeFinance Partner Network',
      desc: 'Refer loan files across 40+ banks & earn highest market commissions with 24-hr payout settlements',
      amountText: 'Direct Bank Settlement',
      tenure: 'DSA Portal',
      icon: 'people',
      color: '#ec4899',
      bgLight: '#fdf2f8',
      type: 'Partner Program',
      isPartnerRoute: true,
    },
  ];

  // 7 Featured Loan Product Cards (matching all 7 loans on shreefinances.com)
  const featuredProducts = [
    {
      id: 'personal-prod',
      slug: 'personal-loan',
      title: 'Personal Loan',
      badge: '10.25% p.a.',
      desc: 'Instant disbursal up to ₹50 Lakhs in 5 mins',
      icon: 'cash-outline',
      color: '#10b981',
      type: 'Personal Loan',
    },
    {
      id: 'home-prod',
      slug: 'home-loan',
      title: 'Home Loan',
      badge: '8.35% p.a.',
      desc: 'Zero processing fee deals from 40+ banks & PMAY',
      icon: 'home-outline',
      color: '#0284c7',
      type: 'Home Loan',
    },
    {
      id: 'lap-prod',
      slug: 'loan-against-property',
      title: 'Loan Against Property',
      badge: '9.25% p.a.',
      desc: 'High-value capital with low monthly EMI',
      icon: 'business-outline',
      color: '#8b5cf6',
      type: 'Loan vs Property',
    },
    {
      id: 'car-prod',
      slug: 'car-loan',
      title: 'Car Loan',
      badge: '8.75% p.a.',
      desc: 'Drive away with 100% on-road funding',
      icon: 'car-sport-outline',
      color: '#f59e0b',
      type: 'Car Loan',
    },
    {
      id: 'business-prod',
      slug: 'business-loan',
      title: 'Business Loan',
      badge: '13.99% p.a.',
      desc: 'Collateral-free MSME capital up to ₹75L',
      icon: 'briefcase-outline',
      color: '#06b6d4',
      type: 'Business Loan',
    },
    {
      id: 'education-prod',
      slug: 'education-loan',
      title: 'Education Loan',
      badge: '9.50% p.a.',
      desc: 'Study in India & abroad with nil margin',
      icon: 'school-outline',
      color: '#6366f1',
      type: 'Education Loan',
    },
    {
      id: 'government-prod',
      slug: 'government-schemes',
      title: 'Govt Schemes',
      badge: 'Govt Subsidy',
      desc: 'PMAY, Mudra & PMEGP national schemes',
      icon: 'ribbon-outline',
      color: '#ea580c',
      type: 'Government Schemes',
    },
    {
      id: 'mudra-prod',
      slug: 'mudra-loan',
      title: 'Mudra Loan',
      badge: 'Zero Collateral',
      desc: 'Govt MSME loan up to ₹20L in 3 tiers',
      icon: 'business-outline',
      color: '#0284c7',
      type: 'Mudra Loan',
    },
  ];

  const handleOpenLoanDetail = (slug: string) => {
    if (slug === 'personal-loan') {
      router.push('/loans/personal-loan' as any);
    } else {
      router.push({
        pathname: '/loans/[id]',
        params: { id: slug, slug },
      } as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ─── TOP APP HEADER (Matching shreefinances.com Header) ─── */}
      <AppHeader
        selectedCity="Pune, MH"
        onOpenApply={() => openLoanModal('Personal Loan')}
        onOpenCibil={openCibilModal}
        onSelectLoan={(type) => openLoanModal(type)}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── 1. HERO SECTION (Mirroring https://www.shreefinances.com/ HeroSection) ─── */}
        <View style={styles.heroWrapper}>
          {/* Ambient Glows */}
          <View style={styles.heroGlowRight} />
          <View style={styles.heroGlowLeft} />

          {/* Badge Row */}
          <View style={styles.heroBadgeRow}>
            <View style={styles.sparkleBadge}>
              <Ionicons name="sparkles" size={11} color="#0284c7" />
              <Text style={styles.sparkleBadgeText}>SHREE FINANCE DIGITAL HUB 2026</Text>
            </View>
            <View style={styles.partnerCountBadge}>
              <Ionicons name="shield-checkmark" size={11} color="#10b981" />
              <Text style={styles.partnerCountText}>40+ Partner Banks</Text>
            </View>
          </View>

          {/* Hero H1 Headline */}
          <Text style={styles.heroH1}>
            Smart Digital Loans{'\n'}
            <Text style={styles.heroH1Highlight}>40+ Partner Banks.</Text>
          </Text>

          {/* Hero Subtitle */}
          <Text style={styles.heroSubtitle}>
            Compare live interest rates, check instant loan sanction eligibility, and get paperless disbursal from India&apos;s premier banking partners.
          </Text>

          {/* 2 Feature Badges */}
          <View style={styles.featureBadgesRow}>
            <View style={styles.featureBadgeCard}>
              <View style={styles.featureBadgeIcon}>
                <Ionicons name="flash" size={15} color="#0284c7" />
              </View>
              <View>
                <Text style={styles.featureBadgeTitle}>30-Min Approval</Text>
                <Text style={styles.featureBadgeSub}>100% Digital KYC</Text>
              </View>
            </View>

            <View style={styles.featureBadgeCard}>
              <View style={styles.featureBadgeIcon}>
                <Ionicons name="trending-down" size={15} color="#0284c7" />
              </View>
              <View>
                <Text style={styles.featureBadgeTitle}>Lowest Rates</Text>
                <Text style={styles.featureBadgeSub}>Starting 8.35% p.a.</Text>
              </View>
            </View>
          </View>

          {/* 3 Action Buttons */}
          <View style={styles.actionButtonsCol}>
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() => openLoanModal('Personal Loan')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionText}>Get Instant Loan Sanction</Text>
              <Ionicons name="arrow-forward" size={14} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.secondaryActionsRow}>
              <TouchableOpacity
                style={styles.cibilActionBtn}
                onPress={openCibilModal}
                activeOpacity={0.85}
              >
                <Ionicons name="flash" size={13} color="#0284c7" />
                <Text style={styles.cibilActionText}>Free CIBIL Check</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.partnerActionBtn}
                onPress={() => router.push('/partner')}
                activeOpacity={0.85}
              >
                <Ionicons name="people" size={13} color="#ffffff" />
                <Text style={styles.partnerActionText}>Become a Partner</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Hero Loan Carousel (Matching HeroLoanCarousel on shreefinances.com) */}
          <View style={styles.carouselSection}>
            <View style={styles.carouselHeaderRow}>
              <Text style={styles.carouselHeaderLabel}>FEATURED LENDING FACILITIES</Text>
              <View style={styles.carouselDotsRow}>
                {heroSlides.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.carouselDot,
                      activeSlideIndex === i && styles.carouselDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>

            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 56));
                setActiveSlideIndex(Math.max(0, Math.min(heroSlides.length - 1, idx)));
              }}
              contentContainerStyle={styles.carouselScrollContent}
            >
              {heroSlides.map((slide) => (
                <View
                  key={slide.id}
                  style={styles.heroSlideCard}
                >
                  <View style={styles.slideTopRow}>
                    <View style={[styles.slideIconCircle, { backgroundColor: slide.bgLight }]}>
                      <Ionicons name={slide.icon as any} size={20} color={slide.color} />
                    </View>
                    <View style={styles.slideRatePill}>
                      <Text style={styles.slideRateText}>{slide.rate}</Text>
                    </View>
                  </View>

                  <Text style={styles.slideCategory}>{slide.category}</Text>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideDesc} numberOfLines={2}>{slide.desc}</Text>

                  <View style={styles.slideMetricsBox}>
                    <View style={styles.slideMetricCol}>
                      <Text style={styles.slideMetricLabel}>Max Limit</Text>
                      <Text style={styles.slideMetricValue}>{slide.amountText}</Text>
                    </View>
                    <View style={styles.slideMetricDivider} />
                    <View style={styles.slideMetricCol}>
                      <Text style={styles.slideMetricLabel}>Tenure</Text>
                      <Text style={[styles.slideMetricValue, { color: slide.color }]}>{slide.tenure}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.slideCtaBtn, { backgroundColor: slide.color }]}
                    onPress={() => {
                      if (slide.isPartnerRoute) {
                        router.push('/partner');
                      } else {
                        router.push(`/loans/${slide.id}` as any);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.slideCtaText}>Apply Now</Text>
                    <Ionicons name="chevron-forward" size={14} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Section Header with View All 9 Link */}
          <View style={styles.featuredProductsHeaderRow}>
            <View>
              <Text style={styles.featuredProductsSectionTitle}>Popular Loan Categories</Text>
              <Text style={styles.featuredProductsSectionSub}>Compare 40+ banks & live rates</Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllLoansBtn}
              onPress={() => router.push('/loans' as any)}
              activeOpacity={0.75}
            >
              <Text style={styles.viewAllLoansText}>View All 9</Text>
              <Ionicons name="arrow-forward" size={13} color={BrandColors.primary} />
            </TouchableOpacity>
          </View>

          {/* Loan Product Cards Grid - Arranged 2 cards per row */}
          <View style={styles.featuredProductsGrid}>
            {featuredProducts.map((prod) => (
              <TouchableOpacity
                key={prod.id}
                style={styles.featuredProductCard}
                onPress={() => handleOpenLoanDetail(prod.slug)}
                activeOpacity={0.8}
              >
                <View>
                  <View style={styles.featuredProductTop}>
                    <View style={[styles.featuredProductIconWrap, { backgroundColor: prod.color + '15', borderColor: prod.color + '30' }]}>
                      <Ionicons name={prod.icon as any} size={18} color={prod.color} />
                    </View>
                    <View style={styles.featuredProductBadge}>
                      <Text style={styles.featuredProductBadgeText} numberOfLines={1} ellipsizeMode="tail">
                        {prod.badge}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.featuredProductTitle} numberOfLines={1}>
                    {prod.title}
                  </Text>
                  <Text style={styles.featuredProductDesc} numberOfLines={2}>
                    {prod.desc}
                  </Text>
                </View>

                <View style={styles.featuredProductLinkRow}>
                  <Text style={styles.featuredProductLinkText}>Details & Rates</Text>
                  <Ionicons name="chevron-forward" size={12} color={BrandColors.primary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── 2. INSTANT ELIGIBILITY FORM (HomeEligibilitySection) ─── */}
        <View style={styles.sectionSpacer}>
          <HomeEligibilitySection
            onSuccess={(refNo) => {
              console.log('Eligibility submitted successfully:', refNo);
            }}
          />
        </View>

        {/* ─── 3. UNIVERSAL FINANCIAL CALCULATOR (UniversalCalculatorSection) ─── */}
        <View style={styles.sectionSpacer}>
          <UniversalCalculatorSection
            onApplyForLoan={(amt, tenure, type) => {
              openLoanModal(type, undefined, amt, tenure);
            }}
          />
        </View>

        {/* ─── 4. DEAL4LOANS FINANCIAL RESOURCE HUB (Deal4LoansHubSection) ─── */}
        <View style={styles.sectionSpacer}>
          <Deal4LoansHubSection
            onSelectProduct={(type) => openLoanModal(type)}
          />
        </View>

        {/* ─── 5. MULTI-BANK RATE COMPARISON MATRIX (RateComparisonSection) ─── */}
        <View style={styles.sectionSpacer}>
          <RateComparisonSection
            onApplyForBank={(bankName, loanType) => {
              openLoanModal(loanType, bankName);
            }}
          />
        </View>

        {/* ─── 6. WHY CHOOSE US & VERIFIED REVIEWS (WhyChooseUsSection) ─── */}
        <View style={styles.sectionSpacer}>
          <WhyChooseUsSection
            onConsultAdvisor={() => openLoanModal('Personal Loan Advisor Consultation')}
          />
        </View>

        {/* ─── 7. OFFICIAL 40+ PARTNER BANKS STRIP (PartnerLogosSection) ─── */}
        <PartnerLogosSection />

        {/* ─── 8. PUNE CORPORATE HEADQUARTERS & DESK ─── */}
        <View style={styles.hqCard}>
          <View style={styles.hqHeaderRow}>
            <View style={styles.hqIconBadge}>
              <Ionicons name="business" size={20} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hqTitle}>Pune Corporate Headquarters</Text>
              <Text style={styles.hqSub}>Shree Finance Advisory Services Pvt. Ltd.</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.hqActionBtn}
            onPress={() => Linking.openURL('tel:+918830434945')}
            activeOpacity={0.85}
          >
            <View style={styles.hqActionIconBg}>
              <Ionicons name="call" size={15} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hqActionLbl}>Senior Underwriter Helpline</Text>
              <Text style={styles.hqActionVal}>+91 88304 34945</Text>
            </View>
            <Text style={styles.callBadge}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.hqActionBtn}
            onPress={() => Linking.openURL('mailto:shreefinancec@gmail.com')}
            activeOpacity={0.85}
          >
            <View style={styles.hqActionIconBg}>
              <Ionicons name="mail" size={15} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hqActionLbl}>Official Inquiries Desk</Text>
              <Text style={styles.hqActionVal}>shreefinancec@gmail.com</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.addressBox}>
            <Ionicons name="location" size={15} color="#64748b" />
            <Text style={styles.addressText}>
              Office No. D/201, Siddhivinayak Angan Society, Near Navale Bridge, Narhe, Pune - 411 041
            </Text>
          </View>

          <TouchableOpacity style={styles.shareAppBtn} onPress={handleShareApp} activeOpacity={0.85}>
            <Ionicons name="share-social" size={15} color="#0284c7" />
            <Text style={styles.shareAppText}>Share Shree Finance App with Friends</Text>
          </TouchableOpacity>
        </View>

        {/* ─── 9. WEBSITE FOOTER NOTICE ─── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Shree Finance. All Rights Reserved. India&apos;s Premier Multi-Bank Lending Marketplace.
          </Text>
        </View>
      </ScrollView>

      {/* ─── REUSABLE APPLICATION & CIBIL MODAL ─── */}
      <LoanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        defaultLoanType={selectedLoanType}
        prefilledBank={selectedBank}
        prefilledAmount={selectedAmount}
        prefilledTenure={selectedTenure}
        isCibilMode={isCibil}
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
    paddingBottom: 110,
  },
  sectionSpacer: {
    marginTop: 8,
  },

  // 1. Hero Section (Matching shreefinances.com)
  heroWrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
    position: 'relative',
    overflow: 'hidden',
  },
  heroGlowRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(2, 132, 199, 0.08)',
  },
  heroGlowLeft: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(56, 189, 248, 0.06)',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0f9ff',
    borderColor: 'rgba(2, 132, 199, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sparkleBadgeText: {
    color: '#0284c7',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  partnerCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  partnerCountText: {
    color: '#065f46',
    fontSize: 10,
    fontWeight: '800',
  },
  heroH1: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  heroH1Highlight: {
    color: '#0284c7',
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginTop: 8,
    lineHeight: 20,
    fontWeight: '500',
  },

  // 2 Feature Badges
  featureBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    marginBottom: 14,
  },
  featureBadgeCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  featureBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBadgeTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0f172a',
  },
  featureBadgeSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 1,
  },

  // 3 Action Buttons
  actionButtonsCol: {
    gap: 8,
    marginBottom: 18,
  },
  primaryActionBtn: {
    backgroundColor: '#0b1329',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  primaryActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cibilActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cibilActionText: {
    color: '#0284c7',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  partnerActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: BrandColors.primary,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 1,
  },
  partnerActionText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

  // Hero Loan Carousel (Matching HeroLoanCarousel)
  carouselSection: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 14,
  },
  carouselHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  carouselHeaderLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 0.6,
  },
  carouselDotsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  carouselDotActive: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: BrandColors.primary,
  },
  carouselScrollContent: {
    gap: 12,
  },
  heroSlideCard: {
    width: SCREEN_WIDTH - 56,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  slideTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slideIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideRatePill: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  slideRateText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0284c7',
  },
  slideCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  slideDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 16,
  },
  slideMetricsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  slideMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  slideMetricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  slideMetricValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  slideMetricDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#e2e8f0',
  },
  slideCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  slideCtaText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },

  // 4 Featured Products Grid
  featuredProductsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  featuredProductsSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  featuredProductsSectionSub: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 1,
  },
  viewAllLoansBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  viewAllLoansText: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  featuredProductsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  featuredProductCard: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 148,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    marginBottom: 12,
  },
  featuredProductTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featuredProductIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredProductBadge: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    maxWidth: '58%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredProductBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803d',
  },
  featuredProductTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  featuredProductDesc: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 14,
    minHeight: 28,
  },
  featuredProductLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  featuredProductLinkText: {
    fontSize: 10,
    fontWeight: '800',
    color: BrandColors.primary,
  },

  // HQ Card
  hqCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  hqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hqIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  hqTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  hqSub: {
    fontSize: 10,
    color: '#64748b',
  },
  hqActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  hqActionIconBg: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hqActionLbl: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
  },
  hqActionVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  callBadge: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addressBox: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
  },
  addressText: {
    fontSize: 10,
    color: '#64748b',
    flex: 1,
    lineHeight: 14,
  },
  shareAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  shareAppText: {
    fontSize: 11,
    fontWeight: '800',
    color: BrandColors.primary,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 14,
  },
});
