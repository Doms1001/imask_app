// frontend/src/screens/CCJ/CCJF7.js
// CCJF7 – Announcements (slots: "ann1", "ann2", "ann3" for CCJ)

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

const DEPT = "CCJ";
const SLOT1 = "ann1";
const SLOT2 = "ann2";
const SLOT3 = "ann3";

export default function CCJF7({ navigation }) {
  const [ann1, setAnn1] = useState(null);
  const [ann2, setAnn2] = useState(null);
  const [ann3, setAnn3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const [u1, u2, u3] = await Promise.all([
                  getDeptMediaUrl(DEPT, SLOT1),
                  getDeptMediaUrl(DEPT, SLOT2),
                  getDeptMediaUrl(DEPT, SLOT3),
                ]);

        if (!isActive) return;

        setAnn1(u1 || null);
        setAnn2(u2 || null);
        setAnn3(u3 || null);

        console.log("[CCJF7] fetched:", { u1, u2, u3 });

      } catch (e) {
        console.log("[CCJF7] failed to load CCJ announcements:", e);
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
        colors={["#3b3b3b", "#141414"]}
        start={[0, 0]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />
      <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
      {url && (
        <Image
          source={{ uri: url }}
          style={m.slotImage}
          resizeMode="cover"
          onError={(e) =>
            console.log("[CCJF7] slot image error:", e.nativeEvent)
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
        barStyle={Platform.OS === "android" ? "light-content" : "light-content"}
      />
      <LinearGradient colors={["#111111", "#050505"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navSafe("CCJF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>
        <Text style={s.title}>Announcements</Text>
        <Text style={s.subtitle}>Latest updates from CCJ</Text>

        <View style={m.list}>
          {renderSlot(ann1)}
          {renderSlot(ann2)}
          {renderSlot(ann3)}
        </View>
      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#2f2f2f",
    opacity: 0.32,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#444444",
    opacity: 0.55,
  },

  back: {
    position: "absolute",
    right: 14,
    top: Platform.OS === "android" ? 18 : 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  backImg: { width: 34, height: 34, tintColor: "#ffffff" },

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
    color: "#f5f5f5",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#bfbfbf",
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
    shadowOpacity: 0.3,
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
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  noImageOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    color: "#f5f5f5",
    fontWeight: "700",
    fontSize: 13,
  },
});
