// frontend/src/screens/CCS/CCSF3.js
import React, { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Animated,
  Platform,
  Text,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomPager from '../../components/BottomPager';

const { width, height } = Dimensions.get('window');
const LOGO = require('../../../assets/CCSlogo.png');
const BACK = require('../../../assets/back.png');

const IMG_NEWS = require('../../../assets/news.png');
const IMG_EVENT = require('../../../assets/event.png');
const IMG_ANNOUNCE = require('../../../assets/announcement.png');

export default function CCSF3({ navigation }) {
  // tiny dummy not used visually but kept for parity
  const dummy = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dummy, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [dummy]);

  // --- Entrance animations (stagger) ---
  const enterAnims = [
    useRef(new Animated.Value(0)).current, // news (left-top)
    useRef(new Animated.Value(0)).current, // announce (left-bottom)
    useRef(new Animated.Value(0)).current, // event (right)
  ];

  // --- Press scales ---
  const pressScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  // --- Glow opacity under each card ---
  const glowOpac = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // --- Tilt (parallax) Animated.ValueXY for each card ---
  const tilt = [
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
  ];

  // --- Shimmer (global) ---
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // stagger entrance
    const seq = enterAnims.map((a, i) =>
      Animated.timing(a, { toValue: 1, duration: 420, delay: i * 120, useNativeDriver: true })
    );
    Animated.stagger(110, seq).start();

    // shimmer loop
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // shimmer translate for overlay (range computed below when used)

  // --- PanResponders factory for tilt ---
  function makeResponder(i) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(pressScales[i], { toValue: 0.96, friction: 7, tension: 200, useNativeDriver: true }).start();
      },
      onPanResponderMove: (evt, gs) => {
        // small mapping: moveX relative to center -> rotateY, moveY -> rotateX
        const dx = gs.dx;
        const dy = gs.dy;
        // clamp values for smoother effect
        const rx = Math.max(-18, Math.min(18, -dx / 8)); // rotateY
        const ry = Math.max(-12, Math.min(12, dy / 10)); // rotateX
        tilt[i].setValue({ x: rx, y: ry });
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(tilt[i].x, { toValue: 0, friction: 6, useNativeDriver: false }),
          Animated.spring(tilt[i].y, { toValue: 0, friction: 6, useNativeDriver: false }),
          Animated.spring(pressScales[i], { toValue: 1, friction: 8, tension: 120, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(tilt[i].x, { toValue: 0, friction: 6, useNativeDriver: false }),
          Animated.spring(tilt[i].y, { toValue: 0, friction: 6, useNativeDriver: false }),
          Animated.spring(pressScales[i], { toValue: 1, friction: 8, tension: 120, useNativeDriver: true }),
        ]).start();
      },
    });
  }

  const responders = [makeResponder(0), makeResponder(1), makeResponder(2)];

  // safe navigation helper
  function navSafe(route) {
    if (!navigation || typeof navigation.navigate !== 'function') {
      console.log('Navigation unavailable — target:', route);
      return;
    }
    navigation.navigate(route);
  }

  // press animation + navigate
  function handlePress(index, target) {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pressScales[index], { toValue: 0.92, duration: 90, useNativeDriver: true }),
        Animated.timing(glowOpac[index], { toValue: 0.38, duration: 90, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(pressScales[index], { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }),
        Animated.timing(glowOpac[index], { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    ]).start(() => navSafe(target));
  }

  // animated style generator for each card
  function cardAnimatedStyle(i) {
    const translateY = enterAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
    const baseScale = enterAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.986, 1] });
    const combinedScale = Animated.multiply(baseScale, pressScales[i]);

    // tilt values mapped to rotateY/rotateX
    const rotateY = tilt[i].x.interpolate({ inputRange: [-30, 30], outputRange: ['-12deg', '12deg'] });
    const rotateX = tilt[i].y.interpolate({ inputRange: [-20, 20], outputRange: ['12deg', '-12deg'] });

    return {
      transform: [{ translateY }, { scale: combinedScale }, { rotateX }, { rotateY }],
    };
  }

  function glowStyle(i) {
    return {
      opacity: glowOpac[i],
      transform: [{ scale: enterAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.06] }) }],
    };
  }

  // shimmer translateX computation (applies to card-level shimmer overlay)
  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  // ---------- Middle panel (same layout, animations added) ----------
  const MiddlePanel = () => {
    return (
      <View style={m.container}>
        <View style={m.leftColumn}>
          {/* NEWS (top-left) */}
          <View style={{ alignItems: 'center' }}>
            <Animated.View
              {...responders[0].panHandlers}
              style={[m.cardWrapper, cardAnimatedStyle(0)]}
            >
              <Animated.View style={[m.card, m.yellowCard]}>
                {/* gradient + inner shadow + glossy highlight + image + shimmer */}
                <LinearGradient colors={['#FFD964', '#FFB300']} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
                <View style={m.innerShadow} pointerEvents="none" />
                <Animated.View style={[m.gloss, { opacity: 0.28, transform: [{ translateX: shimmerTranslate }, { rotate: '22deg' }] }]} pointerEvents="none" />
                <TouchableWithoutFeedback onPress={() => handlePress(0, 'News')}>
                  <Animated.View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Image source={IMG_NEWS} style={m.bigImage} resizeMode="contain" />
                  </Animated.View>
                </TouchableWithoutFeedback>
                <Animated.View style={[m.cardGlow, glowStyle(0)]} pointerEvents="none" />
              </Animated.View>
            </Animated.View>
          </View>

          {/* ANNOUNCEMENT (bottom-left) */}
          <View style={{ alignItems: 'center' }}>
            <Animated.View
              {...responders[1].panHandlers}
              style={[m.cardWrapper, cardAnimatedStyle(1)]}
            >
              <Animated.View style={[m.card, m.smallWhiteCard]}>
                <LinearGradient colors={['#ffffff', '#f8f8f8']} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
                <View style={m.innerShadowSmall} pointerEvents="none" />
                <Animated.View style={[m.glossSmall, { opacity: 0.22, transform: [{ translateX: shimmerTranslate }, { rotate: '18deg' }] }]} pointerEvents="none" />
                <TouchableWithoutFeedback onPress={() => handlePress(1, 'Announcement')}>
                  <Animated.View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Image source={IMG_ANNOUNCE} style={m.smallImage} resizeMode="contain" />
                  </Animated.View>
                </TouchableWithoutFeedback>
                <Animated.View style={[m.cardGlow, glowStyle(1)]} pointerEvents="none" />
              </Animated.View>
            </Animated.View>
          </View>
        </View>

        {/* EVENT (right) */}
        <Animated.View {...responders[2].panHandlers} style={[m.cardWrapper, cardAnimatedStyle(2)]}>
          <Animated.View style={[m.card, m.rightCard]}>
            <LinearGradient colors={['#fff', '#fff']} style={StyleSheet.absoluteFill} />
            <View style={m.innerShadowRight} pointerEvents="none" />
            <Animated.View style={[m.gloss, { opacity: 0.22, transform: [{ translateX: shimmerTranslate }, { rotate: '20deg' }] }]} pointerEvents="none" />
            <TouchableWithoutFeedback onPress={() => handlePress(2, 'Event')}>
              <Animated.View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <Image source={IMG_EVENT} style={m.eventImage} resizeMode="contain" />
              </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.View style={[m.cardGlow, glowStyle(2)]} pointerEvents="none" />
          </Animated.View>
        </Animated.View>

        {/* decorative edge */}
        <View style={m.edgeDecor}>
          <View style={m.redCircle} />
          <View style={m.redSquare} />
        </View>

        {/* top corner */}
        <View style={m.topCorner}>
          <Text style={m.arrow}>↩︎</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={['#fff', '#f7f7f9']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableWithoutFeedback onPress={() => navSafe('CCSF2')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <View style={s.contentWrap} />

      <MiddlePanel />

      <BottomPager navigation={navigation} activeIndex={1} targets={['CCSF2', 'CCSF3', 'CCSF4']} />
    </SafeAreaView>
  );
}

/* Screen styles preserved, only additions below */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },
  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, borderRadius: 18, backgroundColor: '#2f2f2f' },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, backgroundColor: '#ff2b2b', opacity: 0.70 },

  back: { position: 'absolute', right: 14, top: 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 60 },
  backImg: { width: 34, height: 34, tintColor: '#fff' },

  contentWrap: {
    marginTop: 36,
    width: Math.min(420, width - 28),
    height: Math.min(560, height * 0.72),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/* middle panel styles + extras */
const m = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 36,
    bottom: 120, // leaves room for bottom pager
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 40, // above content
  },

  leftColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 320,
    marginRight: 18,
  },

  // wrapper to host animated transforms (keeps card static styles clean)
  cardWrapper: {
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    width: 160,
    borderRadius: 18,
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // static shadow
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },

  yellowCard: {
    backgroundColor: '#FFD217',
    height: 180,
  },

  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '52%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.06)',
    zIndex: 8,
  },

  innerShadowSmall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.05)',
    zIndex: 8,
  },

  innerShadowRight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    zIndex: 8,
  },

  gloss: {
    position: 'absolute',
    left: -70,
    top: -30,
    width: 100,
    height: 240,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.26)',
    zIndex: 12,
  },

  glossSmall: {
    position: 'absolute',
    left: -50,
    top: -20,
    width: 80,
    height: 160,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.20)',
    zIndex: 12,
  },

  cardGlow: {
    position: 'absolute',
    bottom: -8,
    width: 160,
    height: 22,
    borderRadius: 12,
    backgroundColor: 'rgba(240,70,120,0.18)',
    zIndex: -1,
  },

  bigImage: {
    width: 120,
    height: 120,
  },

  smallWhiteCard: {
    backgroundColor: '#fff',
    width: 140,
    height: 120,
    marginTop: 12,
    borderRadius: 14,
  },

  smallImage: {
    width: 100,
    height: 70,
  },

  rightCard: {
    width: 160,
    height: 240,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  eventImage: {
    width: 120,
    height: 120,
  },

  edgeDecor: {
    position: 'absolute',
    right: -10,
    top: 60,
    alignItems: 'center',
    zIndex: 30,
  },

  redCircle: {
    width: 300,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ff2424',
    marginTop: 50,
    right: -200,
  },

  redSquare: {
    width: 50,
    height: 50,
    backgroundColor: '#ff2424',
    marginTop: 350,
    right: -130,
  },

  topCorner: {
    position: 'absolute',
    right: -6,
    top: -8,
    width: 96,
    height: 64,
    borderBottomLeftRadius: 40,
    backgroundColor: '#3a3a3a',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 12,
    zIndex: 50,
  },

  arrow: {
    color: '#fff',
    fontSize: 18,
    transform: [{ rotate: '-25deg' }],
  },
});
