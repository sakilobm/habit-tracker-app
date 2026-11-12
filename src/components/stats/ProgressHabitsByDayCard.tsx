import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HabitWithStatus } from '../../types/habit';
import { HabitDayCellStatus, HabitMatrixRow } from '../../features/stats/hooks/useProgressStats';
import { BeautifulHabitIcon } from '../home/BeautifulHabitIcon';

interface ProgressHabitsByDayCardProps {
  headers: { letter: string; isToday: boolean }[];
  rows: HabitMatrixRow[];
  onPressHabit: (habit: HabitWithStatus) => void;
}

const CELL_STYLES: Record<HabitDayCellStatus, object> = {
  done: { backgroundColor: '#7C83FD' },
  missed: { backgroundColor: '#D6D9E4' },
  skipped: { backgroundColor: '#FFFFFF', borderWidth: 1.3, borderColor: '#CBD5E1' },
  not_due: { backgroundColor: '#F1F2F6' },
  today_pending: { backgroundColor: '#FFFFFF', borderWidth: 1.6, borderColor: '#7C83FD' },
};

/**
 * Progress Card 5: Habits by Day Status Matrix
 * Shows per-habit 7-day capsule pills (Done, Missed, Skipped, Not due, Today pending)
 * with period completion percentage and legend.
 */
export const ProgressHabitsByDayCard: React.FC<ProgressHabitsByDayCardProps> = ({
  headers,
  rows,
  onPressHabit,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Habits by day</Text>

      {/* Column Header Letters (M T W T F S S) */}
      <View style={styles.matrixHeaderRow}>
        <View style={styles.iconSpacer} />
        <View style={styles.lettersRow}>
          {headers.map((h, i) => (
            <Text
              key={`hdr-${i}`}
              style={[styles.headerLetter, h.isToday && styles.headerLetterToday]}
            >
              {h.letter}
            </Text>
          ))}
        </View>
        <View style={styles.pctSpacer} />
      </View>

      {/* Habit Rows */}
      {rows.map(({ habit, percentage, cells }) => (
        <TouchableOpacity
          key={habit.id}
          style={styles.habitRow}
          onPress={() => onPressHabit(habit)}
          activeOpacity={0.78}
        >
          <BeautifulHabitIcon icon={habit.icon} title={habit.title} size={38} />

          <View style={styles.middleCol}>
            <Text style={styles.habitTitle} numberOfLines={1}>
              {habit.title}
            </Text>
            <View style={styles.pillsRow}>
              {cells.map((cell, idx) => (
                <View
                  key={`${habit.id}-${idx}`}
                  style={[styles.statusPill, CELL_STYLES[cell.status]]}
                />
              ))}
            </View>
          </View>

          <Text style={styles.pctText}>{percentage}%</Text>
        </TouchableOpacity>
      ))}

      {/* Bottom Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#7C83FD' }]} />
          <Text style={styles.legendLabel}>Done</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#D6D9E4' }]} />
          <Text style={styles.legendLabel}>Missed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotOutlined]} />
          <Text style={styles.legendLabel}>Skipped</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F1F2F6' }]} />
          <Text style={styles.legendLabel}>Not due</Text>
        </View>
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
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1.5,
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  matrixHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconSpacer: {
    width: 50,
  },
  lettersRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  headerLetter: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  headerLetterToday: {
    color: '#7C83FD',
    fontWeight: '800',
  },
  pctSpacer: {
    width: 44,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  middleCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  habitTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  statusPill: {
    flex: 1,
    height: 11,
    borderRadius: 5.5,
  },
  pctText: {
    width: 38,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
    paddingTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  legendDotOutlined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3,
    borderColor: '#CBD5E1',
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});

