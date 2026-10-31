/**
 * Habit Tracking Core Type Definitions
 * Represents habits, logs, frequencies, view modes, and statistical analytics.
 */

export type HabitLayoutMode = 'list' | 'dual' | 'grid';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type FrequencyType = 'every_day' | 'weekdays' | 'weekends' | 'custom';

export type HabitLogStatus = 'completed' | 'skipped' | 'pending';

export interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  timeOfDay: TimeOfDay;
  frequencyType: FrequencyType;
  frequencyDays: number[]; // 1 = Mon, 7 = Sun
  targetCount: number;
  unit: string;
  createdAt: string;
  archived?: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: HabitLogStatus;
  value: number;
  notes?: string;
  createdAt: string;
}

export interface HabitWithStatus extends Habit {
  status: HabitLogStatus;
  currentValue: number;
  isCompleted: boolean;
  isSkipped: boolean;
  currentStreak: number;
  bestStreak: number;
  totalDays: number;
  daysCompleted: number;
  consistencyPercentage: number;
}

export interface HabitStatistics {
  habitId: string;
  consistencyPercentage: number;
  daysDone: number;
  totalDays: number;
  daysMissed: number;
  bestRun: number;
  currentRun: number;
  streak: number;
  unlockedLevel: number; // 1, 2, or 3
  checkInsNeededForInsights: number;
  dailyHistory: { date: string; dayNumber: number; completed: boolean }[];
}

