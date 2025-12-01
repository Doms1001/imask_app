// frontend/src/screens/CCJ/CCJF9.js
// CCJ – FAQ screen (static content, dark theme, same layout as CCSF9)

import React, { useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Animated,
  Platform,
  Text,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");

export default function CCJF9({ navigation }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(-1)).current;
  const entranceRef = useRef(null);
  const shimmerLoopRef = useRef(null);

  useEffect(() => {
    entranceRef.current = Animated.timing(entrance, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });
    entranceRef.current.start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: -1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerLoopRef.current = loop;
    loop.start();

    return () => {
      entranceRef.current &&
        entranceRef.current.stop &&
        entranceRef.current.stop();
      shimmerLoopRef.current &&
        shimmerLoopRef.current.stop &&
        shimmerLoopRef.current.stop();
    };
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  const cardScale = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.996, 1],
  });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "light-content"}
      />

      {/* CCJ dark background */}
      <LinearGradient colors={["#111111", "#050505"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* BACK BUTTON → CCJF4 */}
      <TouchableWithoutFeedback onPress={() => navSafe("CCJF4")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <View style={s.contentWrap}>
        <Animated.View
          style={[m.cardWrapper, { transform: [{ scale: cardScale }] }]}
        >
          <LinearGradient
            colors={["#3b3b3b", "#141414"]}
            start={[0, 0]}
            end={[1, 1]}
            style={m.bigCard}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              m.gloss,
              {
                transform: [{ rotate: "22deg" }, { translateX: shimmerTranslate }],
                opacity: shimmer.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [0.14, 0.26],
                }),
              },
            ]}
          />

          {/* Inner scrollable FAQ content */}
          <View style={m.innerContent}>
            <ScrollView
              contentContainerStyle={m.scrollInner}
              showsVerticalScrollIndicator={false}
            >
              <View style={m.faqCard}>
                <Text style={m.faqTitle}>Frequently Asked Questions</Text>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: What are the admission requirements?</Text>
                  <Text style={m.a}>
                    Application form, Form 138 (report card), PSA Birth Certificate,
                    2x2 ID photos, and Certificate of Good Moral Character.
                  </Text>
                  <View style={m.highlight}>
                    <Text style={m.highlightText}>
                      Tip: Submit Form 138 (report card) and valid IDs.
                    </Text>
                  </View>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Is there an entrance exam?</Text>
                  <Text style={m.a}>
                    No. Trimex Colleges does not require an entrance exam.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: How long do the programs take?</Text>
                  <Text style={m.a}>
                    • College Program: 4 years (avg){"\n"}
                    • Senior High School: 2 years{"\n"}
                    • TESDA Programs: 1–2 years
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Do graduates receive certificates?</Text>
                  <Text style={m.a}>
                    Yes. Graduates receive diplomas, and TESDA certificates if applicable.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Can I transfer from another school?</Text>
                  <Text style={m.a}>
                    Yes — subject to evaluation and document requirements.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: How much is the downpayment?</Text>
                  <Text style={m.a}>Downpayment is ₱2,000 during registration.</Text>
                  <View style={m.highlight}>
                    <Text style={m.highlightText}>
                      Must be paid to secure your slot.
                    </Text>
                  </View>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: When must the downpayment be paid?</Text>
                  <Text style={m.a}>
                    During or before registration. Late payments may delay enrollment.
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#2f2f2f",
    opacity: 0.32,
  },

  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#444444",
    opacity: 0.55,
  },

  back: {
    position: "absolute",
    right: 14,
    top: Platform.OS === "android" ? 18 : 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },

  backImg: { width: 34, height: 34, tintColor: "#ffffff" },

  // ⬇️ Stretch card area between top & bottom of SafeAreaView
  contentWrap: {
    flex: 1,
    width: Math.min(420, width - 32),
    alignItems: "center",
    justifyContent: "center",
  },
});

const m = StyleSheet.create({
  // ⬇️ Fill available vertical space inside contentWrap
  cardWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 14 },
    shadowRadius: 30,
    elevation: 12,
  },

  bigCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },

  gloss: {
    position: "absolute",
    top: -60,
    left: -40,
    width: 180,
    height: 360,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  innerContent: { width: "92%", marginTop: 18, paddingBottom: 18 },
  scrollInner: { paddingBottom: 24 },

  faqCard: {
    backgroundColor: "rgba(10,10,10,0.96)",
    borderRadius: 10,
    padding: 12,
  },

  faqTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#ffffff",
  },

  qBlock: { marginBottom: 12 },

  // ⬇️ Question chip: light-on-dark to match CCJ theme
  q: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f5f5f5",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },

  // ⬇️ Answers: bright gray for readability
  a: {
    fontSize: 13,
    color: "#f5f5f5",
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 6,
  },

  // ⬇️ Highlight: subtle block but still visible on dark
  highlight: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 8,
    borderRadius: 6,
  },

  highlightText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f5f5f5",
  },
});
