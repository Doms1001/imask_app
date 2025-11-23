// CASF5.js — Violet Theme (big gradient rectangle + shimmer)
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

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

export default function CASF5({ navigation }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(-1)).current;
  const shimmerLoopRef = useRef(null);
  const entranceAnimRef = useRef(null);

  useEffect(() => {
    entranceAnimRef.current = Animated.timing(entrance, { toValue: 1, duration: 600, useNativeDriver: true });
    entranceAnimRef.current.start();

    // shimmer loop for the glossy overlay
    const shim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: -1, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmerLoopRef.current = shim;
    shim.start();

    return () => {
      entranceAnimRef.current && entranceAnimRef.current.stop && entranceAnimRef.current.stop();
      shimmerLoopRef.current && shimmerLoopRef.current.stop && shimmerLoopRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  // shimmer translate for gloss overlay
  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  const cardScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.994, 1] });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle={Platform.OS === "android" ? "light-content" : "dark-content"} />
      <LinearGradient colors={["#fbf7ff", "#efe6ff"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button → go to CASF3 */}
      <TouchableWithoutFeedback onPress={() => navSafe("CASF3")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT */}
      <View style={s.contentWrap}>
        {/* BIG GRADIENT RECTANGLE */}
        <Animated.View style={[m.cardWrapper, { transform: [{ scale: cardScale }] }]}>
          <LinearGradient colors={["#9d4edd", "#6a2fb1"]} start={[0, 0]} end={[1, 1]} style={m.bigCard} />

          {/* glossy animated shine */}
          <Animated.View
            style={[
              m.gloss,
              {
                transform: [{ rotate: "22deg" }, { translateX: shimmerTranslate }],
                opacity: shimmer.interpolate({ inputRange: [-1, 1], outputRange: [0.14, 0.26] }),
                backgroundColor: "rgba(255,255,255,0.22)",
              },
            ]}
            pointerEvents="none"
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    backgroundColor: "#7b2cbf",
    borderRadius: 18,
    opacity: 0.14,
  },

  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: "#c9a6ff",
    borderRadius: 160,
    opacity: 0.26,
  },

  back: {
    position: "absolute",
    right: 14,
    top: Platform.OS === "android" ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  backImg: { width: 34, height: 34, tintColor: "#fff" },

  contentWrap: {
    marginTop: 80,
    width: Math.min(420, width - 40),
    height: Math.min(560, height * 0.72),
    alignItems: "center",
    justifyContent: "center",
  },
});

const m = StyleSheet.create({
  cardWrapper: {
    width: Math.min(360, width - 56),
    height: Math.min(690, height * 0.88),
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -1,
    // subtle shadow for depth (purple-leaning)
    shadowColor: "#6f42c1",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 32,
    elevation: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },

  bigCard: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },

  gloss: {
    position: "absolute",
    top: -60,
    left: -40,
    width: 180,
    height: 360,
    borderRadius: 90,
    zIndex: 6,
  },
});
