import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { StreakDayItem } from '../../features/stats/hooks/useProgressStats';
import { DiagonalStripeOverlay } from './DiagonalStripeOverlay';

interface ProgressStreakCardProps {
  currentStreak: number;
  streakDays: StreakDayItem[];
}

/**
 * Progress Card 1: Current Streak & 7-Day Ring Strip
 * Matches the top striped card in the Progress reference screen.
 */
export const ProgressStreakCard: React.FC<ProgressStreakCardProps> = ({
  currentStreak,
  streakDays,
}) => {
  const hasStreak = currentStreak > 0;
  const ringR = 16;
  const circ = 2 * Math.PI * ringR;

  return (
    <View style={styles.card}>
      <DiagonalStripeOverlay patternId="streakCardStripes" />

      {/* Top Row: Flame Icon + Streak Count */}
      <View style={styles.topRow}>
        <View style={[styles.iconBadge, hasStreak && styles.iconBadgeActive]}>
          <Ionicons
            name={hasStreak ? 'flame' : 'flame-outline'}
            size={21}
            color={hasStreak ? '#EA580C' : '#64748B'}
          />
        </View>

        <View>
          <View style={styles.valueRow}>
            <Text style={styles.streakNum}>{currentStreak}</Text>
            <Text style={styles.streakUnit}>days</Text>
          </View>
          <Text style={styles.streakLabel}>Current streak</Text>
        </View>
      </View>

      {/* Bottom Row: 7-Day Circular Strip */}
      <View style={styles.daysRow}>
        {streakDays.map((day) => {
          const dashOffset = circ * (1 - day.progress);
          return (
            <View key={day.dateStr} style={styles.dayCol}>
              <Text style={[styles.dayLetter, day.isToday && styles.dayLetterToday]}>
                {day.letter}
              </Text>
              <View style={styles.circleWrap}>
                <Svg width={36} height={36} viewBox="0 0 36 36" style={StyleSheet.absoluteFill}>
                  <Circle
                    cx={18}
                    cy={18}
                    r={ringR}
                    stroke={day.isToday ? '#C7D2FE' : '#E2E5EE'}
                    strokeWidth={1.6}
                    fill={day.isPerfect ? '#7C83FD' : 'transparent'}
                  />
                  {day.progress > 0 && !day.isPerfect && (
                    <Circle
                      cx={18}
                      cy={18}
                      r={ringR}
                      stroke="#7C83FD"
                      strokeWidth={2}
                      strokeDasharray={`${circ}`}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      fill="none"
                      rotation="-90"
                      origin="18, 18"
                    />
                  )}
                </Svg>
                <Text
                  style={[
                    styles.dayNum,
                    day.isToday && styles.dayNumToday,
                    day.isPerfect && styles.dayNumPerfect,
                  ]}
                >
                  {day.dayNumber}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF6',
    overflow: 'hidden',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EFF1F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadgeActive: {
    backgroundColor: '#FFEDD5',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  streakNum: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
  },
  streakUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  streakLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
  },
  dayLetter: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  dayLetterToday: {
    color: '#7C83FD',
    fontWeight: '700',
  },
  circleWrap: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayNum: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  dayNumToday: {
    color: '#7C83FD',
    fontWeight: '700',
  },
  dayNumPerfect: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

