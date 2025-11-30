// frontend/src/screens/CCJ/CCJF6.js
// CCJF6 – CCJ Events (slots: "eventsTop", "eventsBottom")

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
import { getDeptMediaUrl } from "../../lib/ccsMediaHelpers";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

const DEPT = "CCJ";
const SLOT_TOP = "eventsTop";
const SLOT_BOTTOM = "eventsBottom";

export default function CCJF6({ navigation }) {
  const [eventsTopUri, setEventsTopUri] = useState(null);
  const [eventsBottomUri, setEventsBottomUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const [top, bottom] = await Promise.all([
          getDeptMediaUrl(DEPT, SLOT_TOP),
          getDeptMediaUrl(DEPT, SLOT_BOTTOM),
        ]);
        console.log("[CCJF6] eventsTop =", top);
        console.log("[CCJF6] eventsBottom =", bottom);
        if (!isActive) return;
        setEventsTopUri(top);
        setEventsBottomUri(bottom);
      } catch (err) {
        console.log("[CCJF6] error loading events:", err);
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
      <LinearGradient
        colors={["#3b3b3b", "#141414"]}
        start={[0, 0]}
        end={[1, 1]}
        style={m.cardBg}
      />
      {uri && (
        <Image
          source={{ uri }}
          style={m.cardImage}
          resizeMode="cover"
          onError={(e) =>
            console.log("[CCJF6] card image error:", e.nativeEvent)
          }
        />
      )}
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
        barStyle={Platform.OS === "android" ? "light-content" : "light-content"}
      />
      <LinearGradient colors={["#111111", "#050505"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navSafe("CCJF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.contentWrap}>
        <Text style={s.title}>CCJ Events</Text>

        {renderCard(eventsTopUri)}
        <View style={{ height: 16 }} />
        {renderCard(eventsBottomUri)}
      </View>
    </SafeAreaView>
  );
}

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
    opacity: 0.3,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#444444",
    opacity: 0.45,
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
  backImg: { width: 34, height: 34, tintColor: "#ffffff" },

  contentWrap: {
    marginTop: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#f5f5f5",
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
    shadowOpacity: 0.3,
    shadowRadius: 18,
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
    backgroundColor: "rgba(0,0,0,0.22)",
  },
});
