import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { LoanModal } from '@/components/LoanModal';

interface ApplicationItem {
  id: string;
  refId: string;
  loanType: string;
  amount: string;
  bank: string;
  rate: string;
  appliedDate: string;
  estimatedDate: string;
  status: 'Sanctioned' | 'In Verification' | 'Submitted' | 'Disbursed';
  statusColor: string;
  statusBg: string;
  currentStage: number;
  totalStages: number;
  rmName: string;
  rmPhone: string;
}

export default function ApplicationScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'active' | 'track' | 'new' | 'docs'>('active');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLoanType, setSelectedLoanType] = useState('Personal Loan');
  const [isCibil, setIsCibil] = useState(false);

  // Search & Track State
  const [searchQuery, setSearchQuery] = useState('SF-2026-8942');
  const [trackedApp, setTrackedApp] = useState({
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
        desc: 'Digital lead & loan preference registered',
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

  // Mock Active Applications
  const applications: ApplicationItem[] = [
    {
      id: 'app-1',
      refId: 'SF-2026-8942',
      loanType: 'Home Loan (PMAY 2.0)',
      amount: '₹55,00,000',
      bank: 'YES Bank',
      rate: '8.35% p.a.',
      appliedDate: '10 Aug 2026',
      estimatedDate: '14 Aug 2026',
      status: 'Sanctioned',
      statusColor: '#10b981',
      statusBg: '#ecfdf5',
      currentStage: 4,
      totalStages: 5,
      rmName: 'Sarvesh Bhoite',
      rmPhone: '+918830434945',
    },
    {
      id: 'app-2',
      refId: 'SF-2026-9214',
      loanType: 'Personal Loan Fastrack',
      amount: '₹8,50,000',
      bank: 'HDFC Bank',
      rate: '10.25% p.a.',
      appliedDate: '12 Aug 2026',
      estimatedDate: '13 Aug 2026',
      status: 'In Verification',
      statusColor: '#0284c7',
      statusBg: '#e0f2fe',
      currentStage: 2,
      totalStages: 5,
      rmName: 'Sarvesh Bhoite',
      rmPhone: '+918830434945',
    },
  ];

  const handleOpenLoanModal = (type = 'Personal Loan') => {
    setSelectedLoanType(type);
    setIsCibil(false);
    setModalVisible(true);
  };

  const handleCallRM = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsAppRM = (phone: string, refId: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hello Shree Finance, I want to inquire about my Loan Application ID: ${refId}`);
    Linking.openURL(`https://wa.me/${cleanPhone}?text=${msg}`);
  };

  const handleSearchTrack = () => {
    if (!searchQuery.trim()) return;
    const trimmed = searchQuery.trim().toUpperCase();
    setTrackedApp((prev) => ({
      ...prev,
      refId: trimmed.startsWith('SF-') ? trimmed : `SF-2026-${trimmed}`,
    }));
  };

  const handleShareSanction = async (refId: string) => {
    try {
      await Share.share({
        message: `My Shree Finance Loan Application Ref: ${refId} is approved! Check your eligibility at https://www.shreefinances.com/`,
      });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Universal Header */}
      <AppHeader
        onOpenApply={() => handleOpenLoanModal('Personal Loan')}
        onOpenCibil={() => {
          setIsCibil(true);
          setModalVisible(true);
        }}
        onSelectLoan={handleOpenLoanModal}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header Banner */}
        <View style={styles.headerBanner}>
          <View style={styles.headerTextGroup}>
            <Text style={styles.bannerBadge}>MY DASHBOARD</Text>
            <Text style={styles.bannerTitle}>Loan Applications</Text>
            <Text style={styles.bannerSubtitle}>
              Track live bank approvals, download sanction letters & apply for new loans
            </Text>
          </View>
          <TouchableOpacity
            style={styles.applyQuickBtn}
            onPress={() => handleOpenLoanModal('Personal Loan')}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={18} color="#ffffff" />
            <Text style={styles.applyQuickText}>New Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'active' && styles.tabButtonActive]}
            onPress={() => setActiveTab('active')}
          >
            <Ionicons
              name="time"
              size={16}
              color={activeTab === 'active' ? BrandColors.primary : '#64748b'}
            />
            <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
              Active ({applications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'track' && styles.tabButtonActive]}
            onPress={() => setActiveTab('track')}
          >
            <Ionicons
              name="search"
              size={16}
              color={activeTab === 'track' ? BrandColors.primary : '#64748b'}
            />
            <Text style={[styles.tabText, activeTab === 'track' && styles.tabTextActive]}>
              Track Status
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'new' && styles.tabButtonActive]}
            onPress={() => setActiveTab('new')}
          >
            <Ionicons
              name="sparkles"
              size={16}
              color={activeTab === 'new' ? BrandColors.primary : '#64748b'}
            />
            <Text style={[styles.tabText, activeTab === 'new' && styles.tabTextActive]}>
              Apply New
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'docs' && styles.tabButtonActive]}
            onPress={() => setActiveTab('docs')}
          >
            <Ionicons
              name="document-attach"
              size={16}
              color={activeTab === 'docs' ? BrandColors.primary : '#64748b'}
            />
            <Text style={[styles.tabText, activeTab === 'docs' && styles.tabTextActive]}>
              Documents
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: ACTIVE APPLICATIONS */}
        {activeTab === 'active' && (
          <View style={styles.sectionContainer}>
            {applications.map((app) => (
              <View key={app.id} style={styles.appCard}>
                {/* Header Row */}
                <View style={styles.appCardHeader}>
                  <View style={styles.appBadgeRow}>
                    <View style={[styles.statusBadge, { backgroundColor: app.statusBg }]}>
                      <Ionicons
                        name={app.status === 'Sanctioned' ? 'checkmark-circle' : 'hourglass'}
                        size={14}
                        color={app.statusColor}
                      />
                      <Text style={[styles.statusBadgeText, { color: app.statusColor }]}>
                        {app.status}
                      </Text>
                    </View>
                    <Text style={styles.refIdText}>{app.refId}</Text>
                  </View>
                  <Text style={styles.dateText}>Applied: {app.appliedDate}</Text>
                </View>

                {/* Loan Title & Amount */}
                <View style={styles.appCardBody}>
                  <View>
                    <Text style={styles.appLoanType}>{app.loanType}</Text>
                    <Text style={styles.appBankPartner}>{app.bank} Partner Deal</Text>
                  </View>
                  <View style={styles.amountBox}>
                    <Text style={styles.amountLabel}>Sanction / Req.</Text>
                    <Text style={styles.amountValue}>{app.amount}</Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Stage {app.currentStage} of {app.totalStages}</Text>
                    <Text style={styles.progressRate}>Rate: {app.rate}</Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${(app.currentStage / app.totalStages) * 100}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* Relationship Manager Contact Bar */}
                <View style={styles.rmBar}>
                  <View style={styles.rmInfo}>
                    <Ionicons name="person-circle" size={24} color="#0284c7" />
                    <View>
                      <Text style={styles.rmTitle}>Dedicated RM: {app.rmName}</Text>
                      <Text style={styles.rmPhoneText}>{app.rmPhone}</Text>
                    </View>
                  </View>
                  <View style={styles.rmActionBtns}>
                    <TouchableOpacity
                      style={styles.rmCallBtn}
                      onPress={() => handleCallRM(app.rmPhone)}
                    >
                      <Ionicons name="call" size={14} color="#0284c7" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rmWhatsAppBtn}
                      onPress={() => handleWhatsAppRM(app.rmPhone, app.refId)}
                    >
                      <Ionicons name="logo-whatsapp" size={14} color="#10b981" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Action Footer */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.footerTrackBtn}
                    onPress={() => {
                      setSearchQuery(app.refId);
                      handleSearchTrack();
                      setActiveTab('track');
                    }}
                  >
                    <Ionicons name="git-network" size={14} color={BrandColors.primary} />
                    <Text style={styles.footerTrackText}>View Full Timeline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.footerShareBtn}
                    onPress={() => handleShareSanction(app.refId)}
                  >
                    <Ionicons name="share-social-outline" size={14} color="#64748b" />
                    <Text style={styles.footerShareText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Quick Assistance Card */}
            <View style={styles.helpCard}>
              <Ionicons name="help-buoy" size={26} color={BrandColors.primary} />
              <View style={styles.helpTextContainer}>
                <Text style={styles.helpTitle}>Need Application Assistance?</Text>
                <Text style={styles.helpDesc}>
                  Our senior credit underwriters are available 9:00 AM – 8:00 PM to help you fast-track approvals.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.helpCallBtn}
                onPress={() => Linking.openURL('tel:+918830434945')}
              >
                <Ionicons name="call" size={14} color="#ffffff" />
                <Text style={styles.helpCallText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* TAB 2: TRACK STATUS TIMELINE */}
        {activeTab === 'track' && (
          <View style={styles.sectionContainer}>
            {/* Search Box */}
            <View style={styles.searchCard}>
              <Text style={styles.searchTitle}>Check Application Status</Text>
              <Text style={styles.searchSubtitle}>
                Enter your Application ID (e.g., SF-2026-8942) or Registered Mobile Number
              </Text>
              <View style={styles.searchInputRow}>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Enter SF Application Ref ID"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.searchBtn} onPress={handleSearchTrack}>
                  <Ionicons name="search" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Application Overview Summary */}
            <View style={styles.timelineOverviewCard}>
              <View style={styles.overviewHeader}>
                <View>
                  <Text style={styles.overviewApplicant}>{trackedApp.applicantName}</Text>
                  <Text style={styles.overviewLoan}>{trackedApp.loanType}</Text>
                </View>
                <View style={styles.overviewBadge}>
                  <Text style={styles.overviewBadgeText}>Stage {trackedApp.currentStage}/5</Text>
                </View>
              </View>

              <View style={styles.overviewGrid}>
                <View style={styles.overviewGridItem}>
                  <Text style={styles.overviewGridLabel}>Amount</Text>
                  <Text style={styles.overviewGridValue}>{trackedApp.amount}</Text>
                </View>
                <View style={styles.overviewGridItem}>
                  <Text style={styles.overviewGridLabel}>Interest Rate</Text>
                  <Text style={styles.overviewGridValue}>{trackedApp.rate}</Text>
                </View>
                <View style={styles.overviewGridItem}>
                  <Text style={styles.overviewGridLabel}>Est. Disbursal</Text>
                  <Text style={styles.overviewGridValue}>{trackedApp.estimatedDate}</Text>
                </View>
              </View>
            </View>

            {/* Stages Timeline */}
            <View style={styles.timelineCard}>
              <Text style={styles.timelineHeaderTitle}>Application Lifecycle</Text>

              {trackedApp.stages.map((stage, idx) => {
                const isCompleted = stage.status === 'completed';
                const isCurrent = stage.status === 'current';
                const isPending = stage.status === 'pending';

                return (
                  <View key={idx} style={styles.timelineRow}>
                    {/* Left Icon & Connecting Line */}
                    <View style={styles.timelineIndicatorColumn}>
                      <View
                        style={[
                          styles.timelineCircle,
                          isCompleted && styles.circleCompleted,
                          isCurrent && styles.circleCurrent,
                          isPending && styles.circlePending,
                        ]}
                      >
                        <Ionicons
                          name={
                            isCompleted
                              ? 'checkmark'
                              : isCurrent
                              ? 'hourglass'
                              : 'ellipse-outline'
                          }
                          size={12}
                          color={
                            isCompleted || isCurrent ? '#ffffff' : '#94a3b8'
                          }
                        />
                      </View>
                      {idx < trackedApp.stages.length - 1 && (
                        <View
                          style={[
                            styles.timelineLine,
                            isCompleted && styles.lineCompleted,
                          ]}
                        />
                      )}
                    </View>

                    {/* Right Details */}
                    <View style={styles.timelineDetails}>
                      <View style={styles.stageTitleRow}>
                        <Text
                          style={[
                            styles.stageTitle,
                            isCurrent && styles.stageTitleCurrent,
                          ]}
                        >
                          {stage.title}
                        </Text>
                        <Text style={styles.stageDate}>{stage.date}</Text>
                      </View>
                      <Text style={styles.stageDesc}>{stage.desc}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 3: APPLY FOR NEW LOAN / PRODUCT */}
        {activeTab === 'new' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Instant Application Hub</Text>
            <Text style={styles.sectionSubheading}>
              Select any financial product below for instant bank rate comparison and fast approval.
            </Text>

            <View style={styles.productGrid}>
              {[
                { name: 'Home Loan', rate: '8.35% p.a.', icon: 'home', tag: 'Lowest Rate' },
                { name: 'Personal Loan', rate: '10.25% p.a.', icon: 'cash', tag: 'Fast 24h' },
                { name: 'Business Loan', rate: '13.99% p.a.', icon: 'business', tag: 'Zero Collateral' },
                { name: 'Loan Against Property', rate: '9.25% p.a.', icon: 'home-outline', tag: 'High Value' },
                { name: 'Car Loan', rate: '8.75% p.a.', icon: 'car', tag: '100% On-Road' },
                { name: 'Education Loan', rate: '9.50% p.a.', icon: 'school', tag: 'Abroad & India' },
                { name: 'Mudra Loan', rate: 'Govt Scheme', icon: 'shield-checkmark', tag: 'PMEGP Subsidy' },
                { name: 'Credit Cards', rate: 'Lifetime Free', icon: 'card', tag: 'Instant Pre-approval' },
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.productCard}
                  onPress={() => handleOpenLoanModal(item.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.productBadge}>
                    <Text style={styles.productBadgeText}>{item.tag}</Text>
                  </View>
                  <View style={styles.productIconWrap}>
                    <Ionicons name={item.icon as any} size={24} color={BrandColors.primary} />
                  </View>
                  <Text style={styles.productCardName}>{item.name}</Text>
                  <Text style={styles.productCardRate}>from {item.rate}</Text>
                  <View style={styles.productApplyBtn}>
                    <Text style={styles.productApplyText}>Apply Now</Text>
                    <Ionicons name="arrow-forward" size={12} color="#ffffff" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: DOCUMENTS CHECKLIST */}
        {activeTab === 'docs' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>Loan KYC & Document Vault</Text>
            <Text style={styles.sectionSubheading}>
              Keep these ready for faster 24-hour verification and direct bank underwriting.
            </Text>

            {[
              {
                title: 'Identity Proof (PAN Card)',
                desc: 'Mandatory for CIBIL check & IT verification',
                status: 'Verified',
                icon: 'id-card',
                statusColor: '#10b981',
              },
              {
                title: 'Address Proof (Aadhaar / Voter ID)',
                desc: 'Aadhaar linked with mobile for e-KYC authentication',
                status: 'Verified',
                icon: 'home',
                statusColor: '#10b981',
              },
              {
                title: 'Bank Statement (Latest 6 Months)',
                desc: 'Net-banking PDF or signed bank statement showing salary/business credits',
                status: 'Pending Upload',
                icon: 'receipt',
                statusColor: '#f59e0b',
              },
              {
                title: 'Income Proof (ITR / 3 Months Salary Slips)',
                desc: 'Form 16 / Latest 2 years ITR with computation of income',
                status: 'Pending Upload',
                icon: 'document-text',
                statusColor: '#f59e0b',
              },
              {
                title: 'Property Documents (For Home / LAP)',
                desc: 'Registered sale deed, 7/12 extract or builder agreement',
                status: 'Optional',
                icon: 'business',
                statusColor: '#64748b',
              },
            ].map((doc, idx) => (
              <View key={idx} style={styles.docCard}>
                <View style={styles.docIconWrap}>
                  <Ionicons name={doc.icon as any} size={22} color={BrandColors.primary} />
                </View>
                <View style={styles.docContent}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  <Text style={styles.docDesc}>{doc.desc}</Text>
                  <View
                    style={[
                      styles.docBadge,
                      {
                        backgroundColor:
                          doc.status === 'Verified'
                            ? '#ecfdf5'
                            : doc.status === 'Pending Upload'
                            ? '#fef3c7'
                            : '#f1f5f9',
                      },
                    ]}
                  >
                    <Text style={[styles.docBadgeText, { color: doc.statusColor }]}>
                      {doc.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.uploadDocBtn}
              onPress={() => handleOpenLoanModal('Document Submission')}
            >
              <Ionicons name="cloud-upload" size={18} color="#ffffff" />
              <Text style={styles.uploadDocBtnText}>Upload Documents Directly</Text>
            </TouchableOpacity>
          </View>
        )}
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
  headerBanner: {
    backgroundColor: BrandColors.navy,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextGroup: {
    flex: 1,
    marginRight: 12,
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
    marginTop: 2,
    lineHeight: 16,
  },
  applyQuickBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyQuickText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#e0f2fe',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: BrandColors.primary,
    fontWeight: '700',
  },
  sectionContainer: {
    padding: 16,
  },
  appCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  refIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  dateText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  appCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appLoanType: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  appBankPartner: {
    fontSize: 12,
    color: BrandColors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  amountBox: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: BrandColors.navy,
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  progressRate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10b981',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: BrandColors.primary,
    borderRadius: 3,
  },
  rmBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  rmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rmTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  rmPhoneText: {
    fontSize: 11,
    color: '#64748b',
  },
  rmActionBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  rmCallBtn: {
    backgroundColor: '#e0f2fe',
    padding: 8,
    borderRadius: 6,
  },
  rmWhatsAppBtn: {
    backgroundColor: '#ecfdf5',
    padding: 8,
    borderRadius: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  footerTrackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerTrackText: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  footerShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerShareText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  helpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  helpDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
  helpCallBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  helpCallText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  searchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  searchSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 12,
  },
  searchInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  searchBtn: {
    backgroundColor: BrandColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  timelineOverviewCard: {
    backgroundColor: BrandColors.navy,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  overviewApplicant: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  overviewLoan: {
    fontSize: 12,
    color: BrandColors.primaryLight,
    marginTop: 2,
  },
  overviewBadge: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  overviewBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  overviewGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
  },
  overviewGridItem: {
    flex: 1,
  },
  overviewGridLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  overviewGridValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timelineHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  timelineIndicatorColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  timelineCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  circleCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  circleCurrent: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  circlePending: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 34,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: '#10b981',
  },
  timelineDetails: {
    flex: 1,
    paddingBottom: 16,
  },
  stageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  stageTitleCurrent: {
    color: BrandColors.primary,
    fontWeight: '800',
  },
  stageDate: {
    fontSize: 10,
    color: '#94a3b8',
  },
  stageDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionSubheading: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 16,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  productBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  productBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  productIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productCardName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  productCardRate: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 10,
  },
  productApplyBtn: {
    backgroundColor: BrandColors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    borderRadius: 6,
  },
  productApplyText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  docCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'flex-start',
    gap: 12,
  },
  docIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docContent: {
    flex: 1,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  docDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 6,
    lineHeight: 15,
  },
  docBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  docBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  uploadDocBtn: {
    backgroundColor: BrandColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  uploadDocBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
