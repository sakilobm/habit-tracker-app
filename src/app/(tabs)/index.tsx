import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CurvedHeader } from '../../components/common/CurvedHeader';
import { HabitCardList } from '../../components/home/HabitCardList';
import { HabitCardDual } from '../../components/home/HabitCardDual';
import { HabitCardGrid } from '../../components/home/HabitCardGrid';
import { HabitActionSheet } from '../../components/home/HabitActionSheet';
import { useHomeHabits } from '../../features/habits/hooks/useHomeHabits';

/**
 * Home View Shell (Declarative, < 120 lines)
 * Features Routinr curved header with 3-way layout switcher, dynamic cards, and action sheet.
 */
export default function HomeScreen() {
  const router = useRouter();
  const {
    habits,
    layoutMode,
    activeHabitForSheet,
    handleToggleHabit,
    handleSelectLayout,
    handleOpenSheet,
    handleCloseSheet,
  } = useHomeHabits();

  return (
    <View style={styles.safeArea}>
      <CurvedHeader
        currentLayout={layoutMode}
        onSelectLayout={handleSelectLayout}
        onPressProfile={() => router.push('/profile')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <Text style={styles.sectionSubtitle}>
            {habits.filter((h) => h.isCompleted).length} of {habits.length} completed
          </Text>
        </View>

        {layoutMode === 'list' && (
          <View>
            {habits.map((habit) => (
              <HabitCardList
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

      {/* Action Bottom Sheet (Screenshot 4) */}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#3730A3', // Header bleed
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 90, // Avoid bottom tab bar overlap
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  dualContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
