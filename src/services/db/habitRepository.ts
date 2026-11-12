import { getDatabase } from './database';
import { Habit, HabitLog, HabitLogStatus, HabitWithStatus, HabitStatistics } from '../../types/habit';
import { format, subDays } from 'date-fns';

/**
 * SQLite Repository for Habits and Daily Logs
 */

export const habitRepository = {
  /**
   * Fetch all active habits
   */
  getAllHabits(): Habit[] {
    const db = getDatabase();
    const rows = db.getAllSync<any>(
      `SELECT * FROM habits WHERE archived = 0 ORDER BY created_at ASC`
    );

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      icon: row.icon || 'sparkles',
      category: row.category || 'general',
      timeOfDay: row.time_of_day,
      frequencyType: row.frequency_type,
      frequencyDays: row.frequency_days ? row.frequency_days.split(',').map(Number) : [1, 2, 3, 4, 5, 6, 7],
      targetCount: row.target_count || 1,
      unit: row.unit || 'times',
      createdAt: row.created_at,
      archived: Boolean(row.archived),
    }));
  },

  /**
   * Fetch habits with daily status for a specific date (YYYY-MM-DD)
   */
  getHabitsForDate(dateStr: string): HabitWithStatus[] {
    const habits = this.getAllHabits();
    const db = getDatabase();

    const logs = db.getAllSync<any>(
      `SELECT * FROM habit_logs WHERE date = ?`,
      [dateStr]
    );

    const logMap = new Map<string, any>();
    logs.forEach((log) => logMap.set(log.habit_id, log));

    return habits.map((habit) => {
      const log = logMap.get(habit.id);
      const status: HabitLogStatus = log ? log.status : 'pending';
      const currentValue = log ? log.value : 0;
      const stats = this.getHabitStatistics(habit.id);

      return {
        ...habit,
        status,
        currentValue,
        isCompleted: status === 'completed',
        isSkipped: status === 'skipped',
        currentStreak: stats.streak,
        bestStreak: stats.bestRun,
        totalDays: stats.totalDays,
        daysCompleted: stats.daysDone,
        consistencyPercentage: stats.consistencyPercentage,
      };
    });
  },

  /**
   * Insert a new habit
   */
  insertHabit(habit: Habit): void {
    const db = getDatabase();
    db.runSync(
      `INSERT INTO habits (id, title, description, icon, category, time_of_day, frequency_type, frequency_days, target_count, unit, created_at, archived)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        habit.id,
        habit.title,
        habit.description,
        habit.icon,
        habit.category,
        habit.timeOfDay,
        habit.frequencyType,
        habit.frequencyDays.join(','),
        habit.targetCount,
        habit.unit,
        habit.createdAt,
        habit.archived ? 1 : 0,
      ]
    );
  },

  /**
   * Log or update habit completion for a specific date
   */
  setHabitStatus(habitId: string, dateStr: string, status: HabitLogStatus, value = 1, notes?: string): void {
    const db = getDatabase();
    const existing = db.getFirstSync<any>(
      `SELECT id FROM habit_logs WHERE habit_id = ? AND date = ?`,
      [habitId, dateStr]
    );

    const now = new Date().toISOString();

    if (existing) {
      db.runSync(
        `UPDATE habit_logs SET status = ?, value = ?, notes = COALESCE(?, notes), created_at = ? WHERE id = ?`,
        [status, value, notes ?? null, now, existing.id]
      );
    } else {
      const logId = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      db.runSync(
        `INSERT INTO habit_logs (id, habit_id, date, status, value, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [logId, habitId, dateStr, status, value, notes ?? null, now]
      );
    }
  },

  /**
   * Delete habit
   */
  deleteHabit(habitId: string): void {
    const db = getDatabase();
    db.runSync(`DELETE FROM habits WHERE id = ?`, [habitId]);
    db.runSync(`DELETE FROM habit_logs WHERE habit_id = ?`, [habitId]);
  },

  /**
   * Fetch all habit logs within an inclusive date range (YYYY-MM-DD)
   */
  getLogsBetween(startDate: string, endDate: string): HabitLog[] {
    const db = getDatabase();
    const rows = db.getAllSync<any>(
      `SELECT * FROM habit_logs WHERE date >= ? AND date <= ? ORDER BY date ASC`,
      [startDate, endDate]
    );
    return rows.map((row) => ({
      id: row.id,
      habitId: row.habit_id,
      date: row.date,
      status: row.status as HabitLogStatus,
      value: row.value ?? 0,
      notes: row.notes ?? undefined,
      createdAt: row.created_at,
    }));
  },

  /**
   * Calculate detailed statistics for a habit (matching Routinr's exact 2x2 stats card and 30-day history)
   */
  getHabitStatistics(habitId: string): HabitStatistics {
    const db = getDatabase();
    const logs = db.getAllSync<any>(
      `SELECT date, status FROM habit_logs WHERE habit_id = ? ORDER BY date DESC`,
      [habitId]
    );

    const completedLogs = logs.filter((l) => l.status === 'completed');
    const daysDone = completedLogs.length;

    // Build 30-day history
    const dailyHistory: { date: string; dayNumber: number; completed: boolean }[] = [];
    const today = new Date();
    const logDateSet = new Set(completedLogs.map((l) => l.date));

    for (let i = 29; i >= 0; i--) {
      const d = subDays(today, i);
      const dStr = format(d, 'yyyy-MM-dd');
      dailyHistory.push({
        date: dStr,
        dayNumber: d.getDate(),
        completed: logDateSet.has(dStr),
      });
    }

    const totalTrackedDays = Math.max(logs.length, 1);
    const consistencyPercentage = totalTrackedDays > 0 ? Math.round((daysDone / totalTrackedDays) * 100) : 100;
    const daysMissed = logs.filter((l) => l.status === 'skipped').length;
    const currentStreak = daysDone > 0 ? Math.min(daysDone, 1) : 0;
    const bestRun = Math.max(currentStreak, 1);

    const unlockedLevel = daysDone >= 3 ? 3 : daysDone >= 1 ? 1 : 0;
    const checkInsNeededForInsights = Math.max(0, 3 - daysDone);

    return {
      habitId,
      consistencyPercentage: consistencyPercentage || 100,
      daysDone,
      totalDays: totalTrackedDays,
      daysMissed,
      bestRun,
      currentRun: currentStreak,
      streak: currentStreak,
      unlockedLevel,
      checkInsNeededForInsights,
      dailyHistory,
    };
  },
};

