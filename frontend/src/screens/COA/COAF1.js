// frontend/src/screens/COA/COAF1.js
// COAF1 — Yellow + White Modern Theme (pattern matched to CCSF1)

import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CONTAINER_W = Math.min(380, width - 24);

const ARROW_IMG = require("../../../assets/back.png");

export default function COAF1({ navigation }) {
  function navSafe(route) {
    if (navigation && typeof navigation.navigate === "function") {
      navigation.navigate(route);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "dark-content" : "dark-content"}
      />

      {/* Background shapes (soft yellow highlights) */}
      <View style={styles.topLeftCircle} />
      <View style={styles.topRightYellowRect} />
      <View style={styles.topRightWhiteRect} />

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={["#ffe066", "#fff9db"]} // yellow → soft white
            start={[0, 0]}
            end={[1, 1]}
            style={styles.card}
          >
            {/* Watermark */}
            <View style={styles.watermarkGroup}>
              <View style={styles.watermarkCircleLarge} />
              <View style={styles.watermarkInnerArc} />
            </View>

            <View style={styles.titleWrap}>
              <Text style={styles.ccsText}>C.O.A</Text>
              <Text style={styles.subtitle}>College of Accountancy</Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.description}>
          This track is for students who plan to pursue a college degree. It
          provides a strong foundation in core subjects and includes specialized
          strands to suit various interests.
        </Text>
      </View>

      {/* Proceed button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.proceedWrapper}
          activeOpacity={0.86}
          onPress={() => navSafe("COAF2")}
        >
          <LinearGradient
            colors={["#ffd60a", "#ffc300"]} // gold / strong yellow
            start={[0, 0]}
            end={[1, 1]}
            style={styles.proceedBtn}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Back Button → Onboarding (same as other F1 screens) */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navSafe("Onboarding")}
        activeOpacity={0.85}
        accessible
        accessibilityLabel="Back"
      >
        <Image source={ARROW_IMG} style={styles.backImage} resizeMode="contain" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* background shapes */
  topLeftCircle: {
    position: "absolute",
    left: 12,
    top: 8,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffee99", // soft yellow highlight
    zIndex: 2,
  },
  topRightYellowRect: {
    position: "absolute",
    right: -4,
    top: 8,
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#ffe680", // bright yellow
    zIndex: 2,
  },
  topRightWhiteRect: {
    position: "absolute",
    right: -4,
    top: 80,
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    zIndex: 1,
  },

  content: {
    width: CONTAINER_W,
    alignItems: "center",
    marginTop: 110,
  },

  /* card */
  cardWrap: {
    width: "100%",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    width: "100%",
    minHeight: 200,
    borderRadius: 18,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  /* watermark */
  watermarkGroup: {
    position: "absolute",
    top: -10,
    width: "150%",
    height: "150%",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.12,
  },
  watermarkCircleLarge: {
    width: "80%",
    height: "80%",
    borderRadius: 999,
    backgroundColor: "#fffdf0",
    opacity: 0.1,
  },
  watermarkInnerArc: {
    position: "absolute",
    width: "55%",
    height: "55%",
    borderRadius: 999,
    borderWidth: 10,
    borderColor: "#ffffff",
    opacity: 0.08,
    transform: [{ translateY: 18 }],
  },

  titleWrap: {
    zIndex: 3,
    alignItems: "center",
  },
  ccsText: {
    color: "#333",
    fontSize: 90,
    fontWeight: "900",
    marginBottom: 8,
  },
  subtitle: {
    color: "#555",
    fontSize: 15,
  },

  description: {
    marginTop: 22,
    textAlign: "center",
    color: "#333",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  /* proceed button */
  bottomArea: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 28,
  },
  proceedWrapper: {
    width: Math.min(340, width - 48),
  },
  proceedBtn: {
    paddingVertical: 20,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  /* back button */
  backBtn: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "android" ? 14 : 50,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  backImage: {
    width: 34,
    height: 34,
    tintColor: "#000",
    opacity: 0.8,
  },
});
