import { habitRepository } from './habitRepository';
import { format } from 'date-fns';

/**
 * Seed initial data matching Routinr screenshots
 */
export function seedInitialHabitsIfNeeded(): void {
  const existingHabits = habitRepository.getAllHabits();
  if (existingHabits.length > 0) return;

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Exact habit from user's screenshot
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
    unit: 'day',
    createdAt: new Date().toISOString(),
  });

  // Additional routines
  habitRepository.insertHabit({
    id: 'habit_drink_water',
    title: 'Hydrate 500ml',
    description: 'Drink a full glass of lukewarm lemon water right after waking up.',
    icon: 'water-outline',
    category: 'health',
    timeOfDay: 'morning',
    frequencyType: 'every_day',
    frequencyDays: [1, 2, 3, 4, 5, 6, 7],
    targetCount: 1,
    unit: 'glass',
    createdAt: new Date().toISOString(),
  });

  habitRepository.insertHabit({
    id: 'habit_mindful_breathing',
    title: '5-Min Morning Breathing',
    description: 'Box breathing exercise: inhale 4s, hold 4s, exhale 4s, hold 4s.',
    icon: 'leaf-outline',
    category: 'mindfulness',
    timeOfDay: 'morning',
    frequencyType: 'every_day',
    frequencyDays: [1, 2, 3, 4, 5, 6, 7],
    targetCount: 1,
    unit: 'session',
    createdAt: new Date().toISOString(),
  });

  // Seed 1 completion for stats preview
  habitRepository.setHabitStatus('habit_notice_good_thing', todayStr, 'completed', 1, 'Felt peaceful during evening tea.');
}

