import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useHabitStats } from '../../features/stats/hooks/useHabitStats';
import { ConsistencyChart } from '../../components/stats/ConsistencyChart';
import { StatsMetricCards } from '../../components/stats/StatsMetricCards';
import { SpeedometerArc } from '../../components/stats/SpeedometerArc';
import { ReflectionNoteCard } from '../../components/stats/ReflectionNoteCard';

/**
 * Stats & Insights View Shell (Declarative, < 140 lines)
 * Exact match to Routinr Screenshots 1, 2, & 3.
 */
export default function StatsScreen() {
  const router = useRouter();
  const {
    currentHabit,
    stats,
    isNoteInputVisible,
    noteText,
    setNoteText,
    setIsNoteInputVisible,
    handleSaveNote,
  } = useHabitStats();

  if (!currentHabit || !stats) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No habit data available yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/')}>
          <Ionicons name="chevron-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.habitTitleHeader} numberOfLines={1}>
          {currentHabit.title}
        </Text>

        <View style={styles.topRightActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="pencil-outline" size={18} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={18} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Consistency Bar Chart (Screenshot 1 & 2) */}
        <ConsistencyChart stats={stats} />

        {/* 2x2 Metric Grid (Screenshot 1) */}
        <StatsMetricCards stats={stats} />

        {/* Compare with previous period banner */}
        <View style={styles.proCompareBanner}>
          <Ionicons name="lock-closed-outline" size={16} color="#6366F1" />
          <Text style={styles.proCompareText}>Compare with the previous period</Text>
          <Text style={styles.proTag}>Pro</Text>
        </View>

        {/* Reflection Note Card (Screenshot 1) */}
        <ReflectionNoteCard
          isVisible={isNoteInputVisible}
          noteText={noteText}
          onChangeText={setNoteText}
          onOpenInput={() => setIsNoteInputVisible(true)}
          onCloseInput={() => setIsNoteInputVisible(false)}
          onSave={handleSaveNote}
        />

        {/* Speedometer Arc & Milestone Unlock (Screenshot 3) */}
        <SpeedometerArc stats={stats} />

        {/* About Card (Screenshot 1) */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutSectionTitle}>About</Text>
          <View style={styles.aboutRow}>
            <View style={styles.aboutLeft}>
              <Ionicons name="calendar-outline" size={18} color="#64748B" />
              <Text style={styles.aboutLabel}>Started</Text>
            </View>
            <Text style={styles.aboutValue}>Today ›</Text>
          </View>

          <View style={styles.aboutRow}>
            <View style={styles.aboutLeft}>
              <Ionicons name="notifications-outline" size={18} color="#64748B" />
              <Text style={styles.aboutLabel}>Reminders</Text>
            </View>
            <Text style={styles.aboutValue}>Off ›</Text>
          </View>

          <View style={[styles.aboutRow, styles.aboutRowLast]}>
            <View style={styles.aboutLeft}>
              <Ionicons name="time-outline" size={18} color="#64748B" />
              <Text style={styles.aboutLabel}>Activity</Text>
            </View>
            <Text style={styles.aboutValue}>See everything ›</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitTitleHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginHorizontal: 12,
  },
  topRightActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 90,
  },
  proCompareBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  proCompareText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#4338CA',
  },
  proTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 16,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  aboutRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  aboutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  aboutValue: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#64748B',
  },
});

