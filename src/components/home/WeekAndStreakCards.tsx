import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, Pattern, Line, Rect } from 'react-native-svg';

interface WeekAndStreakCardsProps {
  weekAverage: number; // e.g. 22
  streakDays: number;  // e.g. 0
  streakTarget: number; // e.g. 3
}

/**
 * Week Progress & Streak Split Panel (Exact match to Routinr Home Screen)
 * Displays two halves divided by a hairline separator inside the top analytics sheet,
 * with 7 slanted capsule bars (including subtle diagonal stripe texture on active week bars).
 */
export const WeekAndStreakCards: React.FC<WeekAndStreakCardsProps> = ({
  weekAverage,
  streakDays,
  streakTarget = 3,
}) => {
  const bars = [0, 1, 2, 3, 4, 5, 6];
  const activeWeekBars = Math.max(weekAverage > 0 ? 1 : 0, Math.round((weekAverage / 100) * 7));

  return (
    <View style={styles.container}>
      {/* Left Half: This week */}
      <View style={styles.halfColumn}>
        <View style={styles.headerRow}>
          <Ionicons name="analytics-outline" size={15} color="#16A34A" />
          <Text style={styles.headerTitle}>This week</Text>
        </View>

        {/* 7 Slanted Bars */}
        <View style={styles.barsRow}>
          {bars.map((idx) => {
            const isFilled = idx < activeWeekBars;
            const isSoftGreen = !isFilled && weekAverage > 0 && idx < activeWeekBars + 2;

            return (
              <View
                key={idx}
                style={[
                  styles.slantedBar,
                  isFilled
                    ? styles.barGreenFilled
                    : isSoftGreen
                      ? styles.barGreenSoft
                      : styles.barPending,
                ]}
              >
                {isFilled && (
                  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                    <Defs>
                      <Pattern
                        id={`weekStripe-${idx}`}
                        width="6"
                        height="6"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(35)"
                      >
                        <Line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="6"
                          stroke="rgba(255,255,255,0.28)"
                          strokeWidth="2"
                        />
                      </Pattern>
                    </Defs>
                    <Rect width="100%" height="100%" fill={`url(#weekStripe-${idx})`} />
                  </Svg>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.footerLabel}>
          <Text style={styles.boldText}>{Math.round(weekAverage)}%</Text> average
        </Text>
      </View>

      {/* Hairline Vertical Divider */}
      <View style={styles.verticalDivider} />

      {/* Right Half: Streak */}
      <View style={styles.halfColumn}>
        <View style={styles.headerRow}>
          <Ionicons name="flame" size={15} color="#C25E28" />
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
    alignItems: 'stretch',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 16,
  },
  halfColumn: {
    flex: 1,
    paddingHorizontal: 6,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#EDF0F6',
    marginVertical: 6,
    marginHorizontal: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 6,
    marginBottom: 10,
  },
  slantedBar: {
    width: 14,
    height: 22,
    borderRadius: 4.5,
    transform: [{ skewX: '-14deg' }],
    overflow: 'hidden',
  },
  barGreenFilled: {
    backgroundColor: '#4BA872',
  },
  barGreenSoft: {
    backgroundColor: '#DFEFE4',
  },
  barPending: {
    backgroundColor: '#E5E8EF',
  },
  barAmberFilled: {
    backgroundColor: '#F59E0B',
  },
  barPeachPending: {
    backgroundColor: '#F7EADF',
  },
  footerLabel: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  boldText: {
    fontSize: 17,
    color: '#0F172A',
    fontWeight: '800',
  },
});
