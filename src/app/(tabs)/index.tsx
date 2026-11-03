import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
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
 * Features Routinr curved lavender header with 7-day ribbon, continuous scroll collapse,
 * 3-way layout switcher, dotted hemicycle fan arc gauge, week/streak cards,
 * and signature habit cards.
 */
export default function HomeScreen() {
  const router = useRouter();
  const {
    habits,
    layoutMode,
    selectedDate,
    activeHabitForSheet,
    scrollY,
    completionPercentage,
    streakDays,
    weekAverage,
    handleScroll,
    handleToggleHabit,
    handleSelectLayout,
    handleOpenSheet,
    handleCloseSheet,
    setSelectedDate,
  } = useHomeHabits();

  return (
    <View style={styles.container}>
      {/* 1. Underlying ScrollView: Fixed Frame, Zero Layout Thrashing */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        overScrollMode="never"
        alwaysBounceVertical={true}
      >
        {/* Top Spacer matches header resting height with breathing room */}
        <View style={styles.topSpacer} />

        {/* Hemicycle Dotted Fan Arc Gauge */}
        <DottedFanArc percentage={completionPercentage} />

        {/* This Week & Streak Momentum Cards */}
        <WeekAndStreakCards
          weekAverage={weekAverage}
          streakDays={streakDays}
          streakTarget={3}
        />

        {/* Layout Mode 1: Compact List [ ▭ ] */}
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

        {/* Layout Mode 2: Weekly Mini-Calendar View [ ▯ ▯ ] */}
        {layoutMode === 'dual' && (
          <View style={styles.listContainer}>
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

        {/* Layout Mode 3: 3-Column Compact Grid [ ⊞ ] */}
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
      </Animated.ScrollView>

      {/* 2. Floating Header Overlay (100% Flicker-Free) */}
      <HomeHeaderWithCalendar
        currentLayout={layoutMode}
        onSelectLayout={handleSelectLayout}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        scrollY={scrollY}
        onPressProfile={() => router.push('/profile')}
        onOpenCalendar={() => {}}
      />

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
  scrollView: {
    flex: 1,
  },
  topSpacer: {
    height: 218,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 220, // Ample clearance to guarantee smooth scrolling in all views
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    marginTop: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
});
