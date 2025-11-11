import React from "react";
import { View, Image, StyleSheet, useWindowDimensions } from "react-native";

const onboardingImage = require("../../assets/onboarding.png");

export default function ZoomImage() {
  const { width, height } = useWindowDimensions(); // dynamic dimensions

  return (
    <View style={[styles.wrap, { width, height: height * 0.60 }]}>
      <Image source={onboardingImage} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  image: {
    width: "100%",
    height: "180%",
    transform: [{ scale: 1 }],
  },
});
