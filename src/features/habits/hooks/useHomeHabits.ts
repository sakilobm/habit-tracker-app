import { useEffect, useMemo, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '../stores/habitStore';
import { HabitLayoutMode, HabitWithStatus, TimeOfDay } from '../../../types/habit';

/**
 * Headless Hook: Home Screen Habit Management & Layout State
 * Encapsulates view switching, routine filtering, completion toggles, and device haptics.
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

  // Group habits by time of day
  const groupedHabits = useMemo(() => {
    const morning = habits.filter((h) => h.timeOfDay === 'morning');
    const afternoon = habits.filter((h) => h.timeOfDay === 'afternoon');
    const evening = habits.filter((h) => h.timeOfDay === 'evening');
    const anytime = habits.filter((h) => h.timeOfDay === 'anytime');

    return {
      morning,
      afternoon,
      evening,
      anytime,
      totalCount: habits.length,
      completedCount: habits.filter((h) => h.isCompleted).length,
    };
  }, [habits]);

  return {
    isInitialized,
    habits,
    layoutMode,
    selectedDate,
    activeHabitForSheet,
    groupedHabits,
    handleToggleHabit,
    handleSelectLayout,
    handleOpenSheet,
    handleCloseSheet: closeHabitSheet,
    setSelectedDate,
  };
}

