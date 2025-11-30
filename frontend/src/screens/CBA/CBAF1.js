// frontend/src/screens/CBA/CBAF1.js
// CBAF1 – Intro screen for College of Business Administration (gold theme)

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const ARROW_IMG = require("../../../assets/back.png");
const CBAlogo = require("../../../assets/CBAlogo.png"); // make sure this file exists

export default function CBAF1({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  const BASE_W = 390;
  const BASE_H = 844;
  const scale = SCREEN_W / BASE_W;
  const vScale = SCREEN_H / BASE_H;
  const normalize = (size) => size * scale;
  const vNormalize = (size) => size * vScale;

  const CARD_W = Math.min(SCREEN_W * 0.9, 380);
  const CARD_H = vNormalize(220);
  const RADIUS = normalize(22);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView
      style={[
        styles.screen,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        translucent={false}
      />

      {/* Background shapes – same layout as CCSF1 but gold/brown theme */}
      <View
        style={[
          styles.topLeftCircle,
          {
            width: normalize(120),
            height: normalize(120),
            borderRadius: normalize(60),
            left: normalize(12),
            top: vNormalize(8),
          },
        ]}
      />
      <View
        style={[
          styles.topRightGoldRect,
          {
            width: normalize(100),
            height: normalize(100),
            right: normalize(-4),
            top: vNormalize(8),
            borderRadius: normalize(8),
          },
        ]}
      />
      <View
        style={[
          styles.topRightDarkRect,
          {
            width: normalize(70),
            height: normalize(70),
            right: normalize(-4),
            top: vNormalize(80),
          },
        ]}
      />

      {/* Main content – mirrored from CCSF1 */}
      <View
        style={[
          styles.content,
          {
            width: CARD_W,
            marginTop: vNormalize(110),
          },
        ]}
      >
        <View style={styles.cardWrap}>
          <View
            style={[
              styles.cardInner,
              {
                width: CARD_W,
                height: CARD_H,
                borderRadius: RADIUS,
              },
            ]}
          >
            {/* Full background logo */}
            <Image
              source={CBAlogo}
              resizeMode="cover"
              style={[
                styles.cardImage,
                {
                  borderRadius: RADIUS,
                },
              ]}
            />

            {/* Shine overlay */}
            <LinearGradient
              colors={["rgba(255,255,255,0.45)", "rgba(255,255,255,0)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.cardShine,
                {
                  borderRadius: RADIUS,
                },
              ]}
            />

            {/* Title text */}
            <View style={styles.titleWrap}>
              <Text
                style={[
                  styles.cbaText,
                  { fontSize: normalize(70) },
                ]}
              >
                C.B.A
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  { fontSize: normalize(14), marginTop: vNormalize(-8) },
                ]}
              >
                College of Business Administration
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text
          style={[
            styles.description,
            {
              fontSize: normalize(14),
              lineHeight: vNormalize(22),
              marginTop: vNormalize(22),
            },
          ]}
        >
          This track is for students who plan to pursue a business-related
          college degree. It builds a strong foundation in management,
          finance, marketing, and entrepreneurship to prepare students for
          the world of business.
        </Text>
      </View>

      {/* Bottom proceed button → CBAF2 */}
      <View
        style={[
          styles.bottomArea,
          {
            paddingBottom: vNormalize(28),
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.proceedWrapper,
            { width: Math.min(SCREEN_W * 0.88, 340) },
          ]}
          activeOpacity={0.86}
          onPress={() => navSafe("CBAF2")}
        >
          <LinearGradient
            colors={["#FFB300", "#FB8C00"]} // gold → orange
            start={[0, 0]}
            end={[1, 1]}
            style={[
              styles.proceedBtn,
              {
                paddingVertical: vNormalize(18),
                borderRadius: normalize(26),
              },
            ]}
          >
            <Text
              style={[
                styles.proceedText,
                { fontSize: normalize(18) },
              ]}
            >
              Proceed
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Back Button → Onboarding */}
      <TouchableOpacity
        style={[
          styles.backBtn,
          {
            right: normalize(12),
            top: vNormalize(10),
            width: normalize(50),
            height: normalize(50),
          },
        ]}
        onPress={() => navSafe("Onboarding")}
        activeOpacity={0.85}
      >
        <Image
          source={ARROW_IMG}
          resizeMode="contain"
          style={[
            styles.backImage,
            {
              width: normalize(40),
              height: normalize(40),
            },
          ]}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fffdf5",
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* background shapes */
  topLeftCircle: {
    position: "absolute",
    backgroundColor: "#FFD54F", // soft gold
    zIndex: 2,
  },
  topRightGoldRect: {
    position: "absolute",
    backgroundColor: "#FFC107", // stronger gold
    zIndex: 2,
  },
  topRightDarkRect: {
    position: "absolute",
    backgroundColor: "#5D4037", // dark brown
    zIndex: 1,
  },

  content: {
    alignItems: "center",
  },

  /* card */
  cardWrap: {
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  cardInner: {
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardShine: {
    position: "absolute",
    width: "160%",
    height: "70%",
    top: -20,
    left: -20,
    transform: [{ rotate: "-18deg" }],
    opacity: 0.6,
  },

  /* Title */
  titleWrap: {
    position: "absolute",
    bottom: "12%",
    alignItems: "center",
    zIndex: 20,
  },
  cbaText: {
    color: "#ffffff",
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.92)",
    fontWeight: "600",
  },

  description: {
    textAlign: "center",
    color: "#222",
    paddingHorizontal: 8,
  },

  bottomArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  proceedWrapper: {
    alignSelf: "center",
  },
  proceedBtn: {
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
    fontWeight: "700",
  },

  backBtn: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    marginTop: 45,
  },
  backImage: {
    tintColor: "#ffffff",
    opacity: 1,
  },
});
