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
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export default function FillupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const messageOpacity = useRef(new Animated.Value(0)).current;
  const messageTranslateY = useRef(new Animated.Value(10)).current;

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

  // ✨ fade + slide toast animation
  const showMessage = (text, type = "success", duration = 3000) => {
    setMessageType(type);
    setMessage(text);

    Animated.parallel([
      Animated.timing(messageOpacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(messageTranslateY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(messageOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(messageTranslateY, {
          toValue: -10,
          duration: 300,
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
  try {
    const { data, error } = await supabase
      .from("users") // or "submissions"
      .insert([{ name: name.trim(), email: email.trim(), gender: gender.trim() }])
      .select();

    if (error) throw error;

    // show toast / message
    showMessage("Information saved successfully!", "success");

    // clear fields (optional)
    setName("");
    setEmail("");
    setGender("");

    // wait so toast is visible, then navigate
    setTimeout(() => {
      navigation.navigate("welcomingdept"); // <--- exact line to go to welcomingdept
    }, 700);
  } catch (e) {
    console.error("Supabase insert error:", e);
    showMessage("Failed to save. Please try again.", "error");
  } finally {
    setSaving(false);
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { minHeight: SCREEN_H - insets.top - insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
      >
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
          {/* Decorations */}
          <View style={styles.topLeftBlack} />
          <View style={styles.topLeftRed} />
          <View style={styles.topRightCircle} />

          <View style={styles.form}>
            <Text style={styles.header}>Fill Up Form</Text>

            <Text style={styles.label}>Name:</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              style={styles.input}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Gender:</Text>
            <TextInput
              value={gender}
              onChangeText={setGender}
              placeholder="Male / Female / Other"
              style={[styles.input, styles.genderInput]}
            />

            <TouchableOpacity
              style={[styles.proceedBtn, saving && { opacity: 0.8 }]}
              onPress={onProceed}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.proceedText}>Proceed</Text>
              )}
            </TouchableOpacity>

            {/* Animated toast message */}
            {message ? (
              <Animated.View
                style={{
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
          </View>

          <View style={styles.bottomRightBlack} />
          <View style={styles.bottomRightRed} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// === Styles ===
const BOX = 80;
const SAFE_BG = "#f2f2f4";

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: SAFE_BG },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 1,
  },
  // Decorations
  topLeftBlack: {
    position: "absolute",
    top: 80,
    left: -20,
    width: BOX - 1,
    height: BOX - 1,
    backgroundColor: "#000",
  },
  topLeftRed: {
    position: "absolute",
    top: 30,
    left: 20,
    width: BOX,
    height: BOX,
    backgroundColor: "#ff4d4d",
  },
  topRightCircle: {
    position: "absolute",
    top: 0,
    right: 0,
    width: BOX,
    height: BOX,
    backgroundColor: "#ff0000",
    borderBottomLeftRadius: BOX,
  },
  bottomRightBlack: {
    position: "absolute",
    bottom: 30,
    right: 1,
    width: BOX - 1,
    height: BOX - 1,
    backgroundColor: "#000",
  },
  bottomRightRed: {
    position: "absolute",
    bottom: 60,
    right: 30,
    width: BOX - 1,
    height: BOX - 1,
    backgroundColor: "#ff4d4d",
  },
  // Form
  form: {
    width: "85%",
    marginTop: 100,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#FF423D",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    marginTop: 12,
  },
  input: {
    height: 46,
    backgroundColor: "#e8e8e8",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 6,
  },
  genderInput: { width: "50%" },
  proceedBtn: {
    backgroundColor: "#0b1113",
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 190,
  },
  proceedText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  message: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  messageSuccess: { color: "#107C10" },
  messageError: { color: "#C92A2A" },
});
