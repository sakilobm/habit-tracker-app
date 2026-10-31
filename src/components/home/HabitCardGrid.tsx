import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';

interface HabitCardGridProps {
  habit: HabitWithStatus;
  onPress: (habit: HabitWithStatus) => void;
  onToggle: (habitId: string) => void;
}

/**
 * 4-Grid Compact Icon Habit Card
 */
export const HabitCardGrid: React.FC<HabitCardGridProps> = ({ habit, onPress, onToggle }) => {
  return (
    <TouchableOpacity
      style={[styles.card, habit.isCompleted && styles.cardCompleted]}
      onPress={() => onPress(habit)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={(habit.icon || 'sparkles-outline') as any}
          size={22}
          color={habit.isCompleted ? '#4F46E5' : '#64748B'}
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {habit.title}
      </Text>
      <TouchableOpacity
        style={[styles.circle, habit.isCompleted && styles.circleCompleted]}
        onPress={() => onToggle(habit.id)}
      >
        {habit.isCompleted && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '23%',
    aspectRatio: 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    margin: '1%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 1,
  },
  cardCompleted: {
    borderColor: '#C7D2FE',
    backgroundColor: '#F5F7FF',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
});

