import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';

interface HabitCardDualProps {
  habit: HabitWithStatus;
  onPress: (habit: HabitWithStatus) => void;
  onToggle: (habitId: string) => void;
}

/**
 * 2-Column Dual Grid Habit Card
 */
export const HabitCardDual: React.FC<HabitCardDualProps> = ({ habit, onPress, onToggle }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(habit)}
      activeOpacity={0.85}
    >
      <View style={styles.topRow}>
        <View style={styles.iconBadge}>
          <Ionicons name={(habit.icon || 'sparkles-outline') as any} size={18} color="#4F46E5" />
        </View>
        <TouchableOpacity
          style={[styles.checkCircle, habit.isCompleted && styles.checkCircleCompleted]}
          onPress={() => onToggle(habit.id)}
        >
          {habit.isCompleted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {habit.title}
      </Text>

      <View style={styles.streakRow}>
        <Ionicons name="flame" size={12} color="#F59E0B" />
        <Text style={styles.streakText}>{habit.currentStreak}d streak</Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${habit.isCompleted ? 100 : (habit.currentValue / habit.targetCount) * 100}%` },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    margin: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    minHeight: 36,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  streakText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#EEF2FF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 3,
  },
});

