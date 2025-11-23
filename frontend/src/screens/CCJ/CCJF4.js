// frontend/src/screens/CCS/CCSF4.js
// CCSF4 — gray/black gradient cards + shimmer + subtle glow + 3D press/tilt
// Theme: gray / black (keeps original interactions)

import React, { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomPager from '../../components/BottomPager';

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

// card images (keeps your existing assets)
const IMG_TUITION = require('../../../assets/tuition.png'); // top
const IMG_UNIFORM = require('../../../assets/uniform.png'); // left
const IMG_FAQ = require('../../../assets/faq.png'); // right

export default function CCJF4({ navigation }) {
  // entrance animation
  const entrance = useRef(new Animated.Value(0)).current;

  // shimmer global animated value
  const shimmer = useRef(new Animated.Value(-1)).current;

  // press scales and tilt for 3 cards
  const pressScales = [
    useRef(new Animated.Value(1)).current, // top
    useRef(new Animated.Value(1)).current, // left
    useRef(new Animated.Value(1)).current, // right
  ];
  const tilt = [
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
  ];

  // glow opacities under cards (animated)
  const glowOpac = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 700, useNativeDriver: true }).start();

    // shimmer loop
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();

    // idle glow pulses (staggered)
    const pulses = glowOpac.map((g, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(g, { toValue: 0.06, duration: 1200 + i * 60, useNativeDriver: true }),
          Animated.timing(g, { toValue: 0.0, duration: 1200 + i * 60, useNativeDriver: true }),
        ])
      )
    );
    Animated.stagger(200, pulses).start();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // shimmer translate (for the glossy overlay)
  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  // safe navigate
  function navSafe(route) {
    if (!navigation || typeof navigation.navigate !== 'function') {
      console.log('Navigation unavailable — target:', route);
      return;
    }
    navigation.navigate(route);
  }

  // PanResponder factory for tilt on card (subtle follow)
  function makeResponder(i) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(pressScales[i], { toValue: 0.96, friction: 8, useNativeDriver: true }).start();
      },
      onPanResponderMove: (evt, gs) => {
        const rx = Math.max(-12, Math.min(12, -gs.dx / 12));
        const ry = Math.max(-8, Math.min(8, gs.dy / 14));
        tilt[i].setValue({ x: rx, y: ry });
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(tilt[i].x, { toValue: 0, friction: 6, useNativeDriver: false }),
          Animated.spring(tilt[i].y, { toValue: 0, friction: 6, useNativeDriver: false }),
          Animated.spring(pressScales[i], { toValue: 1, friction: 9, useNativeDriver: true }),
          Animated.timing(glowOpac[i], { toValue: 0, duration: 260, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(tilt[i].x, { toValue: 0, friction: 6, useNativeDriver: false }),
          Animated.spring(tilt[i].y, { toValue: 0, friction: 6, useNativeDriver: false }),
          Animated.spring(pressScales[i], { toValue: 1, friction: 9, useNativeDriver: true }),
          Animated.timing(glowOpac[i], { toValue: 0, duration: 260, useNativeDriver: true }),
        ]).start();
      },
    });
  }

  const responders = [makeResponder(0), makeResponder(1), makeResponder(2)];

  // helper: card animated style from tilt + entrance + press
  function cardAnimatedStyle(i) {
    const translateY = entrance.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
    const baseScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.992, 1] });
    const combinedScale = Animated.multiply(baseScale, pressScales[i]);

    const rotateY = tilt[i].x.interpolate({ inputRange: [-30, 30], outputRange: ['-8deg', '8deg'] });
    const rotateX = tilt[i].y.interpolate({ inputRange: [-20, 20], outputRange: ['6deg', '-6deg'] });

    return {
      transform: [{ translateY }, { scale: combinedScale }, { rotateX }, { rotateY }],
    };
  }

  // glow style under card
  function glowStyle(i) {
    return {
      opacity: glowOpac[i],
      transform: [{ scale: entrance.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.04] }) }],
    };
  }

  // press handler for giving a stronger glow and navigation
  function handlePress(i, route) {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pressScales[i], { toValue: 0.92, duration: 90, useNativeDriver: true }),
        Animated.timing(glowOpac[i], { toValue: 0.32, duration: 120, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(pressScales[i], { toValue: 1, friction: 7, useNativeDriver: true }),
        Animated.timing(glowOpac[i], { toValue: 0, duration: 280, useNativeDriver: true }),
      ]),
    ]).start(() => navSafe(route));
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0b0b0b', '#1f1f1f']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navSafe('CCJF3')}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      {/* Centered block — slightly lower so it visually sits in the middle */}
      <View style={s.centerContainer}>
        {/* TOP card (TUITION) - neutral dark gradient */}
        <Animated.View {...responders[0].panHandlers} style={[s.topWrapper, cardAnimatedStyle(0)]}>
          <TouchableWithoutFeedback onPress={() => handlePress(0, 'CCJF8')} onPressIn={() => pressScales[0].setValue(0.96)} onPressOut={() => pressScales[0].setValue(1)}>
            <Animated.View style={[s.topCard]}>
              {/* gradient background (dark) */}
              <LinearGradient colors={['#3b3b3b', '#0b0b0b']} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
              {/* inner shadow */}
              <View style={s.innerShadowTop} pointerEvents="none" />
              {/* shimmer overlay */}
              <Animated.View style={[s.shimmer, { transform: [{ translateX: shimmerTranslate }, { rotate: '22deg' }] }]} pointerEvents="none" />
              {/* image */}
              <Image source={IMG_TUITION} style={s.topImage} resizeMode="contain" />
              {/* glow under card (subtle gray) */}
              <Animated.View style={[s.cardGlow, glowStyle(0)]} pointerEvents="none" />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* BOTTOM row: left (UNIFORM) and right (FAQ) */}
        <View style={s.bottomRow}>
          {/* LEFT - Uniform */}
          <Animated.View {...responders[1].panHandlers} style={[s.leftWrapper, cardAnimatedStyle(1)]}>
            <TouchableWithoutFeedback onPress={() => handlePress(1, 'CCJF10')}>
              <Animated.View style={[s.leftCard]}>
                <LinearGradient colors={['#4a4a4a', '#111111']} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
                <View style={s.innerShadowSmall} pointerEvents="none" />
                <Animated.View style={[s.shimmerSmall, { transform: [{ translateX: shimmerTranslate }, { rotate: '18deg' }] }]} pointerEvents="none" />
                <Image source={IMG_UNIFORM} style={s.leftImage} resizeMode="contain" />
                <Animated.View style={[s.cardGlowLeft, glowStyle(1)]} pointerEvents="none" />
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>

          {/* RIGHT - FAQ */}
          <Animated.View {...responders[2].panHandlers} style={[s.rightWrapper, cardAnimatedStyle(2)]}>
            <TouchableWithoutFeedback onPress={() => handlePress(2, 'CCJF9')}>
              <Animated.View style={[s.rightCard]}>
                <LinearGradient colors={['#2e2e2e', '#0a0a0a']} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
                <View style={s.innerShadowTall} pointerEvents="none" />
                <Animated.View style={[s.shimmer, { transform: [{ translateX: shimmerTranslate }, { rotate: '20deg' }] }]} pointerEvents="none" />
                <Image source={IMG_FAQ} style={s.rightImage} resizeMode="contain" />
                <Animated.View style={[s.cardGlowRight, glowStyle(2)]} pointerEvents="none" />
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </View>

      <BottomPager navigation={navigation} activeIndex={2} targets={['CCJF2', 'CCJF3', 'CCJF4']} />
    </SafeAreaView>
  );
}

