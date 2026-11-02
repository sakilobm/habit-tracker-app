import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface DottedFanArcProps {
  percentage: number; // 0 to 100
}

/**
 * Hemicycle Dotted Fan Arc Gauge (Exact match to Routinr Home Screen)
 * Displays concentric dotted semicircle arcs with filled progress dots and center percentage.
 */
export const DottedFanArc: React.FC<DottedFanArcProps> = ({ percentage }) => {
  const width = 320;
  const height = 175;
  const cx = width / 2;
  const cy = height - 15;

  // 3 concentric rows of dots
  const rows = [
    { radius: 68, count: 18, dotR: 3.8, activeColor: '#3B82F6' },  // Inner row (Blue)
    { radius: 92, count: 22, dotR: 4.2, activeColor: '#10B981' },  // Middle row (Green)
    { radius: 116, count: 26, dotR: 4.6, activeColor: '#6366F1' }, // Outer row (Indigo)
  ];

  return (
    <View style={styles.container}>
      {/* Header Tag */}
      <Text style={styles.headerTag}>TODAY · WEEK · STREAK</Text>

      {/* SVG Dotted Semicircle */}
      <View style={styles.svgWrapper}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {rows.map((row, rowIndex) => {
            const dots = [];
            for (let i = 0; i < row.count; i++) {
              // Angle from 180 (left) to 0 (right)
              const fraction = i / (row.count - 1);
              const angleRad = Math.PI - fraction * Math.PI;

              const x = cx + row.radius * Math.cos(angleRad);
              const y = cy - row.radius * Math.sin(angleRad);

              const isFilled = fraction <= percentage / 100 && percentage > 0;
              const dotColor = isFilled ? row.activeColor : '#E2E8F0';

              dots.push(
                <Circle
                  key={`${rowIndex}-${i}`}
                  cx={x}
                  cy={y}
                  r={row.dotR}
                  fill={dotColor}
                />
              );
            }
            return dots;
          })}
        </Svg>

        {/* Center Percentage Text */}
        <View style={styles.centerContent}>
          <Text style={styles.percentageNumber}>{Math.round(percentage)}</Text>
          <Text style={styles.percentageLabel}>% TODAY</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  headerTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  svgWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    bottom: 12,
    alignItems: 'center',
  },
  percentageNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 52,
  },
  percentageLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1.5,
    marginTop: 2,
  },
});

