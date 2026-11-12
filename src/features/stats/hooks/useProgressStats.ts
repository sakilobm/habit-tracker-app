import { useState, useMemo, useCallback, useEffect } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
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

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type ProgressPeriod = 'week' | 'month' | 'year';

export type ProgressCardId =
  | 'streak'
  | 'completion'
  | 'pace'
  | 'dayByDay'
  | 'calendar'
  | 'habitsByDay'
  | 'dayMix'
  | 'habitMap'
  | 'bounceBack'
  | 'byWeekday'
  | 'habitsRanked'
  | 'highlights';

export interface StreakDayItem {
  dateStr: string;
  letter: string;
  dayNumber: string;
  isToday: boolean;
  isFuture: boolean;
  progress: number;
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

export interface CalendarDayItem {
  dateStr: string;
  dayNumber: number;
  isToday: boolean;
  isFuture: boolean;
  doneCount: number;
  dueCount: number;
  level: 'none' | 'some' | 'most' | 'all' | 'future';
}

export interface DayMixData {
  totalElapsedDays: number;
  perfect: number;
  partial: number;
  nothingDone: number;
  daysOff: number;
}

export interface HabitMapPoint {
  habit: HabitWithStatus;
  completionPct: number;
  deltaPct: number;
  quadrant: 'rising' | 'thriving' | 'needs_love' | 'slipping';
}

export interface BounceBackData {
  recoveryPct: number;
  recoveredCount: number;
  totalMisses: number;
  missedTwice: number;
  avgSlumpDays: number;
  longestSlumpDays: number;
  slump1Day: number;
  slump2Day: number;
  slump3PlusDay: number;
}

export interface WeekdayBarItem {
  dayIndex: number;
  label: string;
  percentage: number;
  isBest: boolean;
}

export interface RankedHabitItem {
  habit: HabitWithStatus;
  doneCount: number;
  dueCount: number;
  percentage: number;
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
  hasPreviousData: boolean;
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
  calendarLeadingBlanks: number;
  calendarDays: CalendarDayItem[];
  dayMix: DayMixData;
  habitMapPoints: HabitMapPoint[];
  bounceBack: BounceBackData;
  weekdayBars: WeekdayBarItem[];
  weekdaySummary: string;
  rankedHabits: RankedHabitItem[];
  highlights: HighlightItem[];
}

const DEFAULT_CARD_VISIBILITY: Record<ProgressCardId, boolean> = {
  streak: true,
  completion: true,
  pace: true,
  dayByDay: true,
  calendar: true,
  habitsByDay: true,
  dayMix: true,
  habitMap: true,
  bounceBack: true,
  byWeekday: true,
  habitsRanked: true,
  highlights: true,
};

function isHabitDueOnDate(habit: Habit, date: Date): boolean {
  const isoDay = getISODay(date);
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
  if (pct < 40) return 'Building up';
  if (pct < 75) return 'Steady progress';
  if (pct < 95) return 'Strong pace';
  return 'Peak consistency';
}

const smoothLayout = () =>
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

/**
 * Headless Hook: Fast SQLite-Backed Progress & Stats Analytics
 * Computes Week, Month, and Year metrics in a single batched DB query with memoized selectors.
 */
export function useProgressStats() {
  const { habits, isInitialized, initialize, openHabitSheet } = useHabitStore();
  const [period, setPeriod] = useState<ProgressPeriod>('week');
  const [offset, setOffset] = useState(0);
  const [selectedBarKey, setSelectedBarKey] = useState<string | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [habitsSortAsc, setHabitsSortAsc] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isCompletionInfoOpen, setIsCompletionInfoOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Record<ProgressCardId, boolean>>(
    DEFAULT_CARD_VISIBILITY
  );

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [isInitialized, initialize]);

  const handleSelectPeriod = useCallback((next: ProgressPeriod) => {
    Haptics.selectionAsync();
    smoothLayout();
    setPeriod(next);
    setOffset(0);
    setSelectedBarKey(null);
    setSelectedCalendarDate(null);
  }, []);

