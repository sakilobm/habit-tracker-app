import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';
import { BeautifulHabitIcon } from './BeautifulHabitIcon';

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
      activeOpacity={0.88}
    >
      <View style={styles.topRow}>
        <BeautifulHabitIcon
          icon={habit.icon}
          title={habit.title}
          size={40}
        />
        <TouchableOpacity
          style={[styles.checkCircle, habit.isCompleted && styles.checkCircleCompleted]}
          onPress={() => onToggle(habit.id)}
          activeOpacity={0.7}
        >
          {habit.isCompleted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {habit.title}
      </Text>

      <View style={styles.streakRow}>
        <Ionicons name="flash-outline" size={12} color="#64748B" />
        <Text style={styles.streakText}>
          {habit.currentStreak > 0 ? `${habit.currentStreak}d streak` : 'No streak'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    margin: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#7C83FD',
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
  },
  streakText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
