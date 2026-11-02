import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeHeaderWithCalendar } from '../../components/home/HomeHeaderWithCalendar';
import { DottedFanArc } from '../../components/home/DottedFanArc';
import { WeekAndStreakCards } from '../../components/home/WeekAndStreakCards';
import { RoutinrHabitCard } from '../../components/home/RoutinrHabitCard';
import { HabitCardDual } from '../../components/home/HabitCardDual';
import { HabitCardGrid } from '../../components/home/HabitCardGrid';
import { HabitActionSheet } from '../../components/home/HabitActionSheet';
import { useHomeHabits } from '../../features/habits/hooks/useHomeHabits';

/**
 * Home View Shell (Declarative, < 150 lines)
 * Features Routinr curved lavender header with 7-day ribbon, 3-way layout switcher,
 * dotted hemicycle fan arc gauge, week/streak cards, and signature habit cards.
 */
export default function HomeScreen() {
  const router = useRouter();
  const {
    habits,
    layoutMode,
    selectedDate,
    activeHabitForSheet,
    completionPercentage,
    streakDays,
    weekAverage,
    handleToggleHabit,
    handleSelectLayout,
    handleOpenSheet,
    handleCloseSheet,
    setSelectedDate,
  } = useHomeHabits();

  return (
    <View style={styles.container}>
      <HomeHeaderWithCalendar
        currentLayout={layoutMode}
        onSelectLayout={handleSelectLayout}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onPressProfile={() => router.push('/profile')}
        onOpenCalendar={() => {}}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hemicycle Dotted Fan Arc Gauge */}
        <DottedFanArc percentage={completionPercentage} />

        {/* This Week & Streak Momentum Cards */}
        <WeekAndStreakCards
          weekAverage={weekAverage}
          streakDays={streakDays}
          streakTarget={3}
        />

        {/* Habit Cards by Layout Mode */}
        {layoutMode === 'list' && (
          <View style={styles.listContainer}>
            {habits.map((habit) => (
              <RoutinrHabitCard
                key={habit.id}
                habit={habit}
                onPress={handleOpenSheet}
                onToggle={handleToggleHabit}
              />
            ))}
          </View>
        )}

        {layoutMode === 'dual' && (
          <View style={styles.dualContainer}>
            {habits.map((habit) => (
              <HabitCardDual
                key={habit.id}
                habit={habit}
                onPress={handleOpenSheet}
                onToggle={handleToggleHabit}
              />
            ))}
          </View>
        )}

        {layoutMode === 'grid' && (
          <View style={styles.gridContainer}>
            {habits.map((habit) => (
              <HabitCardGrid
                key={habit.id}
                habit={habit}
                onPress={handleOpenSheet}
                onToggle={handleToggleHabit}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Action Bottom Sheet */}
      <HabitActionSheet
        habit={activeHabitForSheet}
        visible={Boolean(activeHabitForSheet)}
        onClose={handleCloseSheet}
        onNavigateToStats={() => router.push('/stats')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 110,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    marginTop: 6,
  },
  dualContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginTop: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
});
