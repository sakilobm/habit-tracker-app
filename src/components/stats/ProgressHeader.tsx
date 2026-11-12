import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressPeriod } from '../../features/stats/hooks/useProgressStats';

interface ProgressHeaderProps {
  period: ProgressPeriod;
  periodLabel: string;
  canGoNext: boolean;
  onSelectPeriod: (period: ProgressPeriod) => void;
  onStepPeriod: (delta: number) => void;
}

const PERIOD_TABS: { key: ProgressPeriod; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

/**
 * Progress Tab Header
 * Displays "Progress" title, active period subtitle, < / > period steppers,
 * and Week / Month / Year underline tabs matching the reference layout.
 */
export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  period,
  periodLabel,
  canGoNext,
  onSelectPeriod,
  onStepPeriod,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
      {/* Title Row */}
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>{periodLabel}</Text>
        </View>

        <View style={styles.chevronRow}>
          <TouchableOpacity
            style={styles.chevronBtn}
            onPress={() => onStepPeriod(-1)}
            activeOpacity={0.65}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chevronBtn}
            onPress={() => canGoNext && onStepPeriod(1)}
            disabled={!canGoNext}
            activeOpacity={0.65}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={canGoNext ? '#0F172A' : '#CBD5E1'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Week | Month | Year Underline Tabs */}
      <View style={styles.tabsRow}>
        {PERIOD_TABS.map((tab) => {
          const isActive = period === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => onSelectPeriod(tab.key)}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF6',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  chevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  chevronBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 14.5,
    fontWeight: '500',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    width: '78%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#7C83FD',
  },
});

