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

export default function COEF1Shapes({ navigation }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        translucent={false}
      />

      <View style={styles.topLeftCircle} />
      <View style={styles.topRightRedRect} />
      <View style={styles.topRightBlackRect} />

      <View style={styles.content}>
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={["#e72b2b", "#8b0000"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.card}
          >
            <View style={styles.watermarkGroup}>
              <View style={styles.watermarkCircleLarge} />
              <View style={styles.watermarkInnerArc} />
            </View>

            <View style={styles.titleWrap}>
              <Text style={styles.ccsText}>C.O.E</Text>
              <Text style={styles.subtitle}>College of Engineering</Text>
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.description}>
          This track is for students who plan to pursue a college degree. It provides a strong foundation 
          in core subjects and includes specialized strands to suit various interests.
        </Text>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.proceedWrapper}
          activeOpacity={0.86}
          onPress={() => navigation.navigate("COEF2")}
        >
          <LinearGradient
            colors={["#7b0000", "#c21b1b"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.proceedBtn}
          >
            <Text style={styles.proceedText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate("Onboarding")}
        activeOpacity={0.85}
      >
        <Image
          source={ARROW_IMG}
          style={styles.backImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "space-between",
  },

  topLeftCircle: {
    position: "absolute",
    left: 12,
    top: 8,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ff1f1f",
    zIndex: 2,
  },
  topRightRedRect: {
    position: "absolute",
    right: -4,
    top: 8,
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: "#ff1f1f",
    zIndex: 2,
  },
  topRightBlackRect: {
    position: "absolute",
    right: -4,
    top: 80,
    width: 70,
    height: 70,
    backgroundColor: "#0b0b0b",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
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

  watermarkGroup: {
    position: "absolute",
    top: -10,
    width: "150%",
    height: "150%",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.14,
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
    borderColor: "#fff",
    opacity: 0.05,
    transform: [{ translateY: 18 }],
  },

  titleWrap: {
    zIndex: 3,
    alignItems: "center",
  },
  ccsText: {
    color: "#fff",
    fontSize: 90,
    fontWeight: "900",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
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
    shadowOpacity: 0.22,
    shadowRadius: 8,
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
    top: 12,
    backgroundColor: "transparent",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  backImage: {
    marginTop: 60,
    width: 40,
    height: 40,
    tintColor: "#ffffff",
    opacity: 1,
  },
});