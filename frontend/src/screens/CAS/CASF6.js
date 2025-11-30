// frontend/src/screens/CAS/CASF6.js
// CAS Events – two stacked rectangles using unified Supabase media loader.

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
  Text,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getDeptMediaUrl } from "../../lib/ccsMediaHelpers"; // ✅ unified helper

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

// ✅ NEW — define department + slot names
const DEPT = "CAS";
const SLOT_TOP = "eventsTop";
const SLOT_BOTTOM = "eventsBottom";

export default function CASF6({ navigation }) {
  const [eventsTopUri, setEventsTopUri] = useState(null);
  const [eventsBottomUri, setEventsBottomUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        // ✅ unified getter for both images
        const [top, bottom] = await Promise.all([
          getDeptMediaUrl(DEPT, SLOT_TOP),
          getDeptMediaUrl(DEPT, SLOT_BOTTOM),
        ]);

        console.log("[CASF6] eventsTop =", top);
        console.log("[CASF6] eventsBottom =", bottom);

        if (!isActive) return;
        setEventsTopUri(top);
        setEventsBottomUri(bottom);
      } catch (err) {
        console.log("[CASF6] error loading events:", err);
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  const renderCard = (uri) => (
    <View style={m.card}>
      {/* Violet fallback gradient stays EXACTLY the same */}
      <LinearGradient
        colors={["#9d4edd", "#6a2fb1"]}
        start={[0, 0]}
        end={[1, 1]}
        style={m.cardBg}
      />

      {/* Loaded Supabase image (if exists) */}
      {uri && (
        <Image
          source={{ uri }}
          style={m.cardImage}
          resizeMode="cover"
          onError={(e) =>
            console.log("[CASF6] card image error:", e.nativeEvent)
          }
        />
      )}

      {/* Loading overlay */}
      {loading && (
        <View style={m.loadingOverlay}>
          <ActivityIndicator color="#fff" />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      {/* Background graphics (unchanged) */}
      <LinearGradient colors={["#fbf7ff", "#efe6ff"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button */}
      <TouchableOpacity style={s.back} onPress={() => navSafe("CASF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.contentWrap}>
        <Text style={s.title}>CAS Events</Text>

        {renderCard(eventsTopUri)}
        <View style={{ height: 16 }} />
        {renderCard(eventsBottomUri)}
      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#7b2cbf",
    opacity: 0.16,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#c9a6ff",
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

  contentWrap: {
    marginTop: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#3c096c",
  },
});

const m = StyleSheet.create({
  card: {
    width: Math.min(360, width - 40),
    height: height * 0.22,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },
  cardBg: {
    ...StyleSheet.absoluteFillObject,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.18)",
  },
});
