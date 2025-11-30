// frontend/src/screens/CAS/CASF10.js
// CASF10 – Student Essentials image (slot: "essentials")

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { getDeptMediaUrl } from "../../lib/ccsMediaHelpers";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

// ✅ unified dept + slot
const DEPT = "CAS";
const SLOT = "essentials";

export default function CASF10({ navigation }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        // ✅ use unified helper instead of getCasMediaUrl
        const url = await getDeptMediaUrl(DEPT, SLOT);
        console.log("[CASF10] essentials url =", url);
        if (isActive) setImgUrl(url);
      } catch (err) {
        console.log("[CASF10] getDeptMediaUrl error:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      <LinearGradient colors={["#fbf7ff", "#efe6ff"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* BACK BUTTON → CASF4 */}
      <TouchableWithoutFeedback onPress={() => navSafe("CASF4")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CENTER CARD */}
      <View style={s.centerWrap}>
        <View style={s.blurCard}>
          {/* gradient + blur background */}
          <LinearGradient
            colors={["#9d4edd", "#6a2fb1"]}
            start={[0, 0]}
            end={[1, 1]}
            style={StyleSheet.absoluteFill}
          />
          <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />

          {/* main image */}
          {imgUrl && (
            <Image
              source={{ uri: imgUrl }}
              style={s.image}
              resizeMode="cover"
              onError={(e) =>
                console.log("[CASF10] image error:", e.nativeEvent)
              }
            />
          )}

          {loading && (
            <View style={s.loadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  bg: { ...StyleSheet.absoluteFillObject },
  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#7b2cbf",
    opacity: 0.25,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#c9a6ff",
    opacity: 0.4,
  },

  back: {
    position: "absolute",
    right: 14,
    top: Platform.OS === "android" ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  backImg: { width: 34, height: 34, tintColor: "#fff" },

  centerWrap: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },

  blurCard: {
    width: width * 0.82,
    height: height * 0.45,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
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
    backgroundColor: "rgba(0,0,0,0.18)",
  },
});
