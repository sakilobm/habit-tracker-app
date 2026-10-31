import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitLayoutMode } from '../../types/habit';

interface CurvedHeaderProps {
  currentLayout: HabitLayoutMode;
  onSelectLayout: (mode: HabitLayoutMode) => void;
  onOpenCalendar?: () => void;
  onPressProfile?: () => void;
}

/**
 * Routinr Signature Top Curved Header
 * Features user avatar, 3-segment view switch (list, dual, grid), and calendar action.
 */
export const CurvedHeader: React.FC<CurvedHeaderProps> = ({
  currentLayout,
  onSelectLayout,
  onOpenCalendar,
  onPressProfile,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Left Avatar */}
        <TouchableOpacity style={styles.avatarButton} onPress={onPressProfile} activeOpacity={0.8}>
          <View style={styles.avatarRing}>
            <Ionicons name="person" size={18} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        {/* Center 3-Segment Layout Switcher */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentButton, currentLayout === 'list' && styles.segmentActive]}
            onPress={() => onSelectLayout('list')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="reorder-two-outline"
              size={18}
              color={currentLayout === 'list' ? '#4F46E5' : '#94A3B8'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, currentLayout === 'dual' && styles.segmentActive]}
            onPress={() => onSelectLayout('dual')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="browsers-outline"
              size={16}
              color={currentLayout === 'dual' ? '#4F46E5' : '#94A3B8'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentButton, currentLayout === 'grid' && styles.segmentActive]}
            onPress={() => onSelectLayout('grid')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="grid-outline"
              size={16}
              color={currentLayout === 'grid' ? '#4F46E5' : '#94A3B8'}
            />
          </TouchableOpacity>
        </View>

        {/* Right Calendar Action */}
        <TouchableOpacity style={styles.iconButton} onPress={onOpenCalendar} activeOpacity={0.8}>
          <Ionicons name="calendar-outline" size={18} color="#E0E7FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3730A3', // Deep indigo purple matching screenshot
    paddingTop: 12,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarRing: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 22,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

