import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HabitLayoutMode } from '../../types/habit';
import { format, startOfWeek, addDays } from 'date-fns';

const { width } = Dimensions.get('window');

/** Height of the 7-day ribbon row (px). Must match the rendered height exactly. */
const RIBBON_HEIGHT = 78;

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
 * Signature Routinr Top Header — GPU-Accelerated Scroll Collapse
 *
 * Layout (top to bottom):
 *   1. Fixed Top Bar (Avatar · Name · Calendar)  — stays pinned, zIndex clips content behind it
 *   2. Sliding Section (translateY: 0 → -RIBBON_HEIGHT):
 *      a. Weekly Ribbon (7-day cards) — fades to opacity 0 as it slides behind the top bar
 *      b. Organic Wave Curve + Switcher Pod — always visible, docks under top bar when collapsed
 *
 * Performance:
 *   All animations use `transform` and `opacity` only → `useNativeDriver: true` compatible.
 *   Zero layout recalculations. Zero flicker. 60/120 FPS on all devices.
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

  // ── GPU-Accelerated Transform Animations (useNativeDriver: true compatible) ──

  /** Slides the ribbon + curve + pod section upward by RIBBON_HEIGHT */
  const slidingTranslateY = effectiveScrollY.interpolate({
    inputRange: [0, RIBBON_HEIGHT],
    outputRange: [0, -RIBBON_HEIGHT],
    extrapolate: 'clamp',
  });

  /** Fades out the 7-day ribbon as it slides behind the top bar */
  const ribbonOpacity = effectiveScrollY.interpolate({
    inputRange: [0, RIBBON_HEIGHT * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  /** Fades out the profile name ("Sakil obm") early in the scroll */
  const nameOpacity = effectiveScrollY.interpolate({
    inputRange: [0, 24],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // ── Organic Wave Curve Geometry ──
  const cx = width / 2;
  const svgHeight = 60;
  const wingY = 36;
  const archY = 8;
  const podHalfWidth = 90; // 180px total pod width
  const transWidth = 28;

  // Lavender fill: wings at wingY, arches UP to archY above the pod
  const waveFillPath = `
    M 0 0
    L 0 ${wingY}
    L ${cx - podHalfWidth - transWidth} ${wingY}
    C ${cx - podHalfWidth - 14} ${wingY}, ${cx - podHalfWidth - 12} ${archY}, ${cx - podHalfWidth - 2} ${archY}
    L ${cx + podHalfWidth + 2} ${archY}
    C ${cx + podHalfWidth + 12} ${archY}, ${cx + podHalfWidth + 14} ${wingY}, ${cx + podHalfWidth + transWidth} ${wingY}
    L ${width} ${wingY}
    L ${width} 0
    Z
  `;

  // Subtle contour stroke line
  const waveContourPath = `
    M 0 ${wingY}
    L ${cx - podHalfWidth - transWidth} ${wingY}
    C ${cx - podHalfWidth - 14} ${wingY}, ${cx - podHalfWidth - 12} ${archY}, ${cx - podHalfWidth - 2} ${archY}
    L ${cx + podHalfWidth + 2} ${archY}
    C ${cx + podHalfWidth + 12} ${archY}, ${cx + podHalfWidth + 14} ${wingY}, ${cx + podHalfWidth + transWidth} ${wingY}
    L ${width} ${wingY}
  `;

  return (
    <View style={styles.outerWrapper} pointerEvents="box-none">
      {/* ── 1. Fixed Top Bar (always pinned, clips ribbon behind it) ── */}
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

      {/* ── 2. Sliding Section: Ribbon + Curve + Pod (translateY animation) ── */}
      <Animated.View
        style={[
          styles.slidingSection,
          {
            transform: [{ translateY: slidingTranslateY }],
          },
        ]}
      >
        {/* 2a. Weekly Ribbon (fades out as it slides behind top bar) */}
        <Animated.View
          style={[
            styles.ribbonSection,
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

        {/* 2b. Organic Wave Curve + Switcher Pod (always visible) */}
        <View style={styles.curveAndPodWrapper} pointerEvents="box-none">
          {/* Organic Wave Boundary SVG */}
          <View style={styles.waveSvgContainer} pointerEvents="none">
            <Svg width={width} height={svgHeight} viewBox={`0 0 ${width} ${svgHeight}`}>
              <Path d={waveFillPath} fill="#7C83FD" />
              <Path
                d={waveContourPath}
                fill="none"
                stroke="#BAC0ED"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* Signature White Capsule Pod with 3 Layout Buttons */}
          <View style={styles.podContainer} pointerEvents="box-none">
            <View style={styles.podShell}>
              {/* Button 1: Single-Line Compact List [ ▭ / ▭ ] */}
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
                    y="4"
                    width="16"
                    height="4.5"
                    rx="2.2"
                    stroke={currentLayout === 'list' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                  <Rect
                    x="2"
                    y="11.5"
                    width="16"
                    height="4.5"
                    rx="2.2"
                    stroke={currentLayout === 'list' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                </Svg>
              </TouchableOpacity>

              {/* Button 2: Dual Mini-Calendar View [ ▭ / ▯▯ ] */}
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
                    y="3.5"
                    width="15"
                    height="4.5"
                    rx="2.2"
                    stroke={currentLayout === 'dual' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                  <Rect
                    x="2.5"
                    y="10.5"
                    width="6.5"
                    height="6.5"
                    rx="2.2"
                    stroke={currentLayout === 'dual' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                  <Rect
                    x="11"
                    y="10.5"
                    width="6.5"
                    height="6.5"
                    rx="2.2"
                    stroke={currentLayout === 'dual' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                </Svg>
              </TouchableOpacity>

              {/* Button 3: Grid View [ ⊞ ] (2x2 Squares) */}
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
                    stroke={currentLayout === 'grid' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                  <Rect
                    x="11"
                    y="2.5"
                    width="6.5"
                    height="6.5"
                    rx="2"
                    stroke={currentLayout === 'grid' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                  <Rect
                    x="2.5"
                    y="11"
                    width="6.5"
                    height="6.5"
                    rx="2"
                    stroke={currentLayout === 'grid' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                  <Rect
                    x="11"
                    y="11"
                    width="6.5"
                    height="6.5"
                    rx="2"
                    stroke={currentLayout === 'grid' ? '#FFFFFF' : '#5965E6'}
                    strokeWidth="1.8"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#7C83FD',
    paddingHorizontal: 16,
    paddingBottom: 4,
    zIndex: 10, // Higher than slidingSection → ribbon slides BEHIND it
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
  slidingSection: {
    // This entire section slides up via translateY
    // zIndex < topBarContainer so it slides behind the top bar
    zIndex: 5,
  },
  ribbonSection: {
    backgroundColor: '#7C83FD',
    paddingHorizontal: 16,
    height: RIBBON_HEIGHT,
  },
  ribbonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingBottom: 14,
  },
  dayPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
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
    color: '#5965E6',
    fontWeight: '800',
  },
  curveAndPodWrapper: {
    width: width,
    height: 60,
    position: 'relative',
  },
  waveSvgContainer: {
    marginTop: -1,
    width: width,
    height: 60,
  },
  podContainer: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  podShell: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 180,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 4,
    gap: 4,
    borderWidth: 1.2,
    borderColor: '#E2E6F2',
    shadowColor: '#3B4896',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#5965E6',
    shadowColor: '#5965E6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentBtnInactive: {
    backgroundColor: '#D6DCF9',
  },
});
