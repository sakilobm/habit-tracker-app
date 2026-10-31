import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { CustomTabBar } from '../../components/common/CustomTabBar';
import { AddHabitModal } from '../../components/home/AddHabitModal';

/**
 * Tab Navigation Shell
 * Integrates Routinr's custom notched tab bar with raised center + action button.
 */
export default function TabLayout() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar {...props} onOpenAddHabit={() => setIsAddModalVisible(true)} />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
        <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>

      {/* Floating Center + Action Modal */}
      <AddHabitModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
