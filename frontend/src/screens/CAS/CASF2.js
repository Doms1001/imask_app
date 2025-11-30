// frontend/src/screens/CAS/CASF2.js
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

const LOGO = require("../../../assets/CASlogo.png");
const BACK = require("../../../assets/back.png");

// ========================================
//   DATA CONTENT (CAS PROGRAMS)
// ========================================
const DATA = [
  {
    title: "Bachelor of Arts in Psychology",
    subtitle: "Human behavior",
    desc: "The BA Psychology program strengthens understanding of behavior and provides research, counseling, and assessment skills for many careers.",
  },
  {
    title: "Bachelor of Science in Social Work",
    subtitle: "Community service",
    desc: "The BSSW program builds skills in case management, welfare policies, and community development for meaningful social work careers.",
  },
  {
    title:
      "Bachelor of Technical-Vocational Teacher Education Major in Electronics Management",
    subtitle: "Technical instruction",
    desc: "The BTVTEd-EM program builds technical electronics skills and teaching abilities for future educators and trainers.",
  },
  {
    title:
      "Bachelor of Technical-Vocational Teacher Education Major in Food and Service Management",
    subtitle: "Culinary management",
    desc: "The BTTE-FSM program builds culinary, food service, and teaching skills for future educators and industry professionals.",
  },
  {
    title: "N/A",
    subtitle: "N/A",
    desc: "N/A",
  },
];

export default function CASF2({ navigation }) {
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // Responsive scale (same as CCSF2)
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
  const [index, setIndex] = useState(0);

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

  function onMomentumScrollEnd(e) {
    const x = e.nativeEvent.contentOffset.x || 0;
    const ix = Math.round(x / VISIBLE_W);
    setIndex(Math.max(0, Math.min(ix, DATA.length - 1)));
  }

  function navBack() {
    navigation.navigate("CASF1");
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" />

      {/* --- BACKGROUND LAYERS (VIOLET THEME) --- */}
      <LinearGradient
        colors={["#fbf7ff", "#efe6ff"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated floating violet orb */}
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

      {/* Subtle dark violet blurred layer */}
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
            tintColor: "#ffffff",
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
          onMomentumScrollEnd={onMomentumScrollEnd}
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

            const logoTranslate = parallax.interpolate({
              inputRange: input,
              outputRange: [50, 0, -50],
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
                {/* CARD BASE (VIOLET GRADIENT) */}
                <LinearGradient
                  colors={["#7b2cbf", "#5a189a"]}
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

                  {/* BACKGROUND LOGO (CAS) */}
                  <Animated.Image
                    source={LOGO}
                    style={[
                      s.cardLogo,
                      {
                        height: vNormalize(210),
                        top: vNormalize(30),
                        opacity: 0.23,
                        transform: [
                          { translateX: logoTranslate },
                          { scale: pulseScale },
                        ],
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
                          fontSize: normalize(20),
                          lineHeight: normalize(26),
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
        targets={["CASF2", "CASF3", "CASF4"]}
        theme="CAS" // CAS violet theme
        activeIndex={index}
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
    backgroundColor: "#b185ff",
    opacity: 0.55,
  },

  blurLayer: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 200,
    backgroundColor: "#4c1d95",
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
