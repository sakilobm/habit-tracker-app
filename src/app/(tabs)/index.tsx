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
 * Hosts curved lavender header, unified white analytics sheet (hemicycle + week/streak),
 * and 3 habit layout variants (list, dual mini-calendar, grid) over a soft #F6F7FB canvas.
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
    streakTarget,
    streakPercentage,
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
        alwaysBounceVertical
        bounces
      >
        <View style={styles.analyticsSheet}>
          <View style={styles.topSpacer} />
          <DottedFanArc
            percentage={completionPercentage}
            weekPercentage={weekAverage}
            streakPercentage={streakPercentage}
          />
          <WeekAndStreakCards weekAverage={weekAverage} streakDays={streakDays} streakTarget={streakTarget} />
        </View>

        <View style={styles.cardsSection}>
          {layoutMode === 'list' &&
            habits.map((h) => (
              <RoutinrHabitCard key={h.id} habit={h} onPress={handleOpenSheet} onToggle={handleToggleHabit} />
            ))}

          {layoutMode === 'dual' &&
            habits.map((h) => (
              <HabitCardDual key={h.id} habit={h} onPress={handleOpenSheet} onToggle={handleToggleHabit} />
            ))}

          {layoutMode === 'grid' && (
            <View style={styles.gridContainer}>
              {habits.map((h) => (
                <HabitCardGrid key={h.id} habit={h} onPress={handleOpenSheet} onToggle={handleToggleHabit} />
              ))}
            </View>
          )}
        </View>
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
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 240, backgroundColor: '#F6F7FB' },
  analyticsSheet: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderColor: '#ECEFF6',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  topSpacer: { height: 234 },
  cardsSection: { paddingHorizontal: 16, paddingTop: 14 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap' },
});
