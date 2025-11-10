import React, { useRef, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(340, width - 48); // card visible width
const CARD_SPACING = 16;
const VISIBLE_WIDTH = CARD_WIDTH + CARD_SPACING;

const logo = require('../../assets/LP2.png'); // <-- replace with your logo

export default function CCSF2({ navigation }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // three example cards (left-to-right). User will swipe LEFT (right-to-left gesture) to go to next card.
  const cards = [
    {
      title:
        "Bachelor of Science in\nComputer Science with\nSpecialization in Cybersecurity",
      desc:
        "This program equips students with advanced skills in programming, systems development, and information security. It prepares graduates to protect digital systems against cyber threats, manage secure networks, and design innovative solutions for the growing challenges in cybersecurity and technology.",
    },
    {
      title: "Bachelor of Science in\nComputer Science with\nSpecialization in AI",
      desc:
        "This program focuses on AI fundamentals — machine learning, data processing and intelligent systems. Graduates will build and deploy models that solve real-world problems.",
    },
    {
      title: "Bachelor of Science in\nInformation Technology",
      desc:
        "Covers practical IT skills: networking, system administration, and application deployment. Prepares students for industry roles in IT operations and support.",
    },
  ];

  useEffect(() => {
    // ensure first card visible on mount
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, animated: false });
    }
  }, []);

  function onMomentumScrollEnd(e) {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / VISIBLE_WIDTH);
    setActiveIndex(index);
  }

  function goToIndex(i) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ x: i * VISIBLE_WIDTH, animated: true });
    setActiveIndex(i);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "dark-content"}
        translucent={false}
      />

      {/* top decorative */}
      <View style={styles.topLeftWhite} />
      <View style={styles.topRightRed} />

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation?.goBack && navigation.goBack()}
      >
        <Text style={styles.backArrow}>↩</Text>
      </TouchableOpacity>

      {/* HORIZONTAL SWIPER — swipe LEFT (right-to-left gesture) to go to the next card */}
      <View style={styles.sliderWrap}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={VISIBLE_WIDTH}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          {cards.map((c, i) => (
            <View key={i} style={styles.cardContainer}>
              <LinearGradient
                colors={["#b40000", "#e00000"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.card}
              >
                <Image source={logo} style={styles.watermark} resizeMode="contain" />

                <Text style={styles.title}>{c.title}</Text>

                <Text style={styles.description}>{c.desc}</Text>
              </LinearGradient>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* bottom pager buttons */}
      <View style={styles.bottomBtns}>
        {cards.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.circleBtn, isActive && styles.circleBtnActive]}
              onPress={() => goToIndex(i)}
              activeOpacity={0.85}
            >
              <Image source={logo} style={styles.circleIcon} resizeMode="contain" />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
  },
  topLeftWhite: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "60%",
    height: 120,
    backgroundColor: "#ffffff",
    borderBottomRightRadius: 60,
  },
  topRightRed: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 80,
    height: 80,
    backgroundColor: "#e60000",
    borderBottomLeftRadius: 40,
  },
  backBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 50,
    height: 50,
    backgroundColor: "#6b6b6b",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  },
  backArrow: {
    color: "white",
    fontSize: 20,
  },

  sliderWrap: {
    marginTop: 80,
    height: 420,
  },
  scrollContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2 - CARD_SPACING / 2,
    alignItems: "center",
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
  card: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 26,
    paddingHorizontal: 18,
    minHeight: 380,
    overflow: "hidden",
  },
  watermark: {
    position: "absolute",
    width: "120%",
    height: "120%",
    alignSelf: "center",
    opacity: 0.08,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
    lineHeight: 30,
  },
  description: {
    color: "white",
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.95,
  },

  bottomBtns: {
    width: "86%",
    height: 76,
    marginTop: 22,
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: "#e6e6e6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 22,
    justifyContent: "space-between",
    elevation: 6,
  },
  circleBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  circleBtnActive: {
    backgroundColor: "#e33b3b",
    transform: [{ translateY: -6 }],
    shadowOpacity: 0.35,
  },
  circleIcon: {
    width: 36,
    height: 36,
    tintColor: "#8b0000",
  },
});