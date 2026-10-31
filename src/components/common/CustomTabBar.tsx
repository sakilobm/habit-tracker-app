import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface CustomTabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation?: any;
  emitter?: any;
  navigateToTab?: (routeKey: string) => void;
  onOpenAddHabit: () => void;
}

/**
 * Custom Tab Bar with Raised Notched Center Button
 * Matches Routinr's signature elevated + button and clean dock tabs.
 */
export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
  emitter,
  navigateToTab,
  onOpenAddHabit,
}) => {
  const tabIcons: Record<string, { outline: string; active: string; label: string }> = {
    index: { outline: 'home-outline', active: 'home', label: 'Home' },
    discover: { outline: 'compass-outline', active: 'compass', label: 'Discover' },
    stats: { outline: 'speedometer-outline', active: 'speedometer', label: 'Stats' },
    profile: { outline: 'person-outline', active: 'person', label: 'Profile' },
  };

  const centerIndex = 2; // Split 2 tabs on left, 2 tabs on right

  return (
    <View style={styles.container}>
      {/* SVG Notched Background */}
      <Svg width={width} height={70} style={StyleSheet.absoluteFill}>
        <Path
          d={`
            M0,0
            L${width / 2 - 44},0
            C${width / 2 - 32},0 ${width / 2 - 28},24 ${width / 2},24
            C${width / 2 + 28},24 ${width / 2 + 32},0 ${width / 2 + 44},0
            L${width},0
            L${width},70
            L0,70
            Z
          `}
          fill="#FFFFFF"
        />
      </Svg>

      {/* Floating Center + Action Button */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          style={styles.centerButton}
          onPress={onOpenAddHabit}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab Items */}
      <View style={styles.tabsRow}>
        {state.routes.map((route, index: number) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key] || { options: {} };
          const info = tabIcons[route.name] || {
            outline: 'ellipse-outline',
            active: 'ellipse',
            label: options.title || route.name,
          };

          const onPress = () => {
            if (navigateToTab) {
              navigateToTab(route.key);
            } else if (navigation) {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }
          };

          return (
            <React.Fragment key={route.key}>
              {/* Insert space in middle for floating center button */}
              {index === centerIndex && <View style={styles.centerSpacer} />}

              <TouchableOpacity
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <View style={[styles.iconWrapper, isFocused && styles.iconWrapperActive]}>
                  <Ionicons
                    name={(isFocused ? info.active : info.outline) as any}
                    size={22}
                    color={isFocused ? '#4F46E5' : '#94A3B8'}
                  />
                </View>
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {info.label}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  centerButtonWrapper: {
    position: 'absolute',
    top: -24,
    left: width / 2 - 28,
    width: 56,
    height: 56,
    zIndex: 10,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  centerSpacer: {
    width: 64,
  },
  iconWrapper: {
    padding: 2,
    borderRadius: 12,
  },
  iconWrapperActive: {
    backgroundColor: '#EEF2FF',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
