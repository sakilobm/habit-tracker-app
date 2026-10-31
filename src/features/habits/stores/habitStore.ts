import { create } from 'zustand';
import { format } from 'date-fns';
import { HabitLayoutMode, HabitWithStatus } from '../../../types/habit';
import { habitRepository } from '../../../services/db/habitRepository';
import { initializeDatabase } from '../../../services/db/database';
import { seedInitialHabitsIfNeeded } from '../../../services/db/seedData';

interface HabitStoreState {
  selectedDate: string;
  layoutMode: HabitLayoutMode;
  habits: HabitWithStatus[];
  activeHabitForSheet: HabitWithStatus | null;
  activeHabitForStatsId: string | null;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setLayoutMode: (mode: HabitLayoutMode) => void;
  setSelectedDate: (date: string) => void;
  loadHabits: () => void;
  toggleHabitStatus: (habitId: string) => void;
  skipHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  openHabitSheet: (habit: HabitWithStatus) => void;
  closeHabitSheet: () => void;
  setActiveHabitForStats: (habitId: string) => void;
  addHabit: (title: string, description: string, category: string, timeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime') => void;
  addHabitNote: (habitId: string, note: string) => void;
}

export const useHabitStore = create<HabitStoreState>((set, get) => ({
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  layoutMode: 'list',
  habits: [],
  activeHabitForSheet: null,
  activeHabitForStatsId: 'habit_notice_good_thing',
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    await initializeDatabase();
    seedInitialHabitsIfNeeded();
    set({ isInitialized: true });
    get().loadHabits();
  },

  setLayoutMode: (mode) => set({ layoutMode: mode }),

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().loadHabits();
  },

  loadHabits: () => {
    const { selectedDate } = get();
    const habits = habitRepository.getHabitsForDate(selectedDate);
    set({ habits });

    // Update active sheet item if currently open
    const currentActive = get().activeHabitForSheet;
    if (currentActive) {
      const refreshed = habits.find((h) => h.id === currentActive.id) || null;
      set({ activeHabitForSheet: refreshed });
    }
  },

  toggleHabitStatus: (habitId) => {
    const { selectedDate, habits } = get();
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const nextStatus = habit.status === 'completed' ? 'pending' : 'completed';
    const nextValue = nextStatus === 'completed' ? habit.targetCount : 0;

    habitRepository.setHabitStatus(habitId, selectedDate, nextStatus, nextValue);
    get().loadHabits();
  },

  skipHabit: (habitId) => {
    const { selectedDate } = get();
    habitRepository.setHabitStatus(habitId, selectedDate, 'skipped', 0);
    get().loadHabits();
    set({ activeHabitForSheet: null });
  },

  deleteHabit: (habitId) => {
    habitRepository.deleteHabit(habitId);
    get().loadHabits();
    set({ activeHabitForSheet: null });
  },

  openHabitSheet: (habit) => set({ activeHabitForSheet: habit }),

  closeHabitSheet: () => set({ activeHabitForSheet: null }),

  setActiveHabitForStats: (habitId) => set({ activeHabitForStatsId: habitId }),

  addHabit: (title, description, category, timeOfDay) => {
    const newHabit = {
      id: `habit_${Date.now()}`,
      title,
      description,
      icon: 'sparkles-outline',
      category,
      timeOfDay,
      frequencyType: 'every_day' as const,
      frequencyDays: [1, 2, 3, 4, 5, 6, 7],
      targetCount: 1,
      unit: 'day',
      createdAt: new Date().toISOString(),
    };
    habitRepository.insertHabit(newHabit);
    get().loadHabits();
  },

  addHabitNote: (habitId, note) => {
    const { selectedDate, habits } = get();
    const habit = habits.find((h) => h.id === habitId);
    const status = habit?.status || 'pending';
    habitRepository.setHabitStatus(habitId, selectedDate, status, habit?.currentValue || 0, note);
    get().loadHabits();
  },
}));

