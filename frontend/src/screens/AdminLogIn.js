// frontend/src/screens/AdminLogIn.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../services/supabaseClient";

const SAFE_BG = "#f4f4f6";

export default function AdminLogIn({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // base responsive helpers
  const BASE_W = 390;
  const BASE_H = 844;
  const scale = SCREEN_W / BASE_W;
  const vScale = SCREEN_H / BASE_H;
  const normalize = (size) => size * scale;
  const vNormalize = (size) => size * vScale;
  const isSmallHeight = SCREEN_H < 700;
  const isTablet = SCREEN_W > 600;

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // animations
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(30)).current;
  const blobTop = useRef(new Animated.Value(0)).current;
  const blobBottom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // background blobs float
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobTop, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(blobTop, {
          toValue: 0,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobBottom, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(blobBottom, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [cardOpacity, cardTranslateY, blobTop, blobBottom]);

  const blobSize = Math.max(SCREEN_W * 0.9, 320);

  const blobTopTransX = blobTop.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 20],
  });
  const blobTopTransY = blobTop.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });
  const blobTopScale = blobTop.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.08],
  });

  const blobBottomTransX = blobBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -20],
  });
  const blobBottomTransY = blobBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [18, -12],
  });
  const blobBottomScale = blobBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 0.9],
  });

  // ==========================
  // Supabase Admin Login
  // ==========================
  const handleLogin = async () => {
    if (loading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      Alert.alert("Missing info", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        console.log("Supabase login error:", error);
        Alert.alert("Login failed", "Invalid email or password.");
        return;
      }

      const user = data?.user;
      // Supabase exposes custom metadata on user.app_metadata
      const role =
        user?.app_metadata?.role ||
        user?.raw_app_meta_data?.role || // safety fallback
        null;

      if (role !== "admin") {
        Alert.alert(
          "Access denied",
          "This account is not authorized as an admin."
        );
        // Optional: sign out non-admin just in case
        await supabase.auth.signOut();
        return;
      }

      // ✅ Admin OK → go to your admin panel screen
      navigation.navigate("AdminScreen");
    } catch (err) {
      console.error("Unexpected login error:", err);
      Alert.alert("Login error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToUser = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
        {/* White base */}
        <View style={styles.whiteLayer} />

        {/* top orange/red blob */}
        <Animated.View
          style={[
            styles.blob,
            {
              width: blobSize,
              height: blobSize,
              top: -blobSize * 0.35,
              left: -blobSize * 0.25,
              backgroundColor: "#ff6b3b",
              opacity: 0.24,
              transform: [
                { translateX: blobTopTransX },
                { translateY: blobTopTransY },
                { scale: blobTopScale },
              ],
            },
          ]}
        />

        {/* bottom dark blob */}
        <Animated.View
          style={[
            styles.blob,
            {
              width: blobSize * 1.1,
              height: blobSize * 1.1,
              bottom: -blobSize * 0.45,
              right: -blobSize * 0.3,
              backgroundColor: "#111",
              opacity: 0.2,
              transform: [
                { translateX: blobBottomTransX },
                { translateY: blobBottomTransY },
                { scale: blobBottomScale },
              ],
            },
          ]}
        />

        {/* subtle top bar */}
        <View
          style={[
            styles.topBar,
            {
              width: SCREEN_W * 0.55,
              height: vNormalize(4),
              marginTop: vNormalize(10),
            },
          ]}
        />

        {/* content */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
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
                width: SCREEN_W * (isTablet ? 0.65 : 0.9),
                paddingHorizontal: normalize(isTablet ? 26 : 20),
                paddingVertical: vNormalize(isSmallHeight ? 18 : 22),
                opacity: cardOpacity,
                transform: [{ translateY: cardTranslateY }],
              },
            ]}
          >
            {/* top badge */}
            <View style={styles.badgeRow}>
              <View className={styles.badgeDot} />
              <View style={styles.badgeDot} />
              <Text
                style={[
                  styles.badgeText,
                  { fontSize: normalize(11) },
                ]}
              >
                ADMIN ACCESS ONLY
              </Text>
            </View>

            {/* title */}
            <Text
              style={[
                styles.title,
                {
                  fontSize: normalize(isTablet ? 24 : 21),
                  marginTop: vNormalize(6),
                },
              ]}
            >
              Admin Log In
            </Text>
            <Text
              style={[
                styles.subtitle,
                {
                  fontSize: normalize(12),
                  marginTop: vNormalize(4),
                },
              ]}
            >
              Secure panel for administrators. Use your authorized Trimex admin
              account to continue.
            </Text>

            {/* fields */}
            <View style={{ marginTop: vNormalize(18) }}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    height: vNormalize(44),
                    marginTop: vNormalize(6),
                    paddingHorizontal: normalize(12),
                  },
                ]}
                placeholder="admin@trimex.edu"
                placeholderTextColor="rgba(0,0,0,0.32)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text
                style={[
                  styles.label,
                  { marginTop: vNormalize(14) },
                ]}
              >
                Password
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    height: vNormalize(44),
                    marginTop: vNormalize(6),
                    paddingHorizontal: normalize(12),
                  },
                ]}
                placeholder="Enter admin password"
                placeholderTextColor="rgba(0,0,0,0.32)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* login button */}
            <TouchableOpacity
              style={[
                styles.loginBtn,
                {
                  marginTop: vNormalize(isSmallHeight ? 22 : 28),
                  paddingVertical: vNormalize(13),
                  borderRadius: vNormalize(999),
                  opacity: loading ? 0.8 : 1,
                },
              ]}
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginText}>
                {loading ? "Checking..." : "Log In"}
              </Text>
            </TouchableOpacity>

            {/* back to user mode */}
            <TouchableOpacity
              style={{ marginTop: vNormalize(14), alignSelf: "center" }}
              onPress={handleBackToUser}
            >
              <Text style={styles.backText}>Back to user mode</Text>
            </TouchableOpacity>
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
  },
  topBar: {
    alignSelf: "center",
    borderRadius: 999,
    backgroundColor: "#ff423d",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ff423d",
    marginRight: 6,
  },
  badgeText: {
    color: "#ff423d",
    fontWeight: "700",
    letterSpacing: 1,
  },
  title: {
    color: "#111",
    fontWeight: "800",
  },
  subtitle: {
    color: "#555",
    fontWeight: "500",
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
  loginBtn: {
    backgroundColor: "#111318",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  backText: {
    color: "#ff423d",
    fontWeight: "600",
    fontSize: 13,
    textDecorationLine: "underline",
  },
});
