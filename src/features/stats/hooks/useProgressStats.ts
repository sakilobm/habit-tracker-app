import { useState, useMemo, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addWeeks,
  addMonths,
  addYears,
  eachDayOfInterval,
  eachMonthOfInterval,
  getISODay,
  isAfter,
  isSameDay,
  startOfDay,
  differenceInCalendarDays,
  subDays,
} from 'date-fns';
import { useHabitStore } from '../../habits/stores/habitStore';
import { habitRepository } from '../../../services/db/habitRepository';
import { Habit, HabitLog, HabitWithStatus } from '../../../types/habit';

export type ProgressPeriod = 'week' | 'month' | 'year';

export type ProgressCardId =
  | 'streak'
  | 'completion'
  | 'pace'
  | 'dayByDay'
  | 'habitsByDay'
  | 'highlights';

export interface StreakDayItem {
  dateStr: string;
  letter: string;
  dayNumber: string;
  isToday: boolean;
  isFuture: boolean;
  progress: number; // 0..1
  isPerfect: boolean;
}

export interface DayBarItem {
  key: string;
  label: string;
  percentage: number;
  completedCount: number;
  dueCount: number;
  isToday: boolean;
  isFuture: boolean;
}

export type HabitDayCellStatus = 'done' | 'missed' | 'skipped' | 'not_due' | 'today_pending';

export interface HabitMatrixRow {
  habit: HabitWithStatus;
  percentage: number;
  cells: { dateStr: string; status: HabitDayCellStatus }[];
}

export interface HighlightItem {
  habit: HabitWithStatus;
  type: 'attention' | 'top';
  label: string;
  percentage: number;
}

export interface ProgressAnalyticsData {
  periodLabel: string;
  canGoNext: boolean;
  currentStreak: number;
  streakDays: StreakDayItem[];
  completionPct: number;
  completedCheckIns: number;
  elapsedDueCheckIns: number;
  statusHeadline: string;
  deltaPts: number;
  previousPeriodLabel: string;
  perfectDays: number;
  elapsedDaysCount: number;
  bestRun: number;
  activeDays: number;
  daysLeftInPeriod: number;
  minPossiblePct: number;
  maxPossiblePct: number;
  previousPeriodPct: number;
  neededToMatchPrev: number;
  remainingCheckIns: number;
  leftToday: number;
  pacePerfectDays: number;
  paceElapsedDays: number;
  dayBars: DayBarItem[];
  dayAveragePct: number;
  matrixHeaders: { letter: string; isToday: boolean }[];
  habitRows: HabitMatrixRow[];
  highlights: HighlightItem[];
}

const DEFAULT_CARD_VISIBILITY: Record<ProgressCardId, boolean> = {
  streak: true,
  completion: true,
  pace: true,
  dayByDay: true,
  habitsByDay: true,
  highlights: true,
};

function isHabitDueOnDate(habit: Habit, date: Date): boolean {
  const isoDay = getISODay(date); // 1 = Mon .. 7 = Sun
  switch (habit.frequencyType) {
    case 'every_day':
      return true;
    case 'weekdays':
      return isoDay >= 1 && isoDay <= 5;
    case 'weekends':
      return isoDay === 6 || isoDay === 7;
    case 'custom':
      return habit.frequencyDays.includes(isoDay);
    default:
      return true;
  }
}

function getStatusHeadline(pct: number): string {
  if (pct === 0) return 'Fresh start';
  if (pct < 40) return 'Building momentum';
  if (pct < 75) return 'Steady progress';
  if (pct < 95) return 'Strong pace';
  return 'Peak consistency';
}

/**
 * Headless Hook: Progress & Stats Analytics
 * Computes real SQLite-backed Week, Month, and Year metrics, pace projections,
 * day-by-day bar series, habit matrix cells, highlights, and card customization state.
 */
