import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HabitMapPoint } from '../../features/stats/hooks/useProgressStats';

interface ProgressHabitMapCardProps {
  points: HabitMapPoint[];
}

const QUADRANT_META = [
  { key: 'rising', label: 'Rising', color: '#2563EB' },
  { key: 'thriving', label: 'Thriving', color: '#15803D' },
  { key: 'needs_love', label: 'Needs love', color: '#B91C1C' },
  { key: 'slipping', label: 'Slipping', color: '#B45309' },
] as const;

/**
 * Month Card: 4-Quadrant Habit Map Scatter Plot
 * Plots each habit by completion % (X-axis) and delta vs last month (Y-axis).
 */
export const ProgressHabitMapCard: React.FC<ProgressHabitMapCardProps> = React.memo(({ points }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Habit map</Text>
      <Text style={styles.cardSubtitle}>
        Completion across, change since last month up and down
      </Text>

      {/* Quadrant Plot */}
      <View style={styles.plotArea}>
        <View style={styles.crosshairH} />
        <View style={styles.crosshairV} />

        <Text style={[styles.quadLabel, styles.quadTopLeft, { color: '#2563EB' }]}>Rising</Text>
        <Text style={[styles.quadLabel, styles.quadTopRight, { color: '#15803D' }]}>Thriving</Text>
        <Text style={[styles.quadLabel, styles.quadBottomLeft, { color: '#B91C1C' }]}>Needs love</Text>
        <Text style={[styles.quadLabel, styles.quadBottomRight, { color: '#B45309' }]}>Slipping</Text>

        {points.map((pt, idx) => {
          const leftPct = Math.max(4, Math.min(94, pt.completionPct));
          const clampedDelta = Math.max(-50, Math.min(50, pt.deltaPct));
          const topPct = 50 - (clampedDelta / 50) * 42;
          // Slight horizontal stagger if multiple dots share exact coordinates
          const offsetPx = (idx % 3) * 4;

          return (
            <View
              key={pt.habit.id}
              style={[
                styles.plotDot,
                {
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  marginLeft: -7 + offsetPx,
                  marginTop: -7,
                },
              ]}
            />
          );
        })}
      </View>

      {/* X-axis Legend */}
      <View style={styles.axisRow}>
        <Text style={styles.axisText}>0%</Text>
        <Text style={styles.axisText}>Completion</Text>
        <Text style={styles.axisText}>100%</Text>
      </View>

      {/* 2x2 Quadrant Summary Tiles */}
      <View style={styles.tilesGrid}>
        {QUADRANT_META.map((q) => {
          const matching = points.filter((p) => p.quadrant === q.key);
          const names =
            matching.length > 0 ? matching.map((m) => m.habit.title).join(', ') : 'None';
          return (
            <View key={q.key} style={styles.quadTile}>
              <View style={styles.quadTileHeader}>
                <View style={styles.quadTileLeft}>
                  <View style={[styles.quadDot, { backgroundColor: q.color }]} />
                  <Text style={styles.quadTileTitle}>{q.label}</Text>
                </View>
                <Text style={styles.quadTileCount}>{matching.length}</Text>
              </View>
              <Text style={styles.quadTileNames} numberOfLines={2}>
                {names}
              </Text>
            </View>
          );
        })}
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
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  plotArea: {
    height: 220,
    position: 'relative',
    marginBottom: 8,
  },
  crosshairH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: '#E2E5EE',
  },
  crosshairV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: '#E2E5EE',
  },
  quadLabel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '600',
  },
  quadTopLeft: { top: 8, left: 6 },
  quadTopRight: { top: 8, right: 6 },
  quadBottomLeft: { bottom: 8, left: 6 },
  quadBottomRight: { bottom: 8, right: 6 },
  plotDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#7C83FD',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  axisText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quadTile: {
    width: '48.2%',
    backgroundColor: '#F2F3F7',
    borderRadius: 16,
    padding: 12,
  },
  quadTileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  quadTileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  quadTileTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  quadTileCount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  quadTileNames: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 16,
  },
});
