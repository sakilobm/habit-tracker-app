import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileHero } from '../../components/profile/ProfileHero';
import { UpgradeProCard } from '../../components/profile/UpgradeProCard';

/**
 * Profile View Shell (Declarative, < 120 lines)
 * Exact match to Routinr Screenshot 5.
 */
export default function ProfileScreen() {
  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Lavender Curved Hero Header */}
        <ProfileHero
          name="Sakil obm"
          email="b.sakilobm@gmail.com"
          onEditPress={() => {}}
        />

        {/* Upgrade to Pro Card */}
        <UpgradeProCard onUpgradePress={() => {}} />

        {/* Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconPill}>
                  <Ionicons name="person-outline" size={18} color="#475569" />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Edit Profile</Text>
                  <Text style={styles.menuSubtitle}>Update your name, photo, and basics</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconPill}>
                  <Ionicons name="notifications-outline" size={18} color="#475569" />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Notifications & Reminders</Text>
                  <Text style={styles.menuSubtitle}>Set daily morning and evening alerts</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconPill}>
                  <Ionicons name="cloud-download-outline" size={18} color="#475569" />
                </View>
                <View>
                  <Text style={styles.menuTitle}>Data Backup & Export</Text>
                  <Text style={styles.menuSubtitle}>SQLite local vault status: Active</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#818CF8', // Top bleed matching lavender header
  },
  scrollContent: {
    backgroundColor: '#F8FAFC',
    paddingBottom: 90,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEF2F6',
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconPill: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});

