// frontend/src/screens/COE/COEF9.js
// COEF9 – FAQ screen (static content, COE orange/black theme, based on CCSF9)

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

export default function COEF9({ navigation }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

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

    loop.start();
    return () => loop.stop();
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
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
      />

      {/* COE background – white → orange fade */}
      <LinearGradient colors={["#ffffff", "#fff3e2"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* BACK BUTTON → COEF4 */}
      <TouchableWithoutFeedback onPress={() => navSafe("COEF4")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <View style={s.contentWrap}>
        <Animated.View
          style={[m.cardWrapper, { transform: [{ scale: cardScale }] }]}
        >
          {/* Big orange gradient card */}
          <LinearGradient
            colors={["#FF8A65", "#FFCC80"]}
            start={[0, 0]}
            end={[1, 1]}
            style={m.bigCard}
          />

          {/* Gloss animation */}
          <Animated.View
            pointerEvents="none"
            style={[
              m.gloss,
              {
                transform: [
                  { rotate: "22deg" },
                  { translateX: shimmerTranslate },
                ],
                opacity: shimmer.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [0.14, 0.26],
                }),
              },
            ]}
          />

          {/* FAQ Content */}
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
                    Application form, Form 138, PSA Birth Certificate, 2x2 ID photos,
                    and Certificate of Good Moral Character.
                  </Text>
                  <View style={m.highlight}>
                    <Text style={m.highlightText}>
                      Tip: Prepare your Form 138 and valid IDs early.
                    </Text>
                  </View>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Is there an entrance exam?</Text>
                  <Text style={m.a}>No entrance exam required.</Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: How long do the programs take?</Text>
                  <Text style={m.a}>
                    • College Program: 4 years{"\n"}
                    • Senior High School: 2 years{"\n"}
                    • TESDA Programs: 1–2 years
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Do graduates receive certificates?</Text>
                  <Text style={m.a}>
                    Yes, graduates get diplomas and TESDA certificates (if applicable).
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Can I transfer from another school?</Text>
                  <Text style={m.a}>
                    Yes — transferees are accepted based on evaluation.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: How much is the down payment?</Text>
                  <Text style={m.a}>₱2,000 during registration.</Text>
                  <View style={m.highlight}>
                    <Text style={m.highlightText}>Helps secure your slot.</Text>
                  </View>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: When should the down payment be paid?</Text>
                  <Text style={m.a}>
                    Before or during enrollment. Late payment may delay processing.
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

/* ======================
   LAYOUT + STYLE FIXES
======================= */
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#212121",
    opacity: 0.32,
  },

  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#FB8C00",
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
    zIndex: 30,
  },

  backImg: { width: 34, height: 34, tintColor: "#fff" },

  /* 🔥 FIXED — card fills entire safe area */
  contentWrap: {
    flex: 1,
    width: Math.min(420, width - 32),
    alignItems: "center",
    justifyContent: "center",
  },
});

/* CARD + FAQ */
const m = StyleSheet.create({
  /* 🔥 FIXED — make full height */
  cardWrapper: {
    flex: 1,
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#FF8A65",
    shadowOpacity: 0.16,
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
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  innerContent: {
    width: "92%",
    marginTop: 18,
    paddingBottom: 18,
  },

  scrollInner: {
    paddingBottom: 24,
  },

  faqCard: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 10,
    padding: 12,
  },

  faqTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 10,
  },

  qBlock: { marginBottom: 12 },

  q: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },

  /* 🔥 FIXED — white text removed; black is readable */
  a: {
    fontSize: 13,
    color: "#222",
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 6,
  },

  highlight: {
    marginTop: 8,
    backgroundColor: "#FFEFD5",
    padding: 8,
    borderRadius: 6,
  },

  highlightText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
});
