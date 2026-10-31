import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';

interface HabitCardListProps {
  habit: HabitWithStatus;
  onPress: (habit: HabitWithStatus) => void;
  onToggle: (habitId: string) => void;
}

/**
 * Single-Column Habit Card (Matching Routinr Screenshot 4)
 * Features habit icon, title, description, weekday bubbles, fire streak info, and striped progress bar.
 */
export const HabitCardList: React.FC<HabitCardListProps> = ({ habit, onPress, onToggle }) => {
  const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDay = new Date().getDay();
  const normalizedToday = todayDay === 0 ? 7 : todayDay;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(habit)}
      activeOpacity={0.9}
    >
      {/* Header Info */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={styles.iconBadge}>
            <Ionicons name={(habit.icon || 'book-outline') as any} size={20} color="#1E293B" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{habit.title}</Text>
            {habit.description ? (
              <Text style={styles.description} numberOfLines={2}>
                {habit.description}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Quick Check Action */}
        <TouchableOpacity
          style={[styles.checkCircle, habit.isCompleted && styles.checkCircleCompleted]}
          onPress={() => onToggle(habit.id)}
          activeOpacity={0.7}
        >
          {habit.isCompleted ? (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          ) : (
            <Text style={styles.targetText}>
              {habit.currentValue}/{habit.targetCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Weekday Row */}
      <View style={styles.weekdayRow}>
        {weekdays.map((day, idx) => {
          const dayNum = idx + 1;
          const isToday = dayNum === normalizedToday;
          const isPast = dayNum < normalizedToday;

          return (
            <View key={idx} style={styles.dayCol}>
              <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{day}</Text>
              {isPast ? (
                <View style={styles.dotPast} />
              ) : (
                <View
                  style={[
                    styles.circlePending,
                    isToday && habit.isCompleted && styles.circleCompleted,
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Streak Info */}
      <View style={styles.streakRow}>
        <Ionicons name="flame-outline" size={16} color="#F59E0B" />
        <Text style={styles.streakText}>
          {habit.currentStreak > 0
            ? `${habit.currentStreak} day streak`
            : 'No streak yet'}
          {' · '}Best {habit.bestStreak}
          {' · '}{habit.totalDays} total
        </Text>
      </View>

      {/* Striped Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${habit.isCompleted ? 100 : (habit.currentValue / habit.targetCount) * 100}%` },
          ]}
        />
      </View>

      {/* Footer Status */}
      <View style={styles.footerRow}>
        <Text style={styles.footerStatus}>
          {habit.isCompleted ? 'Completed today' : `${habit.currentValue} of ${habit.targetCount} ${habit.unit}`}
        </Text>
        <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  targetText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    marginTop: 6,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  dayLabelToday: {
    color: '#0F172A',
    fontWeight: '700',
  },
  dotPast: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  circlePending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  circleCompleted: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  streakText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 5,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footerStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});

