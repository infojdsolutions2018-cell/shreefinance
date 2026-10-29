import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';
import { submitLoanApplication } from '@/services/api';
import { useRouter } from 'expo-router';

interface HomeEligibilitySectionProps {
  onSuccess?: (refNo: string) => void;
}

export function HomeEligibilitySection({ onSuccess }: HomeEligibilitySectionProps) {
  const router = useRouter();

  const loanOptions = [
    { id: 'Personal Loan', label: 'Personal Loan', rate: '10.25%*' },
    { id: 'Home Loan', label: 'Home Loan', rate: '8.35%*' },
    { id: 'Car / Vehicle Loan', label: 'Car Loan', rate: '8.75%*' },
    { id: 'Business Loan', label: 'Business Loan', rate: '13.99%*' },
    { id: 'Loan Against Property', label: 'LAP', rate: '9.25%*' },
    { id: 'Education Loan', label: 'Education Loan', rate: '9.50%*' },
  ];

  const [selectedLoan, setSelectedLoan] = useState('Personal Loan');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNo, setReferenceNo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name as per PAN.');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address to receive pre-approval.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your current city or location.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitLoanApplication({
        title: `Direct Bank Facility Eligibility: ${selectedLoan}`,
        applicationHeader: 'Shree Finance Instant Eligibility Request',
        name: name.trim(),
        mobile: mobile.replace(/\D/g, '').slice(0, 10),
        email: email.trim(),
        city: city.trim(),
        loanType: selectedLoan,
        loanPurpose: 'Immediate Financial Requirement / Best Bank Sanction',
      });

      if (res.success) {
        const assignedRef = res.referenceNo || `SHREE-LEAD-${Math.floor(1000 + Math.random() * 9000)}`;
        setReferenceNo(assignedRef);
        setIsSuccess(true);
        if (onSuccess) onSuccess(assignedRef);
      } else {
        setErrorMessage(res.error || 'Failed to check eligibility. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setName('');
    setMobile('');
    setEmail('');
    setCity('');
  };

  return (
    <View style={styles.cardContainer}>
      {/* Background Glow */}
      <View style={styles.ambientGlow} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.sparkleBadge}>
            <Ionicons name="sparkles" size={12} color={BrandColors.primary} />
            <Text style={styles.sparkleBadgeText}>DIRECT BANK PRE-APPROVAL</Text>
          </View>
        </View>

        <Text style={styles.title}>Check Loan Eligibility & Live Offers</Text>
        <Text style={styles.subtitle}>
          Enter your basic details below. We instantly verify 40+ partner banks and email your pre-approved sanction terms!
        </Text>
      </View>

      {isSuccess ? (
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark-circle" size={48} color={BrandColors.primary} />
          </View>

          <View style={styles.successHeader}>
            <View style={styles.preApprovedPill}>
              <Text style={styles.preApprovedPillText}>PRE-APPROVAL EMAIL DISPATCHED</Text>
            </View>
            <Text style={styles.successHeading}>Congratulations, {name || 'Applicant'}!</Text>
            <Text style={styles.successSub}>
              We have verified your profile and sent your <Text style={styles.highlightText}>Eligibility Confirmation & Bank Sanction Link</Text> to <Text style={styles.highlightEmail}>{email}</Text>.
            </Text>
          </View>

          {/* Structured Summary Box */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Application Ref ID:</Text>
              <Text style={styles.summaryValueRef}>#{referenceNo}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Selected Facility:</Text>
              <Text style={styles.summaryValue}>{selectedLoan}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Mobile Contact:</Text>
              <Text style={styles.summaryValue}>+91 {mobile}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>City / Location:</Text>
              <Text style={styles.summaryValue}>{city}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Partner Banks:</Text>
              <Text style={styles.summaryValueGreen}>SBI, HDFC, ICICI, YES Bank</Text>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.successActionsRow}>
            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() => router.push('/application' as any)}
              activeOpacity={0.85}
            >
              <Ionicons name="search" size={14} color="#ffffff" />
              <Text style={styles.trackBtnText}>Track Application</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.anotherBtn}
              onPress={handleReset}
              activeOpacity={0.85}
            >
              <Text style={styles.anotherBtnText}>Check Another</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.underwriterCallout}>
            <Ionicons name="shield-checkmark" size={16} color={BrandColors.primary} />
            <Text style={styles.underwriterText}>
              A senior loan officer will call you shortly on +91 {mobile} to assist with zero-paperwork disbursal.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.formContainer}>
          {/* 1. Loan Facility Selector Pills */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Select Loan Facility *</Text>
            <View style={styles.loanChipsGrid}>
              {loanOptions.map((opt) => {
                const isSelected = selectedLoan === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.loanChip,
                      isSelected && styles.loanChipSelected,
                    ]}
                    onPress={() => setSelectedLoan(opt.id)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.loanChipLabel,
                        isSelected && styles.loanChipLabelSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={[
                        styles.loanChipRate,
                        isSelected && styles.loanChipRateSelected,
                      ]}
                    >
                      {opt.rate}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 2. Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Full Name (As per PAN Card) *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={16} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* 3. 10-Digit Mobile */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>10-Digit Mobile Number *</Text>
            <View style={styles.inputWrap}>
              <View style={styles.prefixBadge}>
                <Text style={styles.prefixText}>+91</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Mobile number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={(val) => setMobile(val.replace(/\D/g, '').slice(0, 10))}
              />
            </View>
          </View>

          {/* 4. Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>Email Address (For Instant Pre-Approval Link) *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={16} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="yourname@gmail.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* 5. City / Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.fieldLabel}>City / Location *</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={16} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Pune, Mumbai, Delhi, Bengaluru"
                placeholderTextColor="#94a3b8"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          {/* Error Message Alert */}
          {errorMessage && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#e11d48" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <View style={styles.submittingRow}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.submitBtnText}>Checking 40+ Partner Banks...</Text>
              </View>
            ) : (
              <View style={styles.submittingRow}>
                <Ionicons name="sparkles" size={16} color="#ffffff" />
                <Text style={styles.submitBtnText}>Check Eligibility & Get Loan Link 🚀</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Trust Guarantees */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={13} color={BrandColors.primary} />
              <Text style={styles.trustText}>100% Confidential • Zero CIBIL Impact</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="flash" size={13} color="#f59e0b" />
              <Text style={styles.trustText}>Instant Email Delivery</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
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
    position: 'relative',
    overflow: 'hidden',
  },
  ambientGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(2, 132, 199, 0.06)',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 14,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sparkleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sparkleBadgeText: {
    fontSize: 10,
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
    marginTop: 4,
    lineHeight: 16,
  },
  formContainer: {
    gap: 12,
  },
  inputGroup: {
    gap: 5,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  loanChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  loanChip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    minWidth: '31%',
    flexGrow: 1,
  },
  loanChipSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: BrandColors.primary,
  },
  loanChipLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  loanChipLabelSelected: {
    color: BrandColors.primary,
  },
  loanChipRate: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 1,
  },
  loanChipRateSelected: {
    color: BrandColors.primaryDark,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  prefixBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  prefixText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  errorText: {
    color: '#e11d48',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  submitButton: {
    backgroundColor: BrandColors.primary,
    borderRadius: 16,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: BrandColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 6,
    flexWrap: 'wrap',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f9ff',
    borderWidth: 2,
    borderColor: BrandColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  preApprovedPill: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  preApprovedPillText: {
    color: '#b45309',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  successHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
  },
  successSub: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  highlightText: {
    color: '#0f172a',
    fontWeight: '800',
  },
  highlightEmail: {
    color: BrandColors.primary,
    fontWeight: '800',
  },
  summaryBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    gap: 8,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
  },
  summaryValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '800',
  },
  summaryValueRef: {
    fontSize: 12,
    color: BrandColors.primary,
    fontWeight: '900',
  },
  summaryValueGreen: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '800',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 2,
  },
  successActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 12,
  },
  trackBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: BrandColors.primary,
    borderRadius: 14,
    height: 44,
  },
  trackBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  anotherBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 14,
    height: 44,
  },
  anotherBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
  },
  underwriterCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    width: '100%',
  },
  underwriterText: {
    fontSize: 11,
    color: '#0369a1',
    fontWeight: '600',
    flex: 1,
    lineHeight: 15,
  },
});
