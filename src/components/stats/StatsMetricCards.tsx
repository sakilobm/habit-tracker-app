import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HabitStatistics } from '../../types/habit';

interface StatsMetricCardsProps {
  stats: HabitStatistics;
}

/**
 * 2x2 Metric Cards Grid (Exact match to Routinr Screenshot 1)
 * Displays Consistency %, Days done, Days missed, and Best run.
 */
export const StatsMetricCards: React.FC<StatsMetricCardsProps> = ({ stats }) => {
  return (
    <View style={styles.gridContainer}>
      {/* Row 1 */}
      <View style={styles.row}>
        {/* Consistency */}
        <View style={styles.tile}>
          <Text style={styles.tileLabel}>Consistency</Text>
          <Text style={styles.tileValue}>{stats.consistencyPercentage}%</Text>
        </View>

        {/* Days done */}
        <View style={styles.tile}>
          <Text style={styles.tileLabel}>Days done</Text>
          <Text style={styles.tileValue}>
            {stats.daysDone} <Text style={styles.tileValueSub}>of {stats.totalDays}</Text>
          </Text>
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.row}>
        {/* Days missed */}
        <View style={styles.tile}>
          <Text style={styles.tileLabel}>Days missed</Text>
          <Text style={styles.tileValue}>{stats.daysMissed}</Text>
        </View>

        {/* Best run */}
        <View style={styles.tile}>
          <Text style={styles.tileLabel}>Best run</Text>
          <Text style={styles.tileValue}>
            {stats.bestRun} <Text style={styles.tileValueSub}>{stats.bestRun === 1 ? 'day' : 'days'}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    gap: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  tileLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  tileValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  tileValueSub: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
});

