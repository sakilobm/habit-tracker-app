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
 * Declarative Home View Shell (< 150 lines)
 * Hosts signature curved lavender header, hemicycle fan arc, week & streak cards,
 * and 3 layout variants (compact list, dual mini-tracker, and grid).
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
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        alwaysBounceVertical={true}
        bounces={true}
      >
        <View style={styles.topSpacer} />
        <DottedFanArc percentage={completionPercentage} />
        <WeekAndStreakCards
          weekAverage={weekAverage}
          streakDays={streakDays}
          streakTarget={3}
        />

        {layoutMode === 'list' && (
          <View style={styles.listContainer}>
            {habits.map((h) => (
              <RoutinrHabitCard
                key={h.id}
                habit={h}
                onPress={handleOpenSheet}
                onToggle={handleToggleHabit}
              />
            ))}
          </View>
        )}

        {layoutMode === 'dual' && (
          <View style={styles.listContainer}>
            {habits.map((h) => (
              <HabitCardDual
                key={h.id}
                habit={h}
                onPress={handleOpenSheet}
                onToggle={handleToggleHabit}
              />
            ))}
          </View>
        )}

        {layoutMode === 'grid' && (
          <View style={styles.gridContainer}>
            {habits.map((h) => (
              <HabitCardGrid
                key={h.id}
                habit={h}
                onPress={handleOpenSheet}
                onToggle={handleToggleHabit}
              />
            ))}
          </View>
        )}
      </Animated.ScrollView>

      <HomeHeaderWithCalendar
        currentLayout={layoutMode}
        onSelectLayout={handleSelectLayout}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        scrollY={scrollY}
        onPressProfile={() => router.push('/profile')}
        onOpenCalendar={() => {}}
      />

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
    height: 220,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 240,
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
