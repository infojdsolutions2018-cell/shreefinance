import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';

interface Stage {
  title: string;
  date: string;
  desc: string;
  status: 'completed' | 'current' | 'pending';
}

interface ApplicationResult {
  refId: string;
  applicantName: string;
  loanType: string;
  amount: string;
  bank: string;
  rate: string;
  appliedDate: string;
  estimatedDate: string;
  rmName: string;
  rmPhone: string;
  currentStage: number;
  stages: Stage[];
}

export default function TrackScreen() {
  const [query, setQuery] = useState('SF-2026-8942');
  const [result, setResult] = useState<ApplicationResult | null>({
    refId: 'SF-2026-8942',
    applicantName: 'Rahul Sharma',
    loanType: 'Home Loan (PMAY Underwriting)',
    amount: '₹55,00,000',
    bank: 'YES Bank & Shree Finance Direct',
    rate: '8.35% p.a.',
    appliedDate: '10 Aug 2026',
    estimatedDate: '14 Aug 2026',
    rmName: 'Sarvesh Bhoite',
    rmPhone: '+918830434945',
    currentStage: 4,
    stages: [
      {
        title: 'Application Submitted',
        date: '10 Aug 2026, 11:20 AM',
        desc: 'Digital lead & basic details registered',
        status: 'completed',
      },
      {
        title: 'Document & KYC Verification',
        date: '11 Aug 2026, 03:45 PM',
        desc: 'PAN, Aadhaar & 6-month bank statements verified',
        status: 'completed',
      },
      {
        title: 'Property Valuation & Legal Search',
        date: '12 Aug 2026, 01:15 PM',
        desc: 'Technical valuation & legal title clearance passed',
        status: 'completed',
      },
      {
        title: 'Loan Sanction Letter Issued',
        date: '12 Aug 2026, 06:30 PM',
        desc: 'Official bank sanction letter issued at 8.35% p.a.',
        status: 'current',
      },
      {
        title: 'Final Disbursal to Builder/Account',
        date: '14 Aug 2026 (Estimated)',
        desc: 'Electronic agreement execution & RTGS disbursal',
        status: 'pending',
      },
    ],
  });

  const handleSearch = () => {
    if (!query.trim()) return;

    const trimmed = query.trim().toUpperCase();
    setResult({
      refId: trimmed.startsWith('SF-') ? trimmed : `SF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantName: 'Aishwarya Sulagadle',
      loanType: 'Personal Loan Fastrack',
      amount: '₹8,50,000',
      bank: 'Shree Finance Direct & HDFC',
      rate: '10.25% p.a.',
      appliedDate: 'Just Now',
      estimatedDate: 'Within 24 Hours',
      rmName: 'Sarvesh Bhoite',
      rmPhone: '+918830434945',
      currentStage: 3,
      stages: [
        {
          title: 'Application Submitted',
          date: 'Recorded',
          desc: '100% paperless lead registered',
          status: 'completed',
        },
        {
          title: 'Document & KYC Verification',
          date: 'Completed',
          desc: 'e-KYC verified via Digilocker',
          status: 'completed',
        },
        {
          title: 'Automated Credit Underwriting',
          date: 'In Progress',
          desc: 'Evaluating bank credit score and DTI ratios',
          status: 'current',
        },
        {
          title: 'Sanction Letter Approval',
          date: 'Next Step',
          desc: 'Sanction letter generated and emailed',
          status: 'pending',
        },
        {
          title: 'Direct Bank Disbursal',
          date: 'Pending',
          desc: 'Disbursal into savings account',
          status: 'pending',
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppHeader />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={styles.badgeRow}>
            <View style={styles.liveBadge}>
              <Ionicons name="sparkles" size={11} color="#38bdf8" />
              <Text style={styles.liveBadgeText}>24/7 REALTIME TRACKER</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>Track Application</Text>
          <Text style={styles.headerSub}>
            Enter your Application ID or registered mobile number to see live bank stages.
          </Text>
        </View>

        {/* Search Input Box */}
        <View style={styles.searchCard}>
          <View style={styles.inputWrapper}>
            <Ionicons name="search" size={18} color="#94a3b8" />
            <TextInput
              style={styles.input}
              placeholder="e.g. SF-2026-8942 or 9876543210"
              placeholderTextColor="#94a3b8"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="characters"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.trackBtn} onPress={handleSearch}>
            <Text style={styles.trackBtnText}>Track Status</Text>
            <Ionicons name="arrow-forward" size={14} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.sampleRow}>
            <Text style={styles.sampleLabel}>Sample Ref IDs: </Text>
            <TouchableOpacity onPress={() => setQuery('SF-2026-8942')}>
              <Text style={styles.sampleId}>SF-2026-8942</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setQuery('Shree_Finence_01')}>
              <Text style={styles.sampleId}>Shree_Finence_01</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Result Card */}
        {result && (
          <View style={styles.resultContainer}>
            {/* Summary Header */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryTopRow}>
                <View>
                  <Text style={styles.refLabel}>APPLICATION ID</Text>
                  <Text style={styles.refVal}>{result.refId}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Ionicons name="checkmark-circle" size={13} color="#10b981" />
                  <Text style={styles.statusBadgeText}>Sanction Issued</Text>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLbl}>Applicant Name</Text>
                  <Text style={styles.infoVal}>{result.applicantName}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLbl}>Sanction Amount</Text>
                  <Text style={[styles.infoVal, { color: BrandColors.primary }]}>
                    {result.amount}
                  </Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLbl}>Lending Partner</Text>
                  <Text style={styles.infoVal}>{result.bank}</Text>
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLbl}>Approved Rate</Text>
                  <Text style={[styles.infoVal, { color: BrandColors.emerald }]}>
                    {result.rate}
                  </Text>
                </View>
              </View>

              {/* Relationship Manager Box */}
              <View style={styles.rmBox}>
                <View style={styles.rmAvatar}>
                  <Ionicons name="person" size={14} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rmTitle}>Assigned Relationship Manager</Text>
                  <Text style={styles.rmName}>{result.rmName} (Pune HQ)</Text>
                </View>
                <TouchableOpacity
                  style={styles.rmCallBtn}
                  onPress={() => Linking.openURL(`tel:${result.rmPhone}`)}
                >
                  <Ionicons name="call" size={13} color="#ffffff" />
                  <Text style={styles.rmCallText}>Call RM</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stages Timeline */}
            <View style={styles.timelineCard}>
              <Text style={styles.timelineTitle}>Approval Roadmap</Text>

              <View style={styles.timelineList}>
                {result.stages.map((st, i) => {
                  const isDone = st.status === 'completed';
                  const isCurrent = st.status === 'current';
                  return (
                    <View key={i} style={styles.timelineItem}>
                      <View style={styles.lineCol}>
                        <View
                          style={[
                            styles.nodeCircle,
                            isDone && styles.nodeCircleDone,
                            isCurrent && styles.nodeCircleCurrent,
                          ]}
                        >
                          {isDone ? (
                            <Ionicons name="checkmark" size={12} color="#ffffff" />
                          ) : (
                            <Text
                              style={[
                                styles.nodeNumber,
                                isCurrent && styles.nodeNumberCurrent,
                              ]}
                            >
                              {i + 1}
                            </Text>
                          )}
                        </View>
                        {i < result.stages.length - 1 && (
                          <View
                            style={[
                              styles.verticalLine,
                              isDone && styles.verticalLineDone,
                            ]}
                          />
                        )}
                      </View>

                      <View style={styles.stageContent}>
                        <View style={styles.stageTitleRow}>
                          <Text
                            style={[
                              styles.stageTitle,
                              isCurrent && styles.stageTitleCurrent,
                            ]}
                          >
                            {st.title}
                          </Text>
                          <Text style={styles.stageDate}>{st.date}</Text>
                        </View>
                        <Text style={styles.stageDesc}>{st.desc}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
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
  headerBox: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: BrandColors.primaryBg,
    borderColor: BrandColors.primaryLight,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: BrandColors.primaryDark,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 17,
  },
  searchCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    elevation: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: BrandColors.primary,
    paddingVertical: 13,
    borderRadius: 14,
  },
  trackBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  sampleLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  sampleId: {
    fontSize: 10,
    color: BrandColors.primary,
    fontWeight: '800',
    backgroundColor: BrandColors.primaryBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  resultContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 14,
  },
  summaryCard: {
    backgroundColor: '#0b1329',
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  refLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  refVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38bdf8',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoCol: {
    width: '47%',
  },
  infoLbl: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  rmBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 10,
    gap: 10,
  },
  rmAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rmTitle: {
    fontSize: 9,
    color: '#94a3b8',
    fontWeight: '600',
  },
  rmName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  rmCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  rmCallText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 16,
  },
  timelineList: {
    gap: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  lineCol: {
    alignItems: 'center',
    width: 24,
  },
  nodeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  nodeCircleDone: {
    backgroundColor: BrandColors.emerald,
    borderColor: BrandColors.emerald,
  },
  nodeCircleCurrent: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  nodeNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
  },
  nodeNumberCurrent: {
    color: '#ffffff',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
    minHeight: 28,
  },
  verticalLineDone: {
    backgroundColor: BrandColors.emerald,
  },
  stageContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  stageTitleCurrent: {
    color: BrandColors.primary,
    fontWeight: '900',
  },
  stageDate: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  stageDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
});
