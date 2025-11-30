// frontend/src/screens/CCJ/CCJF1.js
// CCJF1 – Intro screen for College of Criminal Justice (CCJ)
// Design closely mirrors CCSF1, but with CCJ dark theme (black / gray / white)

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

export default function CCJF1({ navigation }) {
  function navSafe(route) {
    if (navigation && typeof navigation.navigate === "function") {
      navigation.navigate(route);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "light-content"}
      />

      {/* Background shapes similar to CCSF1, but CCJ colors */}
      <LinearGradient
        colors={["rgba(255,255,255,0.03)", "rgba(255,255,255,0.01)"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.topLeftCircle}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.topRightLightRect}
      />
      <LinearGradient
        colors={["#232323", "#050505"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.topRightDarkRect}
      />

      {/* Main content area (same layout as CCSF1) */}
      <View style={styles.content}>
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={["#3b3b3b", "#050505"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.card}
          >
            {/* subtle watermark like CCSF1 */}
            <View style={styles.watermarkGroup}>
              <View style={styles.watermarkCircleLarge} />
              <View style={styles.watermarkInnerArc} />
            </View>

            {/* Top small label */}
            <Text style={styles.smallTag}>Trimex Colleges • CCJ</Text>

            {/* Main title */}
            <View style={styles.titleWrap}>
              <Text style={styles.ccsText}>CCJ</Text>
              <Text style={styles.subtitle}>College of Criminal Justice</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Description text, same placement as CCSF1 */}
        <Text style={styles.description}>
          The College of Criminal Justice prepares students for careers in
          law enforcement, criminology, corrections, and related fields. It
          develops discipline, integrity, and critical thinking through
          hands-on training and strong academic foundations.
        </Text>
      </View>

      {/* Bottom proceed button – same style as CCSF1, CCJ colors */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.proceedWrapper}
          activeOpacity={0.86}
          onPress={() => navSafe("CCJF2")}
        >
          <LinearGradient
            colors={["#2f2f2f", "#0b0b0b"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.proceedBtn}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Back Button → Onboarding (same behavior as CCSF1) */}
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
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* background shapes (CCJ dark variant of CCSF1) */
  topLeftCircle: {
    position: "absolute",
    left: 12,
    top: 8,
    width: 120,
    height: 120,
    borderRadius: 60,
    zIndex: 2,
  },
  topRightLightRect: {
    position: "absolute",
    right: -4,
    top: 8,
    width: 100,
    height: 100,
    borderRadius: 10,
    zIndex: 2,
  },
  topRightDarkRect: {
    position: "absolute",
    right: -4,
    top: 80,
    width: 70,
    height: 70,
    borderRadius: 10,
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
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 12,
  },
  card: {
    width: "100%",
    minHeight: 210,
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  /* watermark like CCSF1 */
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
    backgroundColor: "#ffffff",
    opacity: 0.03,
  },
  watermarkInnerArc: {
    position: "absolute",
    width: "55%",
    height: "55%",
    borderRadius: 999,
    borderWidth: 10,
    borderColor: "rgba(255,255,255,0.7)",
    opacity: 0.04,
    transform: [{ translateY: 18 }],
  },

  smallTag: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginBottom: 6,
    zIndex: 3,
  },

  titleWrap: {
    zIndex: 3,
    alignItems: "center",
  },
  ccsText: {
    color: "#ffffff",
    fontSize: 70,
    fontWeight: "900",
    marginBottom: 6,
    letterSpacing: 2,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 9,
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    textAlign: "center",
  },

  description: {
    marginTop: 22,
    textAlign: "center",
    color: "#d1d1d1",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  /* proceed button at bottom (same sizing as CCSF1) */
  bottomArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  proceedText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  /* back button same place as CCSF1 */
  backBtn: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "android" ? 14 : 50,
    backgroundColor: "transparent",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  backImage: {
    width: 24,
    height: 24,
    tintColor: "#ffffff",
    opacity: 0.96,
  },
});
