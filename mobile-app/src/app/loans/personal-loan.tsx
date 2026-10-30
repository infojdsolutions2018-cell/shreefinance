import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { Deal4LoansDynamicForm } from '@/components/forms/Deal4LoansDynamicForm';
import { PersonalLoanDualSection } from '@/components/loans/PersonalLoanDualSection';
import { LoanModal } from '@/components/LoanModal';

export default function PersonalLoanScreen() {
  const router = useRouter();
  const scrollRef = useRef<any>(null);
  const [formY, setFormY] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [isCibil, setIsCibil] = useState(false);

  const handleScrollToForm = () => {
    if (scrollRef.current && formY > 0) {
      scrollRef.current.scrollTo({ y: formY - 10, animated: true });
    } else if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Personal Loan - Shree Finance',
        message:
          'Compare Personal Loan offers across 40+ banks starting 10.25% p.a. with zero paperwork! https://www.shreefinances.com/loans/personal-loan',
      });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ─── APP HEADER WITH LOGO & QUICK ACTIONS ─── */}
      <AppHeader
        onOpenApply={() => handleScrollToForm()}
        onOpenCibil={() => {
          setIsCibil(true);
          setModalVisible(true);
        }}
        onSelectLoan={(loan) => {
          if (loan !== 'Personal Loan') {
            router.push('/loans' as any);
          }
        }}
      />

      {/* Top Breadcrumb / Back Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color="#0f172a" />
          <Text style={styles.backBtnText}>All Loans</Text>
        </TouchableOpacity>

        <View style={styles.pageIndicatorRow}>
          <Text style={styles.pageTitleText}>Personal Loan</Text>
          <View style={styles.ratePill}>
            <Text style={styles.ratePillText}>from 10.25% p.a.</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={18} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ══════════════════════════════════════════════════════════════════
            1. EXACT SCREENSHOT 1:
               SHREE FINANCE DIRECT BANK FACILITY MULTI-BANK APPLICATION FORM
               WITH CATEGORY SWITCHER TABS & STEP 1 ELIGIBILITY
        ══════════════════════════════════════════════════════════════════ */}
        <View
          style={styles.formSectionWrap}
          onLayout={(e) => setFormY(e.nativeEvent.layout.y)}
        >
          <Deal4LoansDynamicForm
            initialCategory="personal"
            showCategorySwitcher={true}
          />
        </View>

        {/* ══════════════════════════════════════════════════════════════════
            2. EXACT SCREENSHOT 2:
               DUAL SECTION WITH:
               - CARD 1: CALCULATE YOUR MONTHLY EMI (Donut Chart & Sliders)
               - CARD 2: PERSONAL LOAN APPLICATION (Purpose, Name, Salary, etc.)
        ══════════════════════════════════════════════════════════════════ */}
        <View style={styles.dualSectionWrap}>
          <PersonalLoanDualSection onApplyPlan={handleScrollToForm} />
        </View>
      </ScrollView>

      {/* Universal Loan Application & CIBIL Modal */}
      <LoanModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        defaultLoanType="Personal Loan"
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  pageIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageTitleText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  ratePill: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  ratePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  shareBtn: {
    padding: 6,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formSectionWrap: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  dualSectionWrap: {
    paddingHorizontal: 12,
    marginTop: 8,
  },
});
