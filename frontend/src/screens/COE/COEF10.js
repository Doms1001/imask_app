// frontend/src/screens/COE/COEF10.js
// COEF10 – Student Essentials image (slot: "coe_essentials")

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

const DEPT = "CAS";
const SLOT = "essentials";

export default function COEF10({ navigation }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        // COE-specific slot key
        const url = await getDeptMediaUrl(DEPT, SLOT);
        console.log("[COEF10] coe_essentials url =", url);
        if (isActive) setImgUrl(url);
      } catch (err) {
        console.log("[COEF10] failed to load coe_essentials:", err);
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

      {/* COE background – white to soft orange */}
      <LinearGradient colors={["#ffffff", "#fff3e2"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* BACK BUTTON → COEF4 */}
      <TouchableWithoutFeedback onPress={() => navSafe("COEF4")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CENTER CARD */}
      <View style={s.centerWrap}>
        <View style={s.blurCard}>
          {/* gradient + blur background (COE orange theme) */}
          <LinearGradient
            colors={["#FF8A65", "#FFCC80"]}
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
                console.log("[COEF10] image error:", e.nativeEvent)
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

  // COE blobs: dark + orange
  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#212121",
    opacity: 0.35,
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
