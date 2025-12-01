// frontend/src/screens/CCJ/CCJF3.js
// CCJF3 — News / Event / Announcement panel (CCS F3-style layout, CCJ dark theme)

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
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomPager from "../../components/BottomPager";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

const IMG_NEWS = require("../../../assets/news.png");
const IMG_EVENT = require("../../../assets/event.png");
const IMG_ANNOUNCE = require("../../../assets/announcement.png");

export default function CCJF3({ navigation }) {
  const dummy = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.timing(dummy, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop && a.stop();
  }, [dummy]);

  // entry animations per card (same pattern as CCSF3)
  const enterAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const pressScales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const glowOpac = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  const tilt = [
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
  ];

  const shimmer = useRef(new Animated.Value(-1)).current;

  const seqRef = useRef(null);
  const shimmerRef = useRef(null);

  useEffect(() => {
    // staggered enter animations
    const seqAnims = enterAnims.map((a, i) =>
      Animated.timing(a, {
        toValue: 1,
        duration: 420,
        delay: i * 120,
        useNativeDriver: true,
      })
    );
    seqRef.current = Animated.stagger(110, seqAnims);
    seqRef.current.start();

    // shimmer loop: -1 → 1 → reset → repeat
    shimmerRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: -1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerRef.current.start();

    return () => {
      seqRef.current && seqRef.current.stop && seqRef.current.stop();
      shimmerRef.current && shimmerRef.current.stop && shimmerRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function makeResponder(i) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(pressScales[i], {
          toValue: 0.96,
          friction: 7,
          tension: 200,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (evt, gs) => {
        const rx = Math.max(-18, Math.min(18, -gs.dx / 8));
        const ry = Math.max(-12, Math.min(12, gs.dy / 10));
        tilt[i].setValue({ x: rx, y: ry });
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          // 🔽 FIXED: now also native-driven
          Animated.spring(tilt[i].x, { toValue: 0, useNativeDriver: true }),
          Animated.spring(tilt[i].y, { toValue: 0, useNativeDriver: true }),
          Animated.spring(pressScales[i], { toValue: 1, useNativeDriver: true }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          // 🔽 FIXED: now also native-driven
          Animated.spring(tilt[i].x, { toValue: 0, useNativeDriver: true }),
          Animated.spring(tilt[i].y, { toValue: 0, useNativeDriver: true }),
          Animated.spring(pressScales[i], { toValue: 1, useNativeDriver: true }),
        ]).start();
      },
    });
  }

  const responders = [makeResponder(0), makeResponder(1), makeResponder(2)];

  function navSafe(route) {
    if (navigation && typeof navigation.navigate === "function") {
      navigation.navigate(route);
    }
  }

  function handlePress(index, target) {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pressScales[index], {
          toValue: 0.92,
          duration: 90,
          useNativeDriver: true,
        }),
        Animated.timing(glowOpac[index], {
          toValue: 0.28,
          duration: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(pressScales[index], { toValue: 1, useNativeDriver: true }),
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

    const rotateY = tilt[i].x.interpolate({
      inputRange: [-30, 30],
      outputRange: ["-12deg", "12deg"],
    });
    const rotateX = tilt[i].y.interpolate({
      inputRange: [-20, 20],
      outputRange: ["12deg", "-12deg"],
    });

    return {
      transform: [{ translateY }, { scale: combinedScale }, { rotateX }, { rotateY }],
    };
  }

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  const MiddlePanel = () => (
    <View style={m.container}>
      <View style={m.leftColumn}>
        {/* NEWS (→ CCJF5) */}
        <Animated.View
          {...responders[0].panHandlers}
          style={[m.cardWrapper, cardAnimatedStyle(0)]}
        >
          <Animated.View style={[m.card, m.gradientCardTop]}>
            <LinearGradient
              colors={["#3b3b3b", "#0b0b0b"]}
              start={[0, 0]}
              end={[1, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={m.innerShadow} />
            <Animated.View
              style={[
                m.gloss,
                {
                  opacity: 0.18,
                  transform: [{ translateX: shimmerTranslate }, { rotate: "22deg" }],
                },
              ]}
            />
            <TouchableWithoutFeedback onPress={() => handlePress(0, "CCJF5")}>
              <View style={m.centered}>
                <Image source={IMG_NEWS} style={m.bigImage} />
              </View>
            </TouchableWithoutFeedback>
            <Animated.View style={[m.cardGlow, { opacity: glowOpac[0] }]} />
          </Animated.View>
        </Animated.View>

        {/* ANNOUNCEMENT (→ CCJF7) */}
        <Animated.View
          {...responders[1].panHandlers}
          style={[m.cardWrapper, cardAnimatedStyle(1)]}
        >
          <Animated.View style={[m.card, m.gradientCardSmall]}>
            <LinearGradient
              colors={["#4a4a4a", "#111111"]}
              start={[0, 0]}
              end={[1, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={m.innerShadowSmall} />
            <Animated.View
              style={[
                m.glossSmall,
                {
                  opacity: 0.14,
                  transform: [{ translateX: shimmerTranslate }, { rotate: "18deg" }],
                },
              ]}
            />
            <TouchableWithoutFeedback onPress={() => handlePress(1, "CCJF7")}>
              <View style={m.centered}>
                <Image source={IMG_ANNOUNCE} style={m.smallImage} />
              </View>
            </TouchableWithoutFeedback>
            <Animated.View style={[m.cardGlow, { opacity: glowOpac[1] }]} />
          </Animated.View>
        </Animated.View>
      </View>

      {/* EVENT (→ CCJF6) */}
      <Animated.View
        {...responders[2].panHandlers}
        style={[m.cardWrapper, cardAnimatedStyle(2)]}
      >
        <Animated.View style={[m.card, m.gradientCardRight]}>
          <LinearGradient
            colors={["#2e2e2e", "#0a0a0a"]}
            start={[0, 0]}
            end={[1, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={m.innerShadowRight} />
          <Animated.View
            style={[
              m.gloss,
              {
                opacity: 0.14,
                transform: [{ translateX: shimmerTranslate }, { rotate: "20deg" }],
              },
            ]}
          />
          <TouchableWithoutFeedback onPress={() => handlePress(2, "CCJF6")}>
            <View style={m.centered}>
              <Image source={IMG_EVENT} style={m.eventImage} />
            </View>
          </TouchableWithoutFeedback>
          <Animated.View style={[m.cardGlow, { opacity: glowOpac[2] }]} />
        </Animated.View>
      </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0b0b0b", "#1f1f1f"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back → CCJF2 (like CCSF3 back → CCSF2) */}
      <TouchableWithoutFeedback onPress={() => navSafe("CCJF2")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* main content area, same structure idea as CCSF3 */}
      <View style={s.contentWrap}>
        <MiddlePanel />
      </View>

      <BottomPager
        navigation={navigation}
        activeIndex={1}
        targets={["CCJF2", "CCJF3", "CCJF4"]}
      />
    </SafeAreaView>
  );
}

/* styles */
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
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "rgba(255,255,255,0.02)",
    opacity: 0.7,
  },
  back: {
    position: "absolute",
    right: 14,
    top: Platform.OS === "android" ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  backImg: { width: 34, height: 34, tintColor: "#e6e6e6" },

  contentWrap: {
    marginTop: 80,
    marginBottom: 40,
    width: Math.min(420, width - 28),
    height: Math.min(560, height * 0.72),
    alignItems: "center",
    justifyContent: "center",
  },
});

const m = StyleSheet.create({
  container: {
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
    backgroundColor: "#111",
    shadowColor: "#000",
    shadowOpacity: 0.36,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
    elevation: 12,
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
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  innerShadowSmall: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "46%",
    backgroundColor: "rgba(0,0,0,0.14)",
  },
  innerShadowRight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  gloss: {
    position: "absolute",
    left: -70,
    top: -30,
    width: 100,
    height: 240,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 80,
  },
  glossSmall: {
    position: "absolute",
    left: -50,
    top: -20,
    width: 80,
    height: 160,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 70,
  },

  cardGlow: {
    position: "absolute",
    bottom: -8,
    width: 160,
    height: 22,
    borderRadius: 12,
    backgroundColor: "rgba(220,220,220,0.06)",
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
