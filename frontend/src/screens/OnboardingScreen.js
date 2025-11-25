// frontend/src/screens/OnboardingScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ActivityIndicator,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ZoomImage from "../components/ZoomImage";

import {
  useFonts as usePacifico,
  Pacifico_400Regular,
} from "@expo-google-fonts/pacifico";
import {
  useFonts as useLato,
  Lato_400Regular,
  Lato_700Bold,
  Lato_900Black,
} from "@expo-google-fonts/lato";

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // dynamic scale helpers
  const BASE_W = 390;
  const BASE_H = 844;
  const scale = SCREEN_W / BASE_W;
  const vScale = SCREEN_H / BASE_H;
  const normalize = (size) => size * scale;
  const vNormalize = (size) => size * vScale;
  const isTablet = SCREEN_W > 600;

  // layout pulse
  const layoutAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(layoutAnim, {
        toValue: 0.985,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(layoutAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [SCREEN_W, SCREEN_H, layoutAnim]);

  const [pLoaded] = usePacifico({ Pacifico_400Regular });
  const [lLoaded] = useLato({
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
  });
  const fontsLoaded = pLoaded && lLoaded;

  const animOpacity = useRef(new Animated.Value(0)).current;
  const animTranslateX = useRef(new Animated.Value(40)).current;
  const [isAnimating, setIsAnimating] = useState(false);

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
  }, [animOpacity, animTranslateX]);

  // ===== Hidden 5-tap → AdminLogIn =====
  const tapCounter = useRef(0);
  const tapTimeout = useRef(null);

  const handleSecretTap = () => {
    tapCounter.current = (tapCounter.current || 0) + 1;

    if (tapCounter.current >= 5) {
      tapCounter.current = 0;
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
      }
      navigation.navigate("AdminLogIn"); // 👈 secret admin route
      return;
    }

    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    tapTimeout.current = setTimeout(() => {
      tapCounter.current = 0;
      tapTimeout.current = null;
    }, 1500);
  };
  // =====================================

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#FF423D" />
        </View>
      </SafeAreaView>
    );
  }

  const handleGetStarted = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(animOpacity, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(animTranslateX, {
        toValue: -60,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) navigation.navigate("Fillup");
    });
  };

  const buttonDisabled = !fontsLoaded || isAnimating;

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      {/* invisible tap area for admin login */}
      <TouchableOpacity
        onPress={handleSecretTap}
        activeOpacity={1}
        style={[
          styles.hiddenButton,
          { top: insets.top + 8, right: 16 },
        ]}
      />

      <View style={styles.container}>
        <Animated.View
          style={[
            styles.card,
            {
              width: SCREEN_W,
              height: SCREEN_H,
              opacity: animOpacity,
              transform: [{ translateX: animTranslateX }, { scale: layoutAnim }],
            },
          ]}
        >
          {/* hero illustration */}
          <ZoomImage topPercent={0.45} zoom={2} />

          {/* text + button */}
          <View
            style={[
              styles.content,
              {
                paddingHorizontal: normalize(26),
                paddingBottom: vNormalize(28),
              },
            ]}
          >
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: normalize(14),
                  marginTop: vNormalize(16),
                  marginBottom: vNormalize(12),
                },
              ]}
            >
              "Unlocking knowledge, shaping the future"
            </Text>

            <Text
              style={[
                styles.trimexLine,
                {
                  fontSize: normalize(isTablet ? 22 : 20),
                  lineHeight: vNormalize(30),
                },
              ]}
            >
              Trimex Learning Experience...
            </Text>

            <Text
              style={[
                styles.worthIt,
                {
                  fontSize: normalize(isTablet ? 46 : 40),
                  lineHeight: vNormalize(56),
                  marginBottom: vNormalize(8),
                },
              ]}
            >
              Worth It
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  paddingVertical: vNormalize(22),
                  paddingHorizontal: normalize(100),
                  marginTop: vNormalize(20),
                },
                buttonDisabled && styles.buttonDisabled,
                pressed && !buttonDisabled ? styles.buttonPressed : null,
              ]}
              onPress={handleGetStarted}
              disabled={buttonDisabled}
            >
              {isAnimating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    { fontSize: normalize(18) },
                  ]}
                >
                  Get Started
                </Text>
              )}
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f2f2f4" },
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 0,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "transparent",
    elevation: 1,
  },

  content: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },

  trimexLine: {
    color: "#FF423D",
    fontFamily: "Pacifico_400Regular",
    textAlign: "center",
    marginBottom: 2,
    marginTop: 8,
  },

  worthIt: {
    color: "#FF423D",
    fontFamily: "Pacifico_400Regular",
    textAlign: "center",
  },

  subtitle: {
    color: "#7a7a7a",
    textAlign: "center",
    fontFamily: "Lato_400Regular",
    textDecorationLine: "underline",
    textDecorationColor: "rgba(120,120,120,0.35)",
  },

  button: {
    backgroundColor: "#0b1113",
    borderRadius: 50,
    minWidth: 160,
    alignSelf: "center",
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.55 },
  buttonPressed: { transform: [{ scale: 0.98 }] },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontFamily: "Lato_900Black",
  },

  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  hiddenButton: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 9999,
    // backgroundColor: "rgba(255,0,0,0.2)", // uncomment to see area while testing
  },
});
