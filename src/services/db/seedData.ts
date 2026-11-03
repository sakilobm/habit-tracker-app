import { habitRepository } from './habitRepository';
import { format } from 'date-fns';

/**
 * Seed initial data matching exact Routinr Home Screen screenshots
 */
export function seedInitialHabitsIfNeeded(): void {
  const existingHabits = habitRepository.getAllHabits();
  const hasRoutinrHabits = existingHabits.some((h) => h.id === 'habit_put_thoughts_paper');

  if (hasRoutinrHabits && existingHabits.length >= 5) return;

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Exact habits from Routinr:
  // 1. Put thoughts on paper
  // 2. Reset your desk
  // 3. Notice one good thing
  // 4. Drink 2L of fresh water
  // 5. Evening quiet reading

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

    habitRepository.setHabitStatus(
      'habit_notice_good_thing',
      todayStr,
      'completed',
      1,
      'Noticed peaceful evening breeze.'
    );
  }

  if (!existingHabits.some((h) => h.id === 'habit_hydrate_water')) {
    habitRepository.insertHabit({
      id: 'habit_hydrate_water',
      title: 'Drink 2L fresh water',
      description: 'Keep your hydration levels high throughout the workday.',
      icon: 'water-outline',
      category: 'health',
      timeOfDay: 'anytime',
      frequencyType: 'every_day',
      frequencyDays: [1, 2, 3, 4, 5, 6, 7],
      targetCount: 2,
      unit: 'liters',
      createdAt: new Date().toISOString(),
    });
  }

  if (!existingHabits.some((h) => h.id === 'habit_quiet_reading')) {
    habitRepository.insertHabit({
      id: 'habit_quiet_reading',
      title: 'Evening quiet reading',
      description: 'Read 15 pages of non-fiction before winding down for sleep.',
      icon: 'reader-outline',
      category: 'mindfulness',
      timeOfDay: 'evening',
      frequencyType: 'every_day',
      frequencyDays: [1, 2, 3, 4, 5, 6, 7],
      targetCount: 1,
      unit: 'time',
      createdAt: new Date().toISOString(),
    });
  }
}
