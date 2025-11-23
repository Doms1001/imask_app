// CCJF2.js — College of Criminal Justice carousel (Gray & Black theme)

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
import BottomPager from '../../components/BottomPager'; // shared pager

const { width, height } = Dimensions.get('window');
const CONTAINER_W = Math.min(420, width - 28);
const CARD_GAP = 18;
const CARD_W = CONTAINER_W;
const VISIBLE_W = CARD_W + CARD_GAP;

const LOGO = require('../../../assets/CCJlogo.png');
const BACK = require('../../../assets/back.png');

const DATA = [
  {
    title: 'Bachelor of Science in Criminology',
    subtitle: 'Crime prevention',
    desc: 'The BSCrim program trains students in law enforcement, forensic science, criminal justice, and correctional management for safety careers.',
  },
  {
    title: 'N/A ',
    subtitle: 'N/A',
    desc: 'N/A',
  },
  {
    title: 'N/A',
    subtitle: 'N/A',
    desc: 'N/A',
  },
  {
    title: 'N/A',
    subtitle: 'N/A',
    desc: 'N/A',
  },
  {
    title: 'N/A',
    subtitle: 'N/A',
    desc: 'N/A',
  },
];

export default function CCJF2({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const parallax = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    // pulse loop (store ref so we can stop on unmount)
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    loopRef.current = loop;
    loop.start();

    return () => {
      loopRef.current && typeof loopRef.current.stop === 'function' && loopRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navSafe(route) {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate(route);
    }
  }

  function onMomentumScrollEnd(e) {
    const x = e.nativeEvent.contentOffset.x;
    const ix = Math.round(x / VISIBLE_W);
    setIndex(ix);
  }

  function handleScroll(e) {
    const x = e.nativeEvent.contentOffset.x;
    parallax.setValue(x);
  }

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.03] });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'light-content'} />

      {/* subtle page background gradient */}
      <LinearGradient colors={['#121212', '#1e1e1e']} style={s.bg} />

      {/* decorative shapes */}
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity
        style={s.back}
        onPress={() => navSafe('CCJF1')}
        accessible
        accessibilityLabel="Back"
      >
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

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
            const input = [(i - 1) * VISIBLE_W, i * VISIBLE_W, (i + 1) * VISIBLE_W];
            const rotate = parallax.interpolate({ inputRange: input, outputRange: ['-3deg', '0deg', '3deg'], extrapolate: 'clamp' });
            const scale = parallax.interpolate({ inputRange: input, outputRange: [0.98, 1, 0.98], extrapolate: 'clamp' });

            return (
              <Animated.View key={i} style={[s.cardContainer, { transform: [{ rotate }, { scale }] }]}>
                <LinearGradient colors={['#4a4a4a', '#0b0b0b']} style={s.card}>
                  <Animated.Image
                    source={LOGO}
                    style={[
                      s.cardLogo,
                      {
                        transform: [
                          {
                            translateX: parallax.interpolate({
                              inputRange: [(i - 1) * VISIBLE_W, i * VISIBLE_W, (i + 1) * VISIBLE_W],
                              outputRange: [60, 0, -60],
                            }),
                          },
                          { scale: pulseScale },
                        ],
                        opacity: 0.65,
                      },
                    ]}
                    resizeMode="contain"
                  />

                  <View style={s.textBlock}>
                    <Text style={s.h1} numberOfLines={2}>{it.title}</Text>
                    <Text style={s.h2}>{it.subtitle}</Text>
                    <Text style={s.p}>{it.desc}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>

      {/* BottomPager: left circle rises on this screen */}
      <BottomPager navigation={navigation} activeIndex={index} targets={['CCJF2', 'CCJF3', 'CCJF4']} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b0b', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },
  layerTopRight: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ rotate: '8deg' }],
  },
  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.02)',
    opacity: 0.6,
  },

  back: { position: 'absolute', right: 14, top: Platform.OS === 'android' ? 14 : 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  backImg: { width: 34, height: 34, tintColor: '#e6e6e6' },

  carouselWrap: { marginTop: 36, width: CONTAINER_W, height: Math.min(560, height * 0.72) },
  scrollContent: { alignItems: 'center', paddingHorizontal: Math.max(12, (width - CARD_W) / 2 - CARD_GAP / 2) },
  cardContainer: { width: CARD_W, marginRight: CARD_GAP },

  card: {
    borderRadius: 20,
    padding: 22,
    minHeight: '100%',
    overflow: 'hidden',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    // subtle inner shadow feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 14,
  },

  cardLogo: { position: 'absolute', width: '78%', height: 200, top: 34, right: 12 },

  textBlock: { marginTop: 110 },
  h1: { color: '#f5f5f5', fontSize: 35, fontWeight: '800', lineHeight: 35, marginTop: 90},
  h2: { color: '#d0d0d0', fontSize: 13, fontWeight: '700', marginTop: 8, opacity: 0.95 },
  p: { color: 'rgba(210,210,210,0.92)', marginTop: 10, lineHeight: 18, fontWeight: '400' },
});
