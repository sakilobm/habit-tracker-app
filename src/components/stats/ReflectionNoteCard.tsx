import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReflectionNoteCardProps {
  isVisible: boolean;
  noteText: string;
  onChangeText: (text: string) => void;
  onOpenInput: () => void;
  onCloseInput: () => void;
  onSave: () => void;
}

/**
 * Reflection Note Card (Matching Routinr Screenshot 1)
 * "How is it going? Jot down what helped or got in the way. [Write note]"
 */
export const ReflectionNoteCard: React.FC<ReflectionNoteCardProps> = ({
  isVisible,
  noteText,
  onChangeText,
  onOpenInput,
  onCloseInput,
  onSave,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="document-text-outline" size={18} color="#6366F1" />
        </View>
        <View style={styles.headerTexts}>
          <Text style={styles.title}>How is it going?</Text>
          <Text style={styles.subtitle}>Jot down what helped or got in the way.</Text>
        </View>
      </View>

      {isVisible ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Write your reflection note..."
            placeholderTextColor="#94A3B8"
            value={noteText}
            onChangeText={onChangeText}
            multiline
            autoFocus
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCloseInput}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.saveText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.writeButton} onPress={onOpenInput} activeOpacity={0.8}>
          <Ionicons name="create-outline" size={16} color="#6366F1" />
          <Text style={styles.writeButtonText}>Write note</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTexts: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  writeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  writeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
  },
  inputContainer: {
    marginTop: 4,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 14,
    color: '#0F172A',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#6366F1',
  },
  saveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

