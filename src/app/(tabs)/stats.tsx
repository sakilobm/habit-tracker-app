import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProgressStats } from '../../features/stats/hooks/useProgressStats';
import { useHabitStore } from '../../features/habits/stores/habitStore';
import { ProgressHeader } from '../../components/stats/ProgressHeader';
import { ProgressStreakCard } from '../../components/stats/ProgressStreakCard';
import { ProgressCompletionCard } from '../../components/stats/ProgressCompletionCard';
import { ProgressPaceCard } from '../../components/stats/ProgressPaceCard';
import { ProgressDayByDayCard } from '../../components/stats/ProgressDayByDayCard';
import { ProgressHabitsByDayCard } from '../../components/stats/ProgressHabitsByDayCard';
import { ProgressMonthCalendarCard } from '../../components/stats/ProgressMonthCalendarCard';
import { ProgressDayMixCard } from '../../components/stats/ProgressDayMixCard';
import { ProgressHabitMapCard } from '../../components/stats/ProgressHabitMapCard';
import {
  ProgressBounceBackCard,
  ProgressByWeekdayCard,
  ProgressHabitsRankedCard,
} from '../../components/stats/ProgressBounceAndWeekdayCards';
import { ProgressHighlightsCard, CustomizeCardsModal } from '../../components/stats/ProgressHighlightsCard';
import { HabitActionSheet } from '../../components/home/HabitActionSheet';

/**
 * Declarative Progress / Stats View Shell (< 150 lines)
 * Renders fast, memoized Week, Month, and Year analytics cards backed by `useProgressStats`.
 */
export default function StatsScreen() {
  const {
    period, analytics, selectedBarKey, selectedCalendarDate, habitsSortAsc, visibleCards,
    isCustomizeOpen, setIsCustomizeOpen, isCompletionInfoOpen, handleSelectPeriod, handleStepPeriod,
    handleSelectBar, handleSelectCalendarDay, handleToggleHabitsSort, handleToggleCompletionInfo,
    handleToggleCard, handleResetCards, handlePressHabit,
  } = useProgressStats();
  const { activeHabitForSheet, closeHabitSheet } = useHabitStore();

  const isMonthOrYear = period !== 'week';
  const periodUnitLabel = period === 'week' ? 'this week' : period === 'month' ? 'this month' : 'this year';
  const prevUnitLabel = period === 'week' ? 'Last week' : period === 'month' ? 'Last month' : 'Last year';
  const barChartTitle = period === 'week' ? 'Day by day' : period === 'month' ? 'Week by week' : 'Month by month';

  return (
    <View style={styles.container}>
      <ProgressHeader
        period={period} periodLabel={analytics.periodLabel} canGoNext={analytics.canGoNext}
        onSelectPeriod={handleSelectPeriod} onStepPeriod={handleStepPeriod}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {visibleCards.streak && (
          <ProgressStreakCard currentStreak={analytics.currentStreak} streakDays={analytics.streakDays} />
        )}

        {visibleCards.completion && (
          <ProgressCompletionCard
            completionPct={analytics.completionPct} completedCheckIns={analytics.completedCheckIns}
            elapsedDueCheckIns={analytics.elapsedDueCheckIns} statusHeadline={analytics.statusHeadline}
            deltaPts={analytics.deltaPts} hasPreviousData={analytics.hasPreviousData}
            previousPeriodLabel={analytics.previousPeriodLabel} perfectDays={analytics.perfectDays}
            elapsedDaysCount={analytics.elapsedDaysCount} bestRun={analytics.bestRun}
            activeDays={analytics.activeDays} isInfoOpen={isCompletionInfoOpen} onToggleInfo={handleToggleCompletionInfo}
          />
        )}

        {visibleCards.pace && (
          <ProgressPaceCard
            daysLeftInPeriod={analytics.daysLeftInPeriod} minPossiblePct={analytics.minPossiblePct}
            maxPossiblePct={analytics.maxPossiblePct} previousPeriodPct={analytics.previousPeriodPct}
            neededToMatchPrev={analytics.neededToMatchPrev} remainingCheckIns={analytics.remainingCheckIns}
            pacePerfectDays={analytics.pacePerfectDays} paceElapsedDays={analytics.paceElapsedDays}
            leftToday={analytics.leftToday} periodUnitLabel={periodUnitLabel} prevUnitLabel={prevUnitLabel}
          />
        )}

        {visibleCards.dayByDay && (
          <ProgressDayByDayCard
            title={barChartTitle} showDashedBaseline={isMonthOrYear} bars={analytics.dayBars}
            averagePct={analytics.dayAveragePct} selectedBarKey={selectedBarKey} onSelectBar={handleSelectBar}
          />
        )}

        {period === 'month' && visibleCards.calendar && (
          <ProgressMonthCalendarCard
            leadingBlanks={analytics.calendarLeadingBlanks} days={analytics.calendarDays}
            selectedDateStr={selectedCalendarDate} onSelectDay={handleSelectCalendarDay}
          />
        )}

        {period === 'week' && visibleCards.habitsByDay && (
          <ProgressHabitsByDayCard headers={analytics.matrixHeaders} rows={analytics.habitRows} onPressHabit={handlePressHabit} />
        )}

        {visibleCards.highlights && (
          <ProgressHighlightsCard highlights={analytics.highlights} onPressHabit={handlePressHabit} />
        )}

        {isMonthOrYear && visibleCards.dayMix && <ProgressDayMixCard dayMix={analytics.dayMix} />}
        {isMonthOrYear && visibleCards.habitMap && <ProgressHabitMapCard points={analytics.habitMapPoints} />}
        {isMonthOrYear && visibleCards.bounceBack && <ProgressBounceBackCard bounceBack={analytics.bounceBack} />}
        {isMonthOrYear && visibleCards.byWeekday && (
          <ProgressByWeekdayCard bars={analytics.weekdayBars} summary={analytics.weekdaySummary} />
        )}
        {isMonthOrYear && visibleCards.habitsRanked && (
          <ProgressHabitsRankedCard
            items={analytics.rankedHabits} sortAsc={habitsSortAsc}
            onToggleSort={handleToggleHabitsSort} onPressHabit={handlePressHabit}
          />
        )}

        <TouchableOpacity style={styles.customizeBtn} onPress={() => setIsCustomizeOpen(true)} activeOpacity={0.7}>
          <Ionicons name="apps-outline" size={16} color="#475569" />
          <Text style={styles.customizeText}>Customize cards</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomizeCardsModal
        visible={isCustomizeOpen} visibleCards={visibleCards} onToggleCard={handleToggleCard}
        onReset={handleResetCards} onClose={() => setIsCustomizeOpen(false)}
      />

      <HabitActionSheet
        habit={activeHabitForSheet} visible={Boolean(activeHabitForSheet)}
        onClose={closeHabitSheet} onNavigateToStats={closeHabitSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  scrollContent: { padding: 16, paddingBottom: 130 },
  customizeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, marginTop: 4 },
  customizeText: { fontSize: 14.5, fontWeight: '600', color: '#475569' },
});
