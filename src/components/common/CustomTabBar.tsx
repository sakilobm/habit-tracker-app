import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface CustomTabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation?: any;
  navigateToTab?: (routeKey: string) => void;
  onOpenAddHabit: () => void;
}

/**
 * Custom Tab Bar with Floating Hexagon Center Button & Clear Notched Air-Gap
 * Matches Routinr's signature hexagon floating + button with visible gap around it.
 */
export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
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
  const cx = width / 2;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* SVG Notched Background with Deep Smooth Scoop for Air-Gap */}
      <Svg width={width} height={75} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Path
          d={`
            M 0 0
            L ${cx - 52} 0
            C ${cx - 38} 0, ${cx - 36} 36, ${cx} 36
            C ${cx + 36} 36, ${cx + 38} 0, ${cx + 52} 0
            L ${width} 0
            L ${width} 75
            L 0 75
            Z
          `}
          fill="#FFFFFF"
        />
      </Svg>

      {/* Floating Rounded Hexagon + Action Button with Clear Air-Gap */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          onPress={onOpenAddHabit}
          activeOpacity={0.85}
          style={styles.hexagonTouchable}
        >
          <Svg width={58} height={54} viewBox="0 0 58 52">
            {/* Rounded Flat-Topped Hexagon */}
            <Path
              d="
                M 19 2
                L 39 2
                Q 45 2 48 7
                L 55 21
                Q 58 26 55 31
                L 48 45
                Q 45 50 39 50
                L 19 50
                Q 13 50 10 45
                L 3 31
                Q 0 26 3 21
                L 10 7
                Q 13 2 19 2
                Z
              "
              fill="#7C83FD"
            />
            {/* White Crisp Plus (+) Symbol */}
            <Line
              x1="29"
              y1="16"
              x2="29"
              y2="36"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <Line
              x1="19"
              y1="26"
              x2="39"
              y2="26"
              stroke="#FFFFFF"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation Items */}
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
              {/* Center Spacer to allow room for the floating hexagon and air-gap */}
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
    height: 72,
    backgroundColor: 'transparent',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  centerButtonWrapper: {
    position: 'absolute',
    top: -24,
    left: width / 2 - 29,
    width: 58,
    height: 54,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  hexagonTouchable: {
    width: 58,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 8,
  },
  centerSpacer: {
    width: 72, // Generous space for hexagon + surrounding air-gap
  },
  iconWrapper: {
    padding: 3,
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
