// frontend/src/screens/Departments.js
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const CARD_W = Math.min(width * 0.92, 880);
const CARD_H = 118;
const RADIUS = 16;
const VERT_MARGIN = 12;

const DEPARTMENTS = [
  { key: "COA", title: "College of Accountancy" },
  { key: "CCS", title: "College of Computer Studies" },
  { key: "CBA", title: "College of Business Administration" },
  { key: "CCJ", title: "College of Criminal Justice" },
  { key: "COE", title: "College of Engineering" },
  { key: "CAS", title: "College of Arts & Science" },
];

export default function Departments({ navigation }) {
  const anim = useRef(DEPARTMENTS.map(() => new Animated.Value(0))).current;
  const blobA = useRef(new Animated.Value(0)).current; // red blob
  const blobB = useRef(new Animated.Value(0)).current; // black blob
  const square = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef(0);

  useEffect(() => {
    // card entrance animation
    const anims = anim.map((a, i) =>
      Animated.timing(a, { toValue: 1, duration: 420, delay: i * 60, useNativeDriver: true })
    );
    Animated.stagger(50, anims).start();

    // Red blob looping animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobA, { toValue: 1, duration: 5000, useNativeDriver: true }),
        Animated.timing(blobA, { toValue: 0, duration: 5000, useNativeDriver: true }),
      ])
    ).start();

    // Black blob looping animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(blobB, { toValue: 1, duration: 9000, useNativeDriver: true }),
        Animated.timing(blobB, { toValue: 0, duration: 9000, useNativeDriver: true }),
      ])
    ).start();

    // Floating square
    Animated.loop(
      Animated.sequence([
        Animated.timing(square, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(square, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

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
    if (now - lastTapRef.current < 420) return; // prevent double taps
    lastTapRef.current = now;

    const routeName = routeMap[deptKey];
    if (routeName) {
      navigation.navigate(routeName);
      return;
    }
  };

  const renderItem = ({ item, index }) => {
    const a = anim[index] || new Animated.Value(1);
    const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
    const opacity = a;

    return (
      <Animated.View key={item.key} style={[styles.cardWrap, { opacity, transform: [{ translateY }] }]}>
        <Pressable
          onPress={() => handleSelect(item.key)}
          android_ripple={{ color: "rgba(0,0,0,0.05)" }}
          hitSlop={8}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        >
          {/* Left gradient strip (no letter) */}
          <LinearGradient
            colors={["#ff3b3b", "#ff8a2b"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.leftBlock}
          >
            {/* Glossy shine */}
            <LinearGradient
              colors={["rgba(255,255,255,0.4)", "rgba(255,255,255,0.05)"]}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gloss}
            />
          </LinearGradient>

          {/* Main info */}
          <View style={styles.cardContent}>
            <Text style={styles.acronym}>{item.key}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>

          <View style={styles.chevWrap}>
            <View style={styles.chevBg}>
              <Text style={styles.chev}>›</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  // Red blob animation values
  const blobATransX = blobA.interpolate({ inputRange: [0, 1], outputRange: [-44, 44] });
  const blobATransY = blobA.interpolate({ inputRange: [0, 1], outputRange: [-12, 12] });
  const blobAScale = blobA.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.18] });

  // Black blob animation
  const blobBTransX = blobB.interpolate({ inputRange: [0, 1], outputRange: [30, -30] });
  const blobBTransY = blobB.interpolate({ inputRange: [0, 1], outputRange: [12, -12] });
  const blobBScale = blobB.interpolate({ inputRange: [0, 1], outputRange: [1, 0.86] });

  // Square animation
  const squareTrans = square.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] });
  const squareScale = square.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.06] });

  return (
    <View style={styles.root}>
      <View style={styles.whiteBg} />

      {/* RED BLOB (strong & bright) */}
      <Animated.View
        style={[
          styles.blob,
          styles.blobRed,
          { transform: [{ translateX: blobATransX }, { translateY: blobATransY }, { scale: blobAScale }], opacity: 0.38 },
        ]}
      >
        <LinearGradient
          colors={["#ff1f1f", "#ff6b3b"]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* BLACK BLOB */}
      <Animated.View
        style={[
          styles.blob,
          styles.blobBlack,
          { transform: [{ translateX: blobBTransX }, { translateY: blobBTransY }, { scale: blobBScale }], opacity: 0.18 },
        ]}
      >
        <LinearGradient
          colors={["#0b0b0b", "#2a2a2a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Tech floating square */}
      <Animated.View
        style={[
          styles.square,
          { transform: [{ translateY: squareTrans }, { scale: squareScale }], opacity: 0.08 },
        ]}
      />

      {/* HEADER — stacked and BIG */}
      <View style={styles.header}>
        <Text style={styles.headerExplore}>Explore</Text>
        <Text style={styles.headerDepartments}>Departments</Text>
        <Text style={styles.headerSub}>Tap a college to open its dashboard</Text>
      </View>

      <FlatList
        data={DEPARTMENTS}
        renderItem={renderItem}
        keyExtractor={(i) => i.key}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center", backgroundColor: "#fff" },
  whiteBg: { ...StyleSheet.absoluteFillObject, backgroundColor: "#fff" },

  /* BLOBS */
  blob: {
    position: "absolute",
    width: Math.max(width * 0.9, 360),
    height: Math.max(width * 0.9, 360),
    borderRadius: 9999,
    overflow: "hidden",
  },
  blobRed: {
    top: -height * 0.20,
    left: -width * 0.20,
  },
  blobBlack: {
    bottom: -height * 0.18,
    right: -width * 0.12,
  },

  /* FLOATING SQUARE */
  square: {
    position: "absolute",
    width: 120,
    height: 120,
    backgroundColor: "#ff6b3b",
    right: width * 0.25,
    top: height * 0.12,
    borderRadius: 8,
  },

  /* HEADER */
  header: { width: CARD_W, marginTop: 50, marginBottom: 15 },
  headerExplore: {
    fontSize: 75,
    fontWeight: "900",
    color: "#ff2b2b",
    letterSpacing: -1,
  },
  headerDepartments: {
    fontSize: 55,
    fontWeight: "900",
    color: "#0b0b0b",
    marginTop: -6,
    letterSpacing: -1,
  },
  headerSub: {
    marginTop: 1,
    color: "#333",
    fontWeight: "700",
    fontSize: 14,
  },

  /* LIST */
  list: { paddingBottom: 48, paddingTop: 12, alignItems: "center", width: "100%" },

  /* CARDS */
  cardWrap: { width: CARD_W, marginVertical: VERT_MARGIN / 2, alignItems: "center" },

  card: {
    width: "100%",
    height: CARD_H,
    borderRadius: RADIUS,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.98)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  cardPressed: { transform: [{ scale: 0.99 }], opacity: 0.97 },

  /* LEFT STRIP */
  leftBlock: {
    width: 116,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  /* GLOSS EFFECT */
  gloss: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    height: 34,
    borderRadius: 12,
    transform: [{ rotate: "-18deg" }],
  },

  /* CARD CONTENT */
  cardContent: { flex: 1, paddingHorizontal: 16, justifyContent: "center" },
  acronym: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0b0b0b",
    marginBottom: 4,
  },
  title: { fontSize: 13, color: "#222", fontWeight: "600" },

  /* CHEVRON */
  chevWrap: { width: 56, alignItems: "center", justifyContent: "center" },
  chevBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  chev: { color: "#444", fontSize: 26, transform: [{ translateX: 2 }] },
});
