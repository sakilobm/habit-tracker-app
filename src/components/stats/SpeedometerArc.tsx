import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { HabitStatistics } from '../../types/habit';

interface SpeedometerArcProps {
  stats: HabitStatistics;
}

/**
 * Speedometer Arc Gauge & Progressive Insight Unlock Card
 * (Exact match to Routinr Screenshot 3)
 */
export const SpeedometerArc: React.FC<SpeedometerArcProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      {/* Background Arc Gauge (SVG) */}
      <View style={styles.gaugeContainer}>
        <Svg width={220} height={120} viewBox="0 0 220 120">
          {/* Background blurred arc representing red-yellow-green spectrum */}
          <Path
            d="M 20 110 A 90 90 0 0 1 200 110"
            fill="none"
            stroke="#EEF2FF"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <Path
            d="M 20 110 A 90 90 0 0 1 110 20"
            fill="none"
            stroke="#FCA5A5"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <Path
            d="M 110 20 A 90 90 0 0 1 200 110"
            fill="none"
            stroke="#86EFAC"
            strokeWidth="18"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {/* Floating Insights Milestone Card */}
      <View style={styles.unlockCard}>
        <View style={styles.sparkleBadge}>
          <Ionicons name="sparkles" size={18} color="#6366F1" />
        </View>

        <Text style={styles.unlockTitle}>Your insights are on the way</Text>
        <Text style={styles.unlockSubtitle}>
          {stats.checkInsNeededForInsights > 0
            ? `Check in ${stats.checkInsNeededForInsights} more times to unlock them.`
            : 'Insights unlocked! Full analytics active.'}
        </Text>

        {/* 3-Step Milestone Progress Bar */}
        <View style={styles.stepsRow}>
          {/* Step 1 */}
          <View style={[styles.stepCircle, styles.stepCircleActive]}>
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </View>
          <View style={[styles.stepLine, stats.daysDone >= 2 && styles.stepLineActive]} />

          {/* Step 2 */}
          <View style={[styles.stepCircle, stats.daysDone >= 2 && styles.stepCircleActive]}>
            {stats.daysDone >= 2 ? (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            ) : (
              <Text style={styles.stepNum}>2</Text>
            )}
          </View>
          <View style={[styles.stepLine, stats.daysDone >= 3 && styles.stepLineActive]} />

          {/* Step 3 */}
          <View style={[styles.stepCircle, stats.daysDone >= 3 && styles.stepCircleActive]}>
            {stats.daysDone >= 3 ? (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            ) : (
              <Text style={styles.stepNum}>3</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: -40,
  },
  unlockCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sparkleBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  unlockTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  unlockSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#6366F1',
  },
  stepNum: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#6366F1',
  },
});

