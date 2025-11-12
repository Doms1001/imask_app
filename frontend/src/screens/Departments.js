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
const CARD_W = Math.min(width * 0.92, 380);
const CARD_H = 108;         // slightly smaller so more cards fit
const RADIUS = 16;
const VERT_MARGIN = 10;     // reduced vertical spacing

const DEPARTMENTS = [
  { key: "COA", title: "College of Accountancy", colors: ["#d8f533ff", "#9bad11ff"] },
  { key: "CCS", title: "College of Computer Studies", colors: ["#ff4b4b", "#8f0000"] },
  { key: "CBA", title: "College of Business Administration", colors: ["#ffc300", "#b07b00"] },
  { key: "CCJ", title: "College of Criminal Justice", colors: ["#8b8b8b", "#2f2f2f"] },
  { key: "COE", title: "College of Engineering", colors: ["#ff8800", "#b05f00"] },
  { key: "CAS", title: "College of Arts & Science", colors: ["#7b0080", "#3d0040"] },
];

export default function Departments({ navigation }) {
  const anim = useRef(DEPARTMENTS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // staggered entrance
    const anims = anim.map((a, i) =>
      Animated.timing(a, { toValue: 1, duration: 380, delay: i * 70, useNativeDriver: true })
    );
    Animated.stagger(50, anims).start();
  }, []);

  const handleSelect = (deptKey) => {
    navigation.navigate("NextScreenName", { dept: deptKey });
  };

  const renderItem = ({ item, index }) => {
    const a = anim[index] || new Animated.Value(1);
    const translateY = a.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });
    const opacity = a;

    return (
      <Animated.View style={{ opacity, transform: [{ translateY }], marginVertical: VERT_MARGIN }}>
        <Pressable
          onPress={() => handleSelect(item.key)}
          android_ripple={{ color: "rgba(0,0,0,0.06)" }}
          style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.994 }], opacity: 0.98 }]}
        >
          <LinearGradient
            colors={item.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.leftBlock}
          />
          <View style={styles.cardContent}>
            <Text style={styles.acronym}>{item.key}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View style={styles.chevWrap}>
            <Text style={styles.chev}>›</Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <View style={styles.root}>
      {/* soft layered background */}
      <View style={styles.bgCircle} />
      <View style={[styles.bgCircle, styles.bgCircle2]} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose a Department</Text>
        <Text style={styles.headerSub}>Pick the college you want to explore</Text>
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
  root: {
    flex: 1,
    backgroundColor: "#f0f0f0ff",
    alignItems: "center",
  },
  bgCircle: {
    position: "absolute",
    width: width * 1.6,
    height: width * 1.6,
    borderRadius: (width * 1.6) / 2,
    top: -width * 0.9,
    left: -width * 0.3,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  bgCircle2: {
    top: -width * 0.6,
    left: width * 0.2,
    backgroundColor: "rgba(0,0,0,0.03)",
    transform: [{ scale: 0.8 }],
  },

  header: {
    width: CARD_W,
    marginTop: 50,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 55,
    fontWeight: "800",
    color: "#0b1113",
  },
  headerSub: {
    marginTop: 15,
    color: "#555",
    fontSize: 18,
  },

  list: {
    paddingBottom: 40,
    paddingTop: 8,
    alignItems: "center",
  },

  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: RADIUS,
    backgroundColor: Platform.OS === "android" ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.98)",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  leftBlock: {
    width: 116,
    height: "100%",
    borderTopLeftRadius: RADIUS,
    borderBottomLeftRadius: RADIUS,
  },

  cardContent: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  acronym: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0c0c0cff",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    color: "rgba(0, 0, 0, 0.96)",
    fontWeight: "600",
  },

  chevWrap: {
    width: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  chev: {
    color: "#999",
    fontSize: 28,
    transform: [{ translateX: 3 }],
  },
});
