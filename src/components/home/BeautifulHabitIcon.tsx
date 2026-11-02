import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

interface BeautifulHabitIconProps {
  icon?: string;
  title?: string;
  size?: number; // Container size, default 48
}

/**
 * BeautifulHabitIcon
 * Renders high-fidelity, polished vector icons inside a vibrant lavender squircle.
 * Specially handcrafted for Routinr's signature habits:
 * - "Put thoughts on paper" (Spiral Notebook with lines & pen)
 * - "Reset your desk" (Workspace tray / organizer)
 * - "Notice one good thing" (Open book with glowing spine)
 */
export const BeautifulHabitIcon: React.FC<BeautifulHabitIconProps> = ({
  icon,
  title = '',
  size = 48,
}) => {
  const normalizedTitle = title.toLowerCase();

  // 1. Notebook / Journal: "Put thoughts on paper"
  const isJournal =
    normalizedTitle.includes('thought') ||
    normalizedTitle.includes('paper') ||
    normalizedTitle.includes('journal') ||
    icon === 'journal-outline' ||
    icon === 'journal';

  // 2. Desk Tray / Workspace: "Reset your desk"
  const isDesk =
    normalizedTitle.includes('desk') ||
    normalizedTitle.includes('reset') ||
    icon === 'file-tray-stacked-outline' ||
    icon === 'briefcase-outline';

  // 3. Open Book: "Notice one good thing"
  const isBook =
    normalizedTitle.includes('notice') ||
    normalizedTitle.includes('read') ||
    normalizedTitle.includes('book') ||
    icon === 'book-outline';

  const renderVectorGlyph = () => {
    if (isJournal) {
      return (
        <Svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          {/* Notebook Base */}
          <Rect
            x="5"
            y="3"
            width="15"
            height="18"
            rx="2.5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Spiral binding rings on left */}
          <Line x1="3" y1="7" x2="6.5" y2="7" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="3" y1="12" x2="6.5" y2="12" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="3" y1="17" x2="6.5" y2="17" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          {/* Note lines inside */}
          <Line x1="9" y1="8" x2="16" y2="8" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
          <Line x1="9" y1="12" x2="16" y2="12" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
          <Line x1="9" y1="16" x2="13" y2="16" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
        </Svg>
      );
    }

    if (isDesk) {
      return (
        <Svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          {/* Organizer Box / Tray */}
          <Path
            d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z"
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />
          {/* Drawer / Tray Front slot */}
          <Path
            d="M4 13H8.5C9.2 13 9.8 13.5 10 14.2L10.3 15.2C10.5 15.7 11 16 11.5 16H12.5C13 16 13.5 15.7 13.7 15.2L14 14.2C14.2 13.5 14.8 13 15.5 13H20"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Tray Handle */}
          <Line x1="10.5" y1="9" x2="13.5" y2="9" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
      );
    }

    if (isBook) {
      return (
        <Svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          {/* Left page */}
          <Path
            d="M4 19.5V6.5C4 5.39543 4.89543 4.5 6 4.5H11C11.5523 4.5 12 4.94772 12 5.5V19.5C10.5 18 7.5 18 4 19.5Z"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right page */}
          <Path
            d="M20 19.5V6.5C20 5.39543 19.1046 4.5 18 4.5H13C12.4477 4.5 12 4.94772 12 5.5V19.5C13.5 18 16.5 18 20 19.5Z"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    }

    // Generic fallback with high-quality Ionicons
    return (
      <Ionicons
        name={(icon as any) || 'sparkles-outline'}
        size={22}
        color="#FFFFFF"
      />
    );
  };

  return (
    <View
      style={[
        styles.squircleContainer,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.33),
        },
      ]}
    >
      {renderVectorGlyph()}
    </View>
  );
};

const styles = StyleSheet.create({
  squircleContainer: {
    backgroundColor: '#7C83FD', // Vibrant Periwinkle Lavender matching screenshot
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
});