  const handleStepPeriod = useCallback((delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    smoothLayout();
    setOffset((prev) => Math.min(0, prev + delta));
    setSelectedBarKey(null);
    setSelectedCalendarDate(null);
  }, []);

  const handleSelectBar = useCallback((key: string | null) => {
    Haptics.selectionAsync();
    smoothLayout();
    setSelectedBarKey(key);
  }, []);

  const handleSelectCalendarDay = useCallback((dateStr: string | null) => {
    Haptics.selectionAsync();
    smoothLayout();
    setSelectedCalendarDate((prev) => (prev === dateStr ? null : dateStr));
  }, []);

  const handleToggleHabitsSort = useCallback(() => {
    Haptics.selectionAsync();
    smoothLayout();
    setHabitsSortAsc((prev) => !prev);
  }, []);

  const handleToggleCompletionInfo = useCallback(() => {
    smoothLayout();
    setIsCompletionInfoOpen((v) => !v);
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

    // Single batched SQLite query covering prevStart..periodEnd AND 90-day streak lookback
    const lookbackStart = subDays(today, 90);
    const queryStart = lookbackStart < prevStart ? lookbackStart : prevStart;
    const queryEnd = periodEnd > today ? periodEnd : today;
    const allLogs: HabitLog[] = habitRepository.getLogsBetween(
      format(queryStart, 'yyyy-MM-dd'),
      format(queryEnd, 'yyyy-MM-dd')
    );

    const logLookup = new Map<string, HabitLog>();
    const streakMap = new Map<string, Set<string>>();
    allLogs.forEach((l) => {
      logLookup.set(`${l.habitId}_${l.date}`, l);
      if (l.status === 'completed') {
        if (!streakMap.has(l.date)) streakMap.set(l.date, new Set());
        streakMap.get(l.date)!.add(l.habitId);
      }
    });

    const periodDays = eachDayOfInterval({ start: periodStart, end: periodEnd });
    const prevDays = eachDayOfInterval({ start: prevStart, end: prevEnd });

    // Current overall streak
    let currentStreak = 0;
    if (habits.length > 0) {
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
          continue;
        } else {
          break;
        }
      }
    }

    // Period check-in totals & Day Mix & Weekday & Calendar
    let completedCheckIns = 0;
    let elapsedDueCheckIns = 0;
    let totalPeriodDueCheckIns = 0;
    let perfectDays = 0;
    let activeDays = 0;
    let elapsedDaysCount = 0;
    let bestRun = 0;
    let runningPerfect = 0;
    let leftToday = 0;

    let mixPerfect = 0;
    let mixPartial = 0;
    let mixNothing = 0;
    let mixOff = 0;

    const weekdayDone = [0, 0, 0, 0, 0, 0, 0];
    const weekdayDue = [0, 0, 0, 0, 0, 0, 0];

