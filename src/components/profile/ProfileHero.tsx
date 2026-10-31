import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileHeroProps {
  name: string;
  email: string;
  onEditPress?: () => void;
}

/**
 * Profile Hero Card (Exact match to Routinr Screenshot 5)
 * Lavender/indigo gradient header with avatar, edit badge, name, and email.
 */
export const ProfileHero: React.FC<ProfileHeroProps> = ({ name, email, onEditPress }) => {
  return (
    <View style={styles.container}>
      {/* Background circular ripple decor */}
      <View style={styles.rippleDecor} />

      {/* Avatar Container */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={42} color="#FFFFFF" />
        </View>
        <TouchableOpacity style={styles.editBadge} onPress={onEditPress} activeOpacity={0.8}>
          <Ionicons name="pencil" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Name and Email */}
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.emailText}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#818CF8', // Soft lavender purple from screenshot
    paddingTop: 36,
    paddingBottom: 28,
    alignItems: 'center',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  rippleDecor: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    top: -40,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
});

