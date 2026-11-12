import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

interface ProgressCompletionCardProps {
  completionPct: number;
  completedCheckIns: number;
  elapsedDueCheckIns: number;
  statusHeadline: string;
  deltaPts: number;
  hasPreviousData?: boolean;
  previousPeriodLabel: string;
  perfectDays: number;
  elapsedDaysCount: number;
  bestRun: number;
  activeDays: number;
  isInfoOpen: boolean;
  onToggleInfo: () => void;
}

/**
 * Progress Card 2: Completion Donut Ring, Delta vs Previous Period & 3 Summary Sub-Tiles
 */
export const ProgressCompletionCard: React.FC<ProgressCompletionCardProps> = ({
  completionPct,
  completedCheckIns,
  elapsedDueCheckIns,
  statusHeadline,
  deltaPts,
  hasPreviousData = true,
  previousPeriodLabel,
  perfectDays,
  elapsedDaysCount,
  bestRun,
  activeDays,
  isInfoOpen,
  onToggleInfo,
}) => {
  const size = 112;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const progressOffset = circ * (1 - Math.max(0, Math.min(100, completionPct)) / 100);

  const isNegative = deltaPts < 0;
  const isPositive = deltaPts > 0;

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Completion</Text>
          <Text style={styles.cardSubtitle}>
            {completedCheckIns} check-ins of {elapsedDueCheckIns}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onToggleInfo}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Ionicons name="information-circle-outline" size={22} color="#64748B" />
        </TouchableOpacity>
      </View>

      {isInfoOpen && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            Measures completed check-ins divided by scheduled check-ins elapsed so far in this period.
          </Text>
        </View>
      )}

      {/* Middle Row: Donut Ring + Status + Delta Pill */}
      <View style={styles.ringSection}>
        <View style={styles.ringWrapper}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#DCE0EA"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {completionPct > 0 && (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#7C83FD"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circ}`}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                fill="none"
                rotation="-90"
                origin={`${size / 2}, ${size / 2}`}
              />
            )}
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.ringPct}>{completionPct}%</Text>
          </View>
        </View>

        <View style={styles.statusCol}>
          <Text style={styles.statusHeadline}>{statusHeadline}</Text>
          {!hasPreviousData ? (
            <Text style={styles.noCompareText}>
              Nothing to compare with {previousPeriodLabel.replace('vs ', '')}.
            </Text>
          ) : (
            <View style={styles.deltaRow}>
              <View
                style={[
                  styles.deltaPill,
                  isNegative
                    ? styles.deltaPillNeg
                    : isPositive
                      ? styles.deltaPillPos
                      : styles.deltaPillNeutral,
                ]}
              >
                <Text
                  style={[
                    styles.deltaPillText,
                    isNegative
                      ? styles.deltaTextNeg
                      : isPositive
                        ? styles.deltaTextPos
                        : styles.deltaTextNeutral,
                  ]}
                >
                  {isNegative ? `↓ ${Math.abs(deltaPts)} pts` : isPositive ? `↑ ${deltaPts} pts` : '— 0 pts'}
                </Text>
              </View>
              <Text style={styles.deltaCompare}>{previousPeriodLabel}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom 3 Sub-Tiles */}
      <View style={styles.tilesRow}>
        <View style={styles.tile}>
          <Text style={styles.tileValue}>
            {perfectDays} <Text style={styles.tileMuted}>/ {elapsedDaysCount}</Text>
          </Text>
          <Text style={styles.tileLabel}>Perfect days</Text>
        </View>

        <View style={styles.tile}>
          <Text style={styles.tileValue}>
            {bestRun} <Text style={styles.tileMuted}>days</Text>
          </Text>
          <Text style={styles.tileLabel}>Best run</Text>
        </View>

        <View style={styles.tile}>
          <Text style={styles.tileValue}>
            {activeDays} <Text style={styles.tileMuted}>days</Text>
          </Text>
          <Text style={styles.tileLabel}>Active</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
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
  },
  infoBanner: {
    backgroundColor: '#F3F4F8',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  infoText: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 17,
  },
  ringSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 18,
  },
  ringWrapper: {
    width: 112,
    height: 112,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringPct: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusCol: {
    flex: 1,
  },
  statusHeadline: {
    fontSize: 18.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  deltaPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deltaPillNeg: {
    backgroundColor: '#F8E3E4',
  },
  deltaPillPos: {
    backgroundColor: '#DCFCE7',
  },
  deltaPillNeutral: {
    backgroundColor: '#F1F5F9',
  },
  deltaPillText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  deltaTextNeg: {
    color: '#B91C1C',
  },
  deltaTextPos: {
    color: '#15803D',
  },
  deltaTextNeutral: {
    color: '#475569',
  },
  deltaCompare: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  noCompareText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 19,
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

