// frontend/src/screens/Departments.js
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
  useWindowDimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Easing } from "react-native";

import COAlogo from "../../assets/COAlogo.png";
import CCSlogo from "../../assets/CCSlogo.png";
import CBAlogo from "../../assets/CBAlogo.png";
import CCJlogo from "../../assets/CCJlogo.png";
import COElogo from "../../assets/COElogo.png";
import CASlogo from "../../assets/CASlogo.png";

const DEPARTMENTS = [
  {
    key: "COA",
    title: "College of Accountancy",
    logo: COAlogo,
    stripColors: ["#FFE57F", "#FFC107", "#FFB300"], // yellow gradient
    glowColor: "rgba(255, 214, 0, 0.6)",
  },
  {
    key: "CCS",
    title: "College of Computer Studies",
    logo: CCSlogo,
    stripColors: ["#FF3B3B", "#FF8A2B", "#FFFFFF"], // red → orange → white
    glowColor: "rgba(255, 82, 82, 0.55)",
  },
  {
    key: "CBA",
    title: "College of Business Administration",
    logo: CBAlogo,
    stripColors: ["#FFD700", "#FFC107", "#B8860B"], // golds
    glowColor: "rgba(255, 215, 0, 0.6)",
  },
  {
    key: "CCJ",
    title: "College of Criminal Justice",
    logo: CCJlogo,
    stripColors: ["#000000", "#424242", "#9E9E9E"], // black & gray
    glowColor: "rgba(33, 33, 33, 0.55)",
  },
  {
    key: "COE",
    title: "College of Engineering",
    logo: COElogo,
    stripColors: ["#FF8A2B", "#FFFFFF", "#000000"], // orange, white, black
    glowColor: "rgba(255, 138, 43, 0.6)",
  },
  {
    key: "CAS",
    title: "College of Arts & Science",
    logo: CASlogo,
    stripColors: ["#8E24AA", "#CE93D8", "#FFFFFF"], // violet & white
    glowColor: "rgba(142, 36, 170, 0.6)",
  },
];

