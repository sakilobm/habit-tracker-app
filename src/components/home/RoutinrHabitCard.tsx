import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';
import { BeautifulHabitIcon } from './BeautifulHabitIcon';

interface RoutinrHabitCardProps {
  habit: HabitWithStatus;
  onPress: (habit: HabitWithStatus) => void;
  onToggle: (habitId: string) => void;
}

/**
 * Routinr Signature Habit Card (Exact match to Home Screen Screenshots 1 & 2)
 * Features squircle gradient icon, bold title, streak/target/frequency chips,
 * and circular checkmark toggle.
 */
export const RoutinrHabitCard: React.FC<RoutinrHabitCardProps> = ({
  habit,
  onPress,
  onToggle,
}) => {
  const completionPercentage = habit.isCompleted
    ? 100
    : Math.round((habit.currentValue / Math.max(habit.targetCount, 1)) * 100);

  const streakText =
    habit.currentStreak > 0 ? `${habit.currentStreak}d st...` : 'No s...';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(habit)}
      activeOpacity={0.88}
    >
      {/* Left Column: Beautiful Squircle Vector Icon */}
      <BeautifulHabitIcon
        icon={habit.icon}
        title={habit.title}
        size={48}
      />

      {/* Middle Column: Title & Subtitle Chips */}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {habit.title}
        </Text>

        <View style={styles.metaRow}>
          {/* Streak Tag */}
          <View style={styles.metaChip}>
            <Ionicons name="flash-outline" size={13} color="#64748B" />
            <Text style={styles.metaText}>{streakText}</Text>
          </View>

          <View style={styles.dividerDot} />

          {/* Completion Target Tag */}
          <View style={styles.metaChip}>
            <Ionicons name="disc-outline" size={13} color="#64748B" />
            <Text style={styles.metaText}>{completionPercentage}%</Text>
          </View>

          <View style={styles.dividerDot} />

          {/* Repeat Tag */}
          <View style={styles.metaChip}>
            <Ionicons name="repeat-outline" size={13} color="#64748B" />
            <Text style={styles.metaText}>Ever...</Text>
          </View>
        </View>
      </View>

      {/* Right Column: Circular Checkmark Toggle Button */}
      <TouchableOpacity
        style={[
          styles.checkButton,
          habit.isCompleted && styles.checkButtonCompleted,
        ]}
        onPress={() => onToggle(habit.id)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {habit.isCompleted && (
          <Ionicons name="checkmark" size={19} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1.5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 6,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  dividerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
  },
  checkButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: '#7C83FD', // Vibrant Periwinkle Lavender matching screenshot 2
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
});

