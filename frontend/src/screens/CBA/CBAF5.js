// frontend/src/screens/CBA/CBAF5.js
// CBAF5 – News main image (CBA gold theme, slot: "cba_newsMain")

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
import { getCcsMediaUrl } from "../../lib/ccsMediaHelpers";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

export default function CBAF5({ navigation }) {
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
        const url = await getCcsMediaUrl("cba_newsMain");
        console.log("[CBAF5] cba_newsMain url =", url);
        if (isActive) setImageUrl(url);
      } catch (err) {
        console.log("[CBAF5] failed to load cba_newsMain:", err);
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
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      {/* CBA warm background */}
      <LinearGradient colors={["#fff9f0", "#fff6ee"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button → CBAF3 */}
      <TouchableWithoutFeedback onPress={() => navSafe("CBAF3")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT CARD */}
      <View style={m.cardWrapper}>
        {/* base gradient fallback */}
        <LinearGradient
          colors={["#FFD54F", "#FF8A00"]}
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
              console.log("[CBAF5] image onError:", e.nativeEvent);
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
  screen: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#FFE082",
    opacity: 0.35,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#FFB300",
    opacity: 0.5,
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
    marginTop: 80,
    shadowColor: "#8f5e00",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 26,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
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
