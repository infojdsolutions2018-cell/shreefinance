import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectLoan?: (loanType: string) => void;
  onOpenCibil?: () => void;
  onOpenApply?: () => void;
}

interface MenuItem {
  title: string;
  rate?: string;
  desc?: string;
  icon: string;
  action: () => void;
}

export function HamburgerMenu({
  visible,
  onClose,
  onSelectLoan,
  onOpenCibil,
  onOpenApply,
}: HamburgerMenuProps) {
  const router = useRouter();

  // Accordion open state (null or category key)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (key: string) => {
    setExpandedCategory((prev) => (prev === key ? null : key));
  };

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const handleApply = (loanType: string) => {
    onClose();
    if (onSelectLoan) {
      onSelectLoan(loanType);
    } else if (onOpenApply) {
      onOpenApply();
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+918830434945');
  };

  // Categories matching https://www.shreefinances.com/ and user screenshot
  const categories: Record<string, { title: string; items: MenuItem[] }> = {
    loans: {
      title: 'Loans',
      items: [
        {
          title: 'Personal Loan',
          rate: '10.25% p.a.',
          desc: 'Instant cash up to ₹50 Lakhs in 5 mins',
          icon: 'briefcase',
          action: () => handleNavigate('/loans/personal-loan'),
        },
        {
          title: 'Home Loan',
          rate: '8.35% p.a.',
          desc: 'Lowest rates from 40+ banks & PMAY',
          icon: 'home',
          action: () => handleNavigate('/loans/home-loan'),
        },
        {
          title: 'Loan Against Property',
          rate: '9.25% p.a.',
          desc: 'High-value capital with low EMI',
          icon: 'business',
          action: () => handleNavigate('/loans/loan-against-property'),
        },
        {
          title: 'Car Loan',
          rate: '8.75% p.a.',
          desc: '100% on-road funding in 30 mins',
          icon: 'car',
          action: () => handleNavigate('/loans/car-loan'),
        },
        {
          title: 'Business Loan',
          rate: '13.99% p.a.',
          desc: 'Collateral-free MSME credit up to ₹75L',
          icon: 'business',
          action: () => handleNavigate('/loans/business-loan'),
        },
        {
          title: 'Education Loan',
          rate: '9.50% p.a.',
          desc: 'Study in India & abroad with nil margin',
          icon: 'school',
          action: () => handleNavigate('/loans/education-loan'),
        },
        {
          title: 'Government Schemes',
          rate: 'Subsidies & Grants',
          desc: 'PMEGP, Stand-Up India & CGTMSE',
          icon: 'ribbon',
          action: () => handleNavigate('/loans/government-schemes'),
        },
        {
          title: 'Mudra Loan',
          rate: 'Zero Collateral',
          desc: 'Shishu, Kishore & Tarun tiers',
          icon: 'shield-checkmark',
          action: () => handleNavigate('/loans/mudra-loan'),
        },
        {
          title: 'PMAY Housing Scheme',
          rate: 'Subsidy ₹2.67L',
          desc: 'Central government home subsidy 2.0',
          icon: 'home-outline',
          action: () => handleNavigate('/loans/pmay'),
        },
        {
          title: 'Explore All 9 Loans Hub',
          rate: 'Compare All',
          desc: 'Browse complete multi-bank loans catalog',
          icon: 'grid',
          action: () => handleNavigate('/loans'),
        },
      ],
    },
    cards: {
      title: 'Cards',
      items: [
        {
          title: 'Credit Cards',
          rate: 'Rewards & Cashback',
          desc: 'Compare best credit cards',
          icon: 'card',
          action: () => handleApply('Credit Card'),
        },
        {
          title: 'Business Cards',
          rate: 'Premium Perks',
          desc: 'For corporate expenses',
          icon: 'briefcase',
          action: () => handleApply('Business Card'),
        },
      ],
    },
    insurance: {
      title: 'Insurance',
      items: [
        {
          title: 'Life Insurance',
          rate: 'Cover upto 1Cr',
          desc: "Secure your family's future",
          icon: 'shield-checkmark',
          action: () => handleApply('Life Insurance'),
        },
        {
          title: 'Health Insurance',
          rate: 'Cashless Claims',
          desc: 'Protect against medical bills',
          icon: 'medkit',
          action: () => handleApply('Health Insurance'),
        },
        {
          title: 'Vehicle Insurance',
          rate: 'Instant Policy',
          desc: 'Mandatory third-party cover',
          icon: 'car',
          action: () => handleApply('Vehicle Insurance'),
        },
      ],
    },
    investments: {
      title: 'Investments',
      items: [
        {
          title: 'Mutual Funds',
          rate: 'High Returns',
          desc: 'SIP starting ₹500',
          icon: 'trending-up',
          action: () => handleNavigate('/calculator'),
        },
        {
          title: 'Stocks',
          rate: 'Zero Brokerage',
          desc: 'Invest in top companies',
          icon: 'stats-chart',
          action: () => handleNavigate('/calculator'),
        },
      ],
    },
    tools: {
      title: 'Compare & Partner',
      items: [
        {
          title: 'Compare All Loans',
          rate: 'Live Rate Matrix',
          desc: 'Compare 40+ top Indian banks',
          icon: 'swap-horizontal',
          action: () => handleNavigate('/compare'),
        },
        {
          title: 'Become a Partner (DSA)',
          rate: 'Earn 2.5% Payout',
          desc: 'Join channel partner network',
          icon: 'people',
          action: () => handleNavigate('/partner'),
        },
        {
          title: 'Partner Program',
          rate: 'DSA Portal',
          desc: 'Partner benefits & registration',
          icon: 'briefcase',
          action: () => handleNavigate('/partner'),
        },
        {
          title: 'Payout Structure',
          rate: 'Up to 2.5% Commission',
          desc: 'DSA slab payouts & bonuses',
          icon: 'cash',
          action: () => handleNavigate('/partner'),
        },
        {
          title: 'Required Documents',
          rate: 'Check Checklist',
          desc: 'KYC, Income & Bank proofs',
          icon: 'document-text',
          action: () => handleApply('Required Documents Check'),
        },
        {
          title: 'All Calculators',
          rate: 'Instant EMI Tools',
          desc: 'EMI, HLBT & Tax calculators',
          icon: 'calculator',
          action: () => handleNavigate('/calculator'),
        },
      ],
    },
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* ─── 1. TOP HEADER (Logo on Left, Close "X" on Right) ─── */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/shreelogobg.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="Close Navigation Menu"
          >
            <Ionicons name="close" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* ─── 2. SCROLLABLE MENU CONTENT ─── */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Home Button */}
          <TouchableOpacity
            style={styles.homeCard}
            onPress={() => handleNavigate('/')}
            activeOpacity={0.75}
          >
            <Text style={styles.navTitle}>Home</Text>
          </TouchableOpacity>

          {/* Accordion Categories: Loans, Cards, Insurance, Investments, Compare & Partner */}
          {Object.entries(categories).map(([key, category]) => {
            const isExpanded = expandedCategory === key;
            return (
              <View key={key} style={styles.accordionWrap}>
                <TouchableOpacity
                  style={[styles.accordionCard, isExpanded && styles.accordionCardOpen]}
                  onPress={() => toggleCategory(key)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.navTitle}>{category.title}</Text>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#0f172a"
                  />
                </TouchableOpacity>

                {/* Sub Items Grid */}
                {isExpanded && (
                  <View style={styles.subItemsList}>
                    {category.items.map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.subItemRow}
                        onPress={item.action}
                        activeOpacity={0.7}
                      >
                        <View style={styles.subItemIconBg}>
                          <Ionicons name={item.icon as any} size={16} color={BrandColors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.subItemTitleRow}>
                            <Text style={styles.subItemTitle}>{item.title}</Text>
                            {item.rate && (
                              <View style={styles.subItemBadge}>
                                <Text style={styles.subItemBadgeText}>{item.rate}</Text>
                              </View>
                            )}
                          </View>
                          {item.desc && <Text style={styles.subItemDesc}>{item.desc}</Text>}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          {/* ─── 3. ACTION / UTILITY PILL BUTTONS (Matching Screenshot) ─── */}
          <View style={styles.actionPillsGroup}>
            {/* Contact */}
            <TouchableOpacity
              style={styles.actionPill}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <View style={styles.actionPillLeft}>
                <Ionicons name="call-outline" size={16} color={BrandColors.primary} />
                <Text style={styles.actionPillText}>Contact</Text>
              </View>
            </TouchableOpacity>

            {/* Track Application Status */}
            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => handleNavigate('/track')}
              activeOpacity={0.8}
            >
              <View style={styles.actionPillLeft}>
                <Ionicons name="search-outline" size={16} color={BrandColors.primary} />
                <Text style={styles.actionPillText}>Track Application Status</Text>
              </View>
            </TouchableOpacity>

            {/* Become a Partner (DSA Registration) */}
            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => handleNavigate('/partner')}
              activeOpacity={0.8}
            >
              <View style={styles.actionPillLeft}>
                <Ionicons name="sparkles-outline" size={16} color={BrandColors.primary} />
                <Text style={styles.actionPillText}>Become a Partner (DSA Registration)</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={BrandColors.primary} />
            </TouchableOpacity>

            {/* Partner Portal Login & Dashboard */}
            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => handleNavigate('/partner')}
              activeOpacity={0.8}
            >
              <View style={styles.actionPillLeft}>
                <Ionicons name="business-outline" size={16} color={BrandColors.primary} />
                <Text style={styles.actionPillText}>Partner Portal Login & Dashboard</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={BrandColors.primary} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ─── 4. BOTTOM FIXED CTA BUTTONS (Matching Screenshot) ─── */}
        <View style={styles.bottomFixedArea}>
          {/* FREE CIBIL SCORE CHECK Button */}
          <TouchableOpacity
            style={styles.cibilScoreBtn}
            onPress={() => {
              onClose();
              if (onOpenCibil) onOpenCibil();
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="flash" size={18} color={BrandColors.primary} />
            <Text style={styles.cibilScoreBtnText}>FREE CIBIL SCORE CHECK</Text>
          </TouchableOpacity>

          {/* APPLY NOW Button */}
          <TouchableOpacity
            style={styles.applyNowBtn}
            onPress={() => {
              onClose();
              if (onOpenApply) onOpenApply();
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.applyNowBtnText}>APPLY NOW</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    height: 40,
    width: 140,
    justifyContent: 'center',
  },
  logoImage: {
    height: '100%',
    width: '100%',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 10,
  },

  // Home Card
  homeCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.2,
  },

  // Accordions
  accordionWrap: {
    gap: 8,
  },
  accordionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  accordionCardOpen: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },

  // Sub-items list
  subItemsList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginTop: -2,
  },
  subItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  subItemIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  subItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  subItemBadge: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  subItemBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0284c7',
  },
  subItemDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  // Action / Utility Pills
  actionPillsGroup: {
    marginTop: 8,
    gap: 10,
  },
  actionPill: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  actionPillText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0284c7',
    letterSpacing: -0.2,
  },

  // Bottom Fixed CTA Area
  bottomFixedArea: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    gap: 10,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cibilScoreBtn: {
    height: 52,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#7dd3fc',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cibilScoreBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0284c7',
    letterSpacing: 0.5,
  },
  applyNowBtn: {
    height: 52,
    backgroundColor: BrandColors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  applyNowBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
