import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { ALL_LOANS_LIST, LoanDetail, LOAN_CATEGORIES } from '@/constants/loansData';
import { LoanModal } from '@/components/LoanModal';
import { Deal4LoansDynamicForm } from '@/components/forms/Deal4LoansDynamicForm';

export default function LoansIndexScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Loans');
  const [selectedLoanForModal, setSelectedLoanForModal] = useState<string | null>(null);

  // Filter loans based on category and search query
  const filteredLoans = useMemo(() => {
    return ALL_LOANS_LIST.filter((loan: LoanDetail) => {
      // Category match
      let matchesCategory = true;
      if (selectedCategory === 'Popular') {
        matchesCategory = ['home-loan', 'personal-loan', 'car-loan', 'business-loan'].includes(loan.slug);
      } else if (selectedCategory === 'Secured Loans') {
        matchesCategory = ['home-loan', 'loan-against-property', 'car-loan'].includes(loan.slug);
      } else if (selectedCategory === 'Unsecured Credit') {
        matchesCategory = ['personal-loan', 'business-loan', 'education-loan'].includes(loan.slug);
      } else if (selectedCategory === 'Government Schemes') {
        matchesCategory = ['government-schemes', 'mudra-loan', 'pmay'].includes(loan.slug);
      }

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        loan.title.toLowerCase().includes(query) ||
        loan.category.toLowerCase().includes(query) ||
        loan.tagline.toLowerCase().includes(query) ||
        loan.keyHighlights.some((h) => h.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleApply = (loanTitle: string) => {
    setSelectedLoanForModal(loanTitle);
  };

  const handleCall = () => {
    Linking.openURL('tel:+918830434945');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ─── TOP APP BAR ─── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>All Loan Products</Text>
          <Text style={styles.headerSubtitle}>40+ Partner Banks • Digital Disbursal</Text>
        </View>

        <TouchableOpacity
          style={styles.callIconBtn}
          onPress={handleCall}
          activeOpacity={0.75}
        >
          <Ionicons name="call" size={17} color={BrandColors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── SEARCH & FILTER SECTION ─── */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Home, Personal, Mudra, Car Loan..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* ─── CATEGORY PILLS FILTER ─── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsScroll}
        >
          {LOAN_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && styles.categoryPillTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── HERO INTRO BANNER ─── */}
        <View style={styles.heroBanner}>
          <View style={styles.heroBannerLeft}>
            <View style={styles.bannerTag}>
              <Ionicons name="flash" size={12} color="#0284c7" />
              <Text style={styles.bannerTagText}>Multi-Bank Direct Facility</Text>
            </View>
            <Text style={styles.bannerTitle}>Compare & Apply Across 40+ Banks</Text>
            <Text style={styles.bannerSubtitle}>
              Get live quotes from SBI, HDFC, ICICI, Axis & NBFCs with 100% paperless approval.
            </Text>
          </View>
          <View style={styles.bannerBadgeBox}>
            <Text style={styles.bannerBadgeRate}>8.35%</Text>
            <Text style={styles.bannerBadgeLabel}>Starts From</Text>
          </View>
        </View>

        {/* ─── LOANS LIST ─── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All Loans' ? 'All Financing Options' : selectedCategory}
          </Text>
          <Text style={styles.resultsCount}>{filteredLoans.length} Loans Available</Text>
        </View>

        {filteredLoans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No matching loans found</Text>
            <Text style={styles.emptyDesc}>Try searching with different keywords like "Home", "Personal", or "Mudra".</Text>
            <TouchableOpacity
              style={styles.emptyResetBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('All Loans');
              }}
            >
              <Text style={styles.emptyResetText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredLoans.map((loan) => (
            <View key={loan.id} style={styles.loanCard}>
              {/* Card Top: Category and Badge */}
              <View style={styles.loanCardHeader}>
                <View style={[styles.loanCategoryTag, { backgroundColor: loan.bgLight }]}>
                  <Text style={[styles.loanCategoryText, { color: loan.color }]}>
                    {loan.category}
                  </Text>
                </View>

                <View style={styles.loanBadgePill}>
                  <Ionicons name="shield-checkmark" size={11} color="#0284c7" />
                  <Text style={styles.loanBadgeText}>{loan.badge}</Text>
                </View>
              </View>

              {/* Title and Tagline */}
              <View style={styles.loanTitleRow}>
                <View style={[styles.loanIconBox, { backgroundColor: loan.bgLight }]}>
                  <Ionicons name={loan.icon as any} size={24} color={loan.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.loanTitle}>{loan.title}</Text>
                  <Text style={styles.loanTagline} numberOfLines={1}>
                    {loan.tagline}
                  </Text>
                </View>
              </View>

              {/* Metrics Grid */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Starting Rate</Text>
                  <Text style={[styles.metricValue, { color: loan.color }]}>
                    {loan.startingRate}
                  </Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Max Amount</Text>
                  <Text style={styles.metricValue}>{loan.maxAmount}</Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Max Tenure</Text>
                  <Text style={styles.metricValue}>{loan.maxTenure}</Text>
                </View>
              </View>

              {/* Key Highlights */}
              <View style={styles.highlightsContainer}>
                {loan.keyHighlights.slice(0, 2).map((highlight, idx) => (
                  <View key={idx} style={styles.highlightRow}>
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                    <Text style={styles.highlightText} numberOfLines={1}>
                      {highlight}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Bank Offers Snippet */}
              <View style={styles.banksRow}>
                <Text style={styles.banksLabel}>Top Lenders:</Text>
                <View style={styles.bankChipsContainer}>
                  {loan.bankOffers.slice(0, 4).map((offer, idx) => (
                    <View key={idx} style={styles.bankChip}>
                      <Text style={styles.bankChipText}>{offer.code}</Text>
                    </View>
                  ))}
                  {loan.bankOffers.length > 4 && (
                    <View style={styles.bankChipMore}>
                      <Text style={styles.bankChipMoreText}>+{loan.bankOffers.length - 4} more</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Card Actions */}
              <View style={styles.cardActionsRow}>
                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => {
                    if (loan.slug === 'personal-loan') {
                      router.push('/loans/personal-loan' as any);
                    } else {
                      router.push({
                        pathname: '/loans/[id]',
                        params: { id: loan.slug, slug: loan.slug },
                      } as any);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.detailsBtnText}>Inside Details</Text>
                  <Ionicons name="arrow-forward" size={14} color={BrandColors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => handleApply(loan.title)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.applyBtnText}>Apply Now</Text>
                  <Ionicons name="flash" size={13} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* ─── DEAL4LOANS DYNAMIC MULTI-STEP APPLICATION FORM (Matching Web #deal4loans-apply-section) ─── */}
        <View style={styles.dynamicFormWrapper}>
          <Deal4LoansDynamicForm showCategorySwitcher={true} />
        </View>

        {/* ─── PUNE HQ UNDERWRITER ASSISTANCE ─── */}
        <View style={styles.hqAssistanceCard}>
          <View style={styles.hqHeader}>
            <View style={styles.hqBadgeIcon}>
              <Ionicons name="business" size={20} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.hqTitle}>Need Personalized Loan Advice?</Text>
              <Text style={styles.hqSubtitle}>Connect with Senior Bank Underwriters in Pune</Text>
            </View>
          </View>

          <View style={styles.hqButtonsRow}>
            <TouchableOpacity
              style={styles.hqCallBtn}
              onPress={handleCall}
              activeOpacity={0.85}
            >
              <Ionicons name="call" size={15} color="#ffffff" />
              <Text style={styles.hqCallBtnText}>Call +91 88304 34945</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hqEmailBtn}
              onPress={() => Linking.openURL('mailto:shreefinancec@gmail.com')}
              activeOpacity={0.85}
            >
              <Ionicons name="mail" size={15} color="#0284c7" />
              <Text style={styles.hqEmailBtnText}>Email Team</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ─── UNIFIED LOAN APPLICATION MODAL ─── */}
      {selectedLoanForModal && (
        <LoanModal
          visible={!!selectedLoanForModal}
          onClose={() => setSelectedLoanForModal(null)}
          defaultLoanType={selectedLoanForModal}
        />
      )}
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  callIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '500',
  },
  categoryPillsScroll: {
    paddingBottom: 14,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryPillActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#ffffff',
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b1329',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  heroBannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  bannerTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38bdf8',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    lineHeight: 20,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 15,
  },
  bannerBadgeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bannerBadgeRate: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38bdf8',
  },
  bannerBadgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  loanCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanCategoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loanCategoryText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  loanBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  loanBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369a1',
  },
  loanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  loanIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loanTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  loanTagline: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 2,
  },
  highlightsContainer: {
    gap: 6,
    marginBottom: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  banksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  banksLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  bankChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  bankChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bankChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  bankChipMore: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bankChipMoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    paddingVertical: 10,
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  applyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: BrandColors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyResetBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyResetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  dynamicFormWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  hqAssistanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  hqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  hqBadgeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hqTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  hqSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 1,
  },
  hqButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  hqCallBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: BrandColors.primary,
    borderRadius: 12,
    paddingVertical: 10,
  },
  hqCallBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  hqEmailBtn: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    paddingVertical: 10,
  },
  hqEmailBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: BrandColors.primary,
  },
});
