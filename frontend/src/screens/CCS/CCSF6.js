// frontend/src/screens/CCS/CCSF6.js
// CCSF6 – Events images (slots: "eventsTop", "eventsBottom")

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { getCCSMediaUrl } from "../../lib/ccsMediaHelpers";


const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

export default function CCSF6({ navigation }) {
  const [topUrl, setTopUrl] = useState(null);
  const [bottomUrl, setBottomUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, b] = await Promise.all([
          getCcsMediaUrl("eventsTop"),
          getCcsMediaUrl("eventsBottom"),
        ]);
        setTopUrl(t);
        setBottomUrl(b);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

      <TouchableOpacity style={s.back} onPress={() => navSafe("CCSF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.contentWrap}>
        {/* TOP event image */}
        <View style={m.card}>
          <LinearGradient
            colors={["#FF5F6D", "#FFC371"]}
            start={[0, 0]}
            end={[1, 1]}
            style={StyleSheet.absoluteFill}
          />
          <BlurView intensity={22} tint="light" style={StyleSheet.absoluteFill} />

          {topUrl && (
            <Image
              source={{ uri: topUrl }}
              style={m.image}
              resizeMode="cover"
              onError={() => setTopUrl(null)}
            />
          )}

          {loading && (
            <View style={m.loadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </View>

        {/* BOTTOM event image */}
        <View style={[m.card, { marginTop: 18 }]}>
          <LinearGradient
            colors={["#FF5F6D", "#FFC371"]}
            start={[0, 0]}
            end={[1, 1]}
            style={StyleSheet.absoluteFill}
          />
          <BlurView intensity={22} tint="light" style={StyleSheet.absoluteFill} />

          {bottomUrl && (
            <Image
              source={{ uri: bottomUrl }}
              style={m.image}
              resizeMode="cover"
              onError={() => setBottomUrl(null)}
            />
          )}

          {loading && (
            <View style={m.loadingOverlay}>
              <ActivityIndicator color="#fff" />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    backgroundColor: "#2f2f2f",
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#ff2b2b",
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
    marginTop: 110,
    width: Math.min(420, width - 40),
  },
});

const m = StyleSheet.create({
  card: {
    width: "100%",
    height: (height * 0.28),
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 24,
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
    backgroundColor: "rgba(0,0,0,0.16)",
  },
});
