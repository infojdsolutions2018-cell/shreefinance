import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { LoanModal } from '@/components/LoanModal';

export default function ProfileScreen() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState('Personal Loan');
  const [isCibil, setIsCibil] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Download Shree Finance App to compare 40+ bank loan rates, check free CIBIL score & apply with instant approval! Visit https://www.shreefinances.com/ or Call +91 88304 34945',
      });
    } catch {}
  };

  const handleCall = (phone = '+918830434945') => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone = '+918830434945') => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent('Hello Shree Finance, I need assistance with my profile and loans.');
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${msg}`);
  };

  const handleOpenWebsite = () => {
    Linking.openURL('https://www.shreefinances.com/');
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
        {/* Profile User Card Header */}
        <View style={styles.profileHeader}>
          <View style={styles.userRow}>
            {/* Avatar Circle */}
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>SF</Text>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Shree Finance User</Text>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                  <Text style={styles.verifiedText}>KYC Verified</Text>
                </View>
              </View>
              <Text style={styles.userPhone}>+91 88304 34945</Text>
              <Text style={styles.userEmail}>contact@shreefinances.com</Text>
            </View>
          </View>

          {/* Quick Financial Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => router.push('/application')}
            >
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Active Applications</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity
              style={styles.statItem}
              onPress={() => {
                setIsCibil(true);
                setModalVisible(true);
              }}
            >
              <Text style={[styles.statValue, { color: '#10b981' }]}>785</Text>
              <Text style={styles.statLabel}>CIBIL Score (Good)</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <TouchableOpacity
              style={styles.statItem}
              onPress={() => router.push('/compare')}
            >
              <Text style={[styles.statValue, { color: BrandColors.primaryLight }]}>40+</Text>
              <Text style={styles.statLabel}>Partner Banks</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Applications & Credit */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>MY FINANCES & APPLICATIONS</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/application')}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="document-text" size={20} color={BrandColors.primary} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>My Applications</Text>
              <Text style={styles.menuItemSubtitle}>Track live status, KYC & sanction letters</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setIsCibil(true);
              setModalVisible(true);
            }}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="speedometer" size={20} color="#10b981" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Free CIBIL Score Report</Text>
              <Text style={styles.menuItemSubtitle}>Check score without lowering rating</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/calculator')}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="calculator" size={20} color={BrandColors.gold} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>EMI & Eligibility Calculators</Text>
              <Text style={styles.menuItemSubtitle}>Home, Car, Personal loans & prepayments</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/compare')}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#f1f5f9' }]}>
              <Ionicons name="swap-horizontal" size={20} color="#475569" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Compare Bank Interest Rates</Text>
              <Text style={styles.menuItemSubtitle}>SBI, HDFC, ICICI, YES Bank rate matrix</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Section: Partner & DSA Network */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>PARTNER PROGRAM (DSA)</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/partner')}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#fdf2f8' }]}>
              <Ionicons name="briefcase" size={20} color="#db2777" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>DSA Channel Partner Program</Text>
              <Text style={styles.menuItemSubtitle}>Earn up to 2.5% commission on disbursed loans</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/partner')}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="cash" size={20} color="#d97706" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Payout Structure & Slabs</Text>
              <Text style={styles.menuItemSubtitle}>View commission tiers, milestones & incentives</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Dedicated Relationship Manager Card */}
        <View style={styles.rmCard}>
          <View style={styles.rmHeader}>
            <View style={styles.rmAvatarWrap}>
              <Ionicons name="person" size={24} color="#ffffff" />
            </View>
            <View style={styles.rmTitleWrap}>
              <Text style={styles.rmBadge}>PERSONAL ADVISOR</Text>
              <Text style={styles.rmName}>Sarvesh Bhoite</Text>
              <Text style={styles.rmSubtitle}>Senior Relationship Manager, Pune</Text>
            </View>
          </View>

          <View style={styles.rmActionRow}>
            <TouchableOpacity
              style={styles.rmCallAction}
              onPress={() => handleCall('+918830434945')}
            >
              <Ionicons name="call" size={16} color="#ffffff" />
              <Text style={styles.rmCallActionText}>Direct Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rmWhatsAppAction}
              onPress={() => handleWhatsApp('+918830434945')}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#ffffff" />
              <Text style={styles.rmWhatsAppActionText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Preferences & Support */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>PREFERENCES & SUPPORT</Text>

          {/* Notifications Toggle */}
          <View style={styles.menuItem}>
            <View style={[styles.menuIconWrap, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="notifications" size={20} color={BrandColors.primary} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Push Notifications</Text>
              <Text style={styles.menuItemSubtitle}>Loan approval alerts & rate drop notices</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#cbd5e1', true: BrandColors.primary }}
              thumbColor="#ffffff"
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleShareApp}>
            <View style={[styles.menuIconWrap, { backgroundColor: '#f1f5f9' }]}>
              <Ionicons name="share-social" size={20} color="#475569" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Share Shree Finance App</Text>
              <Text style={styles.menuItemSubtitle}>Recommend to family, friends & business partners</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleOpenWebsite}>
            <View style={[styles.menuIconWrap, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="globe-outline" size={20} color="#10b981" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Visit Official Website</Text>
              <Text style={styles.menuItemSubtitle}>www.shreefinances.com</Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#94a3b8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              Alert.alert(
                'Shree Finance Support',
                'Helpline: +91 88304 34945\nEmail: contact@shreefinances.com\nHead Office: Pune, Maharashtra\nOperating Hours: 9:00 AM - 8:00 PM',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Call Now', onPress: () => handleCall('+918830434945') },
                ]
              );
            }}
          >
            <View style={[styles.menuIconWrap, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="help-circle" size={20} color={BrandColors.gold} />
            </View>
            <View style={styles.menuItemText}>
              <Text style={styles.menuItemTitle}>Help & Support</Text>
              <Text style={styles.menuItemSubtitle}>Call helpline, email support & office address</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* App Version Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>Shree Finance Mobile App • Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2026 Shree Finance. All Rights Reserved.</Text>
        </View>
      </ScrollView>

      {/* Universal Loan Application & CIBIL Modal */}
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
  profileHeader: {
    backgroundColor: BrandColors.navy,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 22,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BrandColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  userPhone: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#111b33',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '600',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#1e293b',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  rmCard: {
    backgroundColor: BrandColors.navy,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
  },
  rmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  rmAvatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BrandColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rmTitleWrap: {
    flex: 1,
  },
  rmBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: BrandColors.gold,
    letterSpacing: 0.8,
  },
  rmName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 1,
  },
  rmSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  rmActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rmCallAction: {
    flex: 1,
    backgroundColor: BrandColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rmCallActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  rmWhatsAppAction: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rmWhatsAppActionText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 10,
    color: '#cbd5e1',
    marginTop: 2,
  },
});
