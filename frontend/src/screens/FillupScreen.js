// frontend/src/screens/FillupScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

const SAFE_BG = "#f4f4f6";

export default function FillupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // base values for scaling
  const BASE_W = 390;
  const BASE_H = 844;
  const scale = SCREEN_W / BASE_W;
  const vScale = SCREEN_H / BASE_H;

  const normalize = (size) => size * scale;
  const vNormalize = (size) => size * vScale;
  const isSmallHeight = SCREEN_H < 700;
  const isTablet = SCREEN_W > 600;

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);

  // message / toast
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const messageTranslateY = useRef(new Animated.Value(10)).current;

  // entrance animation
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(26)).current;

  // background accent animation
  const blobA = useRef(new Animated.Value(0)).current;
  const blobB = useRef(new Animated.Value(0)).current;
  const square = useRef(new Animated.Value(0)).current;

  // button animations
  const buttonPulse = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // card entrance
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // orange/red blob
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobA, { toValue: 1, duration: 7000, useNativeDriver: true }),
        Animated.timing(blobA, { toValue: 0, duration: 7000, useNativeDriver: true }),
      ])
    ).start();

    // black/grey blob
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobB, { toValue: 1, duration: 9000, useNativeDriver: true }),
        Animated.timing(blobB, { toValue: 0, duration: 9000, useNativeDriver: true }),
      ])
    ).start();

    // floating square
    Animated.loop(
      Animated.sequence([
        Animated.timing(square, { toValue: 1, duration: 6000, useNativeDriver: true }),
        Animated.timing(square, { toValue: 0, duration: 6000, useNativeDriver: true }),
      ])
    ).start();

    // button pulse (scale + slight float)
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // shining shimmer across button
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2200,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: true,
      })
    ).start();
  }, [cardOpacity, cardTranslateY, blobA, blobB, square, buttonPulse, shimmerAnim]);

  // toast animation
  const showMessage = (text, type = "success", duration = 3000) => {
    setMessageType(type);
    setMessage(text);

    Animated.parallel([
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(messageTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(messageOpacity, {
          toValue: 0,
          duration: 280,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(messageTranslateY, {
          toValue: -10,
          duration: 280,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => setMessage(""));
    }, duration);
  };

  const validate = () => {
    if (!name.trim()) {
      showMessage("Please enter your name.", "error");
      return false;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      showMessage("Please enter a valid email address.", "error");
      return false;
    }
    if (!gender.trim()) {
      showMessage("Please enter your gender.", "error");
      return false;
    }
    return true;
  };

  const onProceed = async () => {
    if (saving) return;
    if (!validate()) return;

    setSaving(true);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedGender = gender.trim();

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([{ name: trimmedName, email: trimmedEmail, gender: trimmedGender }])
        .select();

      if (error) throw error;

      showMessage("Information saved successfully!", "success");

      setTimeout(() => {
        navigation.navigate("welcomingdept", { name: trimmedName });
      }, 700);

      setName("");
      setEmail("");
      setGender("");
    } catch (e) {
      console.error("Supabase insert error:", e);
      showMessage("Failed to save. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  // blob transforms
  const blobSize = Math.max(SCREEN_W * 0.9, 320);

  const blobATransX = blobA.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 24],
  });
  const blobATransY = blobA.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 18],
  });
  const blobAScale = blobA.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.12],
  });

  const blobBTransX = blobB.interpolate({
    inputRange: [0, 1],
    outputRange: [36, -26],
  });
  const blobBTransY = blobB.interpolate({
    inputRange: [0, 1],
    outputRange: [24, -16],
  });
  const blobBScale = blobB.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 0.88],
  });

  const squareTransY = square.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 14],
  });
  const squareScale = square.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.06],
  });

  // button transforms
  const buttonScale = buttonPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });
  const buttonTranslateY = buttonPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -2],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 40],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <View
        style={[
          styles.bg,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* White background */}
        <View style={styles.whiteLayer} />

        {/* Orange/Red blob (top-left) */}
        <Animated.View
          style={[
            styles.blob,
            {
              width: blobSize,
              height: blobSize,
              top: -blobSize * 0.35,
              left: -blobSize * 0.2,
              transform: [
                { translateX: blobATransX },
                { translateY: blobATransY },
                { scale: blobAScale },
              ],
              opacity: 0.28,
            },
          ]}
        >
          <LinearGradient
            colors={["#ff4b3a", "#ff8a2b"]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Black/grey blob (bottom-right) */}
        <Animated.View
          style={[
            styles.blob,
            {
              width: blobSize * 1.1,
              height: blobSize * 1.1,
              bottom: -blobSize * 0.5,
              right: -blobSize * 0.3,
              transform: [
                { translateX: blobBTransX },
                { translateY: blobBTransY },
                { scale: blobBScale },
              ],
              opacity: 0.2,
            },
          ]}
        >
          <LinearGradient
            colors={["#111111", "#333333"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Floating accent square */}
        <Animated.View
          style={[
            styles.square,
          {
            right: SCREEN_W * 0.18,
            top: SCREEN_H * 0.14,
            transform: [{ translateY: squareTransY }, { scale: squareScale }],
          },
        ]}
        />

        {/* Top title */}
        <View
          style={[
            styles.topHeader,
            {
              marginTop: vNormalize(16),
              paddingHorizontal: normalize(22),
            },
          ]}
        >
          <Text
            style={[
              styles.topTitle,
              {
                fontSize: normalize(isTablet ? 50 : 55),
              },
            ]}
          >
            Quick info
          </Text>
          <Text
            style={[
              styles.topSubtitle,
              {
                fontSize: normalize(20),
                marginTop: vNormalize(2),
              },
            ]}
          >
            Help us personalize your Trimex experience.
          </Text>
        </View>

        {/* Scrollable card content */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            {
              minHeight: SCREEN_H - insets.top - insets.bottom,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.card,
              {
                width: SCREEN_W * (isTablet ? 0.7 : 0.92),
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslateY }],
                paddingHorizontal: normalize(isTablet ? 26 : 20),
                paddingVertical: vNormalize(isSmallHeight ? 18 : 22),
              },
            ]}
          >
            {/* Small orange bar on top of card */}
            <View
              style={[
                styles.cardAccentBar,
                {
                  width: "34%",
                  height: vNormalize(4),
                },
              ]}
            >
              <LinearGradient
                colors={["#ff8a2b", "#ff423d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </View>

            {/* Card header row */}
            <View style={styles.headerRow}>
              <View style={styles.headerTextWrap}>
                <Text
                  style={[
                    styles.header,
                    {
                      fontSize: normalize(isTablet ? 24 : 20),
                      marginBottom: vNormalize(4),
                    },
                  ]}
                >
                  Fill up form
                </Text>
                <Text
                  style={[
                    styles.subHeader,
                    {
                      fontSize: normalize(11),
                    },
                  ]}
                >
                  Just a few basic details so we can proceed.
                </Text>
              </View>

              <View style={styles.stepPill}>
                <Text style={styles.stepPillText}>Step 1 / 2</Text>
              </View>
            </View>

            {/* Form fields */}
            <View style={{ marginTop: vNormalize(16) }}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor="rgba(0,0,0,0.35)"
                style={[
                  styles.input,
                  {
                    height: vNormalize(46),
                    marginTop: vNormalize(6),
                    paddingHorizontal: normalize(12),
                  },
                ]}
              />

              <Text
                style={[
                  styles.label,
                  {
                    marginTop: vNormalize(14),
                  },
                ]}
              >
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="rgba(0,0,0,0.35)"
                style={[
                  styles.input,
                  {
                    height: vNormalize(46),
                    marginTop: vNormalize(6),
                    paddingHorizontal: normalize(12),
                  },
                ]}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text
                style={[
                  styles.label,
                  {
                    marginTop: vNormalize(14),
                  },
                ]}
              >
                Gender
              </Text>
              <TextInput
                value={gender}
                onChangeText={setGender}
                placeholder="Male / Female / Other"
                placeholderTextColor="rgba(0,0,0,0.35)"
                style={[
                  styles.input,
                  styles.genderInput,
                  {
                    height: vNormalize(46),
                    marginTop: vNormalize(6),
                    paddingHorizontal: normalize(12),
                  },
                ]}
              />
            </View>

            {/* Animated button wrapper (pulse + float) */}
            <Animated.View
              style={{
                marginTop: vNormalize(isSmallHeight ? 26 : 34),
                transform: [{ scale: buttonScale }, { translateY: buttonTranslateY }],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.proceedBtn,
                  {
                    paddingVertical: vNormalize(14),
                    borderRadius: vNormalize(999),
                  },
                  saving && { opacity: 0.8 },
                ]}
                onPress={onProceed}
                disabled={saving}
                activeOpacity={0.9}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.proceedText}>Save & Continue</Text>
                )}

                {/* Shimmer highlight */}
                {!saving && (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      StyleSheet.absoluteFillObject,
                      {
                        opacity: 0.45,
                        transform: [{ translateX: shimmerTranslate }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(255,255,255,0)",
                        "rgba(255,255,255,0.9)",
                        "rgba(255,255,255,0)",
                      ]}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Toast message */}
            {message ? (
              <Animated.View
                style={{
                  marginTop: vNormalize(10),
                  opacity: messageOpacity,
                  transform: [{ translateY: messageTranslateY }],
                }}
              >
                <Text
                  style={[
                    styles.message,
                    messageType === "error"
                      ? styles.messageError
                      : styles.messageSuccess,
                  ]}
                >
                  {message}
                </Text>
              </Animated.View>
            ) : null}
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: SAFE_BG },
  bg: {
    flex: 1,
  },
  whiteLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
  },
  blob: {
    position: "absolute",
    borderRadius: 9999,
    overflow: "hidden",
  },
  square: {
    position: "absolute",
    width: 90,
    height: 90,
    backgroundColor: "#000000",
    opacity: 0.08,
    borderRadius: 14,
    transform: [{ rotate: "-16deg" }],
  },
  topHeader: {
    width: "100%",
  },
  topTitle: {
    fontWeight: "800",
    color: "#222",
  },
  topSubtitle: {
    color: "#555",
    fontWeight: "500",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  cardAccentBar: {
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  header: {
    color: "#111",
    fontWeight: "800",
  },
  subHeader: {
    color: "#666",
    fontWeight: "500",
  },
  stepPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,66,61,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,66,61,0.3)",
  },
  stepPillText: {
    color: "#ff423d",
    fontSize: 11,
    fontWeight: "700",
  },
  label: {
    fontSize: 13,
    color: "#222",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(0,0,0,0.035)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    color: "#000",
  },
  genderInput: {
    width: "60%",
  },
  proceedBtn: {
    backgroundColor: "#ff423d",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff423d",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    overflow: "hidden",
  },
  proceedText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  message: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
  messageSuccess: { color: "#2f9e44" },
  messageError: { color: "#d63323" },
});
