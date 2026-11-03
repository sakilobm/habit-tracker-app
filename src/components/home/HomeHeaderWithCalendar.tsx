import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Path } from 'react-native-svg';
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
 * Routinr Signature Top Header
 * - Upward concave wave boundary: Left/right wings extend lower, center scoops upward.
 * - Subtle contour line separating lavender header from white content area.
 * - 3 unboxed layout buttons: discrete rounded pills with spacing.
 * - Ample vertical clearance for 7-day calendar row so date cards are 100% visible.
 * - Buttery-smooth, zero-flicker scroll collapse powered by native transforms.
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

  // Zero-layout-thrash GPU transforms for 60/120 FPS buttery-smooth collapse
  const COLLAPSE_DISTANCE = 70;

  const collapsibleTranslateY = effectiveScrollY.interpolate({
    inputRange: [0, COLLAPSE_DISTANCE],
    outputRange: [0, -COLLAPSE_DISTANCE],
    extrapolate: 'clamp',
  });

  const ribbonOpacity = effectiveScrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nameOpacity = effectiveScrollY.interpolate({
    inputRange: [0, 25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const cx = width / 2;
  const svgHeight = 44;
  const wingY = 38;
  const plateauY = 14;

  // Exact Upward Concave Curve: Wings at wingY (38), scoops UPWARD to plateauY (14)
  const waveFillPath = `
    M 0 0
    L 0 ${wingY}
    L ${cx - 96} ${wingY}
    C ${cx - 82} ${wingY}, ${cx - 80} ${plateauY}, ${cx - 66} ${plateauY}
    L ${cx + 66} ${plateauY}
    C ${cx + 80} ${plateauY}, ${cx + 82} ${wingY}, ${cx + 96} ${wingY}
    L ${width} ${wingY}
    L ${width} 0
    Z
  `;

  // Subtle Contour Stroke Line along the boundary
  const waveContourPath = `
    M 0 ${wingY}
    L ${cx - 96} ${wingY}
    C ${cx - 82} ${wingY}, ${cx - 80} ${plateauY}, ${cx - 66} ${plateauY}
    L ${cx + 66} ${plateauY}
    C ${cx + 80} ${plateauY}, ${cx + 82} ${wingY}, ${cx + 96} ${wingY}
    L ${width} ${wingY}
  `;

  return (
    <View style={styles.outerWrapper} pointerEvents="box-none">
      {/* 1. Permanent Lavender Base Layer (Covers Status Bar & Top Bar) */}
      <View
        style={[
          styles.topBarContainer,
          {
            paddingTop: Math.max(insets.top, 24) + 6,
          },
        ]}
      >
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
      </View>

      {/* 2. Collapsible Section (Ribbon + Curve Contour + 3 Switcher Buttons) */}
      <Animated.View
        style={[
          styles.collapsibleSection,
          {
            transform: [{ translateY: collapsibleTranslateY }],
          },
        ]}
        pointerEvents="box-none"
      >
        {/* Lavender Extension Behind Weekly Ribbon */}
        <View style={styles.ribbonLavenderExtension}>
          <Animated.View
            style={[
              styles.ribbonWrapper,
              {
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

        {/* Upward Concave SVG Curve with Contour Line */}
        <View style={styles.waveSvgContainer} pointerEvents="none">
          <Svg width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`}>
            <Path d={waveFillPath} fill="#7C83FD" />
            <Path
              d={waveContourPath}
              fill="none"
              stroke="#BAC0ED"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </Svg>
        </View>

        {/* 3 Switcher Buttons (No Outer Box, Discrete Rounded Pills with Gaps) */}
        <View style={styles.switcherWrapper} pointerEvents="box-none">
          <View style={styles.buttonsRow}>
            {/* Button 1: Single-Line Compact List [ ▭ ] */}
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                currentLayout === 'list' ? styles.segmentBtnActive : styles.segmentBtnInactive,
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
                currentLayout === 'dual' ? styles.segmentBtnActive : styles.segmentBtnInactive,
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
                currentLayout === 'grid' ? styles.segmentBtnActive : styles.segmentBtnInactive,
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
      </Animated.View>
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
  },
  topBarContainer: {
    backgroundColor: '#7C83FD', // Signature Periwinkle Lavender
    paddingHorizontal: 16,
    paddingBottom: 6,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  collapsibleSection: {
    width: '100%',
  },
  ribbonLavenderExtension: {
    backgroundColor: '#7C83FD',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 16, // Clean clearance: date cards finish well above the curve
  },
  ribbonWrapper: {
    width: '100%',
  },
  ribbonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 18,
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
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 4,
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
  waveSvgContainer: {
    marginTop: -1,
    width: width,
    height: 44,
  },
  switcherWrapper: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segmentBtn: {
    width: 48,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#6366F1', // Active vibrant purple pill
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentBtnInactive: {
    backgroundColor: '#EEF2FF', // Inactive light periwinkle pill
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
