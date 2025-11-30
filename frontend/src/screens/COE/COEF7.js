// frontend/src/screens/COE/COEF7.js
// COE7 – Announcements (COE theme, slots: "coe_ann1", "coe_ann2", "coe_ann3")

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
import { loadCcsMedia } from "../../lib/ccsMediaHelpers";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

export default function COE7({ navigation }) {
  const [ann1, setAnn1] = useState(null);
  const [ann2, setAnn2] = useState(null);
  const [ann3, setAnn3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const media = await loadCcsMedia();
        console.log("[COE7] media map =", media);

        if (!isActive || !media) return;

        // COE-specific slots (set these from AdminScreen)
        setAnn1(media.coe_ann1 || null);
        setAnn2(media.coe_ann2 || null);
        setAnn3(media.coe_ann3 || null);

        console.log("[COE7] coe_ann1 =", media.coe_ann1);
        console.log("[COE7] coe_ann2 =", media.coe_ann2);
        console.log("[COE7] coe_ann3 =", media.coe_ann3);
      } catch (e) {
        console.log("[COE7] failed to load media:", e);
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
      {/* COE orange gradient base */}
      <LinearGradient
        colors={["#FFB74D", "#F57C00"]}
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
            console.log("[COE7] slot image error:", e.nativeEvent)
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
      {/* COE background: white + soft orange */}
      <LinearGradient colors={["#ffffff", "#fff4e0"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back → COE3 hub */}
      <TouchableOpacity style={s.back} onPress={() => navSafe("COEF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>
        <Text style={s.title}>Announcements</Text>
        <Text style={s.subtitle}>Latest updates from COE</Text>

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
  screen: { flex: 1, backgroundColor: "#fff" },
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
    top: 50,
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
