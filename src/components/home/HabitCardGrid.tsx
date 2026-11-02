import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';
import { BeautifulHabitIcon } from './BeautifulHabitIcon';

interface HabitCardGridProps {
  habit: HabitWithStatus;
  onPress: (habit: HabitWithStatus) => void;
  onToggle: (habitId: string) => void;
}

/**
 * 3-Column Compact Grid Habit Card
 */
export const HabitCardGrid: React.FC<HabitCardGridProps> = ({ habit, onPress, onToggle }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(habit)}
      activeOpacity={0.88}
    >
      <BeautifulHabitIcon
        icon={habit.icon}
        title={habit.title}
        size={44}
      />

      <Text style={styles.title} numberOfLines={1}>
        {habit.title}
      </Text>

      <TouchableOpacity
        style={[styles.checkCircle, habit.isCompleted && styles.checkCircleCompleted]}
        onPress={() => onToggle(habit.id)}
        activeOpacity={0.7}
      >
        {habit.isCompleted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 10,
    margin: '1.6%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1.5,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#7C83FD',
  },
});
