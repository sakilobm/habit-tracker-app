import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHabitStore } from '../../features/habits/stores/habitStore';
import * as Haptics from 'expo-haptics';

/**
 * Discover View Shell (Declarative, < 110 lines)
 * Browse curated routine templates and habit blueprints.
 */
export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { addHabit } = useHabitStore();

  const curatedRoutines = [
    {
      id: 'routine_morning_sun',
      title: 'Morning Sun Exposure',
      category: 'Health',
      duration: '10 mins',
      description: 'Get natural sunlight within 30 minutes of waking for circadian rhythm.',
      icon: 'sunny-outline',
      timeOfDay: 'morning' as const,
    },
    {
      id: 'routine_pomodoro',
      title: '90-Min Deep Work Sprint',
      category: 'Productivity',
      duration: '90 mins',
      description: 'Zero notifications, phone in another room, single-tasking focus.',
      icon: 'laptop-outline',
      timeOfDay: 'afternoon' as const,
    },
    {
      id: 'routine_digital_sunset',
      title: 'Digital Sunset (No Screens)',
      category: 'Sleep',
      duration: '45 mins',
      description: 'Turn off phone and screens 45 minutes before sleep to reset melatonin.',
      icon: 'moon-outline',
      timeOfDay: 'evening' as const,
    },
  ];

  const handleAddCurated = (item: typeof curatedRoutines[0]) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addHabit(item.title, item.description, item.category.toLowerCase(), item.timeOfDay);
  };

  return (
    <View style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) + 10 }]}>
        <Text style={styles.headerTitle}>Discover Routines</Text>
        <Text style={styles.headerSubtitle}>Curated habits based on behavioral science</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {curatedRoutines.map((routine) => (
          <View key={routine.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.iconPill}>
                <Ionicons name={routine.icon as any} size={22} color="#4F46E5" />
              </View>
              <View style={styles.badgeRow}>
                <Text style={styles.categoryBadge}>{routine.category}</Text>
                <Text style={styles.durationBadge}>{routine.duration}</Text>
              </View>
            </View>

            <Text style={styles.routineTitle}>{routine.title}</Text>
            <Text style={styles.routineDescription}>{routine.description}</Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddCurated(routine)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#4F46E5" />
              <Text style={styles.addButtonText}>Add to Today</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconPill: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  durationBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  routineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  routineDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
    marginBottom: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
});

