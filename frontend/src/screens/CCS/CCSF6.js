// frontend/src/screens/CCS/CCSF6.js
// CCS Events – two stacked rectangles using Supabase images.

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
import { getCcsMediaUrl } from "../../lib/ccsMediaHelpers";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

export default function CCSF6({ navigation }) {
  const [eventsTopUri, setEventsTopUri] = useState(null);
  const [eventsBottomUri, setEventsBottomUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const [top, bottom] = await Promise.all([
          getCcsMediaUrl("eventsTop"),
          getCcsMediaUrl("eventsBottom"),
        ]);
        console.log("[CCSF6] eventsTop =", top);
        console.log("[CCSF6] eventsBottom =", bottom);
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

  const renderCard = (uri) => (
    <View style={m.card}>
      <LinearGradient
        colors={["#FF5F6D", "#FFC371"]}
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
            console.log("[CCSF6] card image error:", e.nativeEvent)
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
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />
      <LinearGradient colors={["#fff", "#f7f7f9"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navSafe("CCSF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.contentWrap}>
        <Text style={s.title}>CCS Events</Text>

        {renderCard(eventsTopUri)}
        <View style={{ height: 16 }} />
        {renderCard(eventsBottomUri)}
      </View>
    </SafeAreaView>
  );
}

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
    marginTop: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#222",
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
