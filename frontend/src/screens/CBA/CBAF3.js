// CBAF3.js — Yellow / Orange Theme (tilt, press, shimmer kept)
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
// use CBA logo for consistency
const LOGO = require('../../../assets/CBAlogo.png');
const BACK = require('../../../assets/back.png');

const IMG_NEWS = require('../../../assets/news.png');
const IMG_EVENT = require('../../../assets/event.png');
const IMG_ANNOUNCE = require('../../../assets/announcement.png');

export default function CBAF3({ navigation }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(-1)).current;
  const entranceRef = useRef(null);
  const shimmerLoopRef = useRef(null);

  // entry anims (kept outside effect so they can be referenced)
  const enterAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const pressScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const glowOpac = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const tilt = [
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
  ];

  useEffect(() => {
    entranceRef.current = Animated.timing(entrance, { toValue: 1, duration: 600, useNativeDriver: true });
    entranceRef.current.start();

    const enterSeq = [
      Animated.timing(enterAnims[0], { toValue: 1, duration: 420, delay: 0, useNativeDriver: true }),
      Animated.timing(enterAnims[1], { toValue: 1, duration: 420, delay: 120, useNativeDriver: true }),
      Animated.timing(enterAnims[2], { toValue: 1, duration: 420, delay: 240, useNativeDriver: true }),
    ];
    Animated.stagger(110, enterSeq).start();

    // shimmer loop
    const sLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: -1, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmerLoopRef.current = sLoop;
    sLoop.start();

    return () => {
      entranceRef.current && entranceRef.current.stop && entranceRef.current.stop();
      shimmerLoopRef.current && shimmerLoopRef.current.stop && shimmerLoopRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function makeResponder(i) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(pressScales[i], { toValue: 0.96, friction: 7, tension: 200, useNativeDriver: true }).start();
      },
      onPanResponderMove: (evt, gs) => {
        const rx = Math.max(-18, Math.min(18, -gs.dx / 8));
        const ry = Math.max(-12, Math.min(12, gs.dy / 10));
        tilt[i].setValue({ x: rx, y: ry });
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(tilt[i].x, { toValue: 0, useNativeDriver: false }),
          Animated.spring(tilt[i].y, { toValue: 0, useNativeDriver: false }),
          Animated.spring(pressScales[i], { toValue: 1, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(tilt[i].x, { toValue: 0, useNativeDriver: false }),
          Animated.spring(tilt[i].y, { toValue: 0, useNativeDriver: false }),
          Animated.spring(pressScales[i], { toValue: 1, useNativeDriver: true }),
        ]).start();
      },
    });
  }

  const responders = [makeResponder(0), makeResponder(1), makeResponder(2)];

  function navSafe(route) {
    if (navigation && typeof navigation.navigate === 'function') navigation.navigate(route);
  }

  function handlePress(index, target) {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pressScales[index], { toValue: 0.92, duration: 90, useNativeDriver: true }),
        Animated.timing(glowOpac[index], { toValue: 0.38, duration: 90, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(pressScales[index], { toValue: 1, useNativeDriver: true }),
        Animated.timing(glowOpac[index], { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    ]).start(() => navSafe(target));
  }

  function cardAnimatedStyle(i) {
    const translateY = enterAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
    const baseScale = enterAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.986, 1] });
    const combinedScale = Animated.multiply(baseScale, pressScales[i]);

    const rotateY = tilt[i].x.interpolate({ inputRange: [-30, 30], outputRange: ['-12deg', '12deg'] });
    const rotateX = tilt[i].y.interpolate({ inputRange: [-20, 20], outputRange: ['12deg', '-12deg'] });

    return { transform: [{ translateY }, { scale: combinedScale }, { rotateX }, { rotateY }] };
  }

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  const MiddlePanel = () => (
    <View style={m.container}>
      <View style={m.leftColumn}>
        {/* NEWS */}
        <Animated.View {...responders[0].panHandlers} style={[m.cardWrapper, cardAnimatedStyle(0)]}>
          <Animated.View style={[m.card, m.gradientCardTop]}>
            {/* warm yellow→orange gradient */}
            <LinearGradient colors={['#FFD54F', '#FF8A00']} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
            <View style={m.innerShadow} />
            <Animated.View style={[m.gloss, { opacity: 0.28, transform: [{ translateX: shimmerTranslate }, { rotate: '22deg' }] }]} />
            <TouchableWithoutFeedback onPress={() => handlePress(0, 'CBAF5')}>
              <View style={m.centered}><Image source={IMG_NEWS} style={m.bigImage} /></View>
            </TouchableWithoutFeedback>
            <Animated.View style={[m.cardGlow, { opacity: glowOpac[0], backgroundColor: 'rgba(255,165,60,0.16)' }]} />
          </Animated.View>
        </Animated.View>

        {/* ANNOUNCEMENT */}
        <Animated.View {...responders[1].panHandlers} style={[m.cardWrapper, cardAnimatedStyle(1)]}>
          <Animated.View style={[m.card, m.gradientCardSmall]}>
            <LinearGradient colors={['#FFB74D', '#FF7043']} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
            <View style={m.innerShadowSmall} />
            <Animated.View style={[m.glossSmall, { opacity: 0.22, transform: [{ translateX: shimmerTranslate }, { rotate: '18deg' }] }]} />
            <TouchableWithoutFeedback onPress={() => handlePress(1, 'CBAF7')}>
              <View style={m.centered}><Image source={IMG_ANNOUNCE} style={m.smallImage} /></View>
            </TouchableWithoutFeedback>
            <Animated.View style={[m.cardGlow, { opacity: glowOpac[1], backgroundColor: 'rgba(255,150,60,0.14)' }]} />
          </Animated.View>
        </Animated.View>
      </View>

      {/* EVENT */}
      <Animated.View {...responders[2].panHandlers} style={[m.cardWrapper, cardAnimatedStyle(2)]}>
        <Animated.View style={[m.card, m.gradientCardRight]}>
          <LinearGradient colors={['#FFB74D', '#FF8A00']} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
          <View style={m.innerShadowRight} />
          <Animated.View style={[m.gloss, { opacity: 0.22, transform: [{ translateX: shimmerTranslate }, { rotate: '20deg' }] }]} />
          <TouchableWithoutFeedback onPress={() => handlePress(2, 'CBAF6')}>
            <View style={m.centered}><Image source={IMG_EVENT} style={m.eventImage} /></View>
          </TouchableWithoutFeedback>
          <Animated.View style={[m.cardGlow, { opacity: glowOpac[2], backgroundColor: 'rgba(255,145,40,0.16)' }]} />
        </Animated.View>
      </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" />

      {/* warm background */}
      <LinearGradient colors={['#fff9f0', '#fff6ee']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableWithoutFeedback onPress={() => navSafe('CBAF2')}>
        <View style={s.back}><Image source={BACK} style={s.backImg} /></View>
      </TouchableWithoutFeedback>

      <View style={s.contentWrap} />

      <MiddlePanel />

      <BottomPager navigation={navigation} activeIndex={1} targets={['CBAF2', 'CBAF3', 'CBAF4']} />
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },
  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, backgroundColor: '#FFE082', borderRadius: 18, opacity: 0.95 },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, backgroundColor: '#FFB74D', borderRadius: 160, opacity: 0.95 },
  back: { position: 'absolute', right: 14, top: Platform.OS === 'android' ? 14 : 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center' },
  backImg: { width: 34, height: 34, tintColor: '#fff' },
  contentWrap: { marginTop: 36, width: Math.min(420, width - 28), height: Math.min(560, height * 0.72) },
});

