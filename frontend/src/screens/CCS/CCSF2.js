// frontend/src/screens/CCS/CCSF2.js
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Animated,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import BottomPager from "../../components/BottomPager";

const LOGO = require("../../../assets/CCSlogo.png");
const BACK = require("../../../assets/back.png");

// ========================================
//   DATA CONTENT
// ========================================
const DATA = [
  {
    title:
      "Bachelor of Science in Computer Science with Specialization in Cybersecurity",
    subtitle: "Cyber & Security",
    desc: "Computer Science with Cybersecurity equips students to develop systems, secure networks, combat cyber threats, and create innovative security solutions.",
  },
  {
    title:
      "Bachelor of Science in Computer Science with Specialization in Data & Analytics",
    subtitle: "Data & Analytics",
    desc: "Focuses on programming, analytics, machine learning, and large-scale data processing.",
  },
  {
    title:
      "Bachelor of Science in Information Technology (Mobile & Web Development)",
    subtitle: "Mobile & Web",
    desc: "Specializes in building mobile apps, websites, front-end, and full-stack development.",
  },
  {
    title:
      "Bachelor of Science in Information Technology (Multimedia Arts & Animation)",
    subtitle: "Media & Animation",
    desc: "Covers digital art, animation production, creative design fundamentals and effects.",
  },
  {
    title:
      "Bachelor of Science in Information Technology (Network & System Administration)",
    subtitle: "Networks & Systems",
    desc: "Specializes in network architecture, security, servers, cloud and IT infrastructure.",
  },
];

export default function CCSF2({ navigation }) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // Responsive scale
  const BASE_W = 390;
  const BASE_H = 844;
  const scale = SCREEN_W / BASE_W;
  const vScale = SCREEN_H / BASE_H;
  const normalize = (s) => s * scale;
  const vNormalize = (s) => s * vScale;

  const CARD_GAP = normalize(20);
  const CARD_W = Math.min(SCREEN_W * 0.9, 420);
  const VISIBLE_W = CARD_W + CARD_GAP;

  const scrollRef = useRef(null);
  const parallax = useRef(new Animated.Value(0)).current;

  // subtle breathing pulse
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.045],
  });

  function handleScroll(e) {
    parallax.setValue(e.nativeEvent.contentOffset.x);
  }

  function navBack() {
    navigation.navigate("CCSF1");
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" />

      {/* --- BACKGROUND LAYERS --- */}
      <LinearGradient
        colors={["#ffffff", "#f4f4f7"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated floating red orb */}
      <Animated.View
        style={[
          s.floatingOrb,
          {
            top: vNormalize(-60),
            right: normalize(-40),
            transform: [{ scale: pulseScale }],
          },
        ]}
      />

      {/* Subtle black blurred layer */}
      <View
        style={[
          s.blurLayer,
          {
            left: normalize(-80),
            bottom: vNormalize(-60),
          },
        ]}
      />

      {/* --- BACK BUTTON --- */}
      <TouchableOpacity
        onPress={navBack}
        style={[s.backBtn, { top: vNormalize(10), right: normalize(12) }]}
      >
        <Image
          source={BACK}
          style={{
            width: normalize(32),
            height: normalize(32),
            tintColor: "#fff",
          }}
        />
      </TouchableOpacity>

      {/* --- CARDS WRAPPER --- */}
      <View
        style={[
          s.carouselWrap,
          { width: CARD_W, height: Math.min(SCREEN_H * 0.7, 520) },
        ]}
      >
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={VISIBLE_W}
          contentContainerStyle={{
            paddingHorizontal: (SCREEN_W - CARD_W) / 2 - CARD_GAP / 2,
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: parallax } } }],
            { listener: handleScroll, useNativeDriver: false }
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
              outputRange: ["-4deg", "0deg", "4deg"],
              extrapolate: "clamp",
            });

            const scaleCard = parallax.interpolate({
              inputRange: input,
              outputRange: [0.95, 1, 0.95],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i}
                style={[
                  s.cardContainer,
                  {
                    width: CARD_W,
                    marginRight: CARD_GAP,
                    transform: [{ rotate }, { scale: scaleCard }],
                  },
                ]}
              >
                {/* CARD BASE */}
                <LinearGradient
                  colors={["#ff4d4d", "#8b0000"]}
                  style={[
                    s.card,
                    {
                      padding: normalize(20),
                      borderRadius: normalize(22),
                    },
                  ]}
                >
                  {/* CARD SHINE OVERLAY */}
                  <View style={s.shineOverlay} />

                  {/* BACKGROUND LOGO */}
                  <Animated.Image
                    source={LOGO}
                    style={[
                      s.cardLogo,
                      {
                        height: vNormalize(210),
                        top: vNormalize(30),
                        opacity: 0.23,
                        transform: [{ scale: pulseScale }],
                      },
                    ]}
                    resizeMode="contain"
                  />

                  {/* TEXT CONTENT */}
                  <View style={{ marginTop: vNormalize(72) }}>
                    <Text
                      style={[
                        s.h1,
                        {
                          fontSize: normalize(22),
                          lineHeight: normalize(27),
                        },
                      ]}
                    >
                      {it.title}
                    </Text>

                    <Text
                      style={[
                        s.h2,
                        {
                          fontSize: normalize(14),
                          marginTop: vNormalize(6),
                        },
                      ]}
                    >
                      {it.subtitle}
                    </Text>

                    <Text
                      style={[
                        s.p,
                        {
                          fontSize: normalize(12),
                          lineHeight: normalize(18),
                          marginTop: vNormalize(10),
                        },
                      ]}
                    >
                      {it.desc}
                    </Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>

      {/* --- BOTTOM PAGER --- */}
      <BottomPager
        navigation={navigation}
        targets={["CCSF2", "CCSF3", "CCSF4"]}
        theme="CCS" // keep CCS colors
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  floatingOrb: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 200,
    backgroundColor: "#ff1b1b",
    opacity: 0.55,
  },

  blurLayer: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: "#111",
    opacity: 0.18,
  },

  backBtn: {
    position: "absolute",
    padding: 8,
    zIndex: 20,
  },

  carouselWrap: {
    marginTop: 40,
    alignItems: "center",
  },

  cardContainer: {
    overflow: "visible",
  },

  card: {
    height: "100%",
    overflow: "hidden",
    justifyContent: "flex-start",
  },

  shineOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.15)",
    transform: [{ rotate: "45deg" }],
    width: "180%",
    height: "180%",
    top: -80,
    left: -60,
  },

  cardLogo: {
    position: "absolute",
    width: "85%",
    right: 10,
  },

  h1: {
    color: "#fff",
    fontWeight: "800",
  },
  h2: {
    color: "#fff",
    opacity: 0.95,
    fontWeight: "700",
  },
  p: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: "400",
  },
});
