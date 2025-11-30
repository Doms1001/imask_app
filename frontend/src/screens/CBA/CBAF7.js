// frontend/src/screens/CBA/CBAF7.js
// CBAF7 – Announcements (slots: "cba_ann1", "cba_ann2", "cba_ann3")

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
import { getDeptMediaUrl } from "../../lib/ccsMediaHelpers";


const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");


const DEPT = "CBA";
const SLOT1 = "ann1";
const SLOT2 = "ann2";
const SLOT3 = "ann3";

export default function CBAF7({ navigation }) {
  const [ann1Uri, setAnn1Uri] = useState(null);
  const [ann2Uri, setAnn2Uri] = useState(null);
  const [ann3Uri, setAnn3Uri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const [a1, a2, a3] = await Promise.all([
          getDeptMediaUrl(DEPT, SLOT1),
          getDeptMediaUrl(DEPT, SLOT2),
          getDeptMediaUrl(DEPT, SLOT3),
        ]);

        console.log("[CBAF7] cba_ann1 =", a1);
        console.log("[CBAF7] cba_ann2 =", a2);
        console.log("[CBAF7] cba_ann3 =", a3);

        if (!isActive) return;

        setAnn1Uri(a1 || null);
        setAnn2Uri(a2 || null);
        setAnn3Uri(a3 || null);
      } catch (e) {
        console.log("[CBAF7] failed to load CBA announcements:", e);
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
        colors={["#FFD54F", "#FF8A00"]}
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
            console.log("[CBAF7] slot image error:", e.nativeEvent)
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
      <LinearGradient colors={["#fff9f0", "#fff3d9"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navSafe("CBAF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>
        <Text style={s.title}>Announcements</Text>
        <Text style={s.subtitle}>Latest updates from CBA</Text>

        <View style={m.list}>
          {renderSlot(ann1Uri)}
          {renderSlot(ann2Uri)}
          {renderSlot(ann3Uri)}
        </View>
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
    backgroundColor: "#FBC02D",
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
    opacity: 0.45,
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
    color: "#111",
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
