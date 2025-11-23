// COAF5.js – Yellow + White Theme (Matches COAF1–4)

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

export default function COAF5({ navigation }) {
  const dummy = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dummy, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" />

      {/* Yellow–White Background */}
      <LinearGradient colors={['#fffaf0', '#fff7e6']} style={s.bg} />

      {/* Decorative Shapes */}
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button */}
      <TouchableWithoutFeedback onPress={() => navSafe('COAF3')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT */}
      <View style={s.contentWrap}>

        {/* BIG YELLOW GRADIENT RECTANGLE */}
        <View style={m.cardWrapper}>
          <LinearGradient
            colors={['#ffe066', '#fff4a3']}
            start={[0, 0]}
            end={[1, 1]}
            style={m.bigCard}
          />

          {/* glossy shine */}
          <Animated.View style={m.gloss} />
        </View>

      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fffaf0', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },

  /* Yellow background shapes */
  layerTopRight: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    backgroundColor: 'rgba(255, 235, 120, 0.55)',
    borderRadius: 18,
  },

  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    backgroundColor: 'rgba(255, 215, 60, 0.75)',
    borderRadius: 160,
  },

  /* Back Button */
  back: {
    position: 'absolute',
    right: 14,
    top: Platform.OS === 'android' ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backImg: { width: 34, height: 34, tintColor: '#111' },

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

  /* Main yellow gradient card */
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
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderRadius: 90,
    transform: [{ rotate: '22deg' }],
  },
});
