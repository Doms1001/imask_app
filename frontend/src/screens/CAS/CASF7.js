// frontend/src/screens/CAS/CASF7.js
// CASF7 – Announcements (slots: "ann1", "ann2", "ann3")

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
import { BlurView } from "expo-blur";
import { getDeptMediaUrl } from "../../lib/ccsMediaHelpers"; // ✅ unified helper

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

// ✅ NEW — define department + announcement slot names
const DEPT = "CAS";
const SLOT1 = "ann1";
const SLOT2 = "ann2";
const SLOT3 = "ann3";

export default function CASF7({ navigation }) {
  const [ann1, setAnn1] = useState(null);
  const [ann2, setAnn2] = useState(null);
  const [ann3, setAnn3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        // ✅ load 3 announcement images in parallel
        const [u1, u2, u3] = await Promise.all([
          getDeptMediaUrl(DEPT, SLOT1),
          getDeptMediaUrl(DEPT, SLOT2),
          getDeptMediaUrl(DEPT, SLOT3),
        ]);

        if (!isActive) return;

        setAnn1(u1 || null);
        setAnn2(u2 || null);
        setAnn3(u3 || null);

        console.log("[CASF7] fetched:", { u1, u2, u3 });
      } catch (e) {
        console.log("[CASF7] failed to load CAS announcements:", e);
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

  const renderSlot = (url) => (
    <View style={m.slotCard}>
      <LinearGradient
        colors={["#9d4edd", "#6a2fb1"]} // CAS purple fallback
        start={[0, 0]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />

      <BlurView intensity={22} tint="light" style={StyleSheet.absoluteFill} />

      {url && (
        <Image
          source={{ uri: url }}
          style={m.slotImage}
          resizeMode="cover"
          onError={(e) =>
            console.log("[CASF7] slot image error:", e.nativeEvent)
          }
        />
      )}

      {loading && (
        <View style={m.loadingOverlay}>
          <ActivityIndicator color="#fff" />
        </View>
      )}

      {!loading && !url && (
        <View style={m.noImageOverlay}>
          <Text style={m.noImageText}>No image set</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      {/* Background graphics */}
      <LinearGradient colors={["#fbf7ff", "#efe6ff"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button */}
      <TouchableOpacity style={s.back} onPress={() => navSafe("CASF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>
        <Text style={s.title}>CAS Announcements</Text>
        <Text style={s.subtitle}>Latest updates from CAS</Text>

        <View style={m.list}>
          {renderSlot(ann1)}
          {renderSlot(ann2)}
          {renderSlot(ann3)}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* styles (unchanged) */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    backgroundColor: "#7b2cbf",
    borderRadius: 18,
    opacity: 0.18,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: "#c9a6ff",
    borderRadius: 160,
    opacity: 0.32,
  },

  back: {
    position: "absolute",
    right: 14,
    top: Platform.OS === "android" ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  backImg: { width: 34, height: 34, tintColor: "#fff" },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 18,
    paddingTop: 110,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#3c096c",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#555",
  },
});

const m = StyleSheet.create({
  list: {
    marginTop: 24,
    width: Math.min(380, width - 40),
  },
  slotCard: {
    width: "100%",
    height: height * 0.18,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 8,
  },
  slotImage: {
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
  noImageOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