    const calendarDays: CalendarDayItem[] = periodDays.map((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
      const isFuture = isAfter(d, today);
      const isToday = isSameDay(d, today);
      const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
      totalPeriodDueCheckIns += dueHabits.length;

      let dayDone = 0;
      dueHabits.forEach((h) => {
        const log = logLookup.get(`${h.id}_${dStr}`);
        if (log?.status === 'completed') dayDone++;
        else if (isToday && log?.status !== 'skipped') leftToday++;
      });

      if (!isFuture) {
        elapsedDaysCount++;
        elapsedDueCheckIns += dueHabits.length;
        completedCheckIns += dayDone;

        const wdIdx = getISODay(d) - 1;
        weekdayDue[wdIdx] += dueHabits.length;
        weekdayDone[wdIdx] += dayDone;

        if (dayDone > 0) activeDays++;
        if (dueHabits.length > 0 && dayDone === dueHabits.length) {
          perfectDays++;
          runningPerfect++;
          bestRun = Math.max(bestRun, runningPerfect);
        } else {
          runningPerfect = 0;
        }

        // Day mix excludes today (until today is over)
        if (!isToday) {
          if (dueHabits.length === 0) mixOff++;
          else if (dayDone === dueHabits.length) mixPerfect++;
          else if (dayDone > 0) mixPartial++;
          else mixNothing++;
        }
      }

      const ratio = dueHabits.length > 0 ? dayDone / dueHabits.length : 0;
      const level: CalendarDayItem['level'] = isFuture
        ? 'future'
        : dueHabits.length === 0 || dayDone === 0
          ? 'none'
          : ratio >= 1
            ? 'all'
            : ratio >= 0.5
              ? 'most'
              : 'some';

      return {
        dateStr: dStr,
        dayNumber: d.getDate(),
        isToday,
        isFuture,
        doneCount: dayDone,
        dueCount: dueHabits.length,
        level,
      };
    });

    // Previous period totals (overall + per habit)
    let prevDone = 0;
    let prevDue = 0;
    let hasPreviousData = false;
    const prevHabitDone = new Map<string, number>();
    const prevHabitDue = new Map<string, number>();

    prevDays.forEach((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
      const dueHabits = habits.filter((h) => isHabitDueOnDate(h, d));
      prevDue += dueHabits.length;
      dueHabits.forEach((h) => {
        prevHabitDue.set(h.id, (prevHabitDue.get(h.id) || 0) + 1);
        const log = logLookup.get(`${h.id}_${dStr}`);
        if (log) hasPreviousData = true;
        if (log?.status === 'completed') {
          prevDone++;
          prevHabitDone.set(h.id, (prevHabitDone.get(h.id) || 0) + 1);
        }
      });
    });

    const completionPct =
      elapsedDueCheckIns > 0 ? Math.round((completedCheckIns / elapsedDueCheckIns) * 100) : 0;
    const previousPeriodPct = prevDue > 0 ? Math.round((prevDone / prevDue) * 100) : 0;
    const deltaPts = completionPct - previousPeriodPct;

    // Pace projections
    const daysLeftInPeriod = periodDays.filter((d) => isAfter(d, today)).length;
    const remainingCheckIns = Math.max(0, totalPeriodDueCheckIns - completedCheckIns);
    const minPossiblePct =
      totalPeriodDueCheckIns > 0 ? Math.round((completedCheckIns / totalPeriodDueCheckIns) * 100) : 0;
    const maxPossiblePct =
      totalPeriodDueCheckIns > 0
        ? Math.round(((completedCheckIns + remainingCheckIns) / totalPeriodDueCheckIns) * 100)
        : 0;
    const targetToMatchPrev = Math.ceil((previousPeriodPct / 100) * totalPeriodDueCheckIns);
    const neededToMatchPrev = Math.max(0, targetToMatchPrev - completedCheckIns);

