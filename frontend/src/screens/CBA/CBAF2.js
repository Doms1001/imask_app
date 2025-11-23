// CBAF2.js — Yellow / Orange Gradient Theme (keeps animations & behavior)
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

const LOGO = require('../../../assets/CBAlogo.png');
const BACK = require('../../../assets/back.png');

const DATA = [
  {
    title: 'Bachelor of Science in Public Administration',
    subtitle: 'Government management',
    desc: 'The BSPA program develops governance, policy, and management skills for future leaders committed to transparent public service.',
  },
  {
    title: 'Bachelor of Science in Business Administration Major in Financial Management',
    subtitle: 'Financial leadership',
    desc: 'The BSBA-FM program develops financial analysis, investment, and corporate finance skills for careers in banking and business.',
  },
  {
    title: 'Bachelor of Science in Business Administration Major in Hotel Resource Management',
    subtitle: 'Hospitality management',
    desc: 'The BSBA-HRM program trains students in hotel operations, customer service, and hospitality management for tourism careers.',
  },
  {
    title: 'Bachelor of Science in Business Administration Major in Marketing Management',
    subtitle: 'Market strategy',
    desc: 'The BSBA-MM program develops marketing skills in research, consumer behavior, advertising, sales, and strategic brand management.',
  },
  {
    title: 'Bachelor of Science in Real Estate Management',
    subtitle: 'Property management',
    desc: 'The BSREM program trains students in development, appraisal, brokerage, and investment for real estate profession readiness.',
  },
];

export default function CBAF2({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const parallax = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const pulseLoopRef = useRef(null);

  useEffect(() => {
    // Create a looped pulse animation and keep a ref to stop on unmount
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    pulseLoopRef.current = loop;
    loop.start();

    return () => {
      pulseLoopRef.current && pulseLoopRef.current.stop && pulseLoopRef.current.stop();
    };
  }, [pulse]);

  function onMomentumScrollEnd(e) {
    const x = e.nativeEvent.contentOffset.x || 0;
    const ix = Math.round(x / VISIBLE_W);
    setIndex(Math.max(0, Math.min(ix, DATA.length - 1)));
  }

  function handleScroll(e) {
    const x = e.nativeEvent.contentOffset.x || 0;
    parallax.setValue(x);
  }

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.03] });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />

      {/* subtle warm background gradient */}
      <LinearGradient colors={['#fff9f0', '#fff6ee']} style={s.bg} />

      {/* decorative gradient shapes */}
      <LinearGradient colors={['#FFE082', '#FFB300']} start={[0,0]} end={[1,1]} style={s.layerTopRight} />
      <LinearGradient colors={['#FFD54F', '#FF8A00']} start={[0,0]} end={[1,1]} style={s.layerBottomLeft} />

      <TouchableOpacity
        style={s.back}
        onPress={() => navigation?.navigate && navigation.navigate('CBAF1')}
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
          snapToAlignment="start"
          contentContainerStyle={[s.scrollContent, { paddingHorizontal: Math.max(12, (width - CARD_W) / 2 - CARD_GAP / 2) }]}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: parallax } } }], {
            useNativeDriver: false,
            listener: handleScroll,
          })}
          scrollEventThrottle={16}
        >
          {DATA.map((it, i) => {
            const input = [(i - 1) * VISIBLE_W, i * VISIBLE_W, (i + 1) * VISIBLE_W];
            const rotate = parallax.interpolate({ inputRange: input, outputRange: ['-3deg', '0deg', '3deg'], extrapolate: 'clamp' });
            const scale = parallax.interpolate({ inputRange: input, outputRange: [0.98, 1, 0.98], extrapolate: 'clamp' });

            return (
              <Animated.View key={i} style={[s.cardContainer, { transform: [{ rotate }, { scale }] }]}>
                <LinearGradient colors={['#FFD54F', '#FF8A00']} start={[0,0]} end={[1,1]} style={s.card}>
                  <Animated.Image
                    source={LOGO}
                    style={[
                      s.cardLogo,
                      {
                        transform: [
                          {
                            translateX: parallax.interpolate({
                              inputRange: [(i - 1) * VISIBLE_W, i * VISIBLE_W, (i + 1) * VISIBLE_W],
                              outputRange: [50, 0, -50],
                            }),
                          },
                          { scale: pulseScale },
                        ],
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
      <BottomPager navigation={navigation} activeIndex={index} targets={['CBAF2', 'CBAF3', 'CBAF4']} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },

  // gradient decorative shapes (positioned)
  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, borderRadius: 18 },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, opacity: 0.9 },

  back: { position: 'absolute', right: 14, top: Platform.OS === 'android' ? 14 : 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  backImg: { width: 34, height: 34, tintColor: '#fff' },

  carouselWrap: { marginTop: 36, width: CONTAINER_W, height: Math.min(560, height * 0.72) },
  scrollContent: { alignItems: 'center' },
  cardContainer: { width: CARD_W, marginRight: CARD_GAP },
  card: {
    borderRadius: 20,
    padding: 22,
    minHeight: '100%',
    overflow: 'hidden',
    alignItems: 'flex-start',
    // subtle warm shadow
    shadowColor: '#8f5e00',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
  },

  cardLogo: { position: 'absolute', width: '80%', height: 210, opacity: 0.60, top: 45, right: 19 },

  textBlock: { marginTop: 90 },
  h1: { color: '#fff', fontSize: 30, fontWeight: '800', lineHeight: 34, marginTop: 150 },
  h2: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 6, opacity: 0.95 },
  p: { color: 'rgba(255,255,255,0.95)', marginTop: 10, lineHeight: 18, fontWeight: '400' },
});
