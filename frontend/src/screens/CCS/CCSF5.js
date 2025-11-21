// CCSF5.js
// With big gradient rectangle (same gradient as CCSF3 cards)

import React, { useRef, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

export default function CCSF5({ navigation }) {
  const dummy = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dummy, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#fff", "#f7f7f9"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button → go to CCSF3 */}
      <TouchableWithoutFeedback onPress={() => navSafe('CCSF3')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT */}
      <View style={s.contentWrap}>

        {/* BIG GRADIENT RECTANGLE */}
        <View style={m.cardWrapper}>
          <LinearGradient
            colors={["#FF5F6D", "#FFC371"]}
            start={[0, 0]}
            end={[1, 1]}
            style={m.bigCard}
          />

          {/* glossy shine */}
          <Animated.View
            style={m.gloss}
          />
        </View>

      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },

  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    backgroundColor: '#2f2f2f',
    borderRadius: 18,
  },

  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: '#ff2b2b',
    borderRadius: 160,
    opacity: 0.7,
  },

  back: {
    position: 'absolute',
    right: 14,
    top: 50,
    width: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backImg: { width: 34, height: 34, tintColor: '#fff' },

  contentWrap: {
    marginTop: 100,
    width: Math.min(420, width - 40),
    height: Math.min(560, height * 0.72),
    alignItems: 'center',
  },
});

const m = StyleSheet.create({
  cardWrapper: {
    width: 360,
    height: 690,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -1,
  },

  bigCard: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },

  gloss: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 180,
    height: 360,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 90,
    transform: [{ rotate: '22deg' }],
  },
});
