// CCJF1.js — College of Criminal Justice intro (gray & black theme)

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

// Adjust if your arrow is in another path
const ARROW_IMG = require("../../../assets/back.png");

export default function CCJF1({ navigation }) {
  function navSafe(route) {
    if (navigation && typeof navigation.navigate === "function") {
      navigation.navigate(route);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" translucent={false} />

      {/* Background shapes */}
      <View style={styles.topLeftCircle} />
      <View style={styles.topRightLightRect} />
      <View style={styles.topRightDarkRect} />

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={["#3b3b3b", "#0b0b0b"]}
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
              <Text style={styles.ccsText}>C.C.J</Text>
              <Text style={styles.subtitle}>College of Criminal Justice</Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.description}>
          This track is for students who plan to pursue a college degree. It provides a strong foundation
          in core subjects and includes specialized strands to suit various interests.
        </Text>
      </View>

      {/* Bottom proceed button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.proceedWrapper}
          activeOpacity={0.86}
          onPress={() => navSafe("CCJF2")}
        >
          <LinearGradient
            colors={["#2f2f2f", "#0f0f0f"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.proceedBtn}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Back Button with arrow-left.png */}
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
    backgroundColor: "#0b0b0b",
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
    backgroundColor: "rgba(255,255,255,0.02)",
    zIndex: 2,
  },
  topRightLightRect: {
    position: "absolute",
    right: -4,
    top: 8,
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.03)",
    zIndex: 2,
  },
  topRightDarkRect: {
    position: "absolute",
    right: -4,
    top: 80,
    width: 70,
    height: 70,
    backgroundColor: "#141414",
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
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
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
    opacity: 0.09,
  },
  watermarkCircleLarge: {
    width: "80%",
    height: "80%",
    borderRadius: 999,
    backgroundColor: "#fff",
    opacity: 0.02,
  },
  watermarkInnerArc: {
    position: "absolute",
    width: "55%",
    height: "55%",
    borderRadius: 999,
    borderWidth: 10,
    borderColor: "#fff",
    opacity: 0.02,
    transform: [{ translateY: 18 }],
  },

  titleWrap: {
    zIndex: 3,
    alignItems: "center",
  },
  ccsText: {
    color: "#fff",
    fontSize: 80,
    fontWeight: "900",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
  },

  description: {
    marginTop: 22,
    textAlign: "center",
    color: "#d1d1d1",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  /* proceed button at bottom */
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
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
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
    opacity: 0.95,
  },
});
