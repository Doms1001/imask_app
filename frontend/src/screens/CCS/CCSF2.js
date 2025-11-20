// frontend/src/screens/CCS/CCSF2.js
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

export default function CCSF2({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const parallax = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

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
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />

      <LinearGradient colors={['#fff', '#f7f7f9']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navigation?.navigate && navigation.navigate('CCSF1')}>
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
                <LinearGradient colors={['#ff6161', '#8b0000']} style={s.card}>
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

      {/* BottomPager: left circle rises on this screen */}
      <BottomPager navigation={navigation} activeIndex={0} targets={['CCSF2', 'CCSF3', 'CCSF4']} />
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
});
