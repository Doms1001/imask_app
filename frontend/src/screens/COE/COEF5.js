// frontend/src/screens/COE/COE5.js
// COE5 – News main image (COE orange/black theme, slot: "coe_newsMain")

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

const DEPT = "CAS";
const SLOT_KEY = "newsMain";

export default function COE5({ navigation }) {
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
        // ⬇️ COE slot key (same helper, bagong slot)
        const url = await getDeptMediaUrl(DEPT, SLOT_KEY);
        console.log("[COE5] coe_newsMain url =", url);
        if (isActive) setImageUrl(url);
      } catch (err) {
        console.log("[COE5] failed to load coe_newsMain:", err);
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

      {/* COE orange/white/black background */}
      <LinearGradient colors={["#ffffff", "#fff4e0"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button → COE3 hub (adjust route name if needed) */}
      <TouchableWithoutFeedback onPress={() => navSafe("COE3")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT CARD */}
      <View style={m.cardWrapper}>
        {/* base gradient fallback (COE-ish orange) */}
        <LinearGradient
          colors={["#FFB74D", "#F57C00"]}
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
              console.log("[COE5] image onError:", e.nativeEvent);
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

  // COE theme blobs: black + orange
  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#212121",
    opacity: 0.4,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#FB8C00",
    opacity: 0.6,
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
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 26,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
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
