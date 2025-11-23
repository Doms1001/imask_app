// CASF1.js (Violet Theme + Animated Background) — FIXED
import React, { useRef, useEffect } from "react";
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
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CONTAINER_W = Math.min(380, width - 24);

// Adjust if your arrow is in another path
const ARROW_IMG = require("../../../assets/back.png");

export default function CASF1Shapes({ navigation }) {
  // Floating animation value
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // simple up / down loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 12,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  // alternate translate for the second circle (invert)
  const floatAnimInverted = floatAnim.interpolate({
    inputRange: [-12, 12],
    outputRange: [12, -12],
  });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      {/* Animated violet background circles */}
      <Animated.View
        style={[
          styles.floatingCircle1,
          { transform: [{ translateY: floatAnim }] },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingCircle2,
          { transform: [{ translateY: floatAnimInverted }] },
        ]}
      />

      {/* Top violet shapes */}
      <View style={styles.topLeftCircle} />
      <View style={styles.topRightLight} />
      <View style={styles.topRightDark} />

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={["#9d4edd", "#5a189a"]}
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
              <Text style={styles.ccsText}>C.A.S</Text>
              <Text style={styles.subtitle}>College of Arts and Science</Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.description}>
          This track is for students who plan to pursue a college degree. It
          provides a strong foundation in core subjects and includes
          specialized strands to suit various interests.
        </Text>
      </View>

      {/* Proceed button */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.proceedWrapper}
          activeOpacity={0.86}
          onPress={() => navigation.navigate("CASF2")}
        >
          <LinearGradient
            colors={["#7b2cbf", "#9d4edd"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.proceedBtn}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate("Onboarding")}
        activeOpacity={0.85}
      >
        <Image source={ARROW_IMG} style={styles.backImage} resizeMode="contain" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4e7ff",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* Animated floating background circles */
  floatingCircle1: {
    position: "absolute",
    top: 140,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: "#d5b3ff",
    opacity: 0.25,
  },
  floatingCircle2: {
    position: "absolute",
    top: 300,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: "#c59bff",
    opacity: 0.22,
  },

  /* Top shapes */
  topLeftCircle: {
    position: "absolute",
    left: 12,
    top: 8,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#b185ff",
    zIndex: 2,
  },
  topRightLight: {
    position: "absolute",
    right: -4,
    top: 8,
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#c8a2ff",
    zIndex: 2,
  },
  topRightDark: {
    position: "absolute",
    right: -4,
    top: 80,
    width: 70,
    height: 70,
    backgroundColor: "#4c1d95",
    zIndex: 1,
  },

  content: {
    width: CONTAINER_W,
    alignItems: "center",
    marginTop: 110,
  },

  cardWrap: {
    width: "100%",
    borderRadius: 18,
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
    opacity: 0.12,
  },
  watermarkCircleLarge: {
    width: "80%",
    height: "80%",
    borderRadius: 999,
    backgroundColor: "#fff",
    opacity: 0.1,
  },
  watermarkInnerArc: {
    position: "absolute",
    width: "55%",
    height: "55%",
    borderRadius: 999,
    borderWidth: 10,
    borderColor: "#fff",
    opacity: 0.07,
    transform: [{ translateY: 18 }],
  },

  titleWrap: {
    alignItems: "center",
  },
  ccsText: {
    color: "#fff",
    fontSize: 90,
    fontWeight: "900",
  },
  subtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
  },

  description: {
    marginTop: 22,
    textAlign: "center",
    color: "#222",
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 8,
  },

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

  backBtn: {
    position: "absolute",
    left: 12,
    top: 12,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  backImage: {
    width: 28,
    height: 28,
    tintColor: "#ffffff",
  },
});