export function useProgressStats() {
  const { habits, isInitialized, initialize, openHabitSheet } = useHabitStore();
  const [period, setPeriod] = useState<ProgressPeriod>('week');
  const [offset, setOffset] = useState(0); // 0 = current period, -1 = previous, etc.
  const [selectedBarKey, setSelectedBarKey] = useState<string | null>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isCompletionInfoOpen, setIsCompletionInfoOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Record<ProgressCardId, boolean>>(
    DEFAULT_CARD_VISIBILITY
  );

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  const handleSelectPeriod = useCallback((next: ProgressPeriod) => {
    Haptics.selectionAsync();
    setPeriod(next);
    setOffset(0);
    setSelectedBarKey(null);
  }, []);

  const handleStepPeriod = useCallback((delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOffset((prev) => Math.min(0, prev + delta));
    setSelectedBarKey(null);
  }, []);

  const handleToggleCard = useCallback((cardId: ProgressCardId) => {
    Haptics.selectionAsync();
    setVisibleCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  }, []);

  const handleResetCards = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setVisibleCards(DEFAULT_CARD_VISIBILITY);
  }, []);

  const handlePressHabit = useCallback(
    (habit: HabitWithStatus) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      openHabitSheet(habit);
    },
    [openHabitSheet]
  );

  const analytics: ProgressAnalyticsData = useMemo(() => {
    const today = startOfDay(new Date());
    const todayStr = format(today, 'yyyy-MM-dd');

    // Resolve current & previous period date intervals
    let periodStart: Date;
    let periodEnd: Date;
    let prevStart: Date;
    let prevEnd: Date;
    let periodLabel: string;
    let previousPeriodLabel: string;

    if (period === 'week') {
      const anchor = addWeeks(today, offset);
      periodStart = startOfWeek(anchor, { weekStartsOn: 1 });
      periodEnd = endOfWeek(anchor, { weekStartsOn: 1 });
      prevStart = addWeeks(periodStart, -1);
      prevEnd = addWeeks(periodEnd, -1);
      periodLabel =
        offset === 0
          ? 'This week'
          : offset === -1
            ? 'Last week'
            : `${format(periodStart, 'MMM d')} – ${format(periodEnd, 'MMM d')}`;
      previousPeriodLabel = offset === 0 ? 'vs last week' : 'vs prior week';
    } else if (period === 'month') {
      const anchor = addMonths(today, offset);
      periodStart = startOfMonth(anchor);
      periodEnd = endOfMonth(anchor);
      prevStart = startOfMonth(addMonths(anchor, -1));
      prevEnd = endOfMonth(addMonths(anchor, -1));
      periodLabel = offset === 0 ? 'This month' : format(anchor, 'MMMM yyyy');
      previousPeriodLabel = offset === 0 ? 'vs last month' : 'vs prior month';
    } else {
      const anchor = addYears(today, offset);
      periodStart = startOfYear(anchor);
      periodEnd = endOfYear(anchor);
      prevStart = startOfYear(addYears(anchor, -1));
      prevEnd = endOfYear(addYears(anchor, -1));
      periodLabel = offset === 0 ? 'This year' : format(anchor, 'yyyy');
      previousPeriodLabel = offset === 0 ? 'vs last year' : 'vs prior year';
    }

    const rangeStartStr = format(prevStart, 'yyyy-MM-dd');
    const rangeEndStr = format(periodEnd, 'yyyy-MM-dd');
    const allLogs: HabitLog[] = habitRepository.getLogsBetween(rangeStartStr, rangeEndStr);

    // Map `${habitId}_${dateStr}` -> HabitLog
    const logLookup = new Map<string, HabitLog>();
    allLogs.forEach((l) => logLookup.set(`${l.habitId}_${l.date}`, l));

    const periodDays = eachDayOfInterval({ start: periodStart, end: periodEnd });
    const prevDays = eachDayOfInterval({ start: prevStart, end: prevEnd });

    // Calculate current overall streak up to today (consecutive perfect or active days)
    let currentStreak = 0;
    if (habits.length > 0) {
      const streakLookbackStart = format(subDays(today, 90), 'yyyy-MM-dd');
      const streakLogs = habitRepository.getLogsBetween(streakLookbackStart, todayStr);
      const streakMap = new Map<string, Set<string>>();
      streakLogs.forEach((l) => {
        if (l.status === 'completed') {
          if (!streakMap.has(l.date)) streakMap.set(l.date, new Set());
          streakMap.get(l.date)!.add(l.habitId);
        }
      });

      for (let i = 0; i < 90; i++) {
        const d = subDays(today, i);
        const dStr = format(d, 'yyyy-MM-dd');
        const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
        if (dueHabits.length === 0) continue;
        const doneSet = streakMap.get(dStr);
        const allDone = doneSet ? dueHabits.every((h) => doneSet.has(h.id)) : false;
        if (allDone) {
          currentStreak++;
        } else if (i === 0) {
          // Today not completed yet doesn't break yesterday's streak check
          continue;
        } else {
          break;
        }
      }
    }

    // Period check-in totals
    let completedCheckIns = 0;
    let elapsedDueCheckIns = 0;
    let totalPeriodDueCheckIns = 0;
    let perfectDays = 0;
    let activeDays = 0;
    let elapsedDaysCount = 0;
    let bestRun = 0;
    let runningPerfect = 0;
    let leftToday = 0;

    periodDays.forEach((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
      const isFuture = isAfter(d, today);
      const isToday = isSameDay(d, today);
      const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
      totalPeriodDueCheckIns += dueHabits.length;

      if (!isFuture) {
        elapsedDaysCount++;
        elapsedDueCheckIns += dueHabits.length;

        let dayDone = 0;
        dueHabits.forEach((h) => {
          const log = logLookup.get(`${h.id}_${dStr}`);
          if (log?.status === 'completed') {
            dayDone++;
            completedCheckIns++;
          } else if (isToday && log?.status !== 'skipped') {
            leftToday++;
          }
        });

        if (dayDone > 0) activeDays++;
        if (dueHabits.length > 0 && dayDone === dueHabits.length) {
          perfectDays++;
          runningPerfect++;
          bestRun = Math.max(bestRun, runningPerfect);
        } else {
          runningPerfect = 0;
        }
      }
    });

    // Previous period completion percentage
    let prevDone = 0;
    let prevDue = 0;
    prevDays.forEach((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
      const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
      prevDue += dueHabits.length;
      dueHabits.forEach((h) => {
        if (logLookup.get(`${h.id}_${dStr}`)?.status === 'completed') {
          prevDone++;
        }
      });
    });

    const completionPct =
      elapsedDueCheckIns > 0 ? Math.round((completedCheckIns / elapsedDueCheckIns) * 100) : 0;
    const previousPeriodPct = prevDue > 0 ? Math.round((prevDone / prevDue) * 100) : 0;
    const deltaPts = completionPct - previousPeriodPct;

    // Pace projections
    const remainingDays = periodDays.filter((d) => isAfter(d, today));
    const daysLeftInPeriod = remainingDays.length;
    const remainingCheckIns = Math.max(0, totalPeriodDueCheckIns - completedCheckIns);
    const minPossiblePct =
      totalPeriodDueCheckIns > 0 ? Math.round((completedCheckIns / totalPeriodDueCheckIns) * 100) : 0;
    const maxPossiblePct =
      totalPeriodDueCheckIns > 0
        ? Math.round(((completedCheckIns + remainingCheckIns) / totalPeriodDueCheckIns) * 100)
        : 0;
    const targetToMatchPrev = Math.ceil((previousPeriodPct / 100) * totalPeriodDueCheckIns);
    const neededToMatchPrev = Math.max(0, targetToMatchPrev - completedCheckIns);

    // 7-day strip for Streak card (current week window around anchor)
    const stripAnchor = period === 'week' ? periodDays : periodDays.slice(-7);
    const streakDays: StreakDayItem[] = stripAnchor.map((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
      const isFuture = isAfter(d, today);
      const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
      let done = 0;
      dueHabits.forEach((h) => {
        if (logLookup.get(`${h.id}_${dStr}`)?.status === 'completed') done++;
      });
      const progress = dueHabits.length > 0 ? done / dueHabits.length : 0;
      return {
        dateStr: dStr,
        letter: format(d, 'EEEEE'),
        dayNumber: format(d, 'd'),
        isToday: isSameDay(d, today),
        isFuture,
        progress,
        isPerfect: dueHabits.length > 0 && done === dueHabits.length,
      };
    });

    // Day-by-day bars
    let dayBars: DayBarItem[] = [];
    if (period === 'week') {
      dayBars = periodDays.map((d) => {
        const dStr = format(d, 'yyyy-MM-dd');
        const isFuture = isAfter(d, today);
        const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
        let done = 0;
        if (!isFuture) {
          dueHabits.forEach((h) => {
            if (logLookup.get(`${h.id}_${dStr}`)?.status === 'completed') done++;
          });
        }
        const pct = !isFuture && dueHabits.length > 0 ? Math.round((done / dueHabits.length) * 100) : 0;
        return {
          key: dStr,
          label: format(d, 'EEE'),
          percentage: pct,
          completedCount: done,
          dueCount: dueHabits.length,
          isToday: isSameDay(d, today),
          isFuture,
        };
      });
    } else if (period === 'month') {
      // Group month into weekly buckets (W1..W5)
      for (let i = 0; i < periodDays.length; i += 7) {
        const chunk = periodDays.slice(i, i + 7);
        let cDone = 0;
        let cDue = 0;
        let hasToday = false;
        let allFuture = true;
        chunk.forEach((d) => {
          if (isSameDay(d, today)) hasToday = true;
          if (!isAfter(d, today)) {
            allFuture = false;
            const dStr = format(d, 'yyyy-MM-dd');
            const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
            cDue += dueHabits.length;
            dueHabits.forEach((h) => {
              if (logLookup.get(`${h.id}_${dStr}`)?.status === 'completed') cDone++;
            });
          }
        });
        const pct = cDue > 0 ? Math.round((cDone / cDue) * 100) : 0;
        dayBars.push({
          key: `W${Math.floor(i / 7) + 1}`,
          label: `W${Math.floor(i / 7) + 1}`,
          percentage: pct,
          completedCount: cDone,
          dueCount: cDue,
          isToday: hasToday,
          isFuture: allFuture,
        });
      }
    } else {
      const months = eachMonthOfInterval({ start: periodStart, end: periodEnd });
      dayBars = months.map((m) => {
        const mStart = startOfMonth(m);
        const mEnd = endOfMonth(m);
        const mDays = eachDayOfInterval({ start: mStart, end: mEnd });
        let mDone = 0;
        let mDue = 0;
        let allFuture = true;
        mDays.forEach((d) => {
          if (!isAfter(d, today)) {
            allFuture = false;
            const dStr = format(d, 'yyyy-MM-dd');
            const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
            mDue += dueHabits.length;
            dueHabits.forEach((h) => {
              if (logLookup.get(`${h.id}_${dStr}`)?.status === 'completed') mDone++;
            });
          }
        });
        return {
          key: format(m, 'yyyy-MM'),
          label: format(m, 'MMM').slice(0, 1),
          percentage: mDue > 0 ? Math.round((mDone / mDue) * 100) : 0,
          completedCount: mDone,
          dueCount: mDue,
          isToday: m.getMonth() === today.getMonth() && m.getFullYear() === today.getFullYear(),
          isFuture: allFuture,
        };
      });
    }

    const activeBars = dayBars.filter((b) => !b.isFuture);
    const dayAveragePct =
      activeBars.length > 0
        ? Math.round(activeBars.reduce((acc, b) => acc + b.percentage, 0) / activeBars.length)
        : 0;

    // Habits by day matrix (7-column view for week or latest 7 days of month/year)
    const matrixDays =
      period === 'week'
        ? periodDays
        : eachDayOfInterval({
            start: subDays(isAfter(periodEnd, today) ? today : periodEnd, 6),
            end: isAfter(periodEnd, today) ? today : periodEnd,
          });

    const matrixHeaders = matrixDays.map((d) => ({
      letter: format(d, 'EEEEE'),
      isToday: isSameDay(d, today),
    }));

    const habitRows: HabitMatrixRow[] = habits.map((habit) => {
      let hDone = 0;
      let hElapsedDue = 0;

      periodDays.forEach((d) => {
        if (!isAfter(d, today) && isHabitDueOnDate(habit, d)) {
          hElapsedDue++;
          const dStr = format(d, 'yyyy-MM-dd');
          if (logLookup.get(`${habit.id}_${dStr}`)?.status === 'completed') hDone++;
        }
      });

      const cells = matrixDays.map((d) => {
        const dStr = format(d, 'yyyy-MM-dd');
        const isFuture = isAfter(d, today);
        const isToday = isSameDay(d, today);
        const due = isHabitDueOnDate(habit, d);
        if (!due || isFuture) {
          return { dateStr: dStr, status: 'not_due' as HabitDayCellStatus };
        }
        const log = logLookup.get(`${habit.id}_${dStr}`);
        if (log?.status === 'completed') {
          return { dateStr: dStr, status: 'done' as HabitDayCellStatus };
        }
        if (log?.status === 'skipped') {
          return { dateStr: dStr, status: 'skipped' as HabitDayCellStatus };
        }
        if (isToday) {
          return { dateStr: dStr, status: 'today_pending' as HabitDayCellStatus };
        }
        return { dateStr: dStr, status: 'missed' as HabitDayCellStatus };
      });

      return {
        habit,
        percentage: hElapsedDue > 0 ? Math.round((hDone / hElapsedDue) * 100) : 0,
        cells,
      };
    });

    // Highlights ("Needs attention" lowest %, plus "Top performer" if >= 75%)
    const highlights: HighlightItem[] = [];
    if (habitRows.length > 0) {
      const sortedAsc = [...habitRows].sort((a, b) => a.percentage - b.percentage);
      const lowest = sortedAsc[0];
      const highest = sortedAsc[sortedAsc.length - 1];

      if (lowest.percentage < 60) {
        highlights.push({
          habit: lowest.habit,
          type: 'attention',
          label: 'Needs attention',
          percentage: lowest.percentage,
        });
      }
      if (highest.percentage >= 75 && highest.habit.id !== lowest.habit.id) {
        highlights.push({
          habit: highest.habit,
          type: 'top',
          label: 'Top performer',
          percentage: highest.percentage,
        });
      } else if (highlights.length === 0) {
        highlights.push({
          habit: lowest.habit,
          type: lowest.percentage >= 75 ? 'top' : 'attention',
          label: lowest.percentage >= 75 ? 'Top performer' : 'Needs attention',
          percentage: lowest.percentage,
        });
      }
    }

    const paceElapsedDays =
      differenceInCalendarDays(isAfter(periodEnd, today) ? today : periodEnd, periodStart) + 1;

    return {
      periodLabel,
      canGoNext: offset < 0,
      currentStreak,
      streakDays,
      completionPct,
      completedCheckIns,
      elapsedDueCheckIns,
      statusHeadline: getStatusHeadline(completionPct),
      deltaPts,
      previousPeriodLabel,
      perfectDays,
      elapsedDaysCount,
      bestRun,
      activeDays,
      daysLeftInPeriod,
      minPossiblePct,
      maxPossiblePct,
      previousPeriodPct,
      neededToMatchPrev,
      remainingCheckIns,
      leftToday,
      pacePerfectDays: perfectDays,
      paceElapsedDays: Math.max(0, paceElapsedDays),
      dayBars,
      dayAveragePct,
      matrixHeaders,
      habitRows,
      highlights,
    };
  }, [habits, period, offset]);

  return {
    period,
    analytics,
    selectedBarKey,
    setSelectedBarKey,
    visibleCards,
    isCustomizeOpen,
    setIsCustomizeOpen,
    isCompletionInfoOpen,
    setIsCompletionInfoOpen,
    handleSelectPeriod,
    handleStepPeriod,
    handleToggleCard,
    handleResetCards,
    handlePressHabit,
  };
}

