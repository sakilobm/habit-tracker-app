import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';
import { BeautifulHabitIcon } from './BeautifulHabitIcon';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';

interface HabitCardDualProps {
  habit: HabitWithStatus;
  onPress: (habit: HabitWithStatus) => void;
  onToggle: (habitId: string) => void;
}

/**
 * Weekly Expanded Habit Card (Exact match to Routinr View 2 / Screenshot 6)
 * Selected when the 2nd switcher button [ ▯ ▯ ] is active.
 * Displays squircle vector icon, streak/target/frequency chips, and a 7-day mini calendar row.
 */
export const HabitCardDual: React.FC<HabitCardDualProps> = ({ habit, onPress, onToggle }) => {
  const completionPercentage = habit.isCompleted
    ? 100
    : Math.round((habit.currentValue / Math.max(habit.targetCount, 1)) * 100);

  const streakText =
    habit.currentStreak > 0 ? `${habit.currentStreak}d streak` : '0d streak';

  // Generate 7-day mini calendar row (e.g. Tue, Wed, Thu, Fri, Sat, Sun, Mon)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 2 }); // Tuesday start like screenshot
  const weekDays = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const day = addDays(weekStart, i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const isToday = isSameDay(day, today);

    // If it's Saturday or today & completed
    const isCompletedDay = habit.isCompleted && isToday;

    return {
      dayName: format(day, 'EEE'),
      dayNum: format(day, 'd'),
      dateStr: dayStr,
      isToday,
      isCompleted: isCompletedDay,
    };
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(habit)}
      activeOpacity={0.88}
    >
      {/* Top Header Row: Icon, Title & Subtitle Chips */}
      <View style={styles.topRow}>
        <BeautifulHabitIcon
          icon={habit.icon}
          title={habit.title}
          size={48}
        />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {habit.title}
          </Text>

          <View style={styles.metaRow}>
            {/* Streak Chip */}
            <View style={styles.metaChip}>
              <Ionicons name="flash-outline" size={13} color="#64748B" />
              <Text style={styles.metaText}>{streakText}</Text>
            </View>

            <View style={styles.dividerDot} />

            {/* Target Chip */}
            <View style={styles.metaChip}>
              <Ionicons name="disc-outline" size={13} color="#64748B" />
              <Text style={styles.metaText}>{completionPercentage}%</Text>
            </View>

            <View style={styles.dividerDot} />

            {/* Frequency Chip */}
            <View style={styles.metaChip}>
              <Ionicons name="repeat-outline" size={13} color="#64748B" />
              <Text style={styles.metaText}>Every day</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 7-Day Mini Calendar Row (Matching Screenshot 6) */}
      <View style={styles.weekRow}>
        {weekDays.map((d, idx) => (
          <View key={idx} style={styles.dayCol}>
            <Text style={styles.dayNameText}>{d.dayName}</Text>
            <TouchableOpacity
              style={[
                styles.dayPill,
                d.isCompleted && styles.dayPillCompleted,
                d.isToday && !d.isCompleted && styles.dayPillToday,
              ]}
              onPress={() => {
                if (d.isToday) {
                  onToggle(habit.id);
                }
              }}
              activeOpacity={0.7}
            >
              {d.isCompleted ? (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.dayNumText,
                    d.isToday && styles.dayNumTextToday,
                  ]}
                >
                  {d.dayNum}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
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
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  dayNameText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  dayPill: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#EEF2FF', // Soft translucent lilac pill
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayPillToday: {
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  dayPillCompleted: {
    backgroundColor: '#7C83FD', // Vibrant Periwinkle Lavender matching screenshot
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  dayNumText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  dayNumTextToday: {
    fontWeight: '800',
  },
});
