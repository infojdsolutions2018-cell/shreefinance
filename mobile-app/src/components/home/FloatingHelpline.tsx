import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandColors } from '@/constants/theme';

interface FloatingHelplineProps {
  onOpenApply: () => void;
  onOpenCibil: () => void;
}

export function FloatingHelpline({ onOpenApply, onOpenCibil }: FloatingHelplineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCall = () => {
    Linking.openURL('tel:+918830434945');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/918830434945?text=Hello%20Shree%20Finance,%20I%20want%20to%20check%20my%20loan%20eligibility');
  };

  return (
    <View style={styles.floatingContainer} pointerEvents="box-none">
      {!isExpanded ? (
        <TouchableOpacity
          style={styles.pillButton}
          onPress={() => setIsExpanded(true)}
          activeOpacity={0.85}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="call" size={13} color="#ffffff" />
          </View>
          <View style={styles.pillTextCol}>
            <Text style={styles.pillTitle}>Direct Bank Sanction</Text>
            <Text style={styles.pillSub}>40+ Banks • Call or Apply</Text>
          </View>
          <Ionicons name="chevron-up" size={14} color="#38bdf8" />
        </TouchableOpacity>
      ) : (
        <View style={styles.expandedMenu}>
          <View style={styles.menuHeader}>
            <View style={styles.menuHeaderLeft}>
              <View style={styles.pulseDot} />
              <Text style={styles.menuTitle}>Fast Loan Assistance</Text>
            </View>
            <TouchableOpacity onPress={() => setIsExpanded(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionItem} onPress={handleCall} activeOpacity={0.8}>
              <View style={[styles.actionIconBg, { backgroundColor: '#0284c7' }]}>
                <Ionicons name="call" size={16} color="#ffffff" />
              </View>
              <Text style={styles.actionLabel}>Call Officer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={handleWhatsApp} activeOpacity={0.8}>
              <View style={[styles.actionIconBg, { backgroundColor: '#10b981' }]}>
                <Ionicons name="logo-whatsapp" size={16} color="#ffffff" />
              </View>
              <Text style={styles.actionLabel}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={onOpenApply} activeOpacity={0.8}>
              <View style={[styles.actionIconBg, { backgroundColor: '#0b1329' }]}>
                <Ionicons name="document-text" size={16} color="#38bdf8" />
              </View>
              <Text style={styles.actionLabel}>Apply Loan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={onOpenCibil} activeOpacity={0.8}>
              <View style={[styles.actionIconBg, { backgroundColor: '#f59e0b' }]}>
                <Ionicons name="flash" size={16} color="#ffffff" />
              </View>
              <Text style={styles.actionLabel}>Free CIBIL</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 98 : 74,
    left: 16,
    right: 16,
    zIndex: 999,
    alignItems: 'center',
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b1329',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: BrandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTextCol: {
    flex: 1,
  },
  pillTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },
  pillSub: {
    fontSize: 9,
    color: '#38bdf8',
    fontWeight: '700',
  },
  expandedMenu: {
    backgroundColor: '#0b1329',
    borderRadius: 22,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    gap: 12,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: 8,
  },
  menuHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  menuTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#cbd5e1',
  },
});
