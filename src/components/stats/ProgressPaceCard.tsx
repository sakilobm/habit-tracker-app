import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DiagonalStripeOverlay } from './DiagonalStripeOverlay';

interface ProgressPaceCardProps {
  daysLeftInPeriod: number;
  minPossiblePct: number;
  maxPossiblePct: number;
  previousPeriodPct: number;
  neededToMatchPrev: number;
  remainingCheckIns: number;
  pacePerfectDays: number;
  paceElapsedDays: number;
  leftToday: number;
  periodUnitLabel: string; // e.g. 'this week'
  prevUnitLabel: string;   // e.g. 'Last week'
}

/**
 * Progress Card 3: Pace & Projection Card
 * Displays current pace vs achievable range, previous-period benchmark tick,
 * actionable guidance sentence, and 3 summary sub-tiles.
 */
export const ProgressPaceCard: React.FC<ProgressPaceCardProps> = ({
  daysLeftInPeriod,
  minPossiblePct,
  maxPossiblePct,
  previousPeriodPct,
  neededToMatchPrev,
  remainingCheckIns,
  pacePerfectDays,
  paceElapsedDays,
  leftToday,
  periodUnitLabel,
  prevUnitLabel,
}) => {
  const clampedMin = Math.max(0, Math.min(100, minPossiblePct));
  const clampedMax = Math.max(clampedMin, Math.min(100, maxPossiblePct));
  const clampedPrev = Math.max(0, Math.min(100, previousPeriodPct));

  const guidanceText =
    previousPeriodPct === 0
      ? remainingCheckIns > 0
        ? `Complete ${remainingCheckIns} remaining check-ins to finish strong ${periodUnitLabel}.`
        : `All scheduled check-ins completed ${periodUnitLabel}!`
      : neededToMatchPrev === 0
        ? `You're already matching or ahead of ${prevUnitLabel.toLowerCase()}'s ${previousPeriodPct}%.`
        : `Do ${neededToMatchPrev} of the next ${remainingCheckIns} check-ins to match ${prevUnitLabel.toLowerCase()}'s ${previousPeriodPct}%.`;

  return (
    <View style={styles.card}>
      {/* Header */}
      <Text style={styles.cardTitle}>Pace</Text>
      <Text style={styles.cardSubtitle}>
        {daysLeftInPeriod} {daysLeftInPeriod === 1 ? 'day' : 'days'} left {periodUnitLabel}
      </Text>

      {/* Striped Projection Box */}
      <View style={styles.projectionBox}>
        <DiagonalStripeOverlay patternId="paceBoxStripes" strokeColor="rgba(148,163,184,0.09)" />

        <View style={styles.projectionTopRow}>
          <View>
            <Text style={styles.soFarPct}>{minPossiblePct}%</Text>
            <Text style={styles.soFarLabel}>so far</Text>
          </View>

          <View style={styles.possibleRight}>
            <Text style={styles.possibleRange}>
              {minPossiblePct}%–{maxPossiblePct}%
            </Text>
            <Text style={styles.possibleLabel}>still possible</Text>
          </View>
        </View>

        {/* Horizontal Progress Track with Achievable Span & Benchmark Tick */}
        <View style={styles.trackContainer}>
          <View style={styles.trackBg}>
            {/* Achievable span */}
            <View
              style={[
                styles.achievableSpan,
                {
                  left: `${clampedMin}%`,
                  width: `${Math.max(2, clampedMax - clampedMin)}%`,
                },
              ]}
            />
            {/* Current achieved fill */}
            {clampedMin > 0 && (
              <View style={[styles.achievedFill, { width: `${clampedMin}%` }]} />
            )}
          </View>

          {/* Current dot */}
          <View style={[styles.currentDot, { left: `${clampedMin}%` }]} />

          {/* Previous period benchmark tick */}
          {clampedPrev > 0 && (
            <View style={[styles.benchmarkTick, { left: `${clampedPrev}%` }]} />
          )}
        </View>

        <Text style={styles.benchmarkLabel}>
          {prevUnitLabel} {previousPeriodPct}%
        </Text>
      </View>

      {/* Guidance Sentence */}
      <Text style={styles.guidanceText}>{guidanceText}</Text>

      {/* Bottom 3 Sub-Tiles */}
      <View style={styles.tilesRow}>
        <View style={styles.tile}>
          <Text style={styles.tileValue}>
            {pacePerfectDays} <Text style={styles.tileMuted}>/ {paceElapsedDays}</Text>
          </Text>
          <Text style={styles.tileLabel}>Perfect days</Text>
        </View>

        <View style={styles.tile}>
          <Text style={styles.tileValue}>{leftToday}</Text>
          <Text style={styles.tileLabel}>Left today</Text>
        </View>

        <View style={styles.tile}>
          <Text style={styles.tileValue}>{remainingCheckIns}</Text>
          <Text style={styles.tileLabel}>Still to do</Text>
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
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  projectionBox: {
    backgroundColor: '#F2F3F8',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  projectionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  soFarPct: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 32,
  },
  soFarLabel: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  possibleRight: {
    alignItems: 'flex-end',
  },
  possibleRange: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  possibleLabel: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  trackContainer: {
    height: 18,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 6,
  },
  trackBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E4EC',
    overflow: 'hidden',
    position: 'relative',
  },
  achievableSpan: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#CFD4EB',
    borderRadius: 4,
  },
  achievedFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#7C83FD',
    borderRadius: 4,
  },
  currentDot: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#7C83FD',
    marginLeft: -4,
  },
  benchmarkTick: {
    position: 'absolute',
    width: 2,
    height: 18,
    backgroundColor: '#0F172A',
    borderRadius: 1,
  },
  benchmarkLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  guidanceText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 19,
    marginBottom: 16,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    backgroundColor: '#F2F3F7',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tileValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  tileMuted: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});

