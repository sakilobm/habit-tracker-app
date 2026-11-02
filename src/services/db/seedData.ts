import { habitRepository } from './habitRepository';
import { format } from 'date-fns';

/**
 * Seed initial data matching exact Routinr Home Screen screenshots
 */
export function seedInitialHabitsIfNeeded(): void {
  const existingHabits = habitRepository.getAllHabits();
  const hasRoutinrHabits = existingHabits.some((h) => h.id === 'habit_put_thoughts_paper');

  if (hasRoutinrHabits && existingHabits.length >= 3) return;

  // Clean out older seed habits to ensure exact match to screenshot
  for (const habit of existingHabits) {
    if (!habit.id.startsWith('habit_put_') && !habit.id.startsWith('habit_reset_') && !habit.id.startsWith('habit_notice_')) {
      habitRepository.deleteHabit(habit.id);
    }
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Exact 3 habits from user's latest screenshots:
  // 1. Put thoughts on paper
  // 2. Reset your desk
  // 3. Notice one good thing

  if (!existingHabits.some((h) => h.id === 'habit_put_thoughts_paper')) {
    habitRepository.insertHabit({
      id: 'habit_put_thoughts_paper',
      title: 'Put thoughts on paper',
      description: 'Write down 3 priorities or free-write for 5 minutes before beginning your day.',
      icon: 'journal-outline',
      category: 'mindfulness',
      timeOfDay: 'morning',
      frequencyType: 'every_day',
      frequencyDays: [1, 2, 3, 4, 5, 6, 7],
      targetCount: 1,
      unit: 'time',
      createdAt: new Date().toISOString(),
    });
  }

  if (!existingHabits.some((h) => h.id === 'habit_reset_desk')) {
    habitRepository.insertHabit({
      id: 'habit_reset_desk',
      title: 'Reset your desk',
      description: 'Clear cables, file loose papers, and leave a clean surface for tomorrow.',
      icon: 'file-tray-stacked-outline',
      category: 'productivity',
      timeOfDay: 'afternoon',
      frequencyType: 'every_day',
      frequencyDays: [1, 2, 3, 4, 5, 6, 7],
      targetCount: 1,
      unit: 'time',
      createdAt: new Date().toISOString(),
    });
  }

  if (!existingHabits.some((h) => h.id === 'habit_notice_good_thing')) {
    habitRepository.insertHabit({
      id: 'habit_notice_good_thing',
      title: 'Notice one good thing',
      description: 'Capture one small moment you appreciated today. After dinner, write one sentence in your notebook.',
      icon: 'book-outline',
      category: 'mindfulness',
      timeOfDay: 'evening',
      frequencyType: 'every_day',
      frequencyDays: [1, 2, 3, 4, 5, 6, 7],
      targetCount: 1,
      unit: 'time',
      createdAt: new Date().toISOString(),
    });

    // Mark 1 of 3 completed to showcase 33% exactly like screenshot 2
    habitRepository.setHabitStatus(
      'habit_notice_good_thing',
      todayStr,
      'completed',
      1,
      'Noticed peaceful evening breeze.'
    );
  }
}
