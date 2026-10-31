import { useMemo, useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '../../habits/stores/habitStore';
import { habitRepository } from '../../../services/db/habitRepository';

/**
 * Headless Hook: Stats & Insights Analytics
 * Computes 2x2 metrics, 30-day vertical chart series, arc gauge degrees, and note-taking.
 */
export function useHabitStats() {
  const { habits, activeHabitForStatsId, setActiveHabitForStats, addHabitNote } = useHabitStore();
  const [isNoteInputVisible, setIsNoteInputVisible] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Target habit for stats view
  const currentHabit = useMemo(() => {
    return habits.find((h) => h.id === activeHabitForStatsId) || habits[0] || null;
  }, [habits, activeHabitForStatsId]);

  // Compute stats from repository
  const stats = useMemo(() => {
    if (!currentHabit) return null;
    return habitRepository.getHabitStatistics(currentHabit.id);
  }, [currentHabit]);

  const handleSaveNote = useCallback(() => {
    if (!currentHabit || !noteText.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addHabitNote(currentHabit.id, noteText.trim());
    setNoteText('');
    setIsNoteInputVisible(false);
  }, [currentHabit, noteText, addHabitNote]);

  return {
    currentHabit,
    stats,
    allHabits: habits,
    isNoteInputVisible,
    noteText,
    setNoteText,
    setIsNoteInputVisible,
    handleSaveNote,
    selectHabit: setActiveHabitForStats,
  };
}

