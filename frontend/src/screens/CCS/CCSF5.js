// frontend/src/screens/CCS/CCSF5.js
// CCSF5 – News main image (uses slot "newsMain")

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
import { getCCSMediaUrl } from "../../lib/ccsMediaHelpers";


const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

export default function CCSF5({ navigation }) {
  const dummy = useRef(new Animated.Value(0)).current;
  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImg, setLoadingImg] = useState(true);

  useEffect(() => {
    Animated.timing(dummy, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    (async () => {
      try {
        const url = await getCcsMediaUrl("newsMain"); // 🔑 from AdminScreen
        setImageUrl(url);
      } finally {
        setLoadingImg(false);
      }
    })();
  }, [dummy]);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      <LinearGradient colors={["#fff", "#f7f7f9"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button → CCSF3 */}
      <TouchableWithoutFeedback onPress={() => navSafe("CCSF3")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT */}
      <View style={s.contentWrap}>
        <View style={m.cardWrapper}>
          {/* gradient base */}
          <LinearGradient
            colors={["#FF5F6D", "#FFC371"]}
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
              onError={() => setImageUrl(null)}
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
    backgroundColor: "#2f2f2f",
    borderRadius: 18,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: "#ff2b2b",
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
    marginTop: 100,
    width: Math.min(420, width - 40),
    height: Math.min(560, height * 0.72),
    alignItems: "center",
  },
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
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 24,
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
