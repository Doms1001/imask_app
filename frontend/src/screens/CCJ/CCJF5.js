// CCJF5.js — Gray & Black Theme

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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

export default function CCJF5({ navigation }) {
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

      {/* Dark charcoal background */}
      <LinearGradient
        colors={['#0b0b0b', '#1b1b1b']}
        start={[0, 0]}
        end={[1, 1]}
        style={s.bg}
      />

      {/* subtle gray shapes */}
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back button */}
      <TouchableWithoutFeedback onPress={() => navSafe('CCJF3')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CONTENT */}
      <View style={s.contentWrap}>
        {/* BIG GRADIENT RECTANGLE (gray -> black) */}
        <View style={m.cardWrapper}>
          <LinearGradient
            colors={['#4a4a4a', '#0f0f0f']} // gray to near-black
            start={[0, 0]}
            end={[1, 1]}
            style={m.bigCard}
          />

          {/* glossy shine (very subtle) */}
          <Animated.View style={m.gloss} />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b0b', alignItems: 'center' },

  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: 'absolute',
    right: -30,
    top: -10,
    width: 220,
    height: 220,
    backgroundColor: 'rgba(255,255,255,0.03)', // faint light spot on dark bg
    borderRadius: 18,
    transform: [{ rotate: '12deg' }],
  },

  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 300,
    height: 300,
    backgroundColor: 'rgba(0,0,0,0.45)', // deep shadow circle
    borderRadius: 180,
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

  backImg: { width: 34, height: 34, tintColor: '#d1d1d1' },

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
  },

  bigCard: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },

  gloss: {
    position: 'absolute',
    top: -40,
    left: -30,
    width: 220,
    height: 400,
    backgroundColor: 'rgba(255,255,255,0.06)', // very subtle sheen
    borderRadius: 110,
    transform: [{ rotate: '22deg' }],
    opacity: 0.95,
  },
});
