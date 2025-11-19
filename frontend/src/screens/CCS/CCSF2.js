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
    title: 'Bachelor of Science in Computer Science with Specialization in Cybersecurity',
    subtitle: 'Cyber & Security',
    desc: 'Computer Science with Cybersecurity equips students to develop systems, secure networks, combat cyber threats, and create innovative security solutions for modern technology challenges.',
  },
  {
    title: 'Bachelor of Science in Computer Science with Specialization in Data & Analytics',
    subtitle: 'Data & Analytics',
    desc: 'Computer Science program specializing in Data Science, focusing on programming, analytics, AI, and machine learning.',
  },
  {
    title: 'Bachelor of Science in Information Technology with Specialization in Mobile and Web Development',
    subtitle: 'Mobile & Web',
    desc: 'IT program specializing in mobile and web development, focusing on apps, websites, and modern technologies.',
  },
  {
    title: 'Bachelor of Science in Information Technology with Specialization in Multimedia Arts and Animation',
    subtitle: 'Media & Animation',
    desc: 'IT program specializing in Multimedia Arts and Animation, teaching digital design, animation, and creative media production.',
  },
  {
    title: 'Bachelor of Science in Information Technology with Specialization in Network and System Administration',
    subtitle: 'Networks & Systems',
    desc: 'IT program specializing in Network and System Administration, managing and securing computer systems.',
  },
];

export default function CCSF2Artistic({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  // activeDot controls which bottom circle is visually active (only changes on tap)
  const [activeDot, setActiveDot] = useState(0);
  const parallax = useRef(new Animated.Value(0)).current; // for logo parallax
  const pulse = useRef(new Animated.Value(0)).current; // for subtle breathing on cards

  // Animated values for the three dots (0 = inactive, 1 = active)
  const dotAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    // breathing animation for card logo pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();

    // initialize first dot active
    Animated.timing(dotAnims[activeDot], { toValue: 1, duration: 350, useNativeDriver: true }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // whenever activeDot changes, animate all dotAnims accordingly
    const anims = dotAnims.map((val, i) =>
      Animated.timing(val, {
        toValue: i === activeDot ? 1 : 0,
        duration: i === activeDot ? 350 : 240,
        useNativeDriver: true,
      })
    );
    Animated.parallel(anims).start();
  }, [activeDot, dotAnims]);

  function onMomentumScrollEnd(e) {
    const x = e.nativeEvent.contentOffset.x;
    const ix = Math.round(x / VISIBLE_W);
    setIndex(ix);
    // activeDot remains controlled by taps (so scrolling won't change which dot is visually active)
  }

  function go(i) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ x: i * VISIBLE_W, animated: true });
    // we do NOT change activeDot here automatically to keep circles independent,
    // but we still allow code to programmatically scroll using go(i).
  }

  function handleScroll(e) {
    // map scroll position to parallax offset
    const x = e.nativeEvent.contentOffset.x;
    parallax.setValue(x);
  }

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.03] });

  // NOTE: updated — handleDotTap no longer scrolls the carousel.
  // It only updates the visual active dot (decoupled behavior).
  function handleDotTap(i) {
    // only set visual active state — DO NOT scroll the cards
    setActiveDot(i);
    // (Optional) you could trigger a quick tap animation here if you'd like.
  }

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
                <LinearGradient colors={['#ff6161', '#8b0000']} style={s.card}>
                  {/* parallax logo (moves slightly opposite of scroll) */}
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

      {/* fixed bottom controls (3 interactive circles — independent but clickable) */}
      <View style={s.bottomWrap} pointerEvents="box-none">
        <View style={s.pagerBox}>
          {[0, 1, 2].map((i) => {
            // animated style based on dotAnims[i] (0 -> idle, 1 -> active)
            const translateY = dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
            const scale = dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
            const glowOpacity = dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0, 0.42] });
            const shadowOpacity = dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0, 0.22] });

            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleDotTap(i)}
                activeOpacity={0.9}
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <Animated.View
                  style={[
                    s.outerRing,
                    {
                      transform: [{ translateY }, { scale }],
                      shadowOpacity, // on iOS shadowOpacity will use this
                    },
                  ]}
                >
                  {/* glow / halo behind the inner dot */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      s.dotGlow,
                      {
                        opacity: glowOpacity,
                        transform: [{ scale: dotAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.25] }) }],
                      },
                    ]}
                  />
                  <View style={s.innerDot}>
                    <Image source={LOGO} style={s.dotLogo} />
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },
  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, borderRadius: 18, backgroundColor: '#2f2f2f' },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, backgroundColor: '#ff2b2b', opacity: 0.70 },

  back: { position: 'absolute', right: 14, top: 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  backImg: { width: 34, height: 34, tintColor: '#fff' },

  carouselWrap: { marginTop: 36, width: CONTAINER_W, height: Math.min(560, height * 0.72) },
  scrollContent: { alignItems: 'center', paddingHorizontal: (width - CARD_W) / 2 - CARD_GAP / 2 },
  cardContainer: { width: CARD_W, marginRight: CARD_GAP },
  card: { borderRadius: 20, padding: 22, minHeight: '100%', overflow: 'hidden', alignItems: 'flex-start' },

  cardLogo: { position: 'absolute', width: '80%', height: 210, opacity: 0.60, top: 45, right: 19 },

  textBlock: { marginTop: 90 },
  h1: { color: '#fff', fontSize: 40, fontWeight: '800', lineHeight: 38, marginTop: 50 },
  h2: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: 6, opacity: 0.95 },
  p: { color: 'rgba(255,255,255,0.95)', marginTop: 10, lineHeight: 15, fontWeight: '400' },

  bottomWrap: { position: 'absolute', left: 0, right: 0, bottom: 18, alignItems: 'center' },
  pagerBox: { width: Math.min(380, width - 24), height: 84, borderRadius: 14, backgroundColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 12, elevation: 10 },

  outerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    // base shadow, will be enhanced via animated shadowOpacity on active
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
  },
  // kept for backward compatibility if you want the static transform style
  outerRingActive: { transform: [{ translateY: -6 }], shadowColor: '#000', shadowOpacity: 0.22, shadowOffset: { width: 0, height: 6 }, shadowRadius: 8, elevation: 10 },

  // glow behind dot (animated opacity + scale)
  dotGlow: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(183,28,28,0.14)',
    zIndex: -1,
  },

  innerDot: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#b71c1c', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#a11a1a' },
  dotLogo: { width: 28, height: 28, tintColor: '#5f0000' },
});
