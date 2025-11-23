// CCSF7.js
// Announcement screen with gradient top bar, big gradient card, bottom bar and overlapping red square
// Reference preview image (optional): /mnt/data/0b463c41-4eb7-4cd9-853c-b306b46c45b1.png

import React, { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

export default function COEF7({ navigation }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={['#fff', '#f7f7f9']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navSafe('COEF3')}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>
        {/* faint preview image (optional) */}
        <Image source={{ uri: '/mnt/data/0b463c41-4eb7-4cd9-853c-b306b46c45b1.png' }} style={s.previewRef} resizeMode="contain" />

        {/* top narrow gradient bar */}
        <View style={s.topBarWrap}>
          <LinearGradient colors={['#FF5F6D', '#FFC371']} start={[0,0]} end={[1,1]} style={s.topBar} />
        </View>

        {/* big centered gradient card */}
        <View style={s.bigCardWrapper}>
          <LinearGradient colors={['#FF5F6D', '#FFC371']} start={[0,0]} end={[1,1]} style={s.bigCard} />
          <View style={s.bigInnerBorder} pointerEvents="none" />
          <Animated.View style={s.bigGloss} pointerEvents="none" />
        </View>

        {/* bottom wide bar with overlapping red square */}
        <View style={s.bottomRow}>
          <View style={s.bottomBarWrapper}>
            <LinearGradient colors={['#FF5F6D', '#FFC371']} start={[0,0]} end={[1,1]} style={s.bottomBar} />
            <Animated.View style={s.bottomBarGloss} pointerEvents="none" />
          </View>

          {/* overlapping small red square to the right of the bottom bar */}
          <View style={s.bottomOverlapSquare} />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, borderRadius: 18, backgroundColor: '#2f2f2f' },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, backgroundColor: '#ff2b2b', opacity: 0.70 },

  back: { position: 'absolute', right: 14, top: 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
  backImg: { width: 34, height: 34, tintColor: '#fff' },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',   // <-- this moves all shapes to the MIDDLE
    paddingHorizontal: 18,
  },

  previewRef: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 56,
    height: 56,
    opacity: 0.06,
    zIndex: 5,
  },

  /* TOP bar */
  topBarWrap: {
    width: Math.min(320, width - 64),
    alignItems: 'center',
    marginBottom: 18,
  },
  topBar: {
    width: '100%',
    height: 100,    // <-- change this to resize the top bar height
    borderRadius: 8,
  },

  /* Big card */
  bigCardWrapper: {
    width: Math.min(400, width - 50),   // match top bar width
    height: Math.min(300, height * 0.36),
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: '#fff',
  },
  bigCard: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  bigInnerBorder: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    bottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
  },
  bigGloss: {
    position: 'absolute',
    left: -50,
    top: -40,
    width: 160,
    height: 360,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.20)',
    transform: [{ rotate: '22deg' }],
    zIndex: 4,
  },

  /* bottom row */
  bottomRow: {
    width: Math.min(320, width - 64),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomBarWrapper: {
    flex: 1,
    height: 100,   // <-- change to resize bottom bar height
    width: 150,
    borderRadius: 8,
    overflow: 'hidden',
    
  },
  bottomBar: {
    width: '150%',
    height: '100%',
  },
  bottomBarGloss: {
    position: 'absolute',
    left: -40,
    top: -20,
    width: 120,
    height: 220,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.18)',
    transform: [{ rotate: '22deg' }],
  },
  bottomOverlapSquare: {
    width: 56,
    height: 56,
    backgroundColor: '#ff1b1b',
    marginLeft: -26, // overlaps the bar edge
    borderRadius: 4,
    shadowColor: '#ff1b1b',
    shadowOpacity: 0.32,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
});