// COAF2 — Yellow + White Theme (Matching COAF1)

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

const LOGO = require("../../../assets/COAlogo.png");
const BACK = require("../../../assets/back.png");

const DATA = [
  {
    title:
      "Bachelor of Science in Accountancy",
    subtitle: "accounting professionals",
    desc: "The Bachelor of Science in Accountancy (BSA) program is designed to develop competent and ethical accounting professionals equipped with analytical, technical, and leadership skills.",
  },
  {
    title:
      "N/A",
    subtitle: "N/A",
    desc: "N/A",
  },
  {
    title:
      "N/A",
    subtitle: "N/A",
    desc: "N/A",
  },
  {
    title:
      "N/A",
    subtitle: "N/A",
    desc: "N/A",
  },
  {
    title:
      "N/A",
    subtitle: "N/A",
    desc: "N/A",
  },
];

export default function COAF2({ navigation }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const parallax = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const loopRef = useRef(null);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    loopRef.current = loop;
    loop.start();

    return () => {
      loopRef.current && typeof loopRef.current.stop === "function" && loopRef.current.stop();
    };
  }, []);

  function navSafe(route) {
    if (navigation && typeof navigation.navigate === "function") {
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

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.03],
  });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" />

      {/* background */}
      <LinearGradient colors={["#fffceb", "#fff8d6"]} style={s.bg} />

      {/* subtle shapes */}
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* back */}
      <TouchableOpacity
        style={s.back}
        onPress={() => navSafe("COAF1")}
        activeOpacity={0.8}
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
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: parallax } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
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

            return (
              <Animated.View
                key={i}
                style={[s.cardContainer, { transform: [{ rotate }, { scale }] }]}
              >
                <LinearGradient
                  colors={["#ffe066", "#fff1b8"]} // yellow → lighter yellow
                  style={s.card}
                >
                  <Animated.Image
                    source={LOGO}
                    style={[
                      s.cardLogo,
                      {
                        tintColor: "#ffffff",
                        transform: [
                          {
                            translateX: parallax.interpolate({
                              inputRange: input,
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

      {/* bottom pager */}
      <BottomPager
        navigation={navigation}
        activeIndex={index}
        targets={["COAF2", "COAF3", "COAF4"]}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#ffffff", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "rgba(255, 234, 140, 0.35)",
  },

  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "rgba(255, 220, 90, 0.45)",
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
  backImg: { width: 34, height: 34, tintColor: "#000" },

  carouselWrap: {
    marginTop: 36,
    width: CONTAINER_W,
    height: Math.min(560, height * 0.72),
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: (width - CARD_W) / 2 - CARD_GAP / 2,
  },
  cardContainer: { width: CARD_W, marginRight: CARD_GAP },

  card: {
    borderRadius: 20,
    padding: 22,
    minHeight: "100%",
    overflow: "hidden",
    alignItems: "flex-start",
  },

  cardLogo: {
    position: "absolute",
    width: "80%",
    height: 210,
    opacity: 0.55,
    top: 45,
    right: 19,
  },

  textBlock: { marginTop: 190 },

  h1: {
    color: "#3d3d3d",
    fontSize: 50,
    fontWeight: "800",
    lineHeight: 50,
    marginTop: 50,
  },
  h2: {
    color: "#6b6b6b",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },
  p: {
    color: "#555",
    marginTop: 10,
    lineHeight: 16,
    fontWeight: "400",
  },
});
