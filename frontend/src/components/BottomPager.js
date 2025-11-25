// frontend/src/components/BottomPager.js
import React, { useMemo, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { CommonActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");

// Safe dynamic import with fallback
let LinearGradientComp;
try {
  LinearGradientComp = require("expo-linear-gradient").LinearGradient;
} catch (e) {
  LinearGradientComp = ({ children, style }) => <View style={style}>{children}</View>;
}

/**
 * Department theme color presets
 */
const THEME_COLORS = {
  CCS: {
    active: ["#ff1f1f", "#000000"], // red → black
    glow: "rgba(255,0,0,0.35)",
  },
  COA: {
    active: ["#ffd500", "#000000"], // yellow → black
    glow: "rgba(255,213,0,0.35)",
  },
  CBA: {
    active: ["#d4af37", "#000000"], // gold → black
    glow: "rgba(212,175,55,0.35)",
  },
  CAS: {
    active: ["#7d3cff", "#000000"], // violet → black
    glow: "rgba(125,60,255,0.35)",
  },
  CCJ: {
    active: ["#444444", "#000000"], // dark gray → black
    glow: "rgba(68,68,68,0.35)",
  },
  COE: {
    active: ["#ff7f00", "#000000"], // orange → black
    glow: "rgba(255,127,0,0.35)",
  },
};

// neutral fallback if theme not provided or unknown
const DEFAULT_THEME = {
  active: ["#ffd500", "#000000"],
  glow: "rgba(255,213,0,0.28)",
};

export default function BottomPager({
  navigation,
  activeIndex = null, // prefer null so screen can control it
  targets = null, // screens MUST pass full route names like ['COAF2','COAF3','COAF4']
  logo = null,
  current = null,
  theme = "CCS", // 🔥 NEW: department key to drive colors
}) {
  if (!Array.isArray(targets) || targets.length === 0) {
    console.warn(
      '[BottomPager] Missing or empty "targets" prop. This instance will not render.'
    );
    console.trace && console.trace("[BottomPager] stack trace for missing targets:");
    return null;
  }

  const count = Math.max(1, targets.length);

  // pick colors for this theme
  const colors = THEME_COLORS[theme] || DEFAULT_THEME;

  const dotAnims = useMemo(
    () => Array.from({ length: count }, () => new Animated.Value(0)),
    [count]
  );

  const detectedRoute = useMemo(() => {
    if (current) return current;

    try {
      if (typeof navigation?.getCurrentRoute === "function") {
        const r = navigation.getCurrentRoute();
        if (r && r.name) return r.name;
      }

      const st =
        typeof navigation?.getState === "function"
          ? navigation.getState()
          : navigation?.state;
      if (!st) return null;

      let route = null;
      if (Array.isArray(st.routes) && typeof st.index === "number") {
        route = st.routes[st.index];
      } else if (st.routeName) {
        return st.routeName;
      }

      // follow nested state if any
      while (
        route &&
        route.state &&
        Array.isArray(route.state.routes) &&
        typeof route.state.index === "number"
      ) {
        route = route.state.routes[route.state.index];
      }

      // try parent
      try {
        const parent = navigation?.getParent && navigation.getParent();
        const parentRoute =
          parent?.getCurrentRoute && parent.getCurrentRoute();
        if (parentRoute && parentRoute.name) return parentRoute.name;
      } catch (e) {
        // ignore
      }

      return route && route.name ? route.name : null;
    } catch (err) {
      console.warn("[BottomPager] detectedRoute error", err);
      return null;
    }
  }, [navigation, current]);

  const computedIndex = useMemo(() => {
    if (
      typeof activeIndex === "number" &&
      activeIndex >= 0 &&
      activeIndex < count
    ) {
      return activeIndex;
    }

    if (detectedRoute) {
      const idx = targets.indexOf(detectedRoute);
      if (idx >= 0) return idx;
    }

    return Math.max(0, Math.min(count - 1, Math.floor(count / 2)));
  }, [activeIndex, detectedRoute, targets, count]);

  console.log(
    "[BottomPager] targets=",
    JSON.stringify(targets),
    "detectedRoute=",
    detectedRoute,
    "computedIndex=",
    computedIndex,
    "activeIndex=",
    activeIndex,
    "theme=",
    theme
  );

  useEffect(() => {
    const animations = dotAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: i === computedIndex ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      })
    );
    const run = Animated.parallel(animations);
    run.start();
    return () => run.stop && run.stop();
  }, [computedIndex, dotAnims]);

  const handlePress = useCallback(
    (i) => {
      const target = targets[i];
      if (!target) {
        console.warn("[BottomPager] handlePress: missing target for index", i);
        return;
      }
      if (detectedRoute === target) return;

      if (navigation && typeof navigation.dispatch === "function") {
        try {
          navigation.dispatch(CommonActions.navigate({ name: target }));
          return;
        } catch (e) {
          console.warn("[BottomPager] dispatch failed:", e);
        }
      }

      try {
        const parent = navigation?.getParent && navigation.getParent();
        if (parent && typeof parent.dispatch === "function") {
          parent.dispatch(CommonActions.navigate({ name: target }));
          return;
        }
      } catch (e) {
        console.warn("[BottomPager] parent dispatch failed", e);
      }

      if (navigation && typeof navigation.navigate === "function") {
        try {
          navigation.navigate(target);
        } catch (e) {
          console.warn("[BottomPager] final navigate failed", e);
        }
      } else {
        console.warn("[BottomPager] Unable to navigate to", target);
      }
    },
    [targets, navigation, detectedRoute]
  );

  return (
    <View style={styles.bottomWrap} pointerEvents="box-none">
      <View style={styles.pagerBox}>
        {dotAnims.map((anim, i) => {
          const rise = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10],
          });
          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
          });
          const glowOpacity = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.55],
          });
          const isActive = i === computedIndex;

          return (
            <TouchableOpacity
              key={String(i)}
              onPress={() => handlePress(i)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  styles.outerRing,
                  {
                    transform: [{ translateY: rise }, { scale }],
                  },
                ]}
              >
                {/* 🔥 themed glow */}
                <Animated.View
                  style={[
                    styles.glow,
                    {
                      opacity: glowOpacity,
                      backgroundColor: colors.glow,
                      width: isActive ? 94 : 85,
                      height: isActive ? 94 : 85,
                      borderRadius: isActive ? 47 : 42,
                    },
                  ]}
                />

                {isActive ? (
                  <LinearGradientComp
                    colors={colors.active}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.innerDot, styles.innerDotActive]}
                  >
                    {logo ? (
                      <Image source={logo} style={styles.logoActive} />
                    ) : (
                      <View />
                    )}
                  </LinearGradientComp>
                ) : (
                  <Animated.View
                    style={[styles.innerDot, styles.innerDotInactive]}
                  >
                    {logo ? <Image source={logo} style={styles.logo} /> : <View />}
                  </Animated.View>
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomWrap: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 28 : 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pagerBox: {
    width: Math.min(380, width - 24),
    height: 84,
    borderRadius: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 7,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  outerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  glow: {
    position: "absolute",
  },
  innerDot: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  innerDotActive: {
    borderWidth: 0,
  },
  innerDotInactive: {
    backgroundColor: "#111111",
    opacity: 0.28,
    borderColor: "rgba(0,0,0,0.12)",
    borderWidth: 1,
  },
  logo: {
    width: 28,
    height: 28,
    tintColor: "#ffffff",
    opacity: 0.95,
  },
  logoActive: {
    width: 28,
    height: 28,
    tintColor: "#0b0b0b",
    opacity: 0.98,
  },
});
