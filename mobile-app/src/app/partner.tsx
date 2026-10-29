import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';

export default function PartnerScreen() {
  const [partnerName, setPartnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [profession, setProfession] = useState('DSA / Loan Agent');
  const [registered, setRegistered] = useState(false);
  const [partnerRef, setPartnerRef] = useState('');

  const professions = [
    'DSA / Loan Agent',
    'Real Estate Consultant',
    'Chartered Accountant',
    'Insurance Agent',
    'Financial Advisor',
  ];

  const handleRegister = () => {
    if (!partnerName.trim() || !mobile.trim()) {
      Alert.alert('Required Fields', 'Please provide your full name and mobile number.');
      return;
    }

    const ref = `SF-DSA-${Math.floor(100 + Math.random() * 900)}`;
    setPartnerRef(ref);
    setRegistered(true);
  };

  const partnerPerks = [
    {
      title: 'Up to 2.5% Slab Payout',
      desc: 'Industry-best commissions disbursed directly within 48 hours of bank file clearance.',
      icon: 'cash',
      color: '#10b981',
    },
    {
      title: '40+ Direct Bank Codes',
      desc: 'No sub-brokering. Log loan files directly into SBI, HDFC, ICICI, and YES Bank.',
      icon: 'business',
      color: '#0284c7',
    },
    {
      title: 'Dedicated RM Support',
      desc: 'Direct desk support from Sarvesh Bhoite & underwriting team in Narhe Pune.',
      icon: 'people',
      color: '#8b5cf6',
    },
    {
      title: 'Digital CRM Dashboard',
      desc: 'Track live status of your customer loan files in real time.',
      icon: 'phone-portrait',
      color: '#f59e0b',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={11} color="#38bdf8" />
              <Text style={styles.heroBadgeText}>CHANNEL PARTNER PROGRAM</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Become a Shree Finance Partner</Text>
          <Text style={styles.heroSubtitle}>
            Monetise your network by partnering with Maharashtra&apos;s leading loan aggregator. Earn up to 2.5% payout per sanctioned file.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>2.5%</Text>
              <Text style={styles.heroStatLbl}>Max Payout</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>90+</Text>
              <Text style={styles.heroStatLbl}>Active DSAs</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatVal}>48 Hrs</Text>
              <Text style={styles.heroStatLbl}>Payout Cycle</Text>
            </View>
          </View>
        </View>

        {/* Benefits Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Partner Advantages</Text>
        </View>

        <View style={styles.perksList}>
          {partnerPerks.map((p, i) => (
            <View key={i} style={styles.perkCard}>
              <View style={[styles.perkIconCircle, { backgroundColor: `${p.color}15` }]}>
                <Ionicons name={p.icon as any} size={20} color={p.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.perkTitle}>{p.title}</Text>
                <Text style={styles.perkDesc}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Registration Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>DSA Partner Onboarding</Text>
          <Text style={styles.formSub}>
            Register your profile to activate your Shree Finance Partner Code
          </Text>

          {registered ? (
            <View style={styles.registeredBox}>
              <Ionicons name="checkmark-circle" size={48} color={BrandColors.emerald} />
              <Text style={styles.regTitle}>Registration Successful!</Text>
              <Text style={styles.regSub}>
                Your partner onboarding request has been activated.
              </Text>
              <View style={styles.partnerRefBox}>
                <Text style={styles.partnerRefLabel}>YOUR PARTNER CODE</Text>
                <Text style={styles.partnerRefVal}>{partnerRef}</Text>
              </View>
              <TouchableOpacity
                style={styles.callRmBtn}
                onPress={() => Linking.openURL('tel:+918830434945')}
              >
                <Ionicons name="call" size={14} color="#ffffff" />
                <Text style={styles.callRmBtnText}>Call Channel Desk (+91 88304 34945)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formFields}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name / Firm Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Ramesh Patil / Shree Associates"
                  placeholderTextColor="#94a3b8"
                  value={partnerName}
                  onChangeText={setPartnerName}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Mobile Number (WhatsApp) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10-digit mobile number"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobile}
                  onChangeText={setMobile}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="partner@gmail.com"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Select Profession</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                  {professions.map((prof) => (
                    <TouchableOpacity
                      key={prof}
                      style={[
                        styles.chip,
                        profession === prof && styles.chipActive,
                      ]}
                      onPress={() => setProfession(prof)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          profession === prof && styles.chipTextActive,
                        ]}
                      >
                        {prof}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>City / District</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Pune, PCMC, Satara, Kolhapur"
                  placeholderTextColor="#94a3b8"
                  value={city}
                  onChangeText={setCity}
                />
              </View>

              <TouchableOpacity style={styles.submitBtn} onPress={handleRegister}>
                <Text style={styles.submitBtnText}>Submit Partner Application</Text>
                <Ionicons name="arrow-forward" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Pune Office Channel Partner Support */}
        <View style={styles.channelSupportCard}>
          <Ionicons name="headset" size={22} color="#38bdf8" />
          <View style={{ flex: 1 }}>
            <Text style={styles.supportTitle}>Partner Support Desk</Text>
            <Text style={styles.supportText}>
              Direct desk for file submission & login at Narhe Pune Office.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.quickCallBtn}
            onPress={() => Linking.openURL('tel:+918830434945')}
          >
            <Text style={styles.quickCallText}>Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  heroCard: {
    backgroundColor: '#0b1329',
    margin: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  heroBadgeText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 6,
    lineHeight: 18,
  },
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38bdf8',
  },
  heroStatLbl: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  perksList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  perkCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  perkIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  perkDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
  formCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 14,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  formSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: -8,
  },
  formFields: {
    gap: 12,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  chipScroll: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primaryDark,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: BrandColors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  registeredBox: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  regTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  regSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  partnerRefBox: {
    backgroundColor: BrandColors.primaryBg,
    borderColor: BrandColors.primaryLight,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  partnerRefLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: BrandColors.primaryDark,
    letterSpacing: 1,
  },
  partnerRefVal: {
    fontSize: 22,
    fontWeight: '900',
    color: BrandColors.primary,
    letterSpacing: 1,
    marginTop: 2,
  },
  callRmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0b1329',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 4,
  },
  callRmBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  channelSupportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0b1329',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    padding: 16,
  },
  supportTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  supportText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  quickCallBtn: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  quickCallText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
});
