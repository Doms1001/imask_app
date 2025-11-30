// frontend/src/screens/CBA/CBAF2.js
// CBAF2 — Program cards for College of Business Administration
// Uses the same layout/animation as CCSF2, but in CBA gold theme.

import React, { useRef, useEffect } from "react";
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

const LOGO = require("../../../assets/CBAlogo.png");
const BACK = require("../../../assets/back.png");

// ========================================
//   DATA CONTENT – CBA PROGRAMS
// ========================================
const DATA = [
  {
    title: "Bachelor of Science in Public Administration",
    subtitle: "Government Management",
    desc: "Develops governance, policy, and public management skills for future leaders committed to transparent and effective public service.",
  },
  {
    title:
      "Bachelor of Science in Business Administration Major in Financial Management",
    subtitle: "Financial Leadership",
    desc: "Builds strong foundations in financial analysis, investment, and corporate finance for careers in banking and business.",
  },
  {
    title:
      "Bachelor of Science in Business Administration Major in Hotel Resource Management",
    subtitle: "Hospitality Management",
    desc: "Focuses on hotel operations, customer service, and hospitality management for tourism and service industry careers.",
  },
  {
    title:
      "Bachelor of Science in Business Administration Major in Marketing Management",
    subtitle: "Market Strategy",
    desc: "Trains students in marketing research, branding, sales, and strategic promotion for competitive business environments.",
  },
  {
    title: "Bachelor of Science in Real Estate Management",
    subtitle: "Property Management",
    desc: "Prepares students in appraisal, brokerage, development, and investment to become licensed real estate professionals.",
  },
];

export default function CBAF2({ navigation }) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // Responsive scale (same logic as CCSF2)
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
    navigation.navigate("CBAF1");
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" />

      {/* --- BACKGROUND LAYERS --- */}
      <LinearGradient
        colors={["#fffdf5", "#fff6e8"]} // warm cream background
        style={StyleSheet.absoluteFill}
      />

      {/* Animated floating golden orb */}
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

      {/* Subtle dark gold/brown blurred layer */}
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
                  colors={["#FFD54F", "#FF8A00"]} // gold → orange
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
        targets={["CBAF2", "CBAF3", "CBAF4"]}
        theme="CBA" // you can handle colors inside BottomPager based on this
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
    backgroundColor: "#FFC107", // golden orb
    opacity: 0.55,
  },

  blurLayer: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: "#5D4037", // dark brown glow
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
    backgroundColor: "rgba(255,255,255,0.14)",
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
