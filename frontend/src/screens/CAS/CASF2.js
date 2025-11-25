// CASF2.js (Violet Theme + Parallax + Pulse) — RETHEMED
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
import BottomPager from "../../components/BottomPager"; // shared pager

const { width, height } = Dimensions.get("window");
const CONTAINER_W = Math.min(420, width - 28);
const CARD_GAP = 18;
const CARD_W = CONTAINER_W;
const VISIBLE_W = CARD_W + CARD_GAP;

const LOGO = require("../../../assets/CASlogo.png");
const BACK = require("../../../assets/back.png");

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
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const parallax = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
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
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        translucent={false}
      />

      {/* soft violet background */}
      <LinearGradient colors={["#fbf7ff", "#efe6ff"]} style={s.bg} />

      {/* decorative violet shapes */}
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />
      <View style={s.layerCenterGlow} />

      {/* back button */}
      <TouchableOpacity
        style={s.back}
        onPress={() => navigation && navigation.navigate ? navigation.navigate("CASF1") : null}
        accessible
        accessibilityLabel="Back"
      >
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      {/* carousel */}
      <View style={s.carouselWrap}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={VISIBLE_W}
          snapToAlignment="start"
          contentContainerStyle={[s.scrollContent, { paddingHorizontal: (width - CARD_W) / 2 - CARD_GAP / 2 }]}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: parallax } } }], {
            useNativeDriver: false,
            listener: handleScroll,
          })}
          scrollEventThrottle={16}
        >
          {DATA.map((it, i) => {
            const input = [(i - 1) * VISIBLE_W, i * VISIBLE_W, (i + 1) * VISIBLE_W];
            const rotate = parallax.interpolate({
              inputRange: input,
              outputRange: ["-3deg", "0deg", "3deg"],
              extrapolate: "clamp",
            });
            const scale = parallax.interpolate({
              inputRange: input,
              outputRange: [0.98, 1, 0.98],
              extrapolate: "clamp",
            });

            const logoTranslate = parallax.interpolate({
              inputRange: input,
              outputRange: [50, 0, -50],
              extrapolate: "clamp",
            });

            return (
              <Animated.View key={i} style={[s.cardContainer, { transform: [{ rotate }, { scale }] }]}>
                <LinearGradient colors={["#7b2cbf", "#5a189a"]} style={s.card}>
                  <Animated.Image
                    source={LOGO}
                    style={[
                      s.cardLogo,
                      {
                        transform: [{ translateX: logoTranslate }, { scale: pulseScale }],
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
        </ScrollView>
      </View>

      {/* bottom pager (shared component) */}
      <BottomPager navigation={navigation} activeIndex={index} targets={["CASF2", "CASF3", "CASF4"]} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  // violet decorative layers
  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#7b2cbf",
    opacity: 0.14,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#c9a6ff",
    opacity: 0.28,
  },
  layerCenterGlow: {
    position: "absolute",
    left: (width / 2) - 140,
    top: height * 0.22,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "#e9dbff",
    opacity: 0.18,
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
  backImg: { width: 34, height: 34, tintColor: "#fff", opacity: 0.98 },

  carouselWrap: { marginTop: 36, width: CONTAINER_W, height: Math.min(560, height * 0.72) },
  scrollContent: { alignItems: "center" },
  cardContainer: { width: CARD_W, marginRight: CARD_GAP },
  card: {
    borderRadius: 20,
    padding: 22,
    minHeight: "100%",
    overflow: "hidden",
    alignItems: "flex-start",
    // subtle shadow on Android/iOS
    shadowColor: "#5b2bbf",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
  },

  cardLogo: { position: "absolute", width: "80%", height: 210, opacity: 0.65, top: 45, right: 19 },

  textBlock: { marginTop: 90 },
  h1: { color: "#fff", fontSize: 3, fontWeight: "800", lineHeight: 50, marginTop: 150 },
  h2: { color: "rgba(255,255,255,0.95)", fontSize: 14, fontWeight: "700", marginTop: 6, opacity: 0.95 },
  p: { color: "rgba(255,255,255,0.95)", marginTop: 10, lineHeight: 18, fontWeight: "400" },
});
