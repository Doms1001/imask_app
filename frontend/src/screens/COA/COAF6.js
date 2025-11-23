// CCSF6.js — Event screen converted to Yellow + White theme
// Event screen with reminder bars + big gradient calendar + overlapping yellow square

import React, { useRef, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function CCSF6({ navigation }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);

  function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function startWeekdayOfMonth(year, month) {
    return new Date(year, month, 1).getDay(); // 0..6
  }

  function prevMonth() {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysCount = daysInMonth(year, month);
  const startWeekday = startWeekdayOfMonth(year, month);

  // build grid: array of weeks where each week is 7 items (either day number or null)
  const grid = [];
  let week = new Array(7).fill(null);
  let day = 1;

  // fill the first week
  for (let i = 0; i < 7; i++) {
    if (i >= startWeekday) {
      week[i] = day++;
    }
  }
  grid.push(week);

  while (day <= daysCount) {
    week = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= daysCount; i++) {
      week[i] = day++;
    }
    grid.push(week);
  }

  function isTodayCell(d) {
    return d &&
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
  }

  function isSelectedCell(d) {
    return selectedDate &&
      d &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === d;
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#fffaf0', '#fff7e6']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navSafe('COAF3')}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>
        {/* Top: reminder bars */}
        <View style={s.reminders}>
          <View style={s.reminderRow}>
            <LinearGradient colors={['rgba(0,0,0,0.04)', 'rgba(0,0,0,0.02)']} start={[0,0]} end={[1,0]} style={s.reminderBase}>
              <LinearGradient colors={['#ffe066', '#ffd60a']} start={[0,0]} end={[1,1]} style={s.reminderGradientLeft} />
              <View style={s.reminderBadge}><Text style={s.badgeText}>Reminder</Text></View>
            </LinearGradient>
          </View>

          <View style={s.reminderRow}>
            <LinearGradient colors={['rgba(0,0,0,0.04)', 'rgba(0,0,0,0.02)']} start={[0,0]} end={[1,0]} style={s.reminderBase}>
              <LinearGradient colors={['#ffe066', '#ffd60a']} start={[0,0]} end={[1,1]} style={s.reminderGradientLeft} />
              <View style={s.reminderBadge}><Text style={s.badgeText}>Reminder</Text></View>
            </LinearGradient>
          </View>
        </View>

        {/* Calendar container (big card replacement) */}
        <View style={s.bigCardWrapper}>
          {/* gradient background */}
          <LinearGradient colors={['#ffe066', '#fff1b8']} start={[0,0]} end={[1,1]} style={s.bigCard} />

          {/* header: month + nav */}
          <View style={s.calHeader}>
            <TouchableOpacity onPress={prevMonth} style={s.chevBtn}>
              <Text style={s.chevText}>‹</Text>
            </TouchableOpacity>
            <Text style={s.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} style={s.chevBtn}>
              <Text style={s.chevText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* weekday labels */}
          <View style={s.weekRow}>
            {WEEKDAYS.map(w => (
              <Text key={w} style={s.weekdayText}>{w}</Text>
            ))}
          </View>

          {/* days grid */}
          <View style={s.grid}>
            {grid.map((wk, rIdx) => (
              <View key={`w${rIdx}`} style={s.weekRow}>
                {wk.map((d, cIdx) => {
                  const todayMark = isTodayCell(d);
                  const selMark = isSelectedCell(d);
                  return (
                    <TouchableWithoutFeedback
                      key={`c${rIdx}-${cIdx}`}
                      onPress={() => {
                        if (d) setSelectedDate(new Date(year, month, d));
                      }}
                    >
                      <View style={[s.dayCell, selMark && s.dayCellSelected, todayMark && s.dayCellToday]}>
                        <Text style={[s.dayText, selMark && s.dayTextSelected]}>{d ? String(d) : ''}</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  );
                })}
              </View>
            ))}
          </View>

          {/* inner border and gloss */}
          <View style={s.bigCardInnerBorder} pointerEvents="none" />
          <Animated.View style={s.bigCardGloss} pointerEvents="none" />
        </View>

        {/* Overlapping yellow square attached to big card */}
        <View style={s.overlapSquare} />
      </View>
    </SafeAreaView>
  );
}

/* Styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fffaf0' },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, borderRadius: 18, backgroundColor: 'rgba(255, 235, 120, 0.6)' },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, backgroundColor: 'rgba(255, 220, 60, 0.7)' },

  back: { position: 'absolute', right: 14, top: 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
  backImg: { width: 34, height: 34, tintColor: '#111' },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  /* Reminders */
  reminders: {
    width: Math.min(340, width - 48), // match big card width
    marginBottom: 18,
    alignSelf: 'center',
  },
  reminderRow: { marginBottom: 12 },
  reminderBase: {
    width: '100%',
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  reminderGradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    opacity: 0.26,
  },
  reminderBadge: {
    position: 'absolute',
    right: 12,
    top: 10,
    backgroundColor: '#ffd60a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: { color: '#111', fontSize: 12, fontWeight: '700' },

  /* Big card (calendar) */
  bigCardWrapper: {
    width: Math.min(390, width - 30),
    height: Math.min(360, height * 0.56),
    borderRadius: 8,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    // subtle frame shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
    padding: 12,
  },
  bigCard: {
    position: 'absolute',
    left: '1%',
    top: '1%',
    width: '105%',
    height: '105%',
    borderRadius: 8,
  },

  // Calendar header
  calHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 6,
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  monthTitle: { fontSize: 16, color: '#111', fontWeight: '700' },
  chevBtn: { padding: 6 },
  chevText: { color: '#111', fontSize: 20 },

  weekRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 6,
  },
  weekdayText: { width: (Math.min(340, width - 48) - 24) / 7, textAlign: 'center', fontSize: 12, color: 'rgba(17,17,17,0.7)', fontWeight: '600' },

  grid: {
    width: '100%',
    marginTop: 8,
  },
  dayCell: {
    width: (Math.min(340, width - 48) - 24) / 7,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    borderRadius: 6,
  },
  dayCellToday: {
    backgroundColor: 'rgba(17,17,17,0.08)',
  },
  dayCellSelected: {
    backgroundColor: '#111',
  },
  dayText: { color: '#111', fontSize: 13 },
  dayTextSelected: { color: '#fff', fontWeight: '700' },

  bigCardInnerBorder: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    zIndex: 5,
  },
  bigCardGloss: {
    position: 'absolute',
    left: -60,
    top: -40,
    width: 160,
    height: 380,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.22)',
    transform: [{ rotate: '22deg' }],
    zIndex: 7,
  },

  /* overlapping yellow square (positioned relative to big card) */
  overlapSquare: {
    position: 'absolute',
    right: 12,
    bottom: 112 * -0.0, // unused; kept for compatibility
    marginTop: 10,
    width: 56,
    height: 56,
    backgroundColor: '#ffd60a',
    borderRadius: 4,
    zIndex: 10,
    shadowColor: '#ffd60a',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 10,
  },
});