export default function Departments({ navigation }) {
  const { width, height } = useWindowDimensions();

  // responsive helpers
  const BASE_W = 390;
  const BASE_H = 844;
  const scale = width / BASE_W;
  const vScale = height / BASE_H;
  const normalize = (size) => size * scale;
  const vNormalize = (size) => size * vScale;
  const isTablet = width > 600;

  const CARD_W = Math.min(width * 0.92, 880);
  const CARD_H = vNormalize(112);

  // animations
  const cardAnims = useRef(DEPARTMENTS.map(() => new Animated.Value(0))).current;
  const waveTop = useRef(new Animated.Value(0)).current;
  const waveBottom = useRef(new Animated.Value(0)).current;
  const diamond = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef(0);

  useEffect(() => {
    // staggered cards
    const anims = cardAnims.map((a, i) =>
      Animated.timing(a, {
        toValue: 1,
        duration: 450,
        delay: i * 90,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );
    Animated.stagger(70, anims).start();

    // flowing top wave
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveTop, {
          toValue: 1,
          duration: 8500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(waveTop, {
          toValue: 0,
          duration: 8500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // flowing bottom wave
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveBottom, {
          toValue: 1,
          duration: 9500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(waveBottom, {
          toValue: 0,
          duration: 9500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // floating diamond
    Animated.loop(
      Animated.sequence([
        Animated.timing(diamond, {
          toValue: 1,
          duration: 6500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(diamond, {
          toValue: 0,
          duration: 6500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [cardAnims, waveTop, waveBottom, diamond]);

  const routeMap = {
    COA: "COAF1",
    CCS: "CCSF1",
    CBA: "CBAF1",
    CCJ: "CCJF1",
    COE: "COEF1",
    CAS: "CASF1",
  };

  const handleSelect = (deptKey) => {
    const now = Date.now();
    if (now - lastTapRef.current < 420) return;
    lastTapRef.current = now;

    const routeName = routeMap[deptKey];
    if (routeName) navigation.navigate(routeName);
  };

  const renderItem = ({ item, index }) => {
    const a = cardAnims[index] || new Animated.Value(1);
    const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [28, 0] });
    const opacity = a;
    const scaleCard = a.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] });

    return (
      <Animated.View
        key={item.key}
        style={[
          styles.cardWrap,
          {
            width: CARD_W,
            opacity,
            transform: [{ translateY }, { scale: scaleCard }],
          },
        ]}
      >
        <Pressable
          onPress={() => handleSelect(item.key)}
          android_ripple={{ color: "rgba(0,0,0,0.05)" }}
          style={({ pressed }) => [
            styles.card,
            {
              height: CARD_H,
              borderRadius: normalize(18),
            },
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.96 },
          ]}
        >
          {/* left logo strip with department-specific gradient */}
          <View style={styles.leftStripWrap}>
            <LinearGradient
              colors={item.stripColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.leftStrip}
            />
            <View
              style={[
                styles.leftStripGlow,
                { backgroundColor: item.glowColor },
              ]}
            />
            {/* ORIGINAL LOGO COLORS (no tint) */}
            <Image
              source={item.logo}
              resizeMode="contain"
              style={{
                width: normalize(50),
                height: normalize(50),
              }}
            />
          </View>

          {/* Main text */}
          <View style={styles.cardContent}>
            <Text
              style={[
                styles.title,
                {
                  fontSize: normalize(isTablet ? 17 : 15),
                },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text style={styles.metaText}>
              Tap to view its programs and courses
            </Text>
          </View>

          {/* Chevron */}
          <View style={styles.chevWrap}>
            <View style={styles.chevPill}>
              <Text style={styles.chevText}>›</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  // top wave animation
  const waveTopTranslateX = waveTop.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.2, width * 0.2],
  });
  const waveTopScaleY = waveTop.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  // bottom wave animation
  const waveBottomTranslateX = waveBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [width * 0.15, -width * 0.15],
  });
  const waveBottomScaleY = waveBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 0.95],
  });

  // diamond animation
  const diamondTranslateY = diamond.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 14],
  });
  const diamondScale = diamond.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.08],
  });
  const diamondRotate = diamond.interpolate({
    inputRange: [0, 1],
    outputRange: ["-22deg", "-10deg"],
  });

  return (
    <View style={styles.root}>
      {/* base white */}
      <View style={styles.whiteBg} />

      {/* Top colored wave */}
      <Animated.View
        style={[
          styles.wave,
          styles.waveTop,
          {
            width: width * 1.5,
            height: height * 0.28,
            transform: [
              { translateX: waveTopTranslateX },
              { scaleY: waveTopScaleY },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255,66,61,0.8)", "rgba(255,138,43,0.45)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Bottom dark wave */}
      <Animated.View
        style={[
          styles.wave,
          styles.waveBottom,
          {
            width: width * 1.7,
            height: height * 0.34,
            transform: [
              { translateX: waveBottomTranslateX },
              { scaleY: waveBottomScaleY },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(255,66,61,0.25)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Floating diamond accent */}
      <Animated.View
        style={[
          styles.diamond,
          {
            width: normalize(80),
            height: normalize(80),
            right: width * 0.12,
            top: height * 0.15,
            transform: [
              { translateY: diamondTranslateY },
              { scale: diamondScale },
              { rotate: diamondRotate },
            ],
          },
        ]}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            width: CARD_W,
            marginTop: vNormalize(45),
            marginBottom: vNormalize(16),
          },
        ]}
      >
        <Text
          style={[
            styles.headerMain,
            {
              fontSize: normalize(isTablet ? 32 : 50),
            },
          ]}
        >
          Explore Departments
        </Text>
        <Text
          style={[
            styles.headerAccent,
            {
              fontSize: normalize(isTablet ? 18 : 16),
            },
          ]}
        >
          Pick a college to see what’s waiting for you.
        </Text>
      </View>

      {/* Departments list */}
      <FlatList
        data={DEPARTMENTS}
        renderItem={renderItem}
        keyExtractor={(i) => i.key}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom: vNormalize(52),
          },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  whiteBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
  },

  wave: {
    position: "absolute",
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 160,
    overflow: "hidden",
  },
  waveTop: {
    top: -60,
    left: -40,
  },
  waveBottom: {
    bottom: -80,
    right: -40,
    transform: [{ rotate: "180deg" }],
  },

  diamond: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },

  header: {},
  headerMain: {
    color: "#ff0000ff",
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  headerAccent: {
    color: "#000000ff",
    fontWeight: "600",
    marginTop: 4,
  },

  list: {
    alignItems: "center",
    width: "100%",
    paddingTop: 8,
  },

  cardWrap: {
    marginVertical: 6,
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 9 },
    elevation: 6,
    overflow: "hidden",
  },

  leftStripWrap: {
    width: 120,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  leftStrip: {
    ...StyleSheet.absoluteFillObject,
  },
  leftStripGlow: {
    position: "absolute",
    width: "150%",
    height: 40,
    borderRadius: 999,
    transform: [{ rotate: "-20deg" }],
    top: 6,
    left: -28,
  },

  cardContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  title: {
    color: "#111",
    fontWeight: "700",
  },
  metaText: {
    marginTop: 4,
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },

  chevWrap: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  chevPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  chevText: {
    color: "#444",
    fontSize: 26,
    transform: [{ translateX: 1 }],
  },
});
