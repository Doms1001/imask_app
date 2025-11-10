import React, { useRef, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Artistic CCSF2 — big, bold, layered gradients, parallax logo, animated pager
// Drop into src/screens/CCS/CCSF2_Artistic.js and register in your navigator.

const { width, height } = Dimensions.get('window');
const CONTAINER_W = Math.min(420, width - 28);
const CARD_GAP = 18;
const CARD_W = CONTAINER_W;
const VISIBLE_W = CARD_W + CARD_GAP;

const LOGO = require('../../../assets/CCSlogo.png');
const BACK = require('../../../assets/back.png');

const DATA = [
  {
    title: 'Bachelor of Science in Computer Science',
    subtitle: 'Specialization in Cybersecurity',
    desc:
      'Design secure systems, analyze threats, and craft resilient software — this track balances deep theory with hands-on defensive practice.',
  },
  {
    title: 'Software Engineering',
    subtitle: 'Apps & Systems',
    desc: 'Build production-ready software focusing on quality, testing and architecture.',
  },
  {
    title: 'Information Technology',
    subtitle: 'Networks & Ops',
    desc: 'Infrastructure, deployment, and operational excellence for real-world systems.',
  },
];

export default function CCSF2Artistic({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const parallax = useRef(new Animated.Value(0)).current; // for logo parallax
  const pulse = useRef(new Animated.Value(0)).current; // for subtle breathing

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  function onMomentumScrollEnd(e) {
    const x = e.nativeEvent.contentOffset.x;
    const ix = Math.round(x / VISIBLE_W);
    setIndex(ix);
  }

  function go(i) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ x: i * VISIBLE_W, animated: true });
  }

  function handleScroll(e) {
    // map scroll position to parallax offset
    const x = e.nativeEvent.contentOffset.x;
    parallax.setValue(x);
  }

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.03] });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />

      {/* layered background art */}
      <LinearGradient colors={['#fff', '#f7f7f9']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* back button */}
      <TouchableOpacity style={s.back} onPress={() => navigation?.navigate && navigation.navigate('CCSF1')}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      {/* carousel area */}
      <View style={s.carouselWrap}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={VISIBLE_W}
          contentContainerStyle={s.scrollContent}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: parallax } } }], {
            useNativeDriver: false,
            listener: handleScroll,
          })}
        >
          {DATA.map((it, i) => {
            // interpolate a tiny tilt and scale for 3D feel
            const input = [(i - 1) * VISIBLE_W, i * VISIBLE_W, (i + 1) * VISIBLE_W];
            const rotate = parallax.interpolate({ inputRange: input, outputRange: ['-3deg', '0deg', '3deg'], extrapolate: 'clamp' });
            const scale = parallax.interpolate({ inputRange: input, outputRange: [0.98, 1, 0.98], extrapolate: 'clamp' });

            return (
              <Animated.View key={i} style={[s.cardContainer, { transform: [{ rotate }, { scale }] }]}>
                <LinearGradient colors={["#ff6161", "#8b0000"]} style={s.card}>
                  {/* parallax logo (moves slightly opposite of scroll) */}
                  <Animated.Image
                    source={LOGO}
                    style={[s.cardLogo, { transform: [{ translateX: parallax.interpolate({ inputRange: [(i - 1) * VISIBLE_W, i * VISIBLE_W, (i + 1) * VISIBLE_W], outputRange: [50, 0, -50] }) }, { scale: pulseScale }] }]}
                    resizeMode="contain"
                  />

                  <View style={s.textBlock}>
                    <Text style={s.h1}>{it.title}</Text>
                    <Text style={s.h2}>{it.subtitle}</Text>
                    <Text style={s.p}>{it.desc}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>

      {/* fixed bottom controls */}
      <View style={s.bottomWrap} pointerEvents="box-none">
        <View style={s.pagerBox}>
          {DATA.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => go(i)} activeOpacity={0.9}>
              <Animated.View style={[s.outerRing, index === i && s.outerRingActive]}>
                <View style={s.innerDot}>
                  <Image source={LOGO} style={s.dotLogo} />
                </View>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },
  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, borderRadius: 18, backgroundColor: '#2f2f2f' },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, backgroundColor: '#ff2b2b', opacity: 0.12 },

  back: { position: 'absolute', right: 14, top: 14, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  backImg: { width: 34, height: 34, tintColor: '#fff' },

  carouselWrap: { marginTop: 36, width: CONTAINER_W, height: Math.min(560, height * 0.72) },
  scrollContent: { alignItems: 'center', paddingHorizontal: (width - CARD_W) / 2 - CARD_GAP / 2 },
  cardContainer: { width: CARD_W, marginRight: CARD_GAP },
  card: { borderRadius: 20, padding: 22, minHeight: '100%', overflow: 'hidden', alignItems: 'flex-start' },

  cardLogo: { position: 'absolute', width: '72%', height: 180, opacity: 0.12, top: 18, right: -10 },

  textBlock: { marginTop: 120 },
  h1: { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 30 },
  h2: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 6, opacity: 0.95 },
  p: { color: 'rgba(255,255,255,0.95)', marginTop: 14, lineHeight: 20 },

  bottomWrap: { position: 'absolute', left: 0, right: 0, bottom: 18, alignItems: 'center' },
  pagerBox: { width: Math.min(380, width - 24), height: 84, borderRadius: 14, backgroundColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 12, elevation: 10 },

  outerRing: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  outerRingActive: { transform: [{ translateY: -6 }], shadowColor: '#000', shadowOpacity: 0.22, shadowOffset: { width: 0, height: 6 }, shadowRadius: 8, elevation: 10 },
  innerDot: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#b71c1c', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#a11a1a' },
  dotLogo: { width: 28, height: 28, tintColor: '#5f0000' },
});
