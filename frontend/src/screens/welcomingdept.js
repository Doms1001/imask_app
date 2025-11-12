// frontend/src/screens/welcomingdept.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const BOX = 80;
const SAFE_BG = "#f2f2f4";

export default function WelcomingDept({ navigation, route }) {
  const { name } = route?.params ?? {};

  const animOpacity = useRef(new Animated.Value(0)).current;
  const animTranslateX = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(animTranslateX, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleProceed = () => {
  // small delay to let the animation finish (optional)
  setTimeout(() => {
    navigation.navigate("Departments");
  }, 200);
};


  return (
    <View style={styles.safe}>
      <Animated.View
        style={[
          styles.card,
          {
            width: SCREEN_W,
            height: SCREEN_H,
            opacity: animOpacity,
            transform: [{ translateX: animTranslateX }],
          },
        ]}
      >
        {/* Decorations (same as FillupScreen) */}
        <View style={styles.topLeftBlack} />
        <View style={styles.topLeftRed} />
        <View style={styles.topRightCircle} />

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.header}>Hello there{name ? `, ${name}` : "!"}</Text>
          <Text style={styles.subtitle}>
            Please choose a{"\n"}Department for your desired course
          </Text>
        </View>

        {/* Center art */}
        <View style={styles.centerArtWrap}>
          <View style={styles.centerBlack} />
          <View style={styles.centerRed} />
        </View>

        {/* Proceed button */}
        <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed} activeOpacity={0.85}>
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>

        {/* Bottom decorations */}
        <View style={styles.bottomRightBlack} />
        <View style={styles.bottomRightRed} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SAFE_BG },
  card: {
    backgroundColor: "#fff",
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 1,
  },

  // decorations
  topLeftBlack: {
    position: "absolute",
    top: 80,
    left: -20,
    width: BOX - 1,
    height: BOX - 1,
    backgroundColor: "#000",
    zIndex: 1,
  },
  topLeftRed: {
    position: "absolute",
    top: 30,
    left: 20,
    width: BOX,
    height: BOX,
    backgroundColor: "#ff4d4d",
    zIndex: 2,
  },
  topRightCircle: {
    position: "absolute",
    top: 0,
    right: 0,
    width: BOX,
    height: BOX,
    backgroundColor: "#ff0000",
    borderBottomLeftRadius: BOX,
    zIndex: 1,
  },

  bottomRightBlack: {
    position: "absolute",
    bottom: 30,
    right: 1,
    width: BOX - 1,
    height: BOX - 1,
    backgroundColor: "#000",
    zIndex: 1,
  },
  bottomRightRed: {
    position: "absolute",
    bottom: 60,
    right: 30,
    width: BOX - 1,
    height: BOX - 1,
    backgroundColor: "#ff4d4d",
    zIndex: 2,
  },

  // content
  content: {
    width: "85%",
    alignItems: "flex-start",
    marginTop: 100,
  },
  header: {
    fontSize: 30,
    color: "#FF423D",
    marginBottom: 10,
    fontFamily: "Pacifico_400Regular", // ✅ restored font
  },
  subtitle: {
    fontSize: 16,
    color: "#111",
    lineHeight: 22,
  },

  // center art
  centerArtWrap: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: "flex-end",
    paddingRight: 24,
  },
  centerBlack: {
    width: 120,
    height: 120,
    backgroundColor: "#000",
    transform: [{ rotate: "-25deg" }],
    position: "absolute",
    right: 80,
    bottom: 20,
    zIndex: 1,
  },
  centerRed: {
    width: 64,
    height: 64,
    backgroundColor: "#ff5959",
    position: "absolute",
    right: 24,
    bottom: 20,
    zIndex: 2,
  },

  // proceed button
  proceedBtn: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
    width: "78%",
    height: 68,
    borderRadius: 28,
    backgroundColor: "#161b1d",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 6,
  },
  proceedText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
