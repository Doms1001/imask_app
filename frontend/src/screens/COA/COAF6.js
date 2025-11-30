// frontend/src/screens/COA/COAF6.js
// COA Events – two stacked rectangles using Supabase images (COA yellow/white theme)

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
import { getCoaMediaUrl } from "../../lib/ccsMediaHelpers";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

export default function COAF6({ navigation }) {
  const [eventsTopUri, setEventsTopUri] = useState(null);
  const [eventsBottomUri, setEventsBottomUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const [top, bottom] = await Promise.all([
          getCoaMediaUrl("eventsTop"),
          getCoaMediaUrl("eventsBottom"),
        ]);
        console.log("[COAF6] eventsTop =", top);
        console.log("[COAF6] eventsBottom =", bottom);
        if (!isActive) return;
        setEventsTopUri(top);
        setEventsBottomUri(bottom);
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

  const renderCard = (uri, label) => (
    <View style={m.card}>
      {/* yellow gradient fallback */}
      <LinearGradient
        colors={["#ffe066", "#ffd60a"]}
        start={[0, 0]}
        end={[1, 1]}
        style={m.cardBg}
      />

      {/* Supabase image */}
      {uri && (
        <Image
          source={{ uri }}
          style={m.cardImage}
          resizeMode="cover"
          onError={(e) =>
            console.log("[COAF6] card image error:", e.nativeEvent)
          }
        />
      )}

      {/* loading overlay */}
      {loading && (
        <View style={m.loadingOverlay}>
          <ActivityIndicator color="#fff" />
          {label ? <Text style={m.loadingText}>{label}</Text> : null}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />

      {/* COA yellow background */}
      <LinearGradient colors={["#fffaf0", "#fff7e6"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* back → COAF3 */}
      <TouchableOpacity style={s.back} onPress={() => navSafe("COAF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.contentWrap}>
        <Text style={s.title}>COA Events</Text>

        {renderCard(eventsTopUri, "Top Event")}
        <View style={{ height: 16 }} />
        {renderCard(eventsBottomUri, "Bottom Event")}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fffaf0" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "rgba(255, 235, 120, 0.6)",
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "rgba(255, 215, 60, 0.75)",
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
  backImg: { width: 34, height: 34, tintColor: "#111" },

  contentWrap: {
    marginTop: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#333",
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
    backgroundColor: "#ffd60a",
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
    paddingTop: 8,
  },
  loadingText: {
    marginTop: 6,
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
