// frontend/src/screens/COA/COAF7.js
// COA Announcements – three Supabase images (ann1, ann2, ann3) in yellow/white theme

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

export default function COAF7({ navigation }) {
  const [ann1, setAnn1] = useState(null);
  const [ann2, setAnn2] = useState(null);
  const [ann3, setAnn3] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        const [u1, u2, u3] = await Promise.all([
          getCoaMediaUrl("ann1"),
          getCoaMediaUrl("ann2"),
          getCoaMediaUrl("ann3"),
        ]);
        console.log("[COAF7] ann1 =", u1);
        console.log("[COAF7] ann2 =", u2);
        console.log("[COAF7] ann3 =", u3);
        if (!isActive) return;
        setAnn1(u1);
        setAnn2(u2);
        setAnn3(u3);
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

  const renderCard = (uri, size = "large") => {
    const wrapperStyle =
      size === "large" ? m.cardLarge : size === "medium" ? m.cardMedium : m.cardSmall;

    return (
      <View style={[m.cardBase, wrapperStyle]}>
        <LinearGradient
          colors={["#ffe066", "#fff4a3"]}
          start={[0, 0]}
          end={[1, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        {uri && (
          <Image
            source={{ uri }}
            style={m.cardImage}
            resizeMode="cover"
            onError={(e) =>
              console.log("[COAF7] image load error:", e.nativeEvent)
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
  };

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />
      <LinearGradient colors={["#fffef5", "#fffbea"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* back → COAF3 */}
      <TouchableOpacity style={s.back} onPress={() => navSafe("COAF3")}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.contentWrap}>
        <Text style={s.title}>COA Announcements</Text>

        {/* Top big announcement (ann1) */}
        {renderCard(ann1, "large")}

        {/* bottom row: ann2 & ann3 */}
        <View style={m.bottomRow}>
          {renderCard(ann2, "medium")}
          <View style={{ width: 12 }} />
          {renderCard(ann3, "small")}
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fffef5" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "rgba(255, 230, 140, 0.45)",
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: "rgba(255, 215, 70, 0.45)",
    borderRadius: 160,
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
    marginTop: 90,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
});

const m = StyleSheet.create({
  cardBase: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#ffd60a",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  cardLarge: {
    width: Math.min(360, width - 40),
    height: height * 0.22,
    marginBottom: 18,
  },
  bottomRow: {
    flexDirection: "row",
    width: Math.min(360, width - 40),
  },
  cardMedium: {
    flex: 1.1,
    height: height * 0.16,
  },
  cardSmall: {
    flex: 0.9,
    height: height * 0.16,
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
