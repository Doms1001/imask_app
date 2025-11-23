// frontend/src/screens/CCS/COAF4.js
// COAF4 — Yellow + White theme (keeps original animations & interactions)

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

const { width } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");
const IMG_TUITION = require("../../../assets/tuition.png");
const IMG_UNIFORM = require("../../../assets/uniform.png");
const IMG_FAQ = require("../../../assets/faq.png");

export default function COAF4({ navigation }) {
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

  useEffect(() => {
    const seq = enterAnims.map((a, i) =>
      Animated.timing(a, { toValue: 1, duration: 420, delay: i * 120, useNativeDriver: true })
    );
    Animated.stagger(110, seq).start();
    Animated.loop(Animated.timing(shimmer, { toValue: 1, duration: 1800, useNativeDriver: true })).start();
  }, []);

  function makeResponder(i) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () =>
        Animated.spring(pressScales[i], { toValue: 0.95, friction: 7, tension: 200, useNativeDriver: true }).start(),
      onPanResponderMove: (evt, gs) => {
        const rx = Math.max(-18, Math.min(18, -gs.dx / 8));
        const ry = Math.max(-12, Math.min(12, gs.dy / 10));
        tilt[i].setValue({ x: rx, y: ry });
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(tilt[i].x, { toValue: 0, useNativeDriver: false }),
          Animated.spring(tilt[i].y, { toValue: 0, useNativeDriver: false }),
          Animated.spring(pressScales[i], { toValue: 1, useNativeDriver: true }),
        ]).start();
      },
    });
  }

  const responders = [makeResponder(0), makeResponder(1), makeResponder(2)];
  const shimmerTranslate = shimmer.interpolate({ inputRange: [-1, 1], outputRange: [-width * 0.6, width * 0.8] });

  function cardAnimatedStyle(i) {
    const translateY = enterAnims[i].interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
    const baseScale = enterAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.986, 1] });
    const combinedScale = Animated.multiply(baseScale, pressScales[i]);
    const rotateY = tilt[i].x.interpolate({ inputRange: [-30, 30], outputRange: ["-12deg", "12deg"] });
    const rotateX = tilt[i].y.interpolate({ inputRange: [-20, 20], outputRange: ["12deg", "-12deg"] });
    return { transform: [{ translateY }, { scale: combinedScale }, { rotateX }, { rotateY }] };
  }

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  function handlePress(i, target) {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(pressScales[i], { toValue: 0.92, duration: 90, useNativeDriver: true }),
        Animated.timing(glowOpac[i], { toValue: 0.38, duration: 90, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(pressScales[i], { toValue: 1, useNativeDriver: true }),
        Animated.timing(glowOpac[i], { toValue: 0, duration: 260, useNativeDriver: true }),
      ]),
    ]).start(() => navSafe(target));
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={["#fffaf0", "#fff7e6"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableWithoutFeedback onPress={() => navSafe("COAF3")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <View style={m.container}>
        <View style={m.leftColumn}>
          <Animated.View {...responders[0].panHandlers} style={[m.cardWrapper, cardAnimatedStyle(0)]}>
            <Animated.View style={[m.card, m.cardLarge]}>
              <LinearGradient colors={["#ffe066", "#fff1b8"]} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
              <View style={m.innerShadow} />
              <Animated.View style={[m.gloss, { opacity: 0.28, transform: [{ translateX: shimmerTranslate }, { rotate: "22deg" }] }]} />
              <TouchableWithoutFeedback onPress={() => handlePress(0, "CBAF8")}>
                <View style={m.centered}>
                  <Image source={IMG_TUITION} style={m.bigImage} resizeMode="contain" />
                </View>
              </TouchableWithoutFeedback>
              <Animated.View style={[m.cardGlow, { opacity: glowOpac[0] }]} />
            </Animated.View>
          </Animated.View>

          <Animated.View {...responders[1].panHandlers} style={[m.cardWrapper, cardAnimatedStyle(1)]}>
            <Animated.View style={[m.card, m.cardSmall]}>
              <LinearGradient colors={["#fff1b8", "#ffe066"]} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
              <View style={m.innerShadowSmall} />
              <Animated.View style={[m.glossSmall, { opacity: 0.24, transform: [{ translateX: shimmerTranslate }, { rotate: "18deg" }] }]} />
              <TouchableWithoutFeedback onPress={() => handlePress(1, "CBAF10")}>
                <View style={m.centered}>
                  <Image source={IMG_UNIFORM} style={m.smallImage} resizeMode="contain" />
                </View>
              </TouchableWithoutFeedback>
              <Animated.View style={[m.cardGlow, { opacity: glowOpac[1] }]} />
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View {...responders[2].panHandlers} style={[m.cardWrapper, cardAnimatedStyle(2)]}>
          <Animated.View style={[m.card, m.cardRight]}>
            <LinearGradient colors={["#ffd60a", "#fff4a3"]} start={[0, 0]} end={[1, 1]} style={StyleSheet.absoluteFill} />
            <View style={m.innerShadowRight} />
            <Animated.View style={[m.gloss, { opacity: 0.22, transform: [{ translateX: shimmerTranslate }, { rotate: "20deg" }] }]} />
            <TouchableWithoutFeedback onPress={() => handlePress(2, "CBAF9")}>
              <View style={m.centered}>
                <Image source={IMG_FAQ} style={m.eventImage} resizeMode="contain" />
              </View>
            </TouchableWithoutFeedback>
            <Animated.View style={[m.cardGlow, { opacity: glowOpac[2] }]} />
          </Animated.View>
        </Animated.View>
      </View>

      <BottomPager navigation={navigation} activeIndex={2} targets={['COAF2', 'COAF3', 'COAF4']} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fffaf0", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },
  layerTopRight: { position: "absolute", right: -40, top: -20, width: 220, height: 220, borderRadius: 18, backgroundColor: "rgba(255, 235, 120, 0.6)" },
  layerBottomLeft: { position: "absolute", left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, backgroundColor: "rgba(255, 220, 60, 0.7)" },
  back: { position: "absolute", right: 14, top: 50, width: 50, height: 48, alignItems: "center", justifyContent: "center" },
  backImg: { width: 34, height: 34, tintColor: "#111" },
});

const m = StyleSheet.create({
  container: { position: "absolute", top: 0, bottom: 0, left: 8, right: 8, flexDirection: "row", justifyContent: "center", alignItems: "center" },
  leftColumn: { flexDirection: "column", justifyContent: "space-between", height: 320, marginRight: 18 },
  cardWrapper: { width: 160, alignItems: "center" },
  card: {
    width: 160,
    borderRadius: 18,
    padding: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  cardLarge: { height: 180 },
  cardSmall: { width: 140, height: 120, marginTop: 12, borderRadius: 14 },
  cardRight: { width: 160, height: 240, borderRadius: 18 },
  innerShadow: { position: "absolute", top: 0, left: 0, right: 0, height: "52%", backgroundColor: "rgba(0,0,0,0.04)" },
  innerShadowSmall: { position: "absolute", top: 0, left: 0, right: 0, height: "46%", backgroundColor: "rgba(0,0,0,0.03)" },
  innerShadowRight: { position: "absolute", top: 0, left: 0, right: 0, height: "48%", backgroundColor: "rgba(0,0,0,0.03)" },
  gloss: { position: "absolute", left: -70, top: -30, width: 100, height: 240, backgroundColor: "rgba(255,255,255,0.28)", borderRadius: 80 },
  glossSmall: { position: "absolute", left: -50, top: -20, width: 80, height: 160, backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 70 },
  cardGlow: { position: "absolute", bottom: -8, width: 160, height: 22, borderRadius: 12, backgroundColor: "rgba(255,210,40,0.25)" },
  centered: { alignItems: "center", justifyContent: "center", width: "100%", height: "100%" },
  bigImage: { width: 120, height: 120 },
  smallImage: { width: 100, height: 70 },
  eventImage: { width: 120, height: 120 },
});
