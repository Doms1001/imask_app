// CBAF1.js — Yellow / Orange Gradient Theme
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

export default function CBAF1Shapes({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      {/* BACKGROUND SHAPES — now gradients */}
      <LinearGradient
        colors={["#FFEB3B", "#FFC107"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.topLeftCircle}
      />

      <LinearGradient
        colors={["#FFB300", "#FF9800"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.topRightOrangeRect}
      />

      <LinearGradient
        colors={["#FF8A00", "#FF6D00"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.topRightDarkRect}
      />

      {/* MAIN CONTENT */}
      <View style={styles.content}>
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={["#FFD54F", "#FF8A00"]}
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
              <Text style={styles.ccsText}>C.B.A</Text>
              <Text style={styles.subtitle}>College of Business Administration</Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.description}>
          This track is for students who plan to pursue a college degree. It
          provides a strong foundation in core subjects and includes
          specialized strands to suit various interests.
        </Text>
      </View>

      {/* PROCEED BUTTON */}
      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.proceedWrapper}
          onPress={() => navigation?.navigate && navigation.navigate("CBAF2")}
        >
          <LinearGradient
            colors={["#FFA726", "#FB8C00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.proceedBtn}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation?.navigate && navigation.navigate("Onboarding")}
      >
        <Image source={ARROW_IMG} style={styles.backImage} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fffdf5",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* gradient shapes */
  topLeftCircle: {
    position: "absolute",
    left: 12,
    top: 8,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  topRightOrangeRect: {
    position: "absolute",
    right: -4,
    top: 8,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  topRightDarkRect: {
    position: "absolute",
    right: -4,
    top: 80,
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  content: {
    width: CONTAINER_W,
    alignItems: "center",
    marginTop: 110,
  },

  cardWrap: {
    width: "100%",
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 8 },
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
    opacity: 0.08,
  },
  watermarkInnerArc: {
    position: "absolute",
    width: "55%",
    height: "55%",
    borderRadius: 999,
    borderWidth: 10,
    borderColor: "rgba(255,255,255,0.7)",
    opacity: 0.05,
    transform: [{ translateY: 18 }],
  },

  titleWrap: {
    alignItems: "center",
  },
  ccsText: {
    color: "#fff",
    fontSize: 88,
    fontWeight: "900",
    marginBottom: 6,
    textShadowColor: "rgba(128,64,0,0.2)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 15,
  },

  description: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },

  bottomArea: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 30,
  },
  proceedWrapper: {
    width: Math.min(340, width - 48),
  },
  proceedBtn: {
    paddingVertical: 20,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  proceedText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  backBtn: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "android" ? 12 : 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  backImage: {
    width: 40,
    height: 40,
    tintColor: "#fff",
  },
});
