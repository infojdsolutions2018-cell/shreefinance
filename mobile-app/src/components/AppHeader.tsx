import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';
import { HamburgerMenu } from '@/components/HamburgerMenu';

interface AppHeaderProps {
  onOpenApply?: () => void;
  onOpenCibil?: () => void;
  onSelectLoan?: (loanType: string) => void;
  selectedCity?: string;
  onOpenCityPicker?: () => void;
}

export function AppHeader({
  onOpenApply,
  onOpenCibil,
  onSelectLoan,
  selectedCity = 'Pune, MH',
  onOpenCityPicker,
}: AppHeaderProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleCall = () => {
    Linking.openURL('tel:+918830434945');
  };

  return (
    <>
      <View style={styles.header}>
        {/* Brand Section */}
        <View style={styles.brandRow}>
          {/* Left: Hamburger Menu Button & Logo */}
          <View style={styles.leftGroup}>
            <TouchableOpacity
              style={styles.hamburgerBtn}
              onPress={() => setMenuVisible(true)}
              activeOpacity={0.7}
              accessibilityLabel="Open Navigation Menu"
            >
              <Ionicons name="menu" size={22} color="#0f172a" />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/shreelogobg.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Right Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={12} color="#ffffff" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>

            {onOpenCibil && (
              <TouchableOpacity
                style={styles.cibilButton}
                onPress={onOpenCibil}
                activeOpacity={0.8}
              >
                <Ionicons name="flash" size={11} color={BrandColors.primary} />
                <Text style={styles.cibilButtonText}>CIBIL</Text>
              </TouchableOpacity>
            )}

            {onOpenApply && (
              <TouchableOpacity
                style={styles.applyButton}
                onPress={onOpenApply}
                activeOpacity={0.8}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Location & Partner Banks Sub-Bar (Urban Money Style) */}
        <View style={styles.subBarRow}>
          <TouchableOpacity
            style={styles.cityPill}
            onPress={onOpenCityPicker}
            activeOpacity={0.75}
          >
            <Ionicons name="location-sharp" size={13} color={BrandColors.primary} />
            <Text style={styles.cityText} numberOfLines={1}>
              {selectedCity}
            </Text>
            <Ionicons name="chevron-down" size={12} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.liveAdvisorBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveAdvisorText}>Senior Underwriters Active</Text>
          </View>
        </View>
      </View>

      {/* Hamburger Drawer Menu */}
      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelectLoan={onSelectLoan || onOpenApply}
        onOpenCibil={onOpenCibil}
        onOpenApply={onOpenApply}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 6 : 8,
    paddingBottom: 8,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hamburgerBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    height: 34,
    width: 110,
    justifyContent: 'center',
  },
  logoImage: {
    height: '100%',
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0b1329',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cibilButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: BrandColors.primaryBg,
    borderColor: BrandColors.primaryLight,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
  },
  cibilButtonText: {
    color: BrandColors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  applyButton: {
    backgroundColor: BrandColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  subBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
  liveAdvisorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  liveAdvisorText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065f46',
  },
});