    // 7-day strip for Streak card (always current week Monday..Sunday around anchor)
    const stripAnchorStart =
      period === 'week' ? periodStart : startOfWeek(addWeeks(today, offset), { weekStartsOn: 1 });
    const stripDays = eachDayOfInterval({
      start: stripAnchorStart,
      end: endOfWeek(stripAnchorStart, { weekStartsOn: 1 }),
    });
    const streakDays: StreakDayItem[] = stripDays.map((d) => {
      const dStr = format(d, 'yyyy-MM-dd');
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
        isFuture: isAfter(d, today),
        progress,
        isPerfect: dueHabits.length > 0 && done === dueHabits.length,
      };
    });

    // Day-by-day / Week-by-week bars
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
        return {
          key: dStr,
          label: format(d, 'EEE'),
          percentage: !isFuture && dueHabits.length > 0 ? Math.round((done / dueHabits.length) * 100) : 0,
          completedCount: done,
          dueCount: dueHabits.length,
          isToday: isSameDay(d, today),
          isFuture,
        };
      });
    } else if (period === 'month') {
      // Group month by calendar weeks (Mon-Sun boundaries, matching screenshot: 1, 2-8, 9-15, ...)
      let idx = 0;
      while (idx < periodDays.length) {
        const chunk: Date[] = [];
        while (idx < periodDays.length) {
          const d = periodDays[idx];
          chunk.push(d);
          idx++;
          if (getISODay(d) === 7) break;
        }
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
        const firstD = chunk[0].getDate();
        const lastD = chunk[chunk.length - 1].getDate();
        const label = firstD === lastD ? `${firstD}` : `${firstD}–${lastD}`;
        dayBars.push({
          key: `wk-${firstD}`,
          label,
          percentage: cDue > 0 ? Math.round((cDone / cDue) * 100) : 0,
          completedCount: cDone,
          dueCount: cDue,
          isToday: hasToday,
          isFuture: allFuture,
        });
      }
    } else {
      const months = eachMonthOfInterval({ start: periodStart, end: periodEnd });
      dayBars = months.map((m) => {
        const mDays = eachDayOfInterval({ start: startOfMonth(m), end: endOfMonth(m) });
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

    // Habits matrix, Habit map, Bounce back & Ranked habits
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

    let totalMisses = 0;
    let recoveredCount = 0;
    let missedTwice = 0;
    const slumpLengths: number[] = [];

    const habitRows: HabitMatrixRow[] = [];
    const habitMapPoints: HabitMapPoint[] = [];
    const rankedHabitsRaw: RankedHabitItem[] = [];

    habits.forEach((habit) => {
      let hDone = 0;
      let hElapsedDue = 0;
      let currentSlump = 0;
      let prevDayMissed = false;

      periodDays.forEach((d) => {
        if (!isAfter(d, today) && isHabitDueOnDate(habit, d)) {
          hElapsedDue++;
          const dStr = format(d, 'yyyy-MM-dd');
          const status = logLookup.get(`${habit.id}_${dStr}`)?.status;
          const isDone = status === 'completed';

          if (isDone) {
            hDone++;
            if (prevDayMissed) {
              recoveredCount++;
            }
            if (currentSlump > 0) {
              slumpLengths.push(currentSlump);
              currentSlump = 0;
            }
            prevDayMissed = false;
          } else if (!isSameDay(d, today) && status !== 'skipped') {
            totalMisses++;
            if (prevDayMissed) missedTwice++;
            currentSlump++;
            prevDayMissed = true;
          }
        }
      });
      if (currentSlump > 0) slumpLengths.push(currentSlump);

      const hPct = hElapsedDue > 0 ? Math.round((hDone / hElapsedDue) * 100) : 0;
      const pDone = prevHabitDone.get(habit.id) || 0;
      const pDue = prevHabitDue.get(habit.id) || 0;
      const pPct = pDue > 0 ? Math.round((pDone / pDue) * 100) : 0;
      const deltaPct = hPct - pPct;

      const quadrant: HabitMapPoint['quadrant'] =
        hPct >= 50
          ? deltaPct >= 0
            ? 'thriving'
            : 'slipping'
          : deltaPct > 0
            ? 'rising'
            : 'needs_love';

      habitMapPoints.push({ habit, completionPct: hPct, deltaPct, quadrant });
      rankedHabitsRaw.push({ habit, doneCount: hDone, dueCount: hElapsedDue, percentage: hPct });

      const cells = matrixDays.map((d) => {
        const dStr = format(d, 'yyyy-MM-dd');
        const isFuture = isAfter(d, today);
        const isToday = isSameDay(d, today);
        if (!isHabitDueOnDate(habit, d) || isFuture) {
          return { dateStr: dStr, status: 'not_due' as HabitDayCellStatus };
        }
        const status = logLookup.get(`${habit.id}_${dStr}`)?.status;
        if (status === 'completed') return { dateStr: dStr, status: 'done' as HabitDayCellStatus };
        if (status === 'skipped') return { dateStr: dStr, status: 'skipped' as HabitDayCellStatus };
        return { dateStr: dStr, status: (isToday ? 'today_pending' : 'missed') as HabitDayCellStatus };
      });

      habitRows.push({ habit, percentage: hPct, cells });
    });

    const rankedHabits = [...rankedHabitsRaw].sort((a, b) =>
      habitsSortAsc ? a.percentage - b.percentage : b.percentage - a.percentage
    );

    const slump1Day = slumpLengths.filter((len) => len === 1).length;
    const slump2Day = slumpLengths.filter((len) => len === 2).length;
    const slump3PlusDay = slumpLengths.filter((len) => len >= 3).length;
    const avgSlumpDays =
      slumpLengths.length > 0
        ? Math.round((slumpLengths.reduce((a, b) => a + b, 0) / slumpLengths.length) * 10) / 10
        : 0;
    const longestSlumpDays = slumpLengths.length > 0 ? Math.max(...slumpLengths) : 0;

    // By weekday
    const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekdayFullNames = [
      'Mondays',
      'Tuesdays',
      'Wednesdays',
      'Thursdays',
      'Fridays',
      'Saturdays',
      'Sundays',
    ];
    const weekdayPcts = weekdayDue.map((due, i) => (due > 0 ? Math.round((weekdayDone[i] / due) * 100) : 0));
    const maxWdPct = Math.max(...weekdayPcts);
    const minWdPct = Math.min(...weekdayPcts);
    const bestWdIdx = weekdayPcts.indexOf(maxWdPct);
    const worstWdIdx = weekdayPcts.indexOf(minWdPct);

    const weekdayBars: WeekdayBarItem[] = weekdayNames.map((label, i) => ({
      dayIndex: i,
      label,
      percentage: weekdayPcts[i],
      isBest: maxWdPct > 0 && weekdayPcts[i] === maxWdPct,
    }));

    const weekdaySummary =
      maxWdPct === 0
        ? 'Complete habits to reveal your strongest weekdays'
        : `Best on ${weekdayFullNames[bestWdIdx]} · toughest on ${weekdayFullNames[worstWdIdx]}`;

    // Highlights
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
      }
    }

    const paceElapsedDays =
      differenceInCalendarDays(isAfter(periodEnd, today) ? today : periodEnd, periodStart) + 1;

    return {
      periodLabel,
      canGoNext: offset < 0,
      hasPreviousData,
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
      calendarLeadingBlanks: getISODay(periodStart) - 1,
      calendarDays,
      dayMix: {
        totalElapsedDays: mixPerfect + mixPartial + mixNothing + mixOff,
        perfect: mixPerfect,
        partial: mixPartial,
        nothingDone: mixNothing,
        daysOff: mixOff,
      },
      habitMapPoints,
      bounceBack: {
        recoveryPct: totalMisses > 0 ? Math.round((recoveredCount / totalMisses) * 100) : 0,
        recoveredCount,
        totalMisses,
        missedTwice,
        avgSlumpDays,
        longestSlumpDays,
        slump1Day,
        slump2Day,
        slump3PlusDay,
      },
      weekdayBars,
      weekdaySummary,
      rankedHabits,
      highlights,
    };
  }, [habits, period, offset, habitsSortAsc]);

  return {
    period,
    analytics,
    selectedBarKey,
    selectedCalendarDate,
    habitsSortAsc,
    visibleCards,
    isCustomizeOpen,
    setIsCustomizeOpen,
    isCompletionInfoOpen,
    handleSelectPeriod,
    handleStepPeriod,
    handleSelectBar,
    handleSelectCalendarDay,
    handleToggleHabitsSort,
    handleToggleCompletionInfo,
    handleToggleCard,
    handleResetCards,
    handlePressHabit,
  };
}
