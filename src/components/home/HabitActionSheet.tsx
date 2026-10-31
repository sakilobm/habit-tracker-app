import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';
import { useHabitActionSheet } from '../../features/habits/hooks/useHabitActionSheet';

interface HabitActionSheetProps {
  habit: HabitWithStatus | null;
  visible: boolean;
  onClose: () => void;
  onNavigateToStats: (habitId: string) => void;
}

/**
 * Habit Action Bottom Sheet Modal (Exact Match to Routinr Screenshot 4)
 * Displays today's status card, striped progress bar, weekdays, and skip/edit/delete actions.
 */
export const HabitActionSheet: React.FC<HabitActionSheetProps> = ({
  habit,
  visible,
  onClose,
  onNavigateToStats,
}) => {
  const { weekdays, progressRatio, handleSkip, handleDelete, handleToggle, handleViewStats } =
    useHabitActionSheet(habit);

  if (!habit) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheetContainer}>
          {/* Top Sheet Handle */}
          <View style={styles.handleBar} />

          {/* Habit Header */}
          <View style={styles.headerRow}>
            <View style={styles.iconAndTitle}>
              <View style={styles.iconBadge}>
                <Ionicons name={(habit.icon || 'book-outline') as any} size={22} color="#1E293B" />
              </View>
              <View>
                <Text style={styles.title}>{habit.title}</Text>
                <Text style={styles.frequencyBadge}>Every day</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Intention Description */}
          {habit.description ? (
            <Text style={styles.descriptionText}>{habit.description}</Text>
          ) : null}

          {/* Today Status Hero Card */}
          <View style={styles.statusHeroCard}>
            <Text style={styles.todaySmallLabel}>Today</Text>
            <Text style={styles.statusTitle}>
              {habit.isCompleted ? 'Completed today' : 'Not done yet'}
            </Text>
            <Text style={styles.daySubtitle}>
              {habit.daysCompleted > 0 ? `Day ${habit.daysCompleted + 1} of your habit` : 'Day 1 of your new habit'}
            </Text>

            {/* Weekday Row */}
            <View style={styles.weekdayRow}>
              {weekdays.map((w, i) => (
                <View key={i} style={styles.dayCol}>
                  <Text style={[styles.dayLabel, w.isToday && styles.dayLabelToday]}>{w.label}</Text>
                  {w.isPast ? (
                    <View style={styles.dotPast} />
                  ) : (
                    <View
                      style={[
                        styles.circleFuture,
                        w.isToday && habit.isCompleted && styles.circleCompleted,
                      ]}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Streak Meta */}
            <View style={styles.streakRow}>
              <Ionicons name="flame-outline" size={16} color="#F59E0B" />
              <Text style={styles.streakText}>
                {habit.currentStreak > 0 ? `${habit.currentStreak} day streak` : 'No streak yet'}
                {' · '}Best {habit.bestStreak}
                {' · '}{habit.totalDays} total
              </Text>
            </View>

            {/* Striped Progress Bar */}
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]} />
            </View>

            <View style={styles.progressTextRow}>
              <Text style={styles.progressCountText}>
                {habit.currentValue} of {habit.targetCount} {habit.unit}
              </Text>
              <TouchableOpacity onPress={handleToggle} style={styles.toggleTextButton}>
                <Text style={styles.toggleText}>
                  {habit.isCompleted ? 'Mark Undone' : 'Mark Done'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action List Items */}
          <View style={styles.actionList}>
            {/* View Stats & Insights */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                handleViewStats();
                onClose();
                onNavigateToStats(habit.id);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View style={styles.actionIconPill}>
                  <Ionicons name="stats-chart-outline" size={18} color="#4F46E5" />
                </View>
                <Text style={styles.actionLabel}>View statistics & insights</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Skip Today */}
            <TouchableOpacity style={styles.actionItem} onPress={handleSkip} activeOpacity={0.7}>
              <View style={styles.actionLeft}>
                <View style={styles.actionIconPill}>
                  <Ionicons name="play-skip-forward-outline" size={18} color="#475569" />
                </View>
                <Text style={styles.actionLabel}>Skip today</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Edit Habit */}
            <TouchableOpacity style={styles.actionItem} onPress={onClose} activeOpacity={0.7}>
              <View style={styles.actionLeft}>
                <View style={styles.actionIconPill}>
                  <Ionicons name="create-outline" size={18} color="#475569" />
                </View>
                <Text style={styles.actionLabel}>Edit habit</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Delete Habit (Red) */}
            <TouchableOpacity
              style={[styles.actionItem, styles.actionItemDelete]}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <View style={styles.actionLeft}>
                <View style={[styles.actionIconPill, styles.actionIconPillDelete]}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </View>
                <Text style={[styles.actionLabel, styles.actionLabelDelete]}>Delete habit</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#FCA5A5" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    maxHeight: '90%',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  frequencyBadge: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    marginBottom: 16,
  },
  statusHeroCard: {
    backgroundColor: '#FAFAFD',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 18,
  },
  todaySmallLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  daySubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  dayLabelToday: {
    color: '#0F172A',
    fontWeight: '800',
  },
  dotPast: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  circleFuture: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  circleCompleted: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  streakText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 6,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  toggleTextButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
  actionList: {
    gap: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  actionItemDelete: {
    backgroundColor: '#FEF2F2',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconPill: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconPillDelete: {
    backgroundColor: '#FEE2E2',
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  actionLabelDelete: {
    color: '#EF4444',
  },
});

