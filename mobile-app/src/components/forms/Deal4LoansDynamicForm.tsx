import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/theme';
import { submitLoanApplication } from '@/services/api';

export type DynamicLoanCategory =
  | 'personal'
  | 'home'
  | 'lap'
  | 'car'
  | 'business'
  | 'education'
  | 'government'
  | 'mudra'
  | 'pmay';

export interface DynamicFormConfig {
  id: DynamicLoanCategory;
  name: string;
  badge: string;
  startingRate: string;
  defaultAmount: number;
  maxAmount: number;
  tenureYears: number;
  icon: string;
  amountPresets: number[];
  purposes: string[];
}

export const DYNAMIC_LOAN_CATEGORIES: Record<DynamicLoanCategory, DynamicFormConfig> = {
  personal: {
    id: 'personal',
    name: 'Personal Loan',
    badge: 'Approvals in 5 Mins',
    startingRate: '10.25% p.a.*',
    defaultAmount: 500000,
    maxAmount: 5000000,
    tenureYears: 5,
    icon: 'cash-outline',
    amountPresets: [200000, 500000, 1000000, 2500000],
    purposes: [
      'Wedding / Marriage Expenses',
      'Medical Emergency',
      'Debt Consolidation',
      'Home Renovation',
      'Vacation / Travel',
      'General Personal Need',
    ],
  },
  home: {
    id: 'home',
    name: 'Home Loan',
    badge: 'Multi-Bank Portal 8.35%',
    startingRate: '8.35% p.a.*',
    defaultAmount: 3500000,
    maxAmount: 100000000,
    tenureYears: 20,
    icon: 'home-outline',
    amountPresets: [2000000, 3500000, 5000000, 10000000],
    purposes: [
      'Ready Flat / Villa Purchase',
      'Under-Construction Property',
      'Plot Purchase + Construction',
      'Home Loan Balance Transfer',
      'Home Improvement / Extension',
    ],
  },
  lap: {
    id: 'lap',
    name: 'Loan vs Property',
    badge: 'High LTV 9.25%',
    startingRate: '9.25% p.a.*',
    defaultAmount: 5000000,
    maxAmount: 250000000,
    tenureYears: 15,
    icon: 'business-outline',
    amountPresets: [2500000, 5000000, 10000000, 20000000],
    purposes: [
      'Business Working Capital Infusion',
      'Commercial Property Purchase',
      'Debt Consolidation',
      'Child Higher Education',
      'Personal High-Ticket Liquidity',
    ],
  },
  car: {
    id: 'car',
    name: 'Car Loan',
    badge: '100% On-Road Funding',
    startingRate: '8.75% p.a.*',
    defaultAmount: 800000,
    maxAmount: 10000000,
    tenureYears: 7,
    icon: 'car-sport-outline',
    amountPresets: [400000, 800000, 1200000, 2000000],
    purposes: [
      'New Passenger Car Purchase',
      'Certified Pre-Owned Car',
      'Electric Vehicle (EV Special)',
      'Commercial Passenger Vehicle',
    ],
  },
  business: {
    id: 'business',
    name: 'Business Loan',
    badge: '100% Collateral-Free',
    startingRate: '13.99% p.a.*',
    defaultAmount: 1500000,
    maxAmount: 7500000,
    tenureYears: 5,
    icon: 'briefcase-outline',
    amountPresets: [500000, 1500000, 3000000, 5000000],
    purposes: [
      'Working Capital Need',
      'Machinery & Equipment Term Loan',
      'Business Expansion & Branches',
      'Raw Material Inventory Stocking',
    ],
  },
  education: {
    id: 'education',
    name: 'Education Loan',
    badge: 'Study Abroad & India',
    startingRate: '9.50% p.a.*',
    defaultAmount: 1500000,
    maxAmount: 15000000,
    tenureYears: 10,
    icon: 'school-outline',
    amountPresets: [500000, 1500000, 3000000, 5000000],
    purposes: [
      'Overseas University Studies',
      'Premier Indian Institute (IIT / IIM)',
      'Undergraduate / Masters Degree',
      'Living & Accommodation Moratorium',
    ],
  },
  government: {
    id: 'government',
    name: 'Govt Schemes',
    badge: 'Subsidies up to 35%',
    startingRate: '7.50% p.a.*',
    defaultAmount: 1000000,
    maxAmount: 50000000,
    tenureYears: 7,
    icon: 'ribbon-outline',
    amountPresets: [500000, 1000000, 2500000, 5000000],
    purposes: [
      'PMAY Affordable Housing Subsidy',
      'PMEGP Project Subsidy (15%-35%)',
      'Stand-Up India Scheme',
      'CGTMSE Credit Guarantee',
    ],
  },
  mudra: {
    id: 'mudra',
    name: 'Mudra Loan',
    badge: 'Zero Collateral PMMY',
    startingRate: '8.50% p.a.*',
    defaultAmount: 500000,
    maxAmount: 2000000,
    tenureYears: 5,
    icon: 'shield-checkmark-outline',
    amountPresets: [50000, 200000, 500000, 1000000],
    purposes: [
      'Shishu Tier (Up to ₹50,000)',
      'Kishore Tier (₹50,000 to ₹5 Lakhs)',
      'Tarun Tier (₹5 Lakhs to ₹20 Lakhs)',
      'Mudra RuPay Card Working Capital',
    ],
  },
  pmay: {
    id: 'pmay',
    name: 'PMAY Scheme',
    badge: 'Subsidy up to ₹2.67L',
    startingRate: '8.35% p.a.*',
    defaultAmount: 2500000,
    maxAmount: 5000000,
    tenureYears: 20,
    icon: 'home',
    amountPresets: [1500000, 2500000, 3500000, 5000000],
    purposes: [
      'EWS / LIG First-Time Home Buyer',
      'MIG Affordable Apartment Purchase',
      'Self-Construction on Pucca Plot',
      'Direct Principal Subsidy Credit',
    ],
  },
};

