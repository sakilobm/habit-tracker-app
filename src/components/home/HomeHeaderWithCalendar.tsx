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
 * Routinr Signature Top Header with Layered Wave Boundary & 100% Flicker-Free Sticky Overlay
 * - Fixed/Absolute top overlay (never resizes or displaces the ScrollView).
 * - Multi-layered curve boundary: Lavender fill, grey contour gap line, and clean white boundary.
 * - Continuous smooth collapse of weekly ribbon (64 -> 0px) and profile name on scroll.
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

  // Continuous interpolation: Zero re-renders, 60/120fps native performance
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

  const cx = width / 2;

  // Exact curve matching user's screenshot (media_1793711745911_ad068c57.jpg)
  const waveFillPath = `
    M 0 0
    L 0 12
    C ${cx - 150} 12, ${cx - 135} 12, ${cx - 122} 22
    C ${cx - 110} 30, ${cx - 105} 44, ${cx - 86} 44
    L ${cx + 86} 44
    C ${cx + 105} 44, ${cx + 110} 30, ${cx + 122} 22
    C ${cx + 135} 12, ${cx + 150} 12, ${width} 12
    L ${width} 0
    Z
  `;

  // Grey contour curve outline matching screenshot
  const waveContourPath = `
    M 0 12
    C ${cx - 150} 12, ${cx - 135} 12, ${cx - 122} 22
    C ${cx - 110} 30, ${cx - 105} 44, ${cx - 86} 44
    L ${cx + 86} 44
    C ${cx + 105} 44, ${cx + 110} 30, ${cx + 122} 22
    C ${cx + 135} 12, ${cx + 150} 12, ${width} 12
  `;

  return (
    <View style={styles.outerWrapper} pointerEvents="box-none">
      {/* Main Lavender Header Card */}
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: Math.max(insets.top, 20) + 6,
          },
        ]}
      >
        {/* Subtle Decorative Background Grid */}
        <Svg width={width} height={180} style={StyleSheet.absoluteFill} pointerEvents="none">
          {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => (
            <Line
              key={`v-${x}`}
              x1={x}
              y1={0}
              x2={x}
              y2={180}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={1}
            />
          ))}
          {[30, 60, 90, 120, 150, 180].map((y) => (
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
      </View>

      {/* SVG Layered Organic Wave Boundary: Lavender Fill + Grey Contour Gap Line */}
      <View style={styles.waveSvgContainer} pointerEvents="none">
        <Svg width={width} height={46} viewBox={`0 0 ${width} 46`}>
          {/* Lavender Organic Shape Fill */}
          <Path d={waveFillPath} fill="#7C83FD" />
          {/* Subtle Grey Contour Line ("antha curves la lavender idaila gap gray and white") */}
          <Path
            d={waveContourPath}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={1.8}
            strokeLinecap="round"
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
                stroke={currentLayout === 'list' ? '#FFFFFF' : '#6366F1'}
                strokeWidth="1.6"
              />
              <Rect
                x="2"
                y="11.5"
                width="16"
                height="4"
                rx="2"
                stroke={currentLayout === 'list' ? '#FFFFFF' : '#6366F1'}
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
                stroke={currentLayout === 'dual' ? '#FFFFFF' : '#6366F1'}
                strokeWidth="1.6"
              />
              <Rect
                x="11"
                y="3"
                width="6.5"
                height="14"
                rx="2"
                stroke={currentLayout === 'dual' ? '#FFFFFF' : '#6366F1'}
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
                stroke={currentLayout === 'grid' ? '#FFFFFF' : '#6366F1'}
                strokeWidth="1.6"
              />
              <Rect
                x="11"
                y="2.5"
                width="6.5"
                height="6.5"
                rx="2"
                stroke={currentLayout === 'grid' ? '#FFFFFF' : '#6366F1'}
                strokeWidth="1.6"
              />
              <Rect
                x="2.5"
                y="11"
                width="6.5"
                height="6.5"
                rx="2"
                stroke={currentLayout === 'grid' ? '#FFFFFF' : '#6366F1'}
                strokeWidth="1.6"
              />
              <Rect
                x="11"
                y="11"
                width="6.5"
                height="6.5"
                rx="2"
                stroke={currentLayout === 'grid' ? '#FFFFFF' : '#6366F1'}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 8,
  },
  headerContainer: {
    backgroundColor: '#7C83FD', // Vibrant Periwinkle Lavender
    paddingHorizontal: 16,
    position: 'relative',
    paddingBottom: 2,
  },
  waveSvgContainer: {
    marginTop: -1,
    width: width,
    height: 46,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    paddingVertical: 9,
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
    marginBottom: 5,
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
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 110,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', // Pure White Pill matching screenshot
    borderRadius: 24,
    padding: 3,
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#EEF2FF', // Soft lilac inactive background matching screenshot
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#6366F1', // Solid purple active background
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 2,
  },
});
