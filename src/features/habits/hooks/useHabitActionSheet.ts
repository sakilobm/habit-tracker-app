import { useMemo, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '../stores/habitStore';
import { HabitWithStatus } from '../../../types/habit';

/**
 * Headless Hook: Habit Action Bottom Sheet
 * Encapsulates modal actions (skip, delete, complete), weekday indicators, and striped bar metrics.
 */
export function useHabitActionSheet(habit: HabitWithStatus | null) {
  const { skipHabit, deleteHabit, toggleHabitStatus, closeHabitSheet, setActiveHabitForStats } = useHabitStore();

  const handleSkip = useCallback(() => {
    if (!habit) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    skipHabit(habit.id);
  }, [habit, skipHabit]);

  const handleDelete = useCallback(() => {
    if (!habit) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    deleteHabit(habit.id);
  }, [habit, deleteHabit]);

  const handleToggle = useCallback(() => {
    if (!habit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleHabitStatus(habit.id);
  }, [habit, toggleHabitStatus]);

  // Weekdays: Mon(1) to Sun(7)
  const weekdays = useMemo(() => {
    const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const todayDay = new Date().getDay(); // 0 is Sun, 1 is Mon
    const normalizedToday = todayDay === 0 ? 7 : todayDay;

    return labels.map((label, index) => {
      const dayNum = index + 1;
      const isPast = dayNum < normalizedToday;
      const isToday = dayNum === normalizedToday;
      const isFuture = dayNum > normalizedToday;
      return {
        label,
        dayNum,
        isPast,
        isToday,
        isFuture,
        isCompleted: isPast || (isToday && habit?.isCompleted),
      };
    });
  }, [habit?.isCompleted]);

  const progressRatio = useMemo(() => {
    if (!habit) return 0;
    if (habit.isCompleted) return 1;
    return habit.currentValue / Math.max(habit.targetCount, 1);
  }, [habit]);

  return {
    weekdays,
    progressRatio,
    handleSkip,
    handleDelete,
    handleToggle,
    handleClose: closeHabitSheet,
    handleViewStats: () => {
      if (habit) setActiveHabitForStats(habit.id);
    },
  };
}

