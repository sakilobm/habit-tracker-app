import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HabitWithStatus } from '../../types/habit';
import { HighlightItem, ProgressCardId } from '../../features/stats/hooks/useProgressStats';

interface ProgressHighlightsCardProps {
  highlights: HighlightItem[];
  onPressHabit: (habit: HabitWithStatus) => void;
}

/**
 * Progress Card 6: Highlights ("Needs attention" & "Top performer" callouts)
 */
export const ProgressHighlightsCard: React.FC<ProgressHighlightsCardProps> = ({
  highlights,
  onPressHabit,
}) => {
  if (highlights.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Highlights</Text>

      {highlights.map((item) => {
        const isAttention = item.type === 'attention';
        return (
          <TouchableOpacity
            key={`${item.type}-${item.habit.id}`}
            style={styles.row}
            onPress={() => onPressHabit(item.habit)}
            activeOpacity={0.75}
          >
            <View style={[styles.iconBox, isAttention ? styles.iconBoxWarm : styles.iconBoxGreen]}>
              <Ionicons
                name={isAttention ? 'alert-circle-outline' : 'trophy-outline'}
                size={20}
                color={isAttention ? '#9A5B25' : '#15803D'}
              />
            </View>

            <View style={styles.textCol}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.habitTitle} numberOfLines={1}>
                {item.habit.title}
              </Text>
            </View>

            <View style={styles.rightCol}>
              <Text style={[styles.pctText, isAttention ? styles.pctWarm : styles.pctGreen]}>
                {item.percentage}%
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#64748B" />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface CustomizeCardsModalProps {
  visible: boolean;
  visibleCards: Record<ProgressCardId, boolean>;
  onToggleCard: (id: ProgressCardId) => void;
  onReset: () => void;
  onClose: () => void;
}

const CARD_OPTIONS: { id: ProgressCardId; label: string }[] = [
  { id: 'streak', label: 'Current streak' },
  { id: 'completion', label: 'Completion ring' },
  { id: 'pace', label: 'Pace & projection' },
  { id: 'dayByDay', label: 'Day by day chart' },
  { id: 'habitsByDay', label: 'Habits by day matrix' },
  { id: 'highlights', label: 'Highlights' },
];

/**
 * Bottom sheet modal to show/hide Progress cards.
 */
export const CustomizeCardsModal: React.FC<CustomizeCardsModalProps> = ({
  visible,
  visibleCards,
  onToggleCard,
  onReset,
  onClose,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
      <TouchableOpacity style={styles.modalSheet} activeOpacity={1}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Customize cards</Text>
          <TouchableOpacity onPress={onReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {CARD_OPTIONS.map((opt) => (
          <View key={opt.id} style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{opt.label}</Text>
            <Switch
              value={visibleCards[opt.id]}
              onValueChange={() => onToggleCard(opt.id)}
              trackColor={{ false: '#E2E8F0', true: '#7C83FD' }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}

        <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF6',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1.5,
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBoxWarm: {
    backgroundColor: '#F6EAE2',
  },
  iconBoxGreen: {
    backgroundColor: '#DCFCE7',
  },
  textCol: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748B',
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 1,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pctText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  pctWarm: {
    color: '#9A5B25',
  },
  pctGreen: {
    color: '#15803D',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C83FD',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  doneBtn: {
    backgroundColor: '#7C83FD',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

