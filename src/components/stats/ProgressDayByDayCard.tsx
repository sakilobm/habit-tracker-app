import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DayBarItem } from '../../features/stats/hooks/useProgressStats';

interface ProgressDayByDayCardProps {
  title?: string;
  showDashedBaseline?: boolean;
  bars: DayBarItem[];
  averagePct: number;
  selectedBarKey: string | null;
  onSelectBar: (key: string | null) => void;
}

/**
 * Progress Card 4: Day-by-Day / Week-by-Week Vertical Capsule Bar Chart
 * Renders tall rounded capsule tracks with bottom-up progress fill and interactive tap inspection.
 */
export const ProgressDayByDayCard: React.FC<ProgressDayByDayCardProps> = React.memo(({
  title = 'Day by day',
  showDashedBaseline = false,
  bars,
  averagePct,
  selectedBarKey,
  onSelectBar,
}) => {
  const selectedBar = bars.find((b) => b.key === selectedBarKey) || null;
  const barWidth = bars.length > 8 ? 14 : 24;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          {selectedBar && (
            <Text style={styles.selectedInfo}>
              {selectedBar.label}: {selectedBar.completedCount}/{selectedBar.dueCount} done ({selectedBar.percentage}%)
            </Text>
          )}
        </View>

        <View style={styles.avgRight}>
          <Text style={styles.avgPct}>{averagePct}%</Text>
          <Text style={styles.avgLabel}>average</Text>
        </View>
      </View>

      {/* Vertical Capsule Bars */}
      <View style={styles.barsWrapper}>
        {showDashedBaseline && <View style={styles.dashedBaseline} pointerEvents="none" />}
        <View style={styles.barsRow}>
          {bars.map((bar) => {
            const isSelected = bar.key === selectedBarKey;
            const fillHeightPct = Math.max(0, Math.min(100, bar.percentage));

            return (
              <TouchableOpacity
                key={bar.key}
                style={styles.barCol}
                onPress={() => onSelectBar(isSelected ? null : bar.key)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    styles.barTrack,
                    { width: barWidth, borderRadius: barWidth / 2 },
                    isSelected && styles.barTrackSelected,
                  ]}
                >
                  {fillHeightPct > 0 && (
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${fillHeightPct}%`,
                          borderRadius: barWidth / 2,
                        },
                      ]}
                    />
                  )}
                </View>

                <Text
                  style={[
                    styles.barLabel,
                    bar.isToday && styles.barLabelToday,
                    isSelected && styles.barLabelSelected,
                  ]}
                >
                  {bar.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectedInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C83FD',
    marginTop: 2,
  },
  avgRight: {
    alignItems: 'flex-end',
  },
  avgPct: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  avgLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  barsWrapper: {
    position: 'relative',
  },
  dashedBaseline: {
    position: 'absolute',
    left: 4,
    right: 4,
    bottom: 28,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    height: 152,
    backgroundColor: '#EFEFF5',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 10,
  },
  barTrackSelected: {
    borderWidth: 1.5,
    borderColor: '#7C83FD',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#7C83FD',
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  barLabelToday: {
    color: '#7C83FD',
    fontWeight: '700',
  },
  barLabelSelected: {
    color: '#0F172A',
    fontWeight: '700',
  },
});

