import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FillupScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);

  // fade + slide-in animation
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

  const validate = () => {
    if (!name.trim()) return Alert.alert("Validation", "Please enter your name.");
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
      return Alert.alert("Validation", "Please enter a valid email address.");
    if (!gender.trim()) return Alert.alert("Validation", "Please enter your gender.");
    return true;
  };

  const onProceed = () => {
    if (saving) return;
    if (!validate()) return;

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Success", "Your information has been saved (local).");
      navigation.popToTop();
      setName("");
      setEmail("");
      setGender("");
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safe}>
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
            {/* 🎨 Decorations */}
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
            </View>

            <View style={styles.bottomRightBlack} />
            <View style={styles.bottomRightRed} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// === Styles ===
const BOX = 80;
const SAFE_BG = "#f2f2f4";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SAFE_BG },
  flex: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // full-screen white area
  card: {
    backgroundColor: "#fff",
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "transparent",
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
  // form
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
});
