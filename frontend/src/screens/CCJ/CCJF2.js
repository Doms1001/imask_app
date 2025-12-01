// frontend/src/screens/CCJ/CCJF2.js
// CCJF2 – College of Criminal Justice programs carousel (CCS F2-style layout, CCJ dark theme)

import React, { useRef, useState, useEffect } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomPager from "../../components/BottomPager";

const { width, height } = Dimensions.get("window");
const CONTAINER_W = Math.min(420, width - 28);
const CARD_GAP = 18;
const CARD_W = CONTAINER_W;
const VISIBLE_W = CARD_W + CARD_GAP;

const LOGO = require("../../../assets/CCJlogo.png");
const BACK = require("../../../assets/back.png");

// Same pattern as CCSF2: an array of program cards
const DATA = [
  {
    title: "Bachelor of Science in Criminology",
    subtitle: "Crime Prevention & Justice",
    desc: "The BSCrim program trains students in law enforcement, criminal justice, forensic science, and correctional administration for careers in public safety.",
  },
  {
    title: "Forensic Studies (soon)",
    subtitle: "Evidence & Investigation",
    desc: "Planned specialized track focusing on crime scene processing, evidence handling, and basic forensic principles. (For future offering.)",
  },
  {
    title: "Law Enforcement Operations (soon)",
    subtitle: "Police Work Basics",
    desc: "A focused pathway on patrol operations, community policing, and law enforcement procedures. (For future offering.)",
  },
  {
    title: "Corrections & Rehabilitation (soon)",
    subtitle: "Corrections Management",
    desc: "Emphasis on jail management, rehabilitation programs, and correctional systems. (For future offering.)",
  },
  {
    title: "Security & Safety Management (soon)",
    subtitle: "Protection & Security",
    desc: "Covers private security, risk assessment, and institutional safety strategies. (For future offering.)",
  },
];

export default function CCJF2({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const parallax = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    loopRef.current = loop;
    loop.start();

    return () => {
      loopRef.current &&
        typeof loopRef.current.stop === "function" &&
        loopRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navSafe(route) {
    if (navigation && typeof navigation.navigate === "function") {
      navigation.navigate(route);
    }
  }

  function onMomentumScrollEnd(e) {
    const x = e?.nativeEvent?.contentOffset?.x || 0;
    const rawIndex = Math.round(x / VISIBLE_W);
    const clamped = Math.max(0, Math.min(rawIndex, DATA.length - 1));
    setIndex(clamped);
  }

  function handleScroll(e) {
    const x = e?.nativeEvent?.contentOffset?.x || 0;
    parallax.setValue(x);
  }

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.03],
  });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "light-content"}
      />

      {/* Background similar to CCSF2, but CCJ dark theme */}
      <LinearGradient colors={["#121212", "#1b1b1b"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back → CCJF1 (same pattern as CCSF2 back → CCSF1) */}
      <TouchableOpacity
        style={s.back}
        onPress={() => navSafe("CCJF1")}
        accessible
        accessibilityLabel="Back"
      >
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      {/* HEADER – same structure as CCSF2: logo + texts */}
      <View style={s.header}>
        <View style={s.logoWrap}>
          <Image source={LOGO} style={s.logo} resizeMode="contain" />
        </View>
        <View style={s.headerTextWrap}>
          <Text style={s.headerTitle}>College of Criminal Justice</Text>
          <Text style={s.headerSubtitle}>Programs & Tracks</Text>
        </View>
      </View>

      {/* CAROUSEL – same concept as CCSF2, with CCJ colors */}
      <View style={s.carouselWrap}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={VISIBLE_W}
          snapToAlignment="start"
          contentContainerStyle={[
            s.scrollContent,
            {
              paddingHorizontal: Math.max(
                12,
                (width - CARD_W) / 2 - CARD_GAP / 2
              ),
            },
          ]}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: parallax } } }],
            {
              useNativeDriver: false,
              listener: handleScroll,
            }
          )}
          scrollEventThrottle={16}
        >
          {DATA.map((it, i) => {
            const input = [
              (i - 1) * VISIBLE_W,
              i * VISIBLE_W,
              (i + 1) * VISIBLE_W,
            ];

            const rotate = parallax.interpolate({
              inputRange: input,
              outputRange: ["-3deg", "0deg", "3deg"],
              extrapolate: "clamp",
            });

            const scale = parallax.interpolate({
              inputRange: input,
              outputRange: [0.97, 1, 0.97],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i}
                style={[s.cardContainer, { transform: [{ rotate }, { scale }] }]}
              >
                <LinearGradient
                  colors={["#363636", "#050505"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={s.card}
                >
                  {/* big faint logo background like CCSF2 vibe */}
                  <Animated.Image
                    source={LOGO}
                    style={[
                      s.cardLogo,
                      {
                        transform: [
                          {
                            translateX: parallax.interpolate({
                              inputRange: [
                                (i - 1) * VISIBLE_W,
                                i * VISIBLE_W,
                                (i + 1) * VISIBLE_W,
                              ],
                              outputRange: [60, 0, -60],
                            }),
                          },
                          { scale: pulseScale },
                        ],
                        opacity: 0.55,
                      },
                    ]}
                    resizeMode="contain"
                  />

                  <View style={s.textBlock}>
                    <Text style={s.h1} numberOfLines={2}>
                      {it.title}
                    </Text>
                    <Text style={s.h2}>{it.subtitle}</Text>
                    <Text style={s.p}>{it.desc}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>

      {/* BottomPager – same pattern as CCSF2 but for CCJ screens */}
      <BottomPager
        navigation={navigation}
        activeIndex={0}
        targets={["CCJF2", "CCJF3", "CCJF4"]}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0b0b0b", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    transform: [{ rotate: "8deg" }],
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.02)",
    opacity: 0.5,
  },

  back: {
    position: "absolute",
    right: 14,
    top: Platform.OS === "android" ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  backImg: { width: 34, height: 34, tintColor: "#e6e6e6" },

  /* header like CCSF2 */
  header: {
    marginTop: 72,
    width: CONTAINER_W,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logo: {
    width: 48,
    height: 48,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    marginTop: 4,
    color: "#cfcfcf",
    fontSize: 13,
  },

  /* carousel area */
  carouselWrap: {
    width: CONTAINER_W,
    height: Math.min(560, height * 0.72),
  },
  scrollContent: {
    alignItems: "center",
  },
  cardContainer: { width: CARD_W, marginRight: CARD_GAP },

  card: {
    borderRadius: 20,
    padding: 22,
    minHeight: "100%",
    overflow: "hidden",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 14,
  },

  cardLogo: {
    position: "absolute",
    width: "80%",
    height: 200,
    top: 30,
    right: 0,
  },

  textBlock: { marginTop: 130, maxWidth: "90%" },
  h1: {
    color: "#f5f5f5",
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 30,
    marginBottom: 4,
  },
  h2: {
    color: "#cccccc",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
    opacity: 0.95,
  },
  p: {
    color: "rgba(220,220,220,0.94)",
    marginTop: 10,
    lineHeight: 18,
    fontWeight: "400",
    fontSize: 13,
  },
});
