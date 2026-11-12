import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  BounceBackData,
  WeekdayBarItem,
  RankedHabitItem,
} from '../../features/stats/hooks/useProgressStats';
import { HabitWithStatus } from '../../types/habit';
import { BeautifulHabitIcon } from '../home/BeautifulHabitIcon';

/**
 * Month Card: Bounce Back (Miss recovery & slump length breakdown)
 */
export const ProgressBounceBackCard: React.FC<{ bounceBack: BounceBackData }> = React.memo(
  ({ bounceBack }) => {
    const maxSlumpCount = Math.max(
      1,
      bounceBack.slump1Day,
      bounceBack.slump2Day,
      bounceBack.slump3PlusDay
    );

    const slumpRows = [
      { label: '1 day', count: bounceBack.slump1Day, color: '#15803D' },
      { label: '2 days', count: bounceBack.slump2Day, color: '#F59E0B' },
      { label: '3+ days', count: bounceBack.slump3PlusDay, color: '#C83228' },
    ];

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bounce back</Text>
        <Text style={styles.cardSubtitle}>What happened after a miss</Text>

        <View style={styles.recoveryRow}>
          <Text style={styles.recoveryPct}>{bounceBack.recoveryPct}%</Text>
          <Text style={styles.recoveryDesc}>
            of misses were followed by a done day — {bounceBack.recoveredCount} of{' '}
            {bounceBack.totalMisses}
          </Text>
        </View>

        <View style={styles.tilesRow}>
          <View style={styles.tile}>
            <Text style={styles.tileValue}>{bounceBack.missedTwice}</Text>
            <Text style={styles.tileLabel}>Missed twice</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileValue}>
              {bounceBack.avgSlumpDays} <Text style={styles.tileMuted}>days</Text>
            </Text>
            <Text style={styles.tileLabel}>Avg slump</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileValue}>
              {bounceBack.longestSlumpDays} <Text style={styles.tileMuted}>days</Text>
            </Text>
            <Text style={styles.tileLabel}>Longest</Text>
          </View>
        </View>

        <Text style={styles.slumpHeader}>Slumps by length</Text>
        {slumpRows.map((row) => {
          const widthPct = row.count > 0 ? Math.max(12, Math.round((row.count / maxSlumpCount) * 100)) : 0;
          return (
            <View key={row.label} style={styles.slumpRow}>
              <Text style={styles.slumpLabel}>{row.label}</Text>
              <View style={styles.slumpTrack}>
                {widthPct > 0 && (
                  <View style={[styles.slumpFill, { width: `${widthPct}%`, backgroundColor: row.color }]} />
                )}
              </View>
              <Text style={styles.slumpCount}>{row.count}</Text>
            </View>
          );
        })}
      </View>
    );
  }
);

/**
 * Month Card: By Weekday Vertical Bars
 */
export const ProgressByWeekdayCard: React.FC<{
  bars: WeekdayBarItem[];
  summary: string;
}> = React.memo(({ bars, summary }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>By weekday</Text>
    <Text style={styles.cardSubtitle}>{summary}</Text>

    <View style={styles.wdRow}>
      {bars.map((b) => (
        <View key={b.label} style={styles.wdCol}>
          <Text style={[styles.wdPct, b.isBest && styles.wdPctBest]}>{b.percentage}%</Text>
          <View style={styles.wdTrack}>
            {b.percentage > 0 && (
              <View style={[styles.wdFill, { height: `${Math.max(8, b.percentage)}%` }]} />
            )}
          </View>
          <Text style={[styles.wdLabel, b.isBest && styles.wdLabelBest]}>{b.label}</Text>
        </View>
      ))}
    </View>
  </View>
));

/**
 * Month Card: Sortable Habits Ranked Progress List
 */