/* Styles (adjusted to gray/black theme) */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b0b', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 150,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  layerBottomLeft: {
    position: 'absolute',
    left: -90,
    bottom: 90,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.01)',
    opacity: 0.7,
  },

  back: { position: 'absolute', right: 14, top: 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 60 },
  backImg: { width: 34, height: 34, tintColor: '#cfcfcf' },

  centerContainer: {
    width: Math.min(420, width - 28),
    height: height * 0.72,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topWrapper: { width: '100%', alignItems: 'center', marginBottom: 16 },
  topCard: {
    width: Math.min(320, width - 56),
    height: Math.min(170, height * 0.24),
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // darker shadow for depth
    shadowColor: '#000',
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 28,
    elevation: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  innerShadowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
    backgroundColor: 'rgba(0,0,0,0.12)',
    zIndex: 2,
  },
  shimmer: {
    position: 'absolute',
    left: -90,
    top: -40,
    width: 120,
    height: 260,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    zIndex: 6,
  },
  topImage: { width: '78%', height: '78%', zIndex: 4 },

  bottomRow: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 6,
    marginTop: 6,
  },

  leftWrapper: { width: '62%', alignItems: 'flex-start' },
  leftCard: {
    width: '100%',
    aspectRatio: 1.06,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.30,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 18,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  innerShadowSmall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '36%',
    backgroundColor: 'rgba(0,0,0,0.10)',
    zIndex: 2,
  },
  shimmerSmall: {
    position: 'absolute',
    left: -70,
    top: -30,
    width: 100,
    height: 200,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    zIndex: 5,
  },
  leftImage: { width: '72%', height: '72%', zIndex: 4 },

  rightWrapper: { width: '34%', alignItems: 'flex-end' },
  rightCard: {
    width: '100%',
    aspectRatio: 0.62,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.30,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 18,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.02)',
  },
  innerShadowTall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '32%',
    backgroundColor: 'rgba(0,0,0,0.10)',
    zIndex: 2,
  },
  rightImage: { width: '82%', height: '82%', zIndex: 4 },

  // Subtle gray glows under cards
  cardGlow: {
    position: 'absolute',
    bottom: -12,
    width: Math.min(340, width - 56),
    height: 28,
    borderRadius: 18,
    backgroundColor: 'rgba(220,220,220,0.04)',
    zIndex: -1,
    shadowColor: '#111',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 12,
  },
  cardGlowLeft: {
    position: 'absolute',
    bottom: -10,
    width: '110%',
    height: 22,
    borderRadius: 12,
    backgroundColor: 'rgba(200,200,200,0.03)',
    zIndex: -1,
    shadowColor: '#111',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 10,
  },
  cardGlowRight: {
    position: 'absolute',
    bottom: -10,
    width: '130%',
    height: 22,
    borderRadius: 12,
    backgroundColor: 'rgba(200,200,200,0.03)',
    zIndex: -1,
    shadowColor: '#111',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 10,
  },
});
