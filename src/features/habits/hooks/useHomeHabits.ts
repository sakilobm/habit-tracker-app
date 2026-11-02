import { useEffect, useMemo, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '../stores/habitStore';
import { HabitLayoutMode, HabitWithStatus } from '../../../types/habit';

/**
 * Headless Hook: Home Screen Habit Management & Layout State
 * Encapsulates view switching, routine filtering, completion toggles,
 * hemicycle percentage calculations, and device haptics.
 */
export function useHomeHabits() {
  const {
    isInitialized,
    initialize,
    habits,
    layoutMode,
    selectedDate,
    activeHabitForSheet,
    setLayoutMode,
    setSelectedDate,
    toggleHabitStatus,
    openHabitSheet,
    closeHabitSheet,
  } = useHabitStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleToggleHabit = useCallback(
    (habitId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleHabitStatus(habitId);
    },
    [toggleHabitStatus]
  );

  const handleSelectLayout = useCallback(
    (mode: HabitLayoutMode) => {
      Haptics.selectionAsync();
      setLayoutMode(mode);
    },
    [setLayoutMode]
  );

  const handleOpenSheet = useCallback(
    (habit: HabitWithStatus) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      openHabitSheet(habit);
    },
    [openHabitSheet]
  );

  // Dynamic calculations for Hemicycle Arc and Streak Cards
  const { completedCount, totalCount, completionPercentage, streakDays, weekAverage } = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter((h) => h.isCompleted).length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    const maxStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak), 0);

    // Dynamic week average matches completion rate
    const avg = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completedCount: completed,
      totalCount: total,
      completionPercentage: percentage,
      streakDays: maxStreak,
      weekAverage: avg,
    };
  }, [habits]);

  return {
    isInitialized,
    habits,
    layoutMode,
    selectedDate,
    activeHabitForSheet,
    completedCount,
    totalCount,
    completionPercentage,
    streakDays,
    weekAverage,
    handleToggleHabit,
    handleSelectLayout,
    handleOpenSheet,
    handleCloseSheet: closeHabitSheet,
    setSelectedDate,
  };
}
