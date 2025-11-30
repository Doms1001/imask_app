// frontend/src/screens/CBA/CBAF3.js
// CBAF3 — Gold / Orange version of CCSF3 (same layout, different theme)

import React, { useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomPager from "../../components/BottomPager";

const { width, height } = Dimensions.get("window");

const BACK = require("../../../assets/back.png");
const IMG_NEWS = require("../../../assets/news.png");
const IMG_EVENT = require("../../../assets/event.png");
const IMG_ANNOUNCE = require("../../../assets/announcement.png");

export default function CBAF3({ navigation }) {
  // entrance animation per card
  const enterAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // press scale
  const pressScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  // bottom glow opacity
  const glowOpac = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // shimmer for glossy stripe
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // staggered entrance like CCSF3
    const seq = enterAnims.map((a, i) =>
      Animated.timing(a, {
        toValue: 1,
        duration: 420,
        delay: i * 120,
        useNativeDriver: true,
      })
    );
    Animated.stagger(110, seq).start();

    // shimmer loop
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  function handlePress(index, target) {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pressScales[index], {
          toValue: 0.94,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpac[index], {
          toValue: 0.38,
          duration: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(pressScales[index], {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpac[index], {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => navSafe(target));
  }

  function cardAnimatedStyle(i) {
    const translateY = enterAnims[i].interpolate({
      inputRange: [0, 1],
      outputRange: [24, 0],
    });
    const baseScale = enterAnims[i].interpolate({
      inputRange: [0, 1],
      outputRange: [0.986, 1],
    });
    const combinedScale = Animated.multiply(baseScale, pressScales[i]);

    return {
      transform: [{ translateY }, { scale: combinedScale }],
    };
  }

  const MiddlePanel = () => (
    <View style={m.container}>
      <View style={m.leftColumn}>
        {/* NEWS */}
        <Animated.View style={[m.cardWrapper, cardAnimatedStyle(0)]}>
          <LinearGradient
            colors={["#FFD54F", "#FFB300"]} // gold gradients
            start={[0, 0]}
            end={[1, 1]}
            style={[m.card, m.gradientCardTop]}
          >
            <View style={m.innerShadow} />
            <Animated.View
              style={[
                m.gloss,
                {
                  opacity: 0.28,
                  transform: [{ translateX: shimmerTranslate }, { rotate: "22deg" }],
                },
              ]}
            />
            <TouchableWithoutFeedback
              onPress={() => handlePress(0, "CBAF5")}
            >
              <View style={m.centered}>
                <Image source={IMG_NEWS} style={m.bigImage} />
              </View>
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                m.cardGlow,
                { opacity: glowOpac[0], backgroundColor: "rgba(255,193,7,0.22)" },
              ]}
            />
          </LinearGradient>
        </Animated.View>

        {/* ANNOUNCEMENT */}
        <Animated.View style={[m.cardWrapper, cardAnimatedStyle(1)]}>
          <LinearGradient
            colors={["#FFCA28", "#FF8A00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={[m.card, m.gradientCardSmall]}
          >
            <View style={m.innerShadowSmall} />
            <Animated.View
              style={[
                m.glossSmall,
                {
                  opacity: 0.22,
                  transform: [{ translateX: shimmerTranslate }, { rotate: "18deg" }],
                },
              ]}
            />
            <TouchableWithoutFeedback
              onPress={() => handlePress(1, "CBAF7")}
            >
              <View style={m.centered}>
                <Image source={IMG_ANNOUNCE} style={m.smallImage} />
              </View>
            </TouchableWithoutFeedback>
            <Animated.View
              style={[
                m.cardGlow,
                { opacity: glowOpac[1], backgroundColor: "rgba(255,183,77,0.2)" },
              ]}
            />
          </LinearGradient>
        </Animated.View>
      </View>

      {/* EVENT (right side) */}
      <Animated.View style={[m.cardWrapper, cardAnimatedStyle(2)]}>
        <LinearGradient
          colors={["#FFB74D", "#FF8A00"]}
          start={[0, 0]}
          end={[1, 1]}
          style={[m.card, m.gradientCardRight]}
        >
          <View style={m.innerShadowRight} />
          <Animated.View
            style={[
              m.gloss,
              {
                opacity: 0.22,
                transform: [{ translateX: shimmerTranslate }, { rotate: "20deg" }],
              },
            ]}
          />
          <TouchableWithoutFeedback
            onPress={() => handlePress(2, "CBAF6")}
          >
            <View style={m.centered}>
              <Image source={IMG_EVENT} style={m.eventImage} />
            </View>
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              m.cardGlow,
              { opacity: glowOpac[2], backgroundColor: "rgba(255,167,38,0.2)" },
            ]}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      {/* warm gold background */}
      <LinearGradient colors={["#fffdf5", "#fff6e8"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* back to CBAF2 */}
      <TouchableWithoutFeedback onPress={() => navSafe("CBAF2")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* layout spacer (same pattern as CCSF3) */}
      <View
        style={s.contentWrap}
      />

      <MiddlePanel />

      {/* step 2 in CBA flow: CBAF2 → CBAF3 → CBAF4 */}
      <BottomPager
        navigation={navigation}
        activeIndex={1}
        targets={["CBAF2", "CBAF3", "CBAF4"]}
      />
    </SafeAreaView>
  );
}

/* screen-level styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    backgroundColor: "#B28704", // dark gold/brown
    borderRadius: 18,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: "#FFC107", // strong gold
    borderRadius: 160,
    opacity: 0.7,
  },
  back: {
    position: "absolute",
    right: 14,
    top: 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  backImg: { width: 34, height: 34, tintColor: "#fff" },
  contentWrap: {
    marginTop: 36,
    width: Math.min(420, width - 28),
    height: Math.min(560, height * 0.72),
  },
});

/* middle-panel styles */
const m = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  leftColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: 320,
    marginRight: 18,
  },
  cardWrapper: { width: 160, alignItems: "center" },
  card: {
    width: 160,
    borderRadius: 18,
    padding: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  gradientCardTop: { height: 180 },
  gradientCardSmall: {
    width: 140,
    height: 120,
    marginTop: 12,
    borderRadius: 14,
  },
  gradientCardRight: { width: 160, height: 240, borderRadius: 18 },
  innerShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "52%",
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  innerShadowSmall: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "46%",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  innerShadowRight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  gloss: {
    position: "absolute",
    left: -70,
    top: -30,
    width: 100,
    height: 240,
    backgroundColor: "rgba(255,255,255,0.26)",
    borderRadius: 80,
  },
  glossSmall: {
    position: "absolute",
    left: -50,
    top: -20,
    width: 80,
    height: 160,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 70,
  },
  cardGlow: {
    position: "absolute",
    bottom: -8,
    width: 160,
    height: 22,
    borderRadius: 12,
  },
  bigImage: { width: 120, height: 120 },
  smallImage: { width: 100, height: 70 },
  eventImage: { width: 120, height: 120 },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