export const ProgressHabitsRankedCard: React.FC<{
  items: RankedHabitItem[];
  sortAsc: boolean;
  onToggleSort: () => void;
  onPressHabit: (habit: HabitWithStatus) => void;
}> = React.memo(({ items, sortAsc, onToggleSort, onPressHabit }) => (
  <View style={styles.card}>
    <View style={styles.rankedHeader}>
      <Text style={styles.cardTitle}>Habits</Text>
      <TouchableOpacity style={styles.sortPill} onPress={onToggleSort} activeOpacity={0.75}>
        <Ionicons name="options-outline" size={14} color="#7C83FD" />
        <Text style={styles.sortText}>{sortAsc ? 'Needs work' : 'Best'}</Text>
      </TouchableOpacity>
    </View>

    {items.map(({ habit, doneCount, dueCount, percentage }) => (
      <TouchableOpacity
        key={habit.id}
        style={styles.rankedRow}
        onPress={() => onPressHabit(habit)}
        activeOpacity={0.78}
      >
        <BeautifulHabitIcon icon={habit.icon} title={habit.title} size={40} />

        <View style={styles.rankedMiddle}>
          <View style={styles.rankedTopLine}>
            <Text style={styles.rankedTitle} numberOfLines={1}>
              {habit.title}
            </Text>
            <Text style={styles.rankedPct}>{percentage}%</Text>
          </View>

          <View style={styles.rankedTrack}>
            {percentage > 0 && (
              <View style={[styles.rankedFill, { width: `${Math.max(4, percentage)}%` }]} />
            )}
          </View>

          <Text style={styles.rankedSub}>
            {doneCount} of {dueCount} done
          </Text>
        </View>
      </TouchableOpacity>
    ))}
  </View>
));

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
  cardTitle: { fontSize: 16.5, fontWeight: '700', color: '#0F172A' },
  cardSubtitle: { fontSize: 13, fontWeight: '500', color: '#64748B', marginTop: 2, marginBottom: 14 },
  recoveryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  recoveryPct: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  recoveryDesc: { flex: 1, fontSize: 13.5, fontWeight: '500', color: '#475569', lineHeight: 19 },
  tilesRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  tile: { flex: 1, backgroundColor: '#F2F3F7', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 12 },
  tileValue: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 3 },
  tileMuted: { fontSize: 13, fontWeight: '500', color: '#64748B' },
  tileLabel: { fontSize: 12, fontWeight: '500', color: '#64748B' },
  slumpHeader: { fontSize: 13.5, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  slumpRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 9, gap: 10 },
  slumpLabel: { width: 52, fontSize: 12.5, fontWeight: '500', color: '#64748B' },
  slumpTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#EFEFF5', overflow: 'hidden' },
  slumpFill: { height: '100%', borderRadius: 4 },
  slumpCount: { width: 22, textAlign: 'right', fontSize: 13.5, fontWeight: '700', color: '#0F172A' },
  wdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  wdCol: { flex: 1, alignItems: 'center' },
  wdPct: { fontSize: 12.5, fontWeight: '600', color: '#64748B', marginBottom: 8 },
  wdPctBest: { color: '#7C83FD', fontWeight: '700' },
  wdTrack: {
    width: 16,
    height: 108,
    borderRadius: 8,
    backgroundColor: '#EFEFF5',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  wdFill: { width: '100%', borderRadius: 8, backgroundColor: '#7C83FD' },
  wdLabel: { fontSize: 12, fontWeight: '500', color: '#64748B' },
  wdLabelBest: { color: '#7C83FD', fontWeight: '700' },
  rankedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F2FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  sortText: { fontSize: 12.5, fontWeight: '600', color: '#7C83FD' },
  rankedRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  rankedMiddle: { flex: 1, marginLeft: 12 },
  rankedTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rankedTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#0F172A', marginRight: 8 },
  rankedPct: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  rankedTrack: { height: 7, borderRadius: 3.5, backgroundColor: '#ECEEF5', overflow: 'hidden', marginBottom: 5 },
  rankedFill: { height: '100%', borderRadius: 3.5, backgroundColor: '#7C83FD' },
  rankedSub: { fontSize: 12, fontWeight: '500', color: '#64748B' },
});

