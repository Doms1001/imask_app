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

import { useFonts as usePacifico, Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import { useFonts as useLato, Lato_400Regular, Lato_700Bold, Lato_900Black } from "@expo-google-fonts/lato";

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // dynamic dims via hook (auto-updates on rotate)
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // subtle layout animation when dimensions change
  const layoutAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    // pulse layout slightly on size change
    Animated.sequence([
      Animated.timing(layoutAnim, { toValue: 0.985, duration: 120, useNativeDriver: true }),
      Animated.timing(layoutAnim, { toValue: 1.0, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [SCREEN_W, SCREEN_H, layoutAnim]);

  const [pLoaded] = usePacifico({ Pacifico_400Regular });
  const [lLoaded] = useLato({ Lato_400Regular, Lato_700Bold, Lato_900Black });
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

  // ===== Hidden admin-tap logic (5 taps) =====
  const tapCounter = useRef(0);
  const tapTimeout = useRef(null);

  const handleSecretTap = () => {
    // increment
    tapCounter.current = (tapCounter.current || 0) + 1;

    // if reached 5 taps -> navigate to AdminScreen (changed)
    if (tapCounter.current >= 5) {
      tapCounter.current = 0;
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
      }
      navigation.navigate("AdminScreen"); // <-- updated target
      return;
    }

    // reset if no further taps within 1.5s
    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    tapTimeout.current = setTimeout(() => {
      tapCounter.current = 0;
      tapTimeout.current = null;
    }, 1500);
  };
  // ============================================

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
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
      {/* Invisible admin circle in top-right (does NOT affect layout) */}
      <TouchableOpacity
        onPress={handleSecretTap}
        activeOpacity={1}
        style={[
          styles.hiddenButton,
          // position it just below the safe area so it won't overlap status bar icons
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
          {/* ZoomImage will render top area; pass props if needed */}
          <ZoomImage topPercent={0.45} zoom={2} />

          <View style={styles.content}>
            <Text style={styles.subtitle}>"Unlocking knowledge, shaping the future"</Text>

            <Text style={styles.trimexLine}>Trimex Learning Experience...</Text>
            <Text style={styles.worthIt}>Worth It</Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                buttonDisabled && styles.buttonDisabled,
                pressed && !buttonDisabled ? styles.buttonPressed : null,
              ]}
              onPress={handleGetStarted}
              disabled={buttonDisabled}
            >
              {isAnimating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Get Started</Text>
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
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 0 },

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
    paddingHorizontal: 26,
    paddingTop: 6,
    paddingBottom: 28,
    alignItems: "center",
    marginTop: 8,
  },

  trimexLine: {
    fontSize: 20,
    color: "#FF423D",
    fontFamily: "Pacifico_400Regular",
    lineHeight: 30,
    marginBottom: 2,
    marginTop: 8,
    textAlign: "center",
  },

  worthIt: {
    fontSize: 42,
    color: "#FF423D",
    fontFamily: "Pacifico_400Regular",
    lineHeight: 60,
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#7a7a7a",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
    fontFamily: "Lato_400Regular",
    textDecorationLine: "underline",
    textDecorationColor: "rgba(120,120,120,0.35)",
  },

  button: {
    backgroundColor: "#0b1113",
    paddingVertical: 25,
    paddingHorizontal: 100,
    borderRadius: 50,
    minWidth: 160,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    fontFamily: "Lato_900Black",
  },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  // invisible circle for admin taps (doesn't change layout)
  hiddenButton: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 9999,
    // backgroundColor: 'rgba(255,0,0,0.15)', // uncomment when debugging
  },
});
