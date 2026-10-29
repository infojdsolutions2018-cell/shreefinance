import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { LoanModal } from '@/components/LoanModal';

interface ServiceItem {
  id: string;
  category: 'loans' | 'cards' | 'insurance' | 'investments' | 'tools';
  title: string;
  tagline: string;
  rate: string;
  features: string[];
  icon: string;
  badge?: string;
  route?: string;
  loanType?: string;
}

export default function ServicesScreen() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState('Personal Loan');
  const [isCibil, setIsCibil] = useState(false);

  const servicesList: ServiceItem[] = [
    // LOANS
    {
      id: 'personal-loan',
      category: 'loans',
      title: 'Personal Loan',
      tagline: 'Instant funds with nil collateral in 24 hours',
      rate: '10.25% p.a.',
      badge: 'Popular',
      features: ['Up to ₹50 Lakhs', 'Tenure up to 5 Years', 'Instant Digital KYC'],
      icon: 'cash',
      route: '/loans/personal-loan',
      loanType: 'Personal Loan',
    },
    {
      id: 'home-loan',
      category: 'loans',
      title: 'Home Loan',
      tagline: 'Dream home financing with 40+ banks & PMAY subsidy',
      rate: '8.35% p.a.',
      badge: 'Lowest Rate',
      features: ['Up to ₹10 Crore', 'Tenure up to 30 Years', 'Zero Foreclosure fee'],
      icon: 'home',
      route: '/loans/home-loan',
      loanType: 'Home Loan',
    },
    {
      id: 'business-loan',
      category: 'loans',
      title: 'Business Loan',
      tagline: 'Unsecured working capital & machinery financing for MSMEs',
      rate: '13.99% p.a.',
      badge: 'Zero Collateral',
      features: ['Up to ₹75 Lakhs', 'Quick 48h Disbursal', 'Flexible Repayment'],
      icon: 'business',
      route: '/loans/business-loan',
      loanType: 'Business Loan',
    },
    {
      id: 'lap',
      category: 'loans',
      title: 'Loan Against Property',
      tagline: 'Unlock property equity for business expansion or personal goals',
      rate: '9.25% p.a.',
      badge: 'High Value',
      features: ['Up to ₹15 Crore', 'Commercial & Residential', 'Low Monthly EMI'],
      icon: 'business-outline',
      route: '/loans/loan-against-property',
      loanType: 'Loan Against Property',
    },
    {
      id: 'car-loan',
      category: 'loans',
      title: 'Car Loan',
      tagline: '100% on-road funding for new & pre-owned cars',
      rate: '8.75% p.a.',
      badge: 'Fast Approval',
      features: ['Up to 100% Funding', 'Tenure up to 7 Years', 'Minimal Paperwork'],
      icon: 'car',
      route: '/loans/car-loan',
      loanType: 'Car Loan',
    },
    {
      id: 'education-loan',
      category: 'loans',
      title: 'Education Loan',
      tagline: 'Fund university admissions in India & top global destinations',
      rate: '9.50% p.a.',
      badge: 'Study Abroad',
      features: ['100% Tuition & Living', 'Moratorium Period', 'Income Tax Benefit 80E'],
      icon: 'school',
      route: '/loans/education-loan',
      loanType: 'Education Loan',
    },
    {
      id: 'mudra-loan',
      category: 'loans',
      title: 'Mudra Loan (PMMY)',
      tagline: 'Government subsidized micro-credit for small enterprises',
      rate: 'Govt Subsidized',
      badge: 'PMMY',
      features: ['Shishu up to ₹50k', 'Kishore up to ₹5L', 'Tarun up to ₹20L'],
      icon: 'shield-checkmark',
      route: '/loans/mudra-loan',
      loanType: 'Mudra Loan',
    },
    {
      id: 'pmay',
      category: 'loans',
      title: 'PMAY Housing Subsidy 2.0',
      tagline: 'Central Govt interest subsidy for EWS, LIG & MIG homebuyers',
      rate: 'Subsidy ₹2.67 Lakhs',
      badge: 'Govt Scheme',
      features: ['Direct DBT Subsidy', 'First-time Homebuyers', 'Women Ownership Benefit'],
      icon: 'home-outline',
      route: '/loans/pmay',
      loanType: 'PMAY Housing Scheme',
    },
    {
      id: 'govt-schemes',
      category: 'loans',
      title: 'Government Loan Schemes',
      tagline: 'PMEGP, Stand-Up India & CGTMSE credit guarantee programs',
      rate: 'Up to 35% Subsidy',
      badge: 'Subsidies',
      features: ['PMEGP Grants', 'CGTMSE Coverage', 'SC/ST & Women Support'],
      icon: 'ribbon',
      route: '/loans/government-schemes',
      loanType: 'Government Schemes',
    },

    // CARDS
    {
      id: 'credit-card',
      category: 'cards',
      title: 'Credit Cards',
      tagline: 'Premium cards with cashback, travel perks & lounge access',
      rate: 'Lifetime Free Offers',
      badge: 'Rewards',
      features: ['Complimentary Lounge', '5% Accelerated Cashback', 'Zero Joining Fee'],
      icon: 'card',
      loanType: 'Credit Card',
    },
    {
      id: 'business-card',
      category: 'cards',
      title: 'Corporate & Business Cards',
      tagline: 'Manage employee & company expenses with high revolving credit',
      rate: 'Custom Limits',
      badge: 'Corporate',
      features: ['Automated GST Invoicing', 'Extended 50-day Credit', 'Vendor Payments'],
      icon: 'briefcase',
      loanType: 'Business Card',
    },

    // INSURANCE
    {
      id: 'health-insurance',
      category: 'insurance',
      title: 'Health Insurance',
      tagline: 'Comprehensive medical cover with cashless network hospitals',
      rate: 'From ₹15/day',
      badge: 'Cashless',
      features: ['10,000+ Network Hospitals', 'No Co-Payment', 'Tax Benefit u/s 80D'],
      icon: 'medkit',
      loanType: 'Health Insurance',
    },
    {
      id: 'life-insurance',
      category: 'insurance',
      title: 'Life & Term Insurance',
      tagline: 'Secure your family financial independence with ₹1 Crore cover',
      rate: 'From ₹490/mo',
      badge: '1 Cr Cover',
      features: ['Critical Illness Cover', 'Accidental Rider', '100% Claim Settlement Support'],
      icon: 'shield-half',
      loanType: 'Life Insurance',
    },
    {
      id: 'vehicle-insurance',
      category: 'insurance',
      title: 'Vehicle Insurance',
      tagline: 'Instant car & two-wheeler policy renewal with zero depreciation',
      rate: 'Up to 80% Off',
      badge: 'Instant Policy',
      features: ['Zero Depreciation', '24/7 Roadside Assistance', 'Paperless Claims'],
      icon: 'car-sport',
      loanType: 'Vehicle Insurance',
    },

    // INVESTMENTS
    {
      id: 'mutual-funds',
      category: 'investments',
      title: 'Mutual Funds & SIP',
      tagline: 'Build long-term wealth with top-performing equity & debt mutual funds',
      rate: 'SIP from ₹500',
      badge: 'High Growth',
      features: ['Expert Fund Recommendations', 'Zero Commission Direct Plans', 'ELSS Tax Saver'],
      icon: 'trending-up',
      route: '/calculator',
      loanType: 'Mutual Funds',
    },
    {
      id: 'stocks-demat',
      category: 'investments',
      title: 'Stocks & Demat Account',
      tagline: 'Trade in NSE & BSE with flat-fee discount brokerage',
      rate: 'Zero Brokerage',
      badge: 'Free Demat',
      features: ['Free Account Opening', 'Instant Fund Transfer', 'Advanced Research'],
      icon: 'stats-chart',
      route: '/calculator',
      loanType: 'Stocks & Demat',
    },

    // TOOLS
    {
      id: 'emi-calculator',
      category: 'tools',
      title: 'Universal EMI Calculator',
      tagline: 'Calculate exact monthly installments, interest breakdown & amortization',
      rate: 'Free Instant Tool',
      badge: 'Essential',
      features: ['Home, Car & Personal Loans', 'Prepayment Analysis', 'Visual Pie Chart'],
      icon: 'calculator',
      route: '/calculator',
    },
    {
      id: 'rate-compare',
      category: 'tools',
      title: 'Compare 40+ Bank Rates',
      tagline: 'Side-by-side comparison of SBI, HDFC, ICICI, Axis, YES Bank & more',
      rate: 'Live Rate Matrix',
      badge: 'Live Data',
      features: ['Processing Fee Comparison', 'Approval Times', 'Direct Eligibility Filter'],
      icon: 'swap-horizontal',
      route: '/compare',
    },
    {
      id: 'cibil-score',
      category: 'tools',
      title: 'Free CIBIL Score Checker',
      tagline: 'Check your official credit score report without hurting your rating',
      rate: '100% Free',
      badge: 'Instant CIBIL',
      features: ['No Impact on Credit Score', 'Detailed Report Analysis', 'Personalized Loan Offers'],
      icon: 'speedometer',
      loanType: 'CIBIL Check',
    },
  ];

  const filteredServices = servicesList.filter((s) => {
    const matchesCategory =
      selectedCategory === 'all' || s.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      s.title.toLowerCase().includes(query) ||
      s.tagline.toLowerCase().includes(query) ||
      s.rate.toLowerCase().includes(query) ||
      s.features.some((f) => f.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const handleOpenLoan = (item: ServiceItem) => {
    if (item.loanType === 'CIBIL Check') {
      setIsCibil(true);
      setModalVisible(true);
    } else if (item.loanType) {
      setSelectedLoanType(item.loanType);
      setIsCibil(false);
      setModalVisible(true);
    } else if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Universal Header */}
      <AppHeader
        onOpenApply={() => {
          setSelectedLoanType('Personal Loan');
          setIsCibil(false);
          setModalVisible(true);
        }}
        onOpenCibil={() => {
          setIsCibil(true);
          setModalVisible(true);
        }}
        onSelectLoan={(loan) => {
          setSelectedLoanType(loan);
          setIsCibil(false);
          setModalVisible(true);
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Section */}
        <View style={styles.banner}>
          <Text style={styles.bannerBadge}>FINANCIAL MARKETPLACE</Text>
          <Text style={styles.bannerTitle}>All Services & Products</Text>
          <Text style={styles.bannerSubtitle}>
            Browse 40+ Partner Banks, compare interest rates & apply with zero consultation charges
          </Text>

          {/* Search Box */}
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search loans, cards, insurance, calculators..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {[
            { id: 'all', label: 'All Services', icon: 'grid' },
            { id: 'loans', label: 'Loans (9)', icon: 'cash' },
            { id: 'cards', label: 'Cards (2)', icon: 'card' },
            { id: 'insurance', label: 'Insurance (3)', icon: 'shield-checkmark' },
            { id: 'investments', label: 'Investments', icon: 'trending-up' },
            { id: 'tools', label: 'Tools & Calc', icon: 'calculator' },
          ].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                selectedCategory === cat.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as any}
                size={14}
                color={selectedCategory === cat.id ? '#ffffff' : '#64748b'}
              />
              <Text
                style={[
                  styles.categoryPillText,
                  selectedCategory === cat.id && styles.categoryPillTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services List Grid */}
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.iconWrap}>
                  <Ionicons name={service.icon as any} size={22} color={BrandColors.primary} />
                </View>
                {service.badge && (
                  <View style={styles.badgeWrap}>
                    <Text style={styles.badgeText}>{service.badge}</Text>
                  </View>
                )}
              </View>

              {/* Title & Tagline */}
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceTagline}>{service.tagline}</Text>

              {/* Rate Highlight Box */}
              <View style={styles.rateBox}>
                <Text style={styles.rateLabel}>Interest Rate / Starting Offer</Text>
                <Text style={styles.rateValue}>{service.rate}</Text>
              </View>

              {/* Bullet Features */}
              <View style={styles.featuresList}>
                {service.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                {service.route && (
                  <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => router.push(service.route as any)}
                  >
                    <Text style={styles.detailBtnText}>Details</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.applyBtn, !service.route && { flex: 1 }]}
                  onPress={() => handleOpenLoan(service)}
                >
                  <Text style={styles.applyBtnText}>
                    {service.category === 'tools' ? 'Open Tool' : 'Apply Now'}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Channel Partner Card */}
        <View style={styles.partnerBanner}>
          <View style={styles.partnerTextGroup}>
            <Text style={styles.partnerBadge}>BECOME A PARTNER</Text>
            <Text style={styles.partnerTitle}>Earn Up to 2.5% Payout on Every Disbursed Lead</Text>
            <Text style={styles.partnerDesc}>
              Join over 1,500+ Financial Advisors, Real Estate Agents & DSAs across India.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.partnerBtn}
            onPress={() => router.push('/partner')}
          >
            <Text style={styles.partnerBtnText}>Join Partner Program</Text>
          </TouchableOpacity>
        </View>

        {/* Floating Support Helpline Banner */}
        <View style={styles.helplineCard}>
          <Ionicons name="headset" size={26} color={BrandColors.primary} />
          <View style={styles.helplineText}>
            <Text style={styles.helplineTitle}>Have Questions? Talk to an Expert</Text>
            <Text style={styles.helplineDesc}>Call +91 88304 34945 for instant phone assistance</Text>
          </View>
          <TouchableOpacity
            style={styles.callNowBtn}
            onPress={() => Linking.openURL('tel:+918830434945')}
          >
            <Ionicons name="call" size={14} color="#ffffff" />
            <Text style={styles.callNowText}>Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loan Application & CIBIL Modal */}
      <LoanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        defaultLoanType={selectedLoanType}
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
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: BrandColors.navy,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },
  bannerBadge: {
    color: BrandColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  bannerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 16,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  categoryScroll: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  categoryContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: BrandColors.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  servicesGrid: {
    padding: 16,
    gap: 14,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeWrap: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: BrandColors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  serviceTagline: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 16,
  },
  rateBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: BrandColors.primary,
  },
  rateLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  rateValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  featuresList: {
    gap: 6,
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  detailBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  applyBtn: {
    flex: 1.5,
    backgroundColor: BrandColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  partnerBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: BrandColors.navy,
    borderRadius: 14,
    padding: 16,
  },
  partnerTextGroup: {
    marginBottom: 12,
  },
  partnerBadge: {
    color: BrandColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  partnerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 20,
  },
  partnerDesc: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 15,
  },
  partnerBtn: {
    backgroundColor: BrandColors.gold,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  partnerBtnText: {
    color: BrandColors.navy,
    fontSize: 13,
    fontWeight: '800',
  },
  helplineCard: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  helplineText: {
    flex: 1,
  },
  helplineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  helplineDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  callNowBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  callNowText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
