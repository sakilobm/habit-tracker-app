import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Line, Rect } from 'react-native-svg';

interface DiagonalStripeOverlayProps {
  /** Unique pattern id to avoid SVG def collisions when rendered multiple times */
  patternId: string;
  /** Stroke color for subtle diagonal hatching */
  strokeColor?: string;
}

/**
 * Reusable subtle diagonal stripe SVG overlay used inside Progress cards
 * (Current Streak card and Pace projection container).
 */
export const DiagonalStripeOverlay: React.FC<DiagonalStripeOverlayProps> = ({
  patternId,
  strokeColor = 'rgba(148, 163, 184, 0.08)',
}) => (
  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
    <Defs>
      <Pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <Line x1="0" y1="0" x2="0" y2="10" stroke={strokeColor} strokeWidth="2" />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
  </Svg>
);

