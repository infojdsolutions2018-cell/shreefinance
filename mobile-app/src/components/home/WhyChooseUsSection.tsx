import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';

interface WhyChooseUsSectionProps {
  onConsultAdvisor?: () => void;
}

export function WhyChooseUsSection({ onConsultAdvisor }: WhyChooseUsSectionProps) {
  const features = [
    {
      icon: 'flash',
      title: '15-Min Instant Approval',
      desc: 'Powered by AI-based automated underwriting. Sanction letters delivered directly to your email in minutes.',
      badge: 'Fastest in Industry',
      color: '#0284c7',
      bg: '#e0f2fe',
    },
    {
      icon: 'trending-down',
      title: 'Lowest Interest Guarantee',
      desc: 'Exclusive partnership pricing with 40+ leading national banks and NBFCs to secure you the lowest APR.',
      badge: 'Rates from 8.35%',
      color: '#f59e0b',
      bg: '#fef3c7',
    },
    {
      icon: 'time',
      title: 'Zero Hidden Charges',
      desc: '100% transparent terms with nil processing fee options and no surprise pre-closure penalties.',
      badge: '100% Transparent',
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      icon: 'lock-closed',
      title: '256-Bit Bank Security',
      desc: 'Your financial privacy and documents are protected with enterprise-grade SSL encryption.',
      badge: 'ISO Certified',
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
  ];

  const metrics = [
    { num: '2,100+', label: 'Loans Disbursed', icon: 'wallet-outline' },
    { num: '99%', label: 'Satisfaction', icon: 'thumbs-up-outline' },
    { num: '90+', label: 'Office Partners', icon: 'business-outline' },
    { num: '70+', label: 'Awards & Honors', icon: 'ribbon-outline' },
  ];

  const reviews = [
    {
      name: 'Akash Arun Jadhav',
      role: 'Software Engineer, Pune',
      product: 'Personal Loan',
      bank: 'HDFC Bank',
      amount: '₹3,37,240 Disbursed',
      rating: 5,
      avatar: 'AJ',
      avatarBg: '#0284c7',
      text: 'Got my loan disbursed within 48 hours without any hassle. RM Sarvesh Bhoite guided me through digital KYC. Transparent charges and zero hidden fees!',
    },
    {
      name: 'Siddhi Bhoite',
      role: 'Entrepreneur, Pune',
      product: 'Car Loan',
      bank: 'State Bank of India',
      amount: '₹8,50,000 Disbursed',
      rating: 5,
      avatar: 'SB',
      avatarBg: '#10b981',
      text: 'Best financial consultancy in Pune. They compared live rates across 40+ banks and secured the lowest 8.65% interest rate for my vehicle loan.',
    },
    {
      name: 'Aishwarya Sulagadle',
      role: 'Healthcare Professional, Pune',
      product: 'Education Loan',
      bank: 'ICICI Bank',
      amount: '₹15,00,000 Sanctioned',
      rating: 5,
      avatar: 'AS',
      avatarBg: '#8b5cf6',
      text: 'Seamless documentation for my higher education loan. Shree Finance handled sanction letters and bank logins in record time. Highly recommended!',
    },
    {
      name: 'Atharva Patharkar',
      role: 'Chartered Accountant, PCMC',
      product: 'Business Loan',
      bank: 'Kotak & Axis',
      amount: '₹25,00,000 Disbursed',
      rating: 5,
      avatar: 'AP',
      avatarBg: '#f59e0b',
      text: 'As a financial consultant myself, I appreciate their fast turnaround and direct bank tie-ups. Working capital approved with zero friction.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={12} color={BrandColors.primary} />
            <Text style={styles.badgeText}>THE SHREE FINANCE ADVANTAGE</Text>
          </View>
        </View>
        <Text style={styles.title}>Why Millions Trust Us</Text>
        <Text style={styles.subtitle}>
          We streamline complex banking into a transparent, digital-first experience tailored for you.
        </Text>
      </View>

      {/* 4 Feature Cards */}
      <View style={styles.featuresGrid}>
        {features.map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.featureTop}>
              <View style={[styles.featureIconWrap, { backgroundColor: f.bg }]}>
                <Ionicons name={f.icon as any} size={18} color={f.color} />
              </View>
              <View style={styles.featureBadge}>
                <Text style={styles.featureBadgeText}>{f.badge}</Text>
              </View>
            </View>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>

      {/* 4 Social Proof Numbers Strip */}
      <View style={styles.metricsStrip}>
        {metrics.map((m, idx) => (
          <View key={idx} style={styles.metricItem}>
            <Text style={styles.metricVal}>{m.num}</Text>
            <Text style={styles.metricLbl}>{m.label}</Text>
          </View>
        ))}
      </View>

      {/* Expert Financial Advisor Callout */}
      <View style={styles.advisorCard}>
        <View style={styles.advisorTop}>
          <View style={styles.advisorIconCircle}>
            <Ionicons name="person" size={20} color={BrandColors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.advisorHeading}>Need Expert Guidance?</Text>
            <Text style={styles.advisorSub}>
              Talk with our senior advisor Sarvesh Bhoite for optimal loan structuring.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.advisorBtn}
          onPress={onConsultAdvisor || (() => Linking.openURL('tel:+918830434945'))}
          activeOpacity={0.85}
        >
          <Ionicons name="call" size={14} color="#ffffff" />
          <Text style={styles.advisorBtnText}>Talk to Loan Advisor</Text>
        </TouchableOpacity>
      </View>

      {/* Testimonials Header with 4.9 Rating Pill */}
      <View style={styles.testimonialsHeader}>
        <View style={styles.ratingSummaryPill}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>4.9</Text>
          </View>
          <View>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star" size={12} color="#f59e0b" />
              ))}
            </View>
            <Text style={styles.ratingSub}>Based on 1,420+ Verified Reviews</Text>
          </View>
        </View>
        <Text style={styles.sectionHeaderTitle}>Verified Borrower Experiences</Text>
      </View>

      {/* Horizontal Reviews Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.reviewsScroll}
      >
        {reviews.map((r, i) => (
          <View key={i} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View style={styles.starsRow}>
                {[...Array(r.rating)].map((_, starIdx) => (
                  <Ionicons key={starIdx} name="star" size={12} color="#f59e0b" />
                ))}
              </View>
              <View style={styles.amountPill}>
                <Text style={styles.amountPillText}>{r.amount}</Text>
              </View>
            </View>

            <Text style={styles.reviewText}>&ldquo;{r.text}&rdquo;</Text>

            <View style={styles.reviewerRow}>
              <View style={[styles.avatar, { backgroundColor: r.avatarBg }]}>
                <Text style={styles.avatarText}>{r.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Text style={styles.reviewerName}>{r.name}</Text>
                  <Ionicons name="checkmark-circle" size={12} color={BrandColors.primary} />
                </View>
                <Text style={styles.reviewerRole}>{r.role}</Text>
                <Text style={styles.reviewerProduct}>{r.product} • {r.bank}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
  featuresGrid: {
    gap: 10,
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    gap: 6,
  },
  featureTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBadge: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  featureBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  featureDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 16,
  },
  metricsStrip: {
    flexDirection: 'row',
    backgroundColor: '#0b1329',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginVertical: 14,
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38bdf8',
  },
  metricLbl: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 2,
  },
  advisorCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#bae6fd',
    padding: 14,
    gap: 12,
    marginBottom: 16,
  },
  advisorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  advisorIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  advisorHeading: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
  },
  advisorSub: {
    fontSize: 11,
    color: '#0369a1',
    lineHeight: 15,
    marginTop: 1,
  },
  advisorBtn: {
    backgroundColor: BrandColors.primary,
    borderRadius: 12,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  advisorBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  testimonialsHeader: {
    gap: 8,
    marginBottom: 12,
  },
  ratingSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#b45309',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingSub: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  reviewsScroll: {
    gap: 10,
  },
  reviewCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    width: 270,
    gap: 10,
    justifyContent: 'space-between',
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountPill: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  amountPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: BrandColors.primary,
  },
  reviewText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  reviewerRole: {
    fontSize: 10,
    color: '#64748b',
  },
  reviewerProduct: {
    fontSize: 9,
    color: BrandColors.primary,
    fontWeight: '700',
  },
});
