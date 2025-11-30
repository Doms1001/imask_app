// frontend/src/screens/CCJ/CCJF5.js
// CCJF5 – News main image (uses CCJ slot "newsMain")

import React, { useRef, useEffect, useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getDeptMediaUrl } from "../../lib/ccsMediaHelpers";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

const DEPT = "CCJ";
const SLOT_KEY = "newsMain";

export default function CCJF5({ navigation }) {
  const dummy = useRef(new Animated.Value(0)).current;
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImg, setLoadingImg] = useState(true);

  useEffect(() => {
    Animated.timing(dummy, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    let isActive = true;

    (async () => {
      try {
        const url = await getDeptMediaUrl(DEPT, SLOT_KEY);
        console.log("[CCJF5] newsMain url =", url);
        if (isActive) setImageUrl(url);
      } catch (err) {
        console.log("[CCJF5] getDeptMediaUrl error:", err);
      } finally {
        if (isActive) setLoadingImg(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [dummy]);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "light-content"}
      />

      {/* CCJ dark background (same layout as CCS) */}
      <LinearGradient colors={["#111111", "#050505"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button → CCJF3 */}
      <TouchableWithoutFeedback onPress={() => navSafe("CCJF3")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT (same card as CCSF5) */}
      <View style={m.cardWrapper}>
        {/* base gradient / fallback (CCJ gray) */}
        <LinearGradient
          colors={["#3b3b3b", "#141414"]}
          start={[0, 0]}
          end={[1, 1]}
          style={m.bigCard}
        />

        {/* fetched image overlay */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={m.image}
            resizeMode="cover"
            onError={(e) => {
              console.log("[CCJF5] image onError:", e.nativeEvent);
              setImageUrl(null);
            }}
          />
        )}

        {/* loading spinner while first loading */}
        {loadingImg && (
          <View style={m.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {/* glossy shine */}
        <Animated.View style={m.gloss} pointerEvents="none" />
      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    backgroundColor: "#2f2f2f",
    borderRadius: 18,
    opacity: 0.25,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: "#444444",
    borderRadius: 160,
    opacity: 0.35,
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
  backImg: { width: 34, height: 34, tintColor: "#ffffff" },
});

const m = StyleSheet.create({
  cardWrapper: {
    width: Math.min(360, width - 56),
    height: Math.min(640, height * 0.82),
    borderRadius: 22,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -4,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 28,
    elevation: 12,
  },
  bigCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  gloss: {
    position: "absolute",
    top: -60,
    left: -40,
    width: 180,
    height: 360,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 90,
    transform: [{ rotate: "22deg" }],
  },
});