export function formatIndianCurrencyWords(num: number): string {
  if (!num || isNaN(num)) return '₹0';
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Crore(s)`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh(s)`;
  return `₹${num.toLocaleString('en-IN')}`;
}

export interface Deal4LoansDynamicFormProps {
  initialCategory?: DynamicLoanCategory;
  showCategorySwitcher?: boolean;
  prefilledBank?: string;
  onSuccess?: (refNo: string) => void;
}

export function Deal4LoansDynamicForm({
  initialCategory = 'personal',
  showCategorySwitcher = true,
  prefilledBank,
  onSuccess,
}: Deal4LoansDynamicFormProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<DynamicLoanCategory>(initialCategory);
  const activeConfig = DYNAMIC_LOAN_CATEGORIES[selectedCategory] || DYNAMIC_LOAN_CATEGORIES.personal;

  // Wizard Step: 1 = Basic Parameters, 2 = Profile & PAN, 3 = Documents Verification, 4 = Sanction Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1 STATE
  const [loanAmount, setLoanAmount] = useState<number>(activeConfig.defaultAmount);
  const [employmentStatus, setEmploymentStatus] = useState<'Salaried' | 'Self-Employed'>('Salaried');
  const [city, setCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // STEP 2 STATE
  const [loanPurpose, setLoanPurpose] = useState<string>(activeConfig.purposes[0]);
  const [monthlyIncome, setMonthlyIncome] = useState('₹65,000');
  const [companyName, setCompanyName] = useState('');
  const [panCard, setPanCard] = useState('');
  const [residenceOwnership, setResidenceOwnership] = useState<'Owned' | 'Rented'>('Owned');
  const [preferredBank, setPreferredBank] = useState<string>(prefilledBank || 'Best Available Multi-Bank Quote');

  // STEP 3 STATE: Verified Document Toggles
  const [docsUploaded, setDocsUploaded] = useState({
    pan: true,
    aadhaar: true,
    incomeSlips: true,
    bankStatement: true,
  });

  // SUBMISSION STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync category changes
  useEffect(() => {
    setLoanAmount(activeConfig.defaultAmount);
    setLoanPurpose(activeConfig.purposes[0]);
  }, [selectedCategory]);

  // Sync prefilledBank
  useEffect(() => {
    if (prefilledBank) {
      setPreferredBank(prefilledBank);
    }
  }, [prefilledBank]);

  // Quick City Presets
  const popularCities = ['Pune', 'Mumbai', 'Bangalore', 'Delhi NCR', 'Hyderabad'];

  // Bank Options
  const bankOptions = [
    'Best Available Multi-Bank Quote',
    'State Bank of India (SBI)',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Bank of Baroda',
    'Kotak Mahindra Bank',
    'Tata Capital',
    'Bajaj Finserv',
  ];

  // Validation for Step 1
  const validateStep1 = (): boolean => {
    setErrorMessage(null);
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name as per PAN.');
      return false;
    }
    const cleanPhone = mobile.replace(/\D/g, '').slice(0, 10);
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!city.trim()) {
      setErrorMessage('Please select or enter your current city.');
      return false;
    }
    return true;
  };

  // Validation for Step 2
  const validateStep2 = (): boolean => {
    setErrorMessage(null);
    if (panCard.trim() && panCard.trim().length !== 10) {
      setErrorMessage('PAN Card must be exactly 10 alphanumeric characters (e.g. ABCDE1234F).');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    const payload = {
      title: `Direct Bank Facility Application: ${activeConfig.name}`,
      applicationHeader: 'Shree Finance Multi-Bank Digital Sanction Engine',
      type: `${activeConfig.name} Online Submission`,
      name: fullName.trim(),
      mobile: mobile.replace(/\D/g, '').slice(0, 10),
      email: email.trim(),
      city: city.trim(),
      loanType: activeConfig.name,
      loanCategory: activeConfig.name,
      loanPurpose: loanPurpose,
      requiredLoanAmount: `₹${loanAmount.toLocaleString('en-IN')}`,
      requiredLoanAmountWords: formatIndianCurrencyWords(loanAmount),
      repaymentTenure: `${activeConfig.tenureYears} Years`,
      benchmarkRate: activeConfig.startingRate,
      employmentType: employmentStatus,
      monthlySalaryOrIncome: monthlyIncome,
      companyOrBusiness: companyName.trim() || 'Not specified',
      pan: panCard.trim().toUpperCase() || 'Digital e-KYC Pending',
      residenceType: residenceOwnership,
      bankPartner: preferredBank,
      documentsVerified: {
        panUploaded: docsUploaded.pan,
        aadhaarUploaded: docsUploaded.aadhaar,
        incomeProofUploaded: docsUploaded.incomeSlips,
        bankStatementUploaded: docsUploaded.bankStatement,
      },
    };

    try {
      const res = await submitLoanApplication(payload);

      if (res.success) {
        const assignedRef = res.referenceNo || `SHREE-LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
        setReferenceNo(assignedRef);
        setStep(4);
        if (onSuccess) onSuccess(assignedRef);
      } else {
        setErrorMessage(res.error || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setReferenceNo('');
    setErrorMessage(null);
    setFullName('');
    setMobile('');
    setEmail('');
    setCity('');
    setPanCard('');
  };

  return (
    <View style={styles.container}>
      {/* ─── HEADER WITH DIRECT BANK FACILITY BADGE (MATCHING WEBSITE) ─── */}
      <View style={styles.webHeader}>
        <View style={styles.directFacilityPill}>
          <Ionicons name="sparkles" size={12} color="#0284c7" />
          <Text style={styles.directFacilityText}>SHREE FINANCE DIRECT BANK FACILITY</Text>
        </View>

        <Text style={styles.webMainTitle}>
          Compare {activeConfig.name} Offers from Top Banks & get e-Approved & your Free CIBIL score Instantly.
        </Text>

        <Text style={styles.mandatoryNote}>
          All fields marked with <Text style={{ color: '#e11d48', fontWeight: '900' }}>*</Text> fields are mandatory
        </Text>
      </View>

      {/* ─── CATEGORY SWITCHER TABS (SELECT LOAN TYPE) ─── */}
      {showCategorySwitcher && (
        <View style={styles.webCategoryWrap}>
          <View style={styles.webCategoryTopRow}>
            <Text style={styles.webCategoryTitle}>SELECT LOAN TYPE</Text>
            <Text style={styles.webCategoryRate}>
              {activeConfig.startingRate.replace('*', '')} STARTING
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.webCategoryScroll}
          >
            {[
              { id: 'personal', name: 'Personal', icon: 'link-outline' as const, slug: 'personal-loan' },
              { id: 'home', name: 'Home', icon: 'home-outline' as const, slug: 'home-loan' },
              { id: 'car', name: 'Car', icon: 'car-sport-outline' as const, slug: 'car-loan' },
              { id: 'business', name: 'Business', icon: 'briefcase-outline' as const, slug: 'business-loan' },
              { id: 'lap', name: 'Loan Against Property', icon: 'business-outline' as const, slug: 'loan-against-property' },
              { id: 'education', name: 'Education', icon: 'school-outline' as const, slug: 'education-loan' },
            ].map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.webTabBtn,
                    isSelected && styles.webTabBtnActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(tab.id as DynamicLoanCategory);
                    if (tab.slug === 'personal-loan') {
                      router.push('/loans/personal-loan' as never);
                    } else {
                      router.push({
                        pathname: '/loans/[id]',
                        params: { id: tab.slug, slug: tab.slug },
                      } as never);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={tab.icon}
                    size={20}
                    color={isSelected ? '#ffffff' : '#334155'}
                  />
                  <Text
                    style={[
                      styles.webTabBtnText,
                      isSelected && styles.webTabBtnTextActive,
                    ]}
                  >
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* ─── ERROR BANNER ─── */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={16} color="#ef4444" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STEP 1: QUICK ELIGIBILITY & BASIC INFORMATION (MATCHING IMAGE 1)
      ══════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <View style={styles.step1ContainerCard}>
          {/* Card Top Title Row */}
          <View style={styles.step1HeaderRow}>
            <Text style={styles.step1CardHeading}>
              STEP 1: QUICK ELIGIBILITY & BASIC INFORMATION ({activeConfig.name.toUpperCase()})
            </Text>
            <View style={styles.step1RateTag}>
              <Text style={styles.step1RateTagText}>
                {activeConfig.startingRate.replace('*', '')} starting APR
              </Text>
            </View>
          </View>

          <View style={styles.step1Grid}>
            {/* Field 1: Loan Amount */}
            <View style={styles.step1InputCol}>
              <Text style={styles.step1Label}>
                Loan Amount <Text style={styles.reqAsterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.step1TextInput}
                keyboardType="numeric"
                value={String(loanAmount)}
                onChangeText={(text) => {
                  const cleaned = Number(text.replace(/\D/g, '')) || 0;
                  setLoanAmount(cleaned);
                }}
              />
              <Text style={styles.step1AmountWords}>
                {formatIndianCurrencyWords(loanAmount)}
              </Text>
            </View>

            {/* Field 2: Employment Status */}
            <View style={styles.step1InputCol}>
              <Text style={styles.step1Label}>
                Employment Status <Text style={styles.reqAsterisk}>*</Text>
              </Text>
              <View style={styles.radioGroupRow}>
                <TouchableOpacity
                  style={styles.radioButtonItem}
                  onPress={() => setEmploymentStatus('Salaried')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioOuterCircle, employmentStatus === 'Salaried' && styles.radioOuterActive]}>
                    {employmentStatus === 'Salaried' && <View style={styles.radioInnerCircle} />}
                  </View>
                  <Text style={styles.radioItemText}>Salaried</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioButtonItem}
                  onPress={() => setEmploymentStatus('Self-Employed')}
                  activeOpacity={0.8}
                >
                  <View style={[styles.radioOuterCircle, employmentStatus === 'Self-Employed' && styles.radioOuterActive]}>
                    {employmentStatus === 'Self-Employed' && <View style={styles.radioInnerCircle} />}
                  </View>
                  <Text style={styles.radioItemText}>Self-Employed</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Field 3: City */}
            <View style={styles.step1InputCol}>
              <Text style={styles.step1Label}>
                City <Text style={styles.reqAsterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.step1SelectInput}
                onPress={() => setShowCityDropdown(!showCityDropdown)}
                activeOpacity={0.8}
              >
                <Text style={[styles.step1SelectText, !city && { color: '#94a3b8' }]}>
                  {city || 'Please Select'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#64748b" />
              </TouchableOpacity>

              {showCityDropdown && (
                <View style={styles.cityDropdownMenu}>
                  {popularCities.concat(['Chennai', 'Ahmedabad', 'Kolkata']).map((cityName) => (
                    <TouchableOpacity
                      key={cityName}
                      style={[styles.cityDropdownOption, city === cityName && styles.cityDropdownOptionActive]}
                      onPress={() => {
                        setCity(cityName);
                        setShowCityDropdown(false);
                      }}
                    >
                      <Text style={[styles.cityDropdownOptionText, city === cityName && styles.cityDropdownOptionTextActive]}>
                        {cityName}
                      </Text>
                      {city === cityName && <Ionicons name="checkmark" size={14} color="#0284c7" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Field 4: First Name */}
            <View style={styles.step1InputCol}>
              <Text style={styles.step1Label}>
                First Name <Text style={styles.reqAsterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.step1TextInput}
                placeholder="Enter First Name"
                placeholderTextColor="#94a3b8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Field 5: Mobile Number */}
            <View style={styles.step1InputCol}>
              <Text style={styles.step1Label}>
                Mobile Number <Text style={styles.reqAsterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.step1TextInput}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="10-digit mobile number"
                placeholderTextColor="#94a3b8"
                value={mobile}
                onChangeText={(t) => setMobile(t.replace(/\D/g, ''))}
              />
            </View>

            {/* Field 6: E-Mail ID */}
            <View style={styles.step1InputCol}>
              <Text style={styles.step1Label}>
                E-Mail ID <Text style={styles.reqAsterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.step1TextInput}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="name@example.com"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Proceed Button Row */}
          <View style={styles.step1CtaRow}>
            <TouchableOpacity
              style={styles.proceedApplicationBtn}
              onPress={handleNextStep}
              activeOpacity={0.85}
            >
              <Text style={styles.proceedApplicationBtnText}>PROCEED TO COMPLETE APPLICATION</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STEP 2: PROFILE, PAN & BANK PREFERENCE
      ══════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <View style={styles.stepContent}>
          {/* Loan Purpose Selection */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PRIMARY LOAN PURPOSE</Text>
            <View style={styles.purposesList}>
              {activeConfig.purposes.map((p) => {
                const isSelected = loanPurpose === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.purposeItem,
                      isSelected && styles.purposeItemActive,
                    ]}
                    onPress={() => setLoanPurpose(p)}
                  >
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={16}
                      color={isSelected ? BrandColors.primary : '#94a3b8'}
                    />
                    <Text
                      style={[
                        styles.purposeText,
                        isSelected && styles.purposeTextActive,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Monthly Income / Turnover */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {employmentStatus === 'Salaried' ? 'NET MONTHLY SALARY' : 'ANNUAL GROSS TURNOVER'}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={employmentStatus === 'Salaried' ? '₹65,000' : '₹50 Lakhs'}
              placeholderTextColor="#94a3b8"
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
            />
          </View>

          {/* Company / Business Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {employmentStatus === 'Salaried' ? 'EMPLOYER / COMPANY NAME' : 'BUSINESS ENTITY NAME'}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={employmentStatus === 'Salaried' ? 'TCS, Infosys, Govt...' : 'Sharma Trading Co.'}
              placeholderTextColor="#94a3b8"
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>

          {/* PAN Card Input */}
          <View style={styles.fieldGroup}>
            <View style={styles.amountHeaderRow}>
              <Text style={styles.fieldLabel}>PAN CARD NUMBER</Text>
              <Text style={styles.panNotice}>For Fast-Track Sanction</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.panInput]}
              autoCapitalize="characters"
              maxLength={10}
              placeholder="ABCDE1234F"
              placeholderTextColor="#94a3b8"
              value={panCard}
              onChangeText={(t) => setPanCard(t.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            />
          </View>

          {/* Residence Ownership */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>RESIDENCE OWNERSHIP</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  residenceOwnership === 'Owned' && styles.toggleBtnActive,
                ]}
                onPress={() => setResidenceOwnership('Owned')}
              >
                <Ionicons
                  name="home"
                  size={15}
                  color={residenceOwnership === 'Owned' ? '#ffffff' : '#64748b'}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    residenceOwnership === 'Owned' && styles.toggleBtnTextActive,
                  ]}
                >
                  Owned by Self / Parents
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  residenceOwnership === 'Rented' && styles.toggleBtnActive,
                ]}
                onPress={() => setResidenceOwnership('Rented')}
              >
                <Ionicons
                  name="business"
                  size={15}
                  color={residenceOwnership === 'Rented' ? '#ffffff' : '#64748b'}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    residenceOwnership === 'Rented' && styles.toggleBtnTextActive,
                  ]}
                >
                  Rented Apartment
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferred Bank Selection */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PREFERRED LENDER / BANK</Text>
            <View style={styles.bankSelectWrap}>
              {bankOptions.slice(0, 5).map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[
                    styles.bankOptionRow,
                    preferredBank === b && styles.bankOptionRowActive,
                  ]}
                  onPress={() => setPreferredBank(b)}
                >
                  <Ionicons
                    name={preferredBank === b ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={preferredBank === b ? BrandColors.primary : '#94a3b8'}
                  />
                  <Text
                    style={[
                      styles.bankOptionText,
                      preferredBank === b && styles.bankOptionTextActive,
                    ]}
                  >
                    {b}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Step 2 Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.backStepBtn}
              onPress={() => setStep(1)}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={16} color="#0f172a" />
              <Text style={styles.backStepText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { flex: 1 }]}
              onPress={handleNextStep}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Verify Documents</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STEP 3: DOCUMENTS CHECKLIST & VERIFICATION
      ══════════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <View style={styles.stepContent}>
          <View style={styles.docNoticeBanner}>
            <Ionicons name="shield-checkmark" size={20} color="#0284c7" />
            <View style={{ flex: 1 }}>
              <Text style={styles.docNoticeTitle}>Fast-Track Digital e-KYC</Text>
              <Text style={styles.docNoticeDesc}>
                Soft copies will be verified digitally. No physical branch visit or courier needed.
              </Text>
            </View>
          </View>

          <View style={styles.docsList}>
            {[
              {
                id: 'pan',
                title: 'PAN Card Copy',
                desc: 'Government photo identification proof',
                checked: docsUploaded.pan,
              },
              {
                id: 'aadhaar',
                title: 'Aadhaar Card / Address Proof',
                desc: 'Current residential address verification',
                checked: docsUploaded.aadhaar,
              },
              {
                id: 'incomeSlips',
                title: employmentStatus === 'Salaried' ? 'Latest 3 Months Salary Slips' : 'Latest 2 Years ITR with Computation',
                desc: 'Income & debt service verification proof',
                checked: docsUploaded.incomeSlips,
              },
              {
                id: 'bankStatement',
                title: 'Last 6 Months Bank Statement',
                desc: 'Salary or main commercial operating account',
                checked: docsUploaded.bankStatement,
              },
            ].map((doc) => (
              <View key={doc.id} style={styles.docCheckCard}>
                <View style={styles.docCheckLeft}>
                  <View style={styles.docCheckIcon}>
                    <Ionicons name="document-text" size={18} color="#0284c7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.docCardTitle}>{doc.title}</Text>
                    <Text style={styles.docCardDesc}>{doc.desc}</Text>
                  </View>
                </View>
                <View style={styles.docVerifiedPill}>
                  <Ionicons name="checkmark-circle" size={13} color="#10b981" />
                  <Text style={styles.docVerifiedText}>Ready</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.disclaimerBox}>
            <Ionicons name="information-circle-outline" size={15} color="#64748b" />
            <Text style={styles.disclaimerText}>
              By clicking "Submit for Sanction", I authorize Shree Finance and partner banks to fetch my credit report and contact me regarding this loan facility.
            </Text>
          </View>

          {/* Step 3 Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.backStepBtn}
              onPress={() => setStep(2)}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Ionicons name="arrow-back" size={16} color="#0f172a" />
              <Text style={styles.backStepText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { flex: 1 }]}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Submit for Digital Sanction</Text>
                  <Ionicons name="flash" size={16} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STEP 4: OFFICIAL SANCTION LETTER & CONFIRMATION
      ══════════════════════════════════════════════════════════════ */}
      {step === 4 && (
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-done" size={36} color="#ffffff" />
          </View>

          <View style={styles.successBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#10b981" />
            <Text style={styles.successBadgeText}>DIGITAL APPLICATION SANCTIONED</Text>
          </View>

          <Text style={styles.successTitle}>Application Submitted Successfully!</Text>
          <Text style={styles.successDesc}>
            Your file has been routed through Shree Finance multi-bank underwriting engine.
          </Text>

          {/* Official Ref Box */}
          <View style={styles.refBox}>
            <Text style={styles.refBoxLabel}>OFFICIAL APPLICATION REFERENCE NO.</Text>
            <Text style={styles.refBoxCode}>{referenceNo}</Text>
            <Text style={styles.refBoxSub}>Confirmation receipt dispatched to {email}</Text>
          </View>

          {/* Summary Table */}
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLbl}>Applicant Name</Text>
              <Text style={styles.summaryVal}>{fullName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLbl}>Loan Product</Text>
              <Text style={styles.summaryVal}>{activeConfig.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLbl}>Sanction Amount</Text>
              <Text style={[styles.summaryVal, { color: '#0284c7' }]}>
                ₹{loanAmount.toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLbl}>Preferred Bank</Text>
              <Text style={styles.summaryVal}>{preferredBank}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLbl}>Location</Text>
              <Text style={styles.summaryVal}>{city}</Text>
            </View>
          </View>

          {/* Helpline Action */}
          <TouchableOpacity
            style={styles.helplineBtn}
            onPress={() => Linking.openURL('tel:+918830434945')}
            activeOpacity={0.85}
          >
            <Ionicons name="call" size={16} color="#ffffff" />
            <Text style={styles.helplineBtnText}>Call Pune Senior Desk: +91 88304 34945</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.newAppBtn}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text style={styles.newAppBtnText}>Apply Another Loan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f7fe',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  // Website Matching Header
  webHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0f2fe',
    paddingBottom: 14,
    marginBottom: 14,
  },
  directFacilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#e0f2fe',
    borderColor: '#bae6fd',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  directFacilityText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0369a1',
    letterSpacing: 0.5,
  },
  webMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.4,
    lineHeight: 24,
    marginBottom: 6,
  },
  mandatoryNote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#64748b',
    fontWeight: '600',
  },

  // Category Switcher Tabs
  webCategoryWrap: {
    marginBottom: 16,
  },
  webCategoryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  webCategoryTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.5,
  },
  webCategoryRate: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0284c7',
  },
  webCategoryScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  webTabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
    minWidth: 80,
    gap: 4,
  },
  webTabBtnActive: {
    backgroundColor: '#0284c7',
    elevation: 2,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  webTabBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
  webTabBtnTextActive: {
    color: '#ffffff',
  },

  // Step 1 Container Card
  step1ContainerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0f2fe',
    padding: 16,
    elevation: 2,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  step1HeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 6,
  },
  step1CardHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: 0.3,
    flex: 1,
  },
  step1RateTag: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  step1RateTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284c7',
  },
  step1Grid: {
    gap: 12,
  },
  step1InputCol: {
    gap: 4,
  },
  step1Label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  reqAsterisk: {
    color: '#e11d48',
    fontWeight: '900',
  },
  step1TextInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '700',
  },
  step1AmountWords: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284c7',
    marginTop: 2,
  },
  radioGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 4,
  },
  radioButtonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  radioOuterCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#0284c7',
  },
  radioInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0284c7',
  },
  radioItemText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
  },
  step1SelectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  step1SelectText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  cityDropdownMenu: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 3,
  },
  cityDropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  cityDropdownOptionActive: {
    backgroundColor: '#f0f9ff',
  },
  cityDropdownOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  cityDropdownOptionTextActive: {
    color: '#0284c7',
    fontWeight: '900',
  },
  step1CtaRow: {
    marginTop: 14,
    alignItems: 'flex-end',
  },
  proceedApplicationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284c7',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 14,
    width: '100%',
    elevation: 2,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  proceedApplicationBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Legacy header styles
  header: {
    marginBottom: 16,
  },
  stepProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  stepProgressItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  stepNumberCircleCurrent: {
    backgroundColor: BrandColors.primary,
  },
  stepNumberCircleDone: {
    backgroundColor: '#10b981',
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
  },
  stepNumberTextCurrent: {
    color: '#ffffff',
  },
  stepLabelText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#94a3b8',
    textAlign: 'center',
  },
  stepLabelTextActive: {
    color: '#0f172a',
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 11,
    color: '#b91c1c',
    fontWeight: '600',
    flex: 1,
  },
  stepContent: {
    gap: 14,
  },
  categorySwitcherWrap: {
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryBtnActive: {
    backgroundColor: BrandColors.primary,
    borderColor: BrandColors.primary,
  },
  categoryBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  categoryBtnTextActive: {
    color: '#ffffff',
  },
  categoryRateText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284c7',
    marginLeft: 2,
  },
  categoryRateTextActive: {
    color: '#e0f2fe',
  },
  fieldGroup: {
    gap: 4,
  },
  amountHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountWords: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284c7',
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    height: 48,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  presetPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  presetPillActive: {
    backgroundColor: '#0284c7',
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  presetTextActive: {
    color: '#ffffff',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 10,
    borderRadius: 12,
  },
  toggleBtnActive: {
    backgroundColor: '#0b1329',
    borderColor: '#0b1329',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  toggleBtnTextActive: {
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  phoneInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    overflow: 'hidden',
  },
  countryCodeBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  countryCodeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
  },
  cityPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  cityPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cityPillActive: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  cityPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  cityPillTextActive: {
    color: '#0284c7',
    fontWeight: '800',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 6,
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  backStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
  },
  backStepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  purposesList: {
    gap: 6,
  },
  purposeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  purposeItemActive: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  purposeText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  purposeTextActive: {
    color: '#0369a1',
    fontWeight: '800',
  },
  panNotice: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
  },
  panInput: {
    letterSpacing: 2,
    fontWeight: '900',
  },
  bankSelectWrap: {
    gap: 6,
  },
  bankOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f8fafc',
    padding: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bankOptionRowActive: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  bankOptionText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  bankOptionTextActive: {
    color: '#0369a1',
    fontWeight: '800',
  },
  docNoticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  docNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369a1',
  },
  docNoticeDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
    lineHeight: 15,
  },
  docsList: {
    gap: 8,
  },
  docCheckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  docCheckLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  docCheckIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  docCardDesc: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  docVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  docVerifiedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
  },
  disclaimerText: {
    fontSize: 10,
    color: '#64748b',
    lineHeight: 14,
    flex: 1,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  successBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  successDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  refBox: {
    backgroundColor: '#0b1329',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  refBoxLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  refBoxCode: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38bdf8',
    marginVertical: 4,
    letterSpacing: 1,
  },
  refBoxSub: {
    fontSize: 10,
    color: '#94a3b8',
  },
  summaryTable: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLbl: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  helplineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BrandColors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 8,
  },
  helplineBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },
  newAppBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  newAppBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
});
