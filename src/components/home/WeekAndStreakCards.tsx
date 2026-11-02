import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeekAndStreakCardsProps {
  weekAverage: number; // e.g. 33
  streakDays: number;  // e.g. 0
  streakTarget: number; // e.g. 3
}

/**
 * Week Progress & Streak Double Cards (Exact match to Routinr Home Screen)
 * Displays 7 slanted capsule bars for weekly average and streak momentum.
 */
export const WeekAndStreakCards: React.FC<WeekAndStreakCardsProps> = ({
  weekAverage,
  streakDays,
  streakTarget = 3,
}) => {
  const bars = [0, 1, 2, 3, 4, 5, 6];
  const activeWeekBars = Math.round((weekAverage / 100) * 7);

  return (
    <View style={styles.container}>
      {/* Left Card: This Week */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="trending-up-outline" size={16} color="#10B981" />
          <Text style={styles.headerTitle}>This week</Text>
        </View>

        {/* 7 Slanted Bars */}
        <View style={styles.barsRow}>
          {bars.map((idx) => {
            const isFilled = idx < activeWeekBars;
            return (
              <View
                key={idx}
                style={[
                  styles.slantedBar,
                  isFilled ? styles.barGreenFilled : styles.barPending,
                ]}
              />
            );
          })}
        </View>

        <Text style={styles.footerLabel}>
          <Text style={styles.boldText}>{Math.round(weekAverage)}%</Text> average
        </Text>
      </View>

      {/* Right Card: Streak */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="flame" size={16} color="#F59E0B" />
          <Text style={styles.headerTitle}>Streak</Text>
        </View>

        {/* 7 Slanted Peach Bars */}
        <View style={styles.barsRow}>
          {bars.map((idx) => {
            const isFilled = idx < streakDays;
            return (
              <View
                key={idx}
                style={[
                  styles.slantedBar,
                  isFilled ? styles.barAmberFilled : styles.barPeachPending,
                ]}
              />
            );
          })}
        </View>

        <Text style={styles.footerLabel}>
          <Text style={styles.boldText}>{streakDays}</Text> of {streakTarget} days
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  slantedBar: {
    width: 10,
    height: 22,
    borderRadius: 5,
    transform: [{ skewX: '-16deg' }],
  },
  barGreenFilled: {
    backgroundColor: '#86EFAC', // Soft pastel green matching screenshot 2
  },
  barPending: {
    backgroundColor: '#EEF2F6',
  },
  barAmberFilled: {
    backgroundColor: '#FBBF24',
  },
  barPeachPending: {
    backgroundColor: '#FFEDD5', // Soft peach matching screenshot
  },
  footerLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  boldText: {
    color: '#0F172A',
    fontWeight: '800',
  },
});

