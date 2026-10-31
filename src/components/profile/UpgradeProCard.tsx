import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UpgradeProCardProps {
  onUpgradePress?: () => void;
}

/**
 * Upgrade to Pro Card (Exact match to Routinr Screenshot 5)
 * Gold crown, subtitle, 3-box feature highlights (Unlimited Habits, Advanced Insights, AI Generator), and Go Pro link.
 */
export const UpgradeProCard: React.FC<UpgradeProCardProps> = ({ onUpgradePress }) => {
  return (
    <View style={styles.card}>
      {/* Crown Icon */}
      <View style={styles.crownRow}>
        <Ionicons name="sparkles" size={32} color="#F59E0B" />
      </View>

      <Text style={styles.title}>Upgrade to Premium</Text>
      <Text style={styles.subtitle}>Unlock premium tools to build better habits faster.</Text>

      {/* 3 Pro Feature Boxes */}
      <View style={styles.featureRow}>
        {/* Box 1 */}
        <View style={styles.featureBox}>
          <Text style={styles.featureIcon}>∞</Text>
          <Text style={styles.featureLabel}>Unlimited</Text>
          <Text style={styles.featureSubLabel}>Habits</Text>
        </View>

        {/* Box 2 */}
        <View style={styles.featureBox}>
          <Ionicons name="trending-up-outline" size={18} color="#1E293B" style={styles.boxIcon} />
          <Text style={styles.featureLabel}>Advanced</Text>
          <Text style={styles.featureSubLabel}>Insights</Text>
        </View>

        {/* Box 3 */}
        <View style={styles.featureBox}>
          <Ionicons name="sparkles-outline" size={18} color="#1E293B" style={styles.boxIcon} />
          <Text style={styles.featureLabel}>AI</Text>
          <Text style={styles.featureSubLabel}>Generator</Text>
        </View>
      </View>

      {/* Go Pro CTA */}
      <TouchableOpacity style={styles.ctaButton} onPress={onUpgradePress} activeOpacity={0.8}>
        <Text style={styles.ctaText}>Go pro</Text>
        <Ionicons name="chevron-forward" size={14} color="#6366F1" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  crownRow: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 18,
  },
  featureBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featureIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  boxIcon: {
    marginBottom: 6,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  featureSubLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
});

