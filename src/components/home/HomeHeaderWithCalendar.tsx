import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Path, Defs, Pattern, Line, ClipPath, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HabitLayoutMode } from '../../types/habit';
import { format, startOfWeek, addDays } from 'date-fns';

const { width } = Dimensions.get('window');
/** Full-bleed width rounded up (+2px) to prevent subpixel gaps on the right edge */
const FULL_W = Math.ceil(width) + 2;

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
  /** Optional completion ratio (0..1) for days to render subtle progress ring */
  todayProgress?: number;
}

/**
 * Signature Routinr Top Header — Exact Pixel-Matched Curve, Grid & GPU Scroll Collapse
 *
 * Layout (top to bottom):
 *   1. Fixed Top Bar (Avatar · Name · Circular Calendar Btn) with subtle grid texture
 *   2. Sliding Section (translateY: 0 -> -RIBBON_HEIGHT, useNativeDriver: true):
 *      a. Weekly Ribbon (7-day cards with subtle progress arc) — fades behind top bar
 *      b. Dual-Layer Organic Wave + #F5F6FA Outer Cradle + Segmented 3-Button Switcher
 *
 * Performance:
 *   All animations use `transform` and `opacity` only -> `useNativeDriver: true` compatible.
 */
export const HomeHeaderWithCalendar: React.FC<HomeHeaderWithCalendarProps> = ({
  currentLayout,
  onSelectLayout,
  selectedDate,
  onSelectDate,
  scrollY,
  onPressProfile,
  onOpenCalendar,
  todayProgress = 0.65,
}) => {
  const insets = useSafeAreaInsets();
  const currentDate = new Date(selectedDate);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday

  const weekDays = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const day = addDays(weekStart, i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const isSelected = dayStr === selectedDate;

    return {
      index: i,
      name: format(day, 'EEE'),
      number: format(day, 'd'),
      dateStr: dayStr,
      isSelected,
    };
  });

  const fallbackScrollY = useRef(new Animated.Value(0)).current;
  const effectiveScrollY = scrollY || fallbackScrollY;

  // ── GPU-Accelerated Transform Animations (useNativeDriver: true) ──
  const slidingTranslateY = effectiveScrollY.interpolate({
    inputRange: [0, RIBBON_HEIGHT],
    outputRange: [0, -RIBBON_HEIGHT],
    extrapolate: 'clamp',
  });

  const ribbonOpacity = effectiveScrollY.interpolate({
    inputRange: [0, RIBBON_HEIGHT * 0.55],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nameOpacity = effectiveScrollY.interpolate({
    inputRange: [0, 26],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  /** Subtle upward tuck of the segmented buttons inside the cradle as header collapses */
  const podTuckY = effectiveScrollY.interpolate({
    inputRange: [0, RIBBON_HEIGHT],
    outputRange: [0, -4],
    extrapolate: 'clamp',
  });

  // ── Dual-Layer Wave & Cradle Geometry ──
  const cx = width / 2;
  const svgHeight = 70;
  const cornerR = 20;

  // Top boundary of the cradle / bottom edge of the lavender sheet
  const wingY = 27;
  const archTopY = 3;
  const archHalfFlat = 74;
  const archRampW = 42;

  // Bottom boundary of the #F5F6FA cradle shelf
  const shelfWingY = 39;
  const cradleBottomY = 64;

  // 1. Lavender wave fill (rounded outer bottom-left/right corners + smooth arch UP above pod)
  const lavenderWavePath = `
    M 0 0
    L 0 ${wingY - cornerR}
    Q 0 ${wingY}, ${cornerR} ${wingY}
    L ${cx - archHalfFlat - archRampW} ${wingY}
    C ${cx - archHalfFlat - 20} ${wingY}, ${cx - archHalfFlat - 18} ${archTopY}, ${cx - archHalfFlat} ${archTopY}
    L ${cx + archHalfFlat} ${archTopY}
    C ${cx + archHalfFlat + 18} ${archTopY}, ${cx + archHalfFlat + 20} ${wingY}, ${cx + archHalfFlat + archRampW} ${wingY}
    L ${FULL_W - cornerR} ${wingY}
    Q ${FULL_W} ${wingY}, ${FULL_W} ${wingY - cornerR}
    L ${FULL_W} 0
    Z
  `;

  // 2. #F5F6FA outer cradle shelf (fills the wing band + curves DOWN under the buttons)
  const cradleFillPath = `
    M 0 0
    L 0 ${shelfWingY - cornerR}
    Q 0 ${shelfWingY}, ${cornerR} ${shelfWingY}
    L ${cx - archHalfFlat - archRampW} ${shelfWingY}
    C ${cx - archHalfFlat - 20} ${shelfWingY}, ${cx - archHalfFlat - 18} ${cradleBottomY}, ${cx - archHalfFlat} ${cradleBottomY}
    L ${cx + archHalfFlat} ${cradleBottomY}
    C ${cx + archHalfFlat + 18} ${cradleBottomY}, ${cx + archHalfFlat + 20} ${shelfWingY}, ${cx + archHalfFlat + archRampW} ${shelfWingY}
    L ${FULL_W - cornerR} ${shelfWingY}
    Q ${FULL_W} ${shelfWingY}, ${FULL_W} ${shelfWingY - cornerR}
    L ${FULL_W} 0
    Z
  `;

  // 3. Crisp contour border along bottom of the #F5F6FA cradle
  const cradleContourPath = `
    M 0 ${shelfWingY - cornerR}
    Q 0 ${shelfWingY}, ${cornerR} ${shelfWingY}
    L ${cx - archHalfFlat - archRampW} ${shelfWingY}
    C ${cx - archHalfFlat - 20} ${shelfWingY}, ${cx - archHalfFlat - 18} ${cradleBottomY}, ${cx - archHalfFlat} ${cradleBottomY}
    L ${cx + archHalfFlat} ${cradleBottomY}
    C ${cx + archHalfFlat + 18} ${cradleBottomY}, ${cx + archHalfFlat + 20} ${shelfWingY}, ${cx + archHalfFlat + archRampW} ${shelfWingY}
    L ${FULL_W - cornerR} ${shelfWingY}
    Q ${FULL_W} ${shelfWingY}, ${FULL_W} ${shelfWingY - cornerR}
  `;

  const topBarHeight = Math.max(insets.top, 24) + 52;

  return (
    <View style={styles.outerWrapper} pointerEvents="box-none">
      {/* ── 1. Fixed Top Bar (pinned, clips ribbon behind it, subtle grid background) ── */}
      <View
        style={[
          styles.topBarContainer,
          {
            paddingTop: Math.max(insets.top, 24) + 6,
          },
        ]}
      >
        <Svg
          width={FULL_W}
          height={topBarHeight + 10}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            <Pattern id="topGrid" width="22" height="22" patternUnits="userSpaceOnUse">
              <Line x1="22" y1="0" x2="22" y2="22" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <Line x1="0" y1="22" x2="22" y2="22" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </Pattern>
          </Defs>
          <Rect x="0" y="0" width={FULL_W} height={topBarHeight + 10} fill="#7C83FD" />
          <Rect x="0" y="0" width={FULL_W} height={topBarHeight + 10} fill="url(#topGrid)" />
        </Svg>

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
              style={[styles.profileName, { opacity: nameOpacity }]}
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
            <Ionicons name="calendar-outline" size={19} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 2. Sliding Section: Ribbon + Dual Wave + Segmented Switcher ── */}
      <Animated.View
        style={[
          styles.slidingSection,
          { transform: [{ translateY: slidingTranslateY }] },
        ]}
        pointerEvents="box-none"
      >
        {/* 2a. Weekly Ribbon */}
        <Animated.View
          style={[styles.ribbonSection, { opacity: ribbonOpacity }]}
        >
          <Svg
            width={FULL_W}
            height={RIBBON_HEIGHT + 4}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Defs>
              <Pattern id="ribbonGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                <Line x1="22" y1="0" x2="22" y2="22" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <Line x1="0" y1="22" x2="22" y2="22" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              </Pattern>
            </Defs>
            <Rect x="0" y="0" width={FULL_W} height={RIBBON_HEIGHT + 4} fill="#7C83FD" />
            <Rect x="0" y="0" width={FULL_W} height={RIBBON_HEIGHT + 4} fill="url(#ribbonGrid)" />
          </Svg>

          <View style={styles.ribbonRow}>
            {weekDays.map((day) => {
              const showProgressRing = day.index === 0 && !day.isSelected;
              const ringR = 14.5;
              const circ = 2 * Math.PI * ringR;
              const dashOffset = circ * (1 - todayProgress);

              return (
                <TouchableOpacity
                  key={day.dateStr}
                  style={[styles.dayPill, day.isSelected && styles.dayPillSelected]}
                  onPress={() => onSelectDate(day.dateStr)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayName, day.isSelected && styles.dayNameSelected]}>
                    {day.name}
                  </Text>
                  <View
                    style={[
                      styles.dateCircle,
                      day.isSelected && styles.dateCircleSelected,
                    ]}
                  >
                    {showProgressRing && (
                      <Svg
                        width={32}
                        height={32}
                        viewBox="0 0 32 32"
                        style={styles.progressRingSvg}
                      >
                        <Circle
                          cx={16}
                          cy={16}
                          r={ringR}
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth={2}
                          fill="none"
                        />
                        <Circle
                          cx={16}
                          cy={16}
                          r={ringR}
                          stroke="#FFFFFF"
                          strokeWidth={2}
                          strokeDasharray={`${circ}`}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          fill="none"
                          rotation="-90"
                          origin="16, 16"
                        />
                      </Svg>
                    )}
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
              );
            })}
          </View>
        </Animated.View>

        {/* 2b. Organic Dual-Layer Wave + #F5F6FA Cradle + 3 Segmented Buttons */}
        <View style={styles.curveAndPodWrapper} pointerEvents="box-none">
          <View style={styles.waveSvgContainer} pointerEvents="none">
            <Svg width={FULL_W} height={svgHeight} viewBox={`0 0 ${FULL_W} ${svgHeight}`}>
              <Defs>
                <Pattern id="waveGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                  <Line x1="22" y1="0" x2="22" y2="22" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <Line x1="0" y1="22" x2="22" y2="22" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                </Pattern>
                <ClipPath id="lavenderClip">
                  <Path d={lavenderWavePath} />
                </ClipPath>
              </Defs>

              {/* Bottom Layer: #F5F6FA outer cradle shelf */}
              <Path d={cradleFillPath} fill="#F5F6FA" />

              {/* Top Layer: Lavender header wave + clipped grid texture */}
              <Path d={lavenderWavePath} fill="#7C83FD" />
              <Rect
                x="0"
                y="0"
                width={FULL_W}
                height={svgHeight}
                fill="url(#waveGrid)"
                clipPath="url(#lavenderClip)"
              />

              {/* Subtle bottom contour border along #F5F6FA cradle */}
              <Path
                d={cradleContourPath}
                fill="none"
                stroke="#E4E7F2"
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            </Svg>
          </View>

          {/* 3 Segmented Switcher Buttons nestled directly inside the #F5F6FA cradle */}
          <Animated.View
            style={[
              styles.podContainer,
              { transform: [{ translateY: podTuckY }] },
            ]}
            pointerEvents="box-none"
          >
            <View style={styles.podButtonsRow}>
              {/* Button 1: Compact List [ ▭ / ▭ ] */}
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  styles.segmentBtnLeft,
                  currentLayout === 'list' ? styles.segmentBtnActive : styles.segmentBtnInactive,
                ]}
                onPress={() => onSelectLayout('list')}
                activeOpacity={0.78}
              >
                <Svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <Rect
                    x="2.2"
                    y="4.2"
                    width="15.6"
                    height="4.4"
                    rx="2.2"
                    stroke={currentLayout === 'list' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                  <Rect
                    x="2.2"
                    y="11.4"
                    width="15.6"
                    height="4.4"
                    rx="2.2"
                    stroke={currentLayout === 'list' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                </Svg>
              </TouchableOpacity>

              {/* Button 2: Dual Weekly Card [ ▭ / ▯▯ ] */}
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  styles.segmentBtnMiddle,
                  currentLayout === 'dual' ? styles.segmentBtnActive : styles.segmentBtnInactive,
                ]}
                onPress={() => onSelectLayout('dual')}
                activeOpacity={0.78}
              >
                <Svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <Rect
                    x="2.5"
                    y="3.5"
                    width="15"
                    height="4.4"
                    rx="2.1"
                    stroke={currentLayout === 'dual' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                  <Rect
                    x="2.5"
                    y="10.5"
                    width="6.4"
                    height="6.4"
                    rx="2.1"
                    stroke={currentLayout === 'dual' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                  <Rect
                    x="11.1"
                    y="10.5"
                    width="6.4"
                    height="6.4"
                    rx="2.1"
                    stroke={currentLayout === 'dual' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                </Svg>
              </TouchableOpacity>

              {/* Button 3: Grid View [ ⊞ ] */}
              <TouchableOpacity
                style={[
                  styles.segmentBtn,
                  styles.segmentBtnRight,
                  currentLayout === 'grid' ? styles.segmentBtnActive : styles.segmentBtnInactive,
                ]}
                onPress={() => onSelectLayout('grid')}
                activeOpacity={0.78}
              >
                <Svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <Rect
                    x="2.6"
                    y="2.6"
                    width="6.2"
                    height="6.2"
                    rx="1.8"
                    stroke={currentLayout === 'grid' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                  <Rect
                    x="11.2"
                    y="2.6"
                    width="6.2"
                    height="6.2"
                    rx="1.8"
                    stroke={currentLayout === 'grid' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                  <Rect
                    x="2.6"
                    y="11.2"
                    width="6.2"
                    height="6.2"
                    rx="1.8"
                    stroke={currentLayout === 'grid' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                  <Rect
                    x="11.2"
                    y="11.2"
                    width="6.2"
                    height="6.2"
                    rx="1.8"
                    stroke={currentLayout === 'grid' ? '#FFFFFF' : '#4E5CE6'}
                    strokeWidth="1.75"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
    paddingBottom: 8,
    zIndex: 10,
    overflow: 'hidden',
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
    borderWidth: 1.8,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  calendarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidingSection: {
    zIndex: 5,
  },
  ribbonSection: {
    backgroundColor: '#7C83FD',
    paddingHorizontal: 14,
    height: RIBBON_HEIGHT,
    overflow: 'hidden',
  },
  ribbonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingBottom: 6,
  },
  dayPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 16,
    marginHorizontal: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dayPillSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.88)',
    marginBottom: 5,
  },
  dayNameSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dateCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCircleSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  progressRingSvg: {
    position: 'absolute',
  },
  dateNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dateNumSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  curveAndPodWrapper: {
    width: FULL_W,
    height: 70,
    position: 'relative',
  },
  waveSvgContainer: {
    marginTop: -1,
    width: FULL_W,
    height: 70,
  },
  podContainer: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  podButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 176,
    height: 38,
    gap: 5,
  },
  segmentBtn: {
    flex: 1,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBtnLeft: {
    borderTopLeftRadius: 19,
    borderBottomLeftRadius: 19,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  segmentBtnMiddle: {
    borderRadius: 8,
  },
  segmentBtnRight: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 19,
    borderBottomRightRadius: 19,
  },
  segmentBtnActive: {
    backgroundColor: '#757EFB',
    shadowColor: '#5965E6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentBtnInactive: {
    backgroundColor: '#D5DCFA',
  },
});
