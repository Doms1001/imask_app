// frontend/src/screens/CAS/CASF5.js
// CASF5 – News main image (unified helper version)

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
import { getDeptMediaUrl } from "../../lib/ccsMediaHelpers"; // ✅ unified helper

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");


// CAS slot (same as AdminScreen MEDIA_SLOTS)
const DEPT = "CAS";
const SLOT_KEY = "newsMain";

export default function CASF5({ navigation }) {
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
        console.log("[CASF5] Loaded newsMain URL =", url);
        if (isActive) setImageUrl(url);
      } catch (err) {
        console.log("[CASF5] getDeptMediaUrl error:", err);
      } finally {
        if (isActive) setLoadingImg(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  const navSafe = (route) => {
    if (navigation?.navigate) navigation.navigate(route);
  };

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      {/* CAS violet background */}
      <LinearGradient colors={["#fbf7ff", "#efe6ff"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back → CASF3 */}
      <TouchableWithoutFeedback onPress={() => navSafe("CASF3")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT */}
      <View style={m.cardWrapper}>
        {/* purple fallback background */}
        <LinearGradient
          colors={["#9d4edd", "#6a2fb1"]}
          start={[0, 0]}
          end={[1, 1]}
          style={m.bigCard}
        />

        {/* loaded Supabase image */}
        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={m.image}
            resizeMode="cover"
            onError={(e) => {
              console.log("[CASF5] Image load error:", e.nativeEvent);
              setImageUrl(null);
            }}
          />
        )}

        {/* loading state */}
        {loadingImg && (
          <View style={m.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        )}

        {/* gloss effect */}
        <Animated.View style={m.gloss} pointerEvents="none" />
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
    opacity: 0.16,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: "#c9a6ff",
    borderRadius: 160,
    opacity: 0.28,
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
  backImg: { width: 34, height: 34, tintColor: "#fff" },
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
    shadowColor: "#6f42c1",
    shadowOpacity: 0.16,
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
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  gloss: {
    position: "absolute",
    top: -60,
    left: -40,
    width: 180,
    height: 360,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 90,
    transform: [{ rotate: "22deg" }],
  },
});
