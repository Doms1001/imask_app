// frontend/src/screens/welcomingdept.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";

const SAFE_BG = "#f4f4f6";
const BOX = 80;

export default function WelcomingDept({ navigation, route }) {
  const { name } = route?.params ?? {};
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // responsive helpers
  const BASE_W = 390;
  const BASE_H = 844;
  const scale = SCREEN_W / BASE_W;
  const vScale = SCREEN_H / BASE_H;
  const normalize = (size) => size * scale;
  const vNormalize = (size) => size * vScale;
  const isSmallHeight = SCREEN_H < 700;
  const isTablet = SCREEN_W > 600;

  // main entrance animation
  const animOpacity = useRef(new Animated.Value(0)).current;
  const animTranslateX = useRef(new Animated.Value(60)).current;

  // background blobs
  const blobA = useRef(new Animated.Value(0)).current;
  const blobB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // card slide-in
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

    // soft looping blob animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobA, { toValue: 1, duration: 7500, useNativeDriver: true }),
        Animated.timing(blobA, { toValue: 0, duration: 7500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobB, { toValue: 1, duration: 9000, useNativeDriver: true }),
        Animated.timing(blobB, { toValue: 0, duration: 9000, useNativeDriver: true }),
      ])
    ).start();
  }, [animOpacity, animTranslateX, blobA, blobB]);

  const handleProceed = () => {
    setTimeout(() => {
      navigation.navigate("Departments");
    }, 200);
  };

  // blob transforms
  const blobSize = Math.max(SCREEN_W * 0.9, 320);

  const blobATransX = blobA.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 18],
  });
  const blobATransY = blobA.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 14],
  });
  const blobAScale = blobA.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.1],
  });

  const blobBTransX = blobB.interpolate({
    inputRange: [0, 1],
    outputRange: [32, -20],
  });
  const blobBTransY = blobB.interpolate({
    inputRange: [0, 1],
    outputRange: [22, -12],
  });
  const blobBScale = blobB.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 0.9],
  });

  return (
    <View style={styles.safe}>
      {/* white background */}
      <View style={styles.whiteLayer} />

      {/* soft orange/red blob (top-left) */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: blobSize,
            height: blobSize,
            top: -blobSize * 0.35,
            left: -blobSize * 0.25,
            backgroundColor: "#ff6b3b",
            transform: [
              { translateX: blobATransX },
              { translateY: blobATransY },
              { scale: blobAScale },
            ],
            opacity: 0.22,
          },
        ]}
      />

      {/* dark blob (bottom-right) */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: blobSize * 1.05,
            height: blobSize * 1.05,
            bottom: -blobSize * 0.45,
            right: -blobSize * 0.3,
            backgroundColor: "#111",
            transform: [
              { translateX: blobBTransX },
              { translateY: blobBTransY },
              { scale: blobBScale },
            ],
            opacity: 0.18,
          },
        ]}
      />

      {/* main card */}
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
        {/* corner decorations (like FillupScreen style) */}
        <View
          style={[
            styles.cornerBlockDark,
            {
              top: vNormalize(80),
              left: -normalize(22),
              width: normalize(BOX),
              height: normalize(BOX),
            },
          ]}
        />
        <View
          style={[
            styles.cornerBlockRed,
            {
              top: vNormalize(40),
              left: normalize(18),
              width: normalize(BOX - 6),
              height: normalize(BOX - 6),
            },
          ]}
        />
        <View
          style={[
            styles.cornerArcTop,
            {
              width: normalize(BOX),
              height: normalize(BOX),
            },
          ]}
        />

        {/* content */}
        <View
          style={[
            styles.content,
            {
              width: "85%",
              marginTop: vNormalize(isSmallHeight ? 90 : 110),
            },
          ]}
        >
          <Text
            style={[
              styles.header,
              {
                fontSize: normalize(isTablet ? 32 : 28),
                marginBottom: vNormalize(10),
              },
            ]}
          >
            Hello there{name ? `, ${name}` : "!"}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                fontSize: normalize(15),
                lineHeight: vNormalize(22),
              },
            ]}
          >
            Please choose a{"\n"}Department for your desired course
          </Text>
        </View>

        {/* center art on the right side */}
        <View style={styles.centerArtWrap}>
          <View
            style={[
              styles.centerBlack,
              {
                width: normalize(120),
                height: normalize(120),
                right: normalize(80),
                bottom: vNormalize(26),
              },
            ]}
          />
          <View
            style={[
              styles.centerRed,
              {
                width: normalize(64),
                height: normalize(64),
                right: normalize(24),
                bottom: vNormalize(28),
              },
            ]}
          />
        </View>

        {/* proceed button */}
        <TouchableOpacity
          style={[
            styles.proceedBtn,
            {
              bottom: vNormalize(70),
              width: "78%",
              height: vNormalize(64),
              borderRadius: vNormalize(28),
            },
          ]}
          onPress={handleProceed}
          activeOpacity={0.88}
        >
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>

        {/* bottom corner accents */}
        <View
          style={[
            styles.bottomRightBlack,
            {
              bottom: vNormalize(32),
              right: 1,
              width: normalize(BOX - 1),
              height: normalize(BOX - 1),
            },
          ]}
        />
        <View
          style={[
            styles.bottomRightRed,
            {
              bottom: vNormalize(60),
              right: normalize(30),
              width: normalize(BOX - 1),
              height: normalize(BOX - 1),
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: SAFE_BG },
  whiteLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
  },
  card: {
    backgroundColor: "transparent",
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 1,
  },

  // blobs
  blob: {
    position: "absolute",
    borderRadius: 9999,
  },

  // corner decorations
  cornerBlockDark: {
    position: "absolute",
    backgroundColor: "#111",
    zIndex: 1,
  },
  cornerBlockRed: {
    position: "absolute",
    backgroundColor: "#ff4d4d",
    zIndex: 2,
  },
  cornerArcTop: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#ff423d",
    borderBottomLeftRadius: BOX,
    zIndex: 1,
  },

  bottomRightBlack: {
    position: "absolute",
    backgroundColor: "#000",
    zIndex: 1,
  },
  bottomRightRed: {
    position: "absolute",
    backgroundColor: "#ff4d4d",
    zIndex: 2,
  },

  // text content
  content: {
    alignItems: "flex-start",
  },
  header: {
    color: "#FF423D",
    fontFamily: "Pacifico_400Regular", // uses your loaded font
  },
  subtitle: {
    color: "#111",
  },

  // center art
  centerArtWrap: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: "flex-end",
    paddingRight: 24,
  },
  centerBlack: {
    backgroundColor: "#000",
    transform: [{ rotate: "-25deg" }],
    position: "absolute",
    zIndex: 1,
  },
  centerRed: {
    backgroundColor: "#ff5959",
    position: "absolute",
    zIndex: 2,
  },

  // button
  proceedBtn: {
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "#161b1d",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 6,
  },
  proceedText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
