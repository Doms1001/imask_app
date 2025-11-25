// CCJF7.js — Gray & Black Theme 

import React, { useRef, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

export default function CCJF7({ navigation }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0b0b0b', '#141414']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navSafe('CCJF3')}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>

        {/* top narrow gray bar */}
        <View style={s.topBarWrap}>
          <LinearGradient colors={['#4a4a4a', '#0f0f0f']} start={[0,0]} end={[1,1]} style={s.topBar} />
        </View>

        {/* big centered dark card */}
        <View style={s.bigCardWrapper}>
          <LinearGradient colors={['#3b3b3b', '#0b0b0b']} start={[0,0]} end={[1,1]} style={s.bigCard} />
          <View style={s.bigInnerBorder} pointerEvents="none" />
          <Animated.View style={s.bigGloss} pointerEvents="none" />
        </View>

        {/* bottom wide bar with overlapping dark square */}
        <View style={s.bottomRow}>
          <View style={s.bottomBarWrapper}>
            <LinearGradient colors={['#4a4a4a', '#0f0f0f']} start={[0,0]} end={[1,1]} style={s.bottomBar} />
            <Animated.View style={s.bottomBarGloss} pointerEvents="none" />
          </View>

          {/* overlapping small dark square to the right of the bottom bar */}
          <View style={s.bottomOverlapSquare} />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b0b' },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.02)' },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, backgroundColor: 'rgba(255,255,255,0.01)', opacity: 0.9 },

  back: { position: 'absolute', right: 14, top: 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
  backImg: { width: 34, height: 34, tintColor: '#cfcfcf' },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  previewRef: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 56,
    height: 56,
    opacity: 0.06,
    zIndex: 5,
  },

  /* TOP bar */
  topBarWrap: {
    width: Math.min(320, width - 64),
    alignItems: 'center',
    marginBottom: 18,
  },
  topBar: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },

  /* Big card */
  bigCardWrapper: {
    width: Math.min(400, width - 50),
    height: Math.min(300, height * 0.36),
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  bigCard: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  bigInnerBorder: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  bigGloss: {
    position: 'absolute',
    left: -50,
    top: -40,
    width: 160,
    height: 360,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
    transform: [{ rotate: '22deg' }],
    zIndex: 4,
  },

  /* bottom row */
  bottomRow: {
    width: Math.min(320, width - 64),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomBarWrapper: {
    flex: 1,
    height: 100,
    width: 150,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bottomBar: {
    width: '150%',
    height: '100%',
  },
  bottomBarGloss: {
    position: 'absolute',
    left: -40,
    top: -20,
    width: 120,
    height: 220,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ rotate: '22deg' }],
  },
  bottomOverlapSquare: {
    width: 56,
    height: 56,
    backgroundColor: '#2a2a2a',
    marginLeft: -26, // overlaps the bar edge
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
});
