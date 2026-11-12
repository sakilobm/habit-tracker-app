import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { DayMixData } from '../../features/stats/hooks/useProgressStats';

interface ProgressDayMixCardProps {
  dayMix: DayMixData;
}

/**
 * Month Card: Day Mix Multi-Segment Donut Breakdown
 * Visualizes Perfect, Partial, Nothing done, and Days off proportions.
 */
export const ProgressDayMixCard: React.FC<ProgressDayMixCardProps> = React.memo(({ dayMix }) => {
  const { totalElapsedDays, perfect, partial, nothingDone, daysOff } = dayMix;
  const size = 112;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;

  const segments = [
    { label: 'Perfect', count: perfect, color: '#7C83FD' },
    { label: 'Partial', count: partial, color: '#C2C7FA' },
    { label: 'Nothing done', count: nothingDone, color: '#C83228' },
    { label: 'Days off', count: daysOff, color: '#D1D5DB' },
  ];

  let cumulativeRatio = 0;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Day mix</Text>
      <Text style={styles.cardSubtitle}>How the month's days went</Text>

      <View style={styles.bodyRow}>
        {/* Multi-segment Donut */}
        <View style={styles.ringWrap}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {totalElapsedDays > 0 &&
              segments.map((seg) => {
                if (seg.count === 0) return null;
                const ratio = seg.count / totalElapsedDays;
                const segLength = circ * ratio;
                const startAngle = -90 + cumulativeRatio * 360;
                cumulativeRatio += ratio;

                return (
                  <Circle
                    key={seg.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${segLength} ${circ - segLength}`}
                    fill="none"
                    rotation={startAngle}
                    origin={`${size / 2}, ${size / 2}`}
                  />
                );
              })}
          </Svg>
          <View style={styles.ringCenter}>
            <Text style={styles.centerCount}>{totalElapsedDays}</Text>
            <Text style={styles.centerUnit}>days</Text>
          </View>
        </View>

        {/* Breakdown Rows */}
        <View style={styles.tableCol}>
          {segments.map((seg) => {
            const pct = totalElapsedDays > 0 ? Math.round((seg.count / totalElapsedDays) * 100) : 0;
            return (
              <View key={seg.label} style={styles.tableRow}>
                <View style={styles.rowLeft}>
                  <View style={[styles.dot, { backgroundColor: seg.color }]} />
                  <Text style={styles.rowLabel}>{seg.label}</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowCount}>{seg.count}</Text>
                  <Text style={styles.rowPct}>{pct}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={styles.footerNote}>Today joins the mix once it's over.</Text>
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
    marginBottom: 16,
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 14,
  },
  ringWrap: {
    width: 112,
    height: 112,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 25,
  },
  centerUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  tableCol: {
    flex: 1,
    gap: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  rowLabel: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#475569',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowCount: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    minWidth: 18,
    textAlign: 'right',
  },
  rowPct: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
    minWidth: 30,
    textAlign: 'right',
  },
  footerNote: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
  },
});