const m = StyleSheet.create({
  container: { position: 'absolute', top: 0, bottom: 0, left: 8, right: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  leftColumn: { flexDirection: 'column', justifyContent: 'space-between', height: 320, marginRight: 18 },
  cardWrapper: { width: 160, alignItems: 'center' },
  card: {
    width: 160,
    borderRadius: 18,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: '#8f5e00',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  gradientCardTop: { height: 180 },
  gradientCardSmall: { width: 140, height: 120, marginTop: 12, borderRadius: 14 },
  gradientCardRight: { width: 160, height: 240, borderRadius: 18 },
  innerShadow: { position: 'absolute', top: 0, left: 0, right: 0, height: '52%', backgroundColor: 'rgba(0,0,0,0.06)' },
  innerShadowSmall: { position: 'absolute', top: 0, left: 0, right: 0, height: '46%', backgroundColor: 'rgba(0,0,0,0.05)' },
  innerShadowRight: { position: 'absolute', top: 0, left: 0, right: 0, height: '48%', backgroundColor: 'rgba(0,0,0,0.05)' },
  gloss: { position: 'absolute', left: -70, top: -30, width: 100, height: 240, backgroundColor: 'rgba(255,255,255,0.26)', borderRadius: 80 },
  glossSmall: { position: 'absolute', left: -50, top: -20, width: 80, height: 160, backgroundColor: 'rgba(255,255,255,0.20)', borderRadius: 70 },
  cardGlow: { position: 'absolute', bottom: -8, width: 160, height: 22, borderRadius: 12, backgroundColor: 'rgba(255,160,50,0.16)' },
  bigImage: { width: 120, height: 120 },
  smallImage: { width: 100, height: 70 },
  eventImage: { width: 120, height: 120 },
  centered: { alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
});
