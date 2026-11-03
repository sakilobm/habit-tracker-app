import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Path, Line } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HabitLayoutMode } from '../../types/habit';
import { format, startOfWeek, addDays } from 'date-fns';

const { width } = Dimensions.get('window');

interface HomeHeaderWithCalendarProps {
  currentLayout: HabitLayoutMode;
  onSelectLayout: (mode: HabitLayoutMode) => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  scrollY?: Animated.Value;
  onPressProfile?: () => void;
  onOpenCalendar?: () => void;
}

/**
 * Routinr Signature Top Header with Continuous Animated Scroll Collapse & Organic Wave Bottom Curve
 * - 0 to 50px scroll: 7-day ribbon smoothly and continuously collapses in height and fades in opacity.
 * - Profile name "Sakil obm" smoothly fades out, keeping the avatar and calendar icons aligned.
 * - Organic wave bottom boundary separates the header and content with zero flicker.
 */
export const HomeHeaderWithCalendar: React.FC<HomeHeaderWithCalendarProps> = ({
  currentLayout,
  onSelectLayout,
  selectedDate,
  onSelectDate,
  scrollY,
  onPressProfile,
  onOpenCalendar,
}) => {
  const insets = useSafeAreaInsets();
  const currentDate = new Date(selectedDate);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday

  // Generate 7 days of the week: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  const weekDays = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const day = addDays(weekStart, i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const isSelected = dayStr === selectedDate;

    return {
      name: format(day, 'EEE'),
      number: format(day, 'd'),
      dateStr: dayStr,
      isSelected,
    };
  });

  const fallbackScrollY = useRef(new Animated.Value(0)).current;
  const effectiveScrollY = scrollY || fallbackScrollY;

  // Continuous interpolation curves: Zero flicker, 60fps native performance
  const ribbonHeight = effectiveScrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [64, 0],
    extrapolate: 'clamp',
  });

  const ribbonOpacity = effectiveScrollY.interpolate({
    inputRange: [0, 35],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nameOpacity = effectiveScrollY.interpolate({
    inputRange: [0, 25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = effectiveScrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [24, 8],
    extrapolate: 'clamp',
  });

  const cx = width / 2;

  return (
    <View style={styles.outerWrapper}>
      {/* Main Lavender Header Card */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            paddingTop: Math.max(insets.top, 20) + 6,
            paddingBottom: headerPaddingBottom,
          },
        ]}
      >
        {/* Subtle Decorative Background Grid */}
        <Svg width={width} height={160} style={StyleSheet.absoluteFill} pointerEvents="none">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
            <Line
              key={`v-${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={160}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={1}
            />
          ))}
          {[30, 60, 90, 120, 150].map((y) => (
            <Line
              key={`h-${y}`}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={1}
            />
          ))}
        </Svg>

        {/* Top Bar: Avatar, Name, Calendar Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.profileRow}
            onPress={onPressProfile}
            activeOpacity={0.8}
          >
            <View style={styles.avatarOuterRing}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={18} color="#FFFFFF" />
              </View>
            </View>
            <Animated.Text
              style={[
                styles.profileName,
                {
                  opacity: nameOpacity,
                },
              ]}
              numberOfLines={1}
            >
              Sakil obm
            </Animated.Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.calendarButton}
            onPress={onOpenCalendar}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Horizontal 7-Day Weekly Ribbon - Smooth Continuous Collapse */}
        <Animated.View
          style={[
            styles.ribbonWrapper,
            {
              height: ribbonHeight,
              opacity: ribbonOpacity,
            },
          ]}
        >
          <View style={styles.ribbonRow}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.dateStr}
                style={[styles.dayPill, day.isSelected && styles.dayPillSelected]}
                onPress={() => onSelectDate(day.dateStr)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayName,
                    day.isSelected && styles.dayNameSelected,
                  ]}
                >
                  {day.name}
                </Text>
                <View
                  style={[
                    styles.dateCircle,
                    day.isSelected && styles.dateCircleSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateNum,
                      day.isSelected && styles.dateNumSelected,
                    ]}
                  >
                    {day.number}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>

      {/* SVG Organic Wave Bottom Boundary */}
      <View style={styles.waveSvgContainer}>
        <Svg width={width} height={34} viewBox={`0 0 ${width} 34`}>
          <Path
            d={`
              M 0 0
              L 0 10
              C ${cx - 140} 10, ${cx - 120} 2, ${cx - 105} 2
              C ${cx - 95} 2, ${cx - 90} 26, ${cx - 70} 26
              L ${cx + 70} 26
              C ${cx + 90} 26, ${cx + 95} 2, ${cx + 105} 2
              C ${cx + 120} 2, ${cx + 140} 10, ${width} 10
              L ${width} 0
              Z
            `}
            fill="#7C83FD"
          />
        </Svg>
      </View>

      {/* 3-Segment View Switcher Centered in the Wave Pod */}
      <View style={styles.switcherWrapper}>
        <View style={styles.segmentContainer}>
          {/* Button 1: Single-Line Compact List [ ▭ ] */}
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              currentLayout === 'list' && styles.segmentBtnActive,
            ]}
            onPress={() => onSelectLayout('list')}
            activeOpacity={0.75}
          >
            <Svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <Rect
                x="2"
                y="4.5"
                width="16"
                height="4"
                rx="2"
                stroke={currentLayout === 'list' ? '#FFFFFF' : '#818CF8'}
                strokeWidth="1.6"
              />
              <Rect
                x="2"
                y="11.5"
                width="16"
                height="4"
                rx="2"
                stroke={currentLayout === 'list' ? '#FFFFFF' : '#818CF8'}
                strokeWidth="1.6"
              />
            </Svg>
          </TouchableOpacity>

          {/* Button 2: Weekly Mini-Calendar View [ ▯ ▯ ] */}
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              currentLayout === 'dual' && styles.segmentBtnActive,
            ]}
            onPress={() => onSelectLayout('dual')}
            activeOpacity={0.75}
          >
            <Svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <Rect
                x="2.5"
                y="3"
                width="6.5"
                height="14"
                rx="2"
                stroke={currentLayout === 'dual' ? '#FFFFFF' : '#818CF8'}
                strokeWidth="1.6"
              />
              <Rect
                x="11"
                y="3"
                width="6.5"
                height="14"
                rx="2"
                stroke={currentLayout === 'dual' ? '#FFFFFF' : '#818CF8'}
                strokeWidth="1.6"
              />
            </Svg>
          </TouchableOpacity>

          {/* Button 3: Grid View [ ⊞ ] */}
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              currentLayout === 'grid' && styles.segmentBtnActive,
            ]}
            onPress={() => onSelectLayout('grid')}
            activeOpacity={0.75}
          >
            <Svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <Rect
                x="2.5"
                y="2.5"
                width="6.5"
                height="6.5"
                rx="2"
                stroke={currentLayout === 'grid' ? '#FFFFFF' : '#818CF8'}
                strokeWidth="1.6"
              />
              <Rect
                x="11"
                y="2.5"
                width="6.5"
                height="6.5"
                rx="2"
                stroke={currentLayout === 'grid' ? '#FFFFFF' : '#818CF8'}
                strokeWidth="1.6"
              />
              <Rect
                x="2.5"
                y="11"
                width="6.5"
                height="6.5"
                rx="2"
                stroke={currentLayout === 'grid' ? '#FFFFFF' : '#818CF8'}
                strokeWidth="1.6"
              />
              <Rect
                x="11"
                y="11"
                width="6.5"
                height="6.5"
                rx="2"
                stroke={currentLayout === 'grid' ? '#FFFFFF' : '#818CF8'}
                strokeWidth="1.6"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    zIndex: 20,
  },
  headerContainer: {
    backgroundColor: '#7C83FD', // Vibrant Periwinkle Lavender
    paddingHorizontal: 16,
    position: 'relative',
  },
  waveSvgContainer: {
    marginTop: -1,
    width: width,
    height: 34,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarOuterRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5A62E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ribbonWrapper: {
    overflow: 'hidden',
    width: '100%',
  },
  ribbonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  dayPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  dayPillSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.82)',
    marginBottom: 6,
  },
  dayNameSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dateCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCircleSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  dateNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dateNumSelected: {
    color: '#6366F1',
    fontWeight: '800',
  },
  switcherWrapper: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 30,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6E9FD',
    borderRadius: 24,
    padding: 4,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 2,
  },
});
