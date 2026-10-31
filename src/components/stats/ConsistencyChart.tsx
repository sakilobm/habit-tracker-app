import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HabitStatistics } from '../../types/habit';

interface ConsistencyChartProps {
  stats: HabitStatistics;
}

/**
 * Consistency Vertical Bar Chart (Matching Routinr Screenshot 1)
 * Shows daily completion bars and date markers (12, 14, 16... 30).
 */
export const ConsistencyChart: React.FC<ConsistencyChartProps> = ({ stats }) => {
  const visibleDays = stats.dailyHistory.slice(-14);

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {visibleDays.map((item, index) => {
          const isLabeled = item.dayNumber % 2 === 0;

          return (
            <View key={index} style={styles.barCol}>
              <View style={styles.track}>
                {item.completed ? (
                  <View style={styles.barFill} />
                ) : (
                  <View style={styles.dashLine} />
                )}
              </View>
              <Text style={[styles.dateLabel, !isLabeled && styles.invisibleLabel]}>
                {isLabeled ? item.dayNumber : ''}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingBottom: 4,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  track: {
    flex: 1,
    width: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    height: '90%',
    backgroundColor: '#6366F1', // Lavender indigo bar from screenshot
    borderRadius: 4,
  },
  dashLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#E2E8F0',
    position: 'absolute',
    bottom: 0,
  },
  dateLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  invisibleLabel: {
    opacity: 0,
  },
});

