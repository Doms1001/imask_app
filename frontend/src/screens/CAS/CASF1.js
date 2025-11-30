// frontend/src/screens/CAS/CASF1.js

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
const CASlogo = require("../../../assets/CASlogo.png");

export default function CASF1({ navigation }) {
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

      {/* Background shapes (CAS violet theme) */}
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
          styles.topRightLightRect,
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

      {/* Main content */}
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
            {/* Full Background Logo (CAS) */}
            <Image
              source={CASlogo}
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

            {/* CAS Title */}
            <View style={styles.titleWrap}>
              <Text
                style={[
                  styles.casText,
                  { fontSize: normalize(70) },
                ]}
              >
                C.A.S
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  { fontSize: normalize(14), marginTop: vNormalize(-8) },
                ]}
              >
                College of Arts and Science
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
          This track is for students who plan to pursue a college degree.
          It provides a strong foundation in core subjects and includes
          specialized strands to suit various interests.
        </Text>
      </View>

      {/* Bottom proceed button (violet gradient) */}
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
          onPress={() => navigation.navigate("CASF2")}
        >
          <LinearGradient
            colors={["#7b2cbf", "#9d4edd"]}
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

      {/* Back Button (same placement as CCSF1) */}
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
        onPress={() => navigation.navigate("Onboarding")}
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
    backgroundColor: "#f4e7ff", // light violet background
    alignItems: "center",
    justifyContent: "space-between",
  },

  /* background shapes - CAS violet theme */
  topLeftCircle: {
    position: "absolute",
    backgroundColor: "#b185ff",
    zIndex: 2,
  },
  topRightLightRect: {
    position: "absolute",
    backgroundColor: "#c8a2ff",
    zIndex: 2,
  },
  topRightDarkRect: {
    position: "absolute",
    backgroundColor: "#4c1d95",
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
  casText: {
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
