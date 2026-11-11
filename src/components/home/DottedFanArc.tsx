import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

interface DottedFanArcProps {
  /** Today completion percentage (0 to 100) */
  percentage: number;
  /** Weekly average percentage (0 to 100) rendered along the middle ring */
  weekPercentage?: number;
  /** Streak progress percentage (0 to 100) rendered along the inner ring */
  streakPercentage?: number;
}

const ARCH_LABEL = 'TODAY · WEEK · STREAK';

/**
 * Hemicycle Dotted Fan Arc Gauge (Exact match to Routinr Home Screen)
 * Displays 3 concentric arcs of 19 aligned radial spoke dots (Today, Week, Streak),
 * symmetrically arched "TODAY · WEEK · STREAK" label, and large center today percentage.
 */
export const DottedFanArc: React.FC<DottedFanArcProps> = ({
  percentage,
  weekPercentage = 0,
  streakPercentage = 0,
}) => {
  const width = 320;
  const height = 186;
  const cx = width / 2;
  const cy = height - 10;
  const spokeCount = 19;

  // 3 concentric rows aligned along 19 radial fan spokes
  const rows = [
    {
      radius: 68,
      dotR: 4.3,
      value: streakPercentage,
      activeColor: '#F59E0B',
      fadeColor: '#FDE68A',
    }, // Inner row (Streak)
    {
      radius: 90,
      dotR: 4.7,
      value: weekPercentage,
      activeColor: '#15803D',
      fadeColor: '#9BC4AA',
    }, // Middle row (Week)
    {
      radius: 112,
      dotR: 5.0,
      value: percentage,
      activeColor: '#5965E6',
      fadeColor: '#B5BCF8',
    }, // Outer row (Today)
  ];

  // Cross-platform symmetric polar character placement along the top arch
  const textRadius = 132;
  const chars = ARCH_LABEL.split('');
  const totalSpanDeg = 54; // Symmetrical -27deg to +27deg around 12 o'clock
  const stepDeg = totalSpanDeg / (chars.length - 1);

  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Symmetrically Arched "TODAY · WEEK · STREAK" label */}
          {chars.map((char, idx) => {
            const offsetDeg = -totalSpanDeg / 2 + idx * stepDeg;
            const angleRad = ((90 - offsetDeg) * Math.PI) / 180;
            const x = cx + textRadius * Math.cos(angleRad);
            const y = cy - textRadius * Math.sin(angleRad);

            return (
              <SvgText
                key={`arch-char-${idx}`}
                x={x}
                y={y}
                fill="#7C8598"
                fontSize="10.5"
                fontWeight="600"
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`rotate(${offsetDeg}, ${x}, ${y})`}
              >
                {char}
              </SvgText>
            );
          })}

          {/* Concentric fan-aligned dot rows */}
          {rows.map((row, rowIndex) => {
            const exactFill = (Math.max(0, Math.min(100, row.value)) / 100) * spokeCount;
            const fullDots = Math.floor(exactFill);
            const hasFadeDot = exactFill - fullDots >= 0.15;

            return Array.from({ length: spokeCount }).map((_, i) => {
              const fraction = i / (spokeCount - 1);
              const angleRad = Math.PI - fraction * Math.PI;
              const x = cx + row.radius * Math.cos(angleRad);
              const y = cy - row.radius * Math.sin(angleRad);

              let dotColor = '#E2E5EC';
              if (row.value > 0) {
                if (i < fullDots) {
                  dotColor = row.activeColor;
                } else if (i === fullDots && hasFadeDot) {
                  dotColor = row.fadeColor;
                }
              }

              return (
                <Circle
                  key={`${rowIndex}-${i}`}
                  cx={x}
                  cy={y}
                  r={row.dotR}
                  fill={dotColor}
                />
              );
            });
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
    marginTop: 6,
    marginBottom: 8,
  },
  svgWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    bottom: 8,
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
    color: '#334155',
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
