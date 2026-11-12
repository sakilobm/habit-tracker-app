import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CalendarDayItem } from '../../features/stats/hooks/useProgressStats';

interface ProgressMonthCalendarCardProps {
  leadingBlanks: number;
  days: CalendarDayItem[];
  selectedDateStr: string | null;
  onSelectDay: (dateStr: string | null) => void;
}

const WEEKDAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const LEVEL_BG: Record<CalendarDayItem['level'], string> = {
  none: '#D7DAE4',
  some: '#BCC1F9',
  most: '#979EFB',
  all: '#7C83FD',
  future: '#F3F4F8',
};

/**
 * Month Card: Interactive Completion Calendar Grid
 * Color-codes each day of the month (None, Some, Most, All done) with tap-to-inspect details.
 */
export const ProgressMonthCalendarCard: React.FC<ProgressMonthCalendarCardProps> = React.memo(({
  leadingBlanks,
  days,
  selectedDateStr,
  onSelectDay,
}) => {
  const cells: (CalendarDayItem | null)[] = [
    ...Array.from({ length: leadingBlanks }).map(() => null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (CalendarDayItem | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const selectedDay = days.find((d) => d.dateStr === selectedDateStr) || null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Calendar</Text>

      {/* Weekday Headers */}
      <View style={styles.weekHeaderRow}>
        {WEEKDAY_HEADERS.map((letter, idx) => (
          <Text key={`cal-hdr-${idx}`} style={styles.weekHeaderLetter}>
            {letter}
          </Text>
        ))}
      </View>

      {/* Calendar Rows */}
      {weeks.map((week, wIdx) => (
        <View key={`cal-wk-${wIdx}`} style={styles.weekRow}>
          {week.map((day, dIdx) => {
            if (!day) return <View key={`blank-${wIdx}-${dIdx}`} style={styles.dayCellSpacer} />;
            const isSelected = day.dateStr === selectedDateStr;
            const isLightText = day.level === 'all' || day.level === 'most';

            return (
              <TouchableOpacity
                key={day.dateStr}
                style={[
                  styles.dayCell,
                  { backgroundColor: LEVEL_BG[day.level] },
                  day.isToday && styles.dayCellToday,
                  isSelected && styles.dayCellSelected,
                ]}
                onPress={() => !day.isFuture && onSelectDay(day.dateStr)}
                activeOpacity={day.isFuture ? 1 : 0.7}
              >
                <Text
                  style={[
                    styles.dayNum,
                    day.isFuture && styles.dayNumFuture,
                    isLightText && styles.dayNumLight,
                  ]}
                >
                  {day.dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Tap Hint / Selected Day Breakdown */}
      <Text style={styles.tapHint}>
        {selectedDay
          ? `${selectedDay.dateStr}: ${selectedDay.doneCount} of ${selectedDay.dueCount} habits done (${
              selectedDay.dueCount > 0
                ? Math.round((selectedDay.doneCount / selectedDay.dueCount) * 100)
                : 0
            }%)`
          : 'Tap a day to see how it went'}
      </Text>

      {/* Bottom Legend */}
      <View style={styles.legendRow}>
        {[
          { label: 'None', color: '#D7DAE4' },
          { label: 'Some', color: '#BCC1F9' },
          { label: 'Most', color: '#979EFB' },
          { label: 'All done', color: '#7C83FD' },
        ].map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

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
    marginBottom: 14,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekHeaderLetter: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  weekRow: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 7,
  },
  dayCellSpacer: {
    flex: 1,
    aspectRatio: 1.05,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1.05,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCellToday: {
    borderWidth: 1.8,
    borderColor: '#7C83FD',
  },
  dayCellSelected: {
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  dayNum: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  dayNumFuture: {
    color: '#475569',
  },
  dayNumLight: {
    color: '#FFFFFF',
  },
  tapHint: {
    textAlign: 'center',
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 8,
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
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
  legendLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});

