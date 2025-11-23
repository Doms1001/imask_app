// CBAF7.js – Announcement screen (Yellow → Orange CBAF Theme) + Firestore image support

import React, { useRef, useEffect, useState } from 'react';
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

export default function CBAF7({ navigation }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [fsErr, setFsErr] = useState(null);

  const anim = useRef(new Animated.Value(0)).current;
  const animRef = useRef(null);

  useEffect(() => {
    animRef.current = Animated.timing(anim, {
      toValue: 1,
      duration: 550,
      useNativeDriver: true,
    });
    animRef.current.start();

    // Firestore listener: screens/CBAF7
    const docRef = doc(db, 'screens', 'CBAF7');
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setImageUrl(data?.imageUrl || null);
        } else {
          setImageUrl(null);
        }
      },
      (err) => {
        console.warn('CBAF7 Firestore error:', err);
        setFsErr(err);
      }
    );

    return () => {
      animRef.current?.stop();
      unsub && unsub();
    };
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      {/* Background */}
      <LinearGradient colors={['#fff9f0', '#fff3d9']} style={s.bg} />

      {/* Decorative yellow/orange shapes */}
      <LinearGradient
        colors={['#FBC02D', '#FFA000']}
        start={[0, 0]}
        end={[1, 1]}
        style={s.layerTopRight}
      />
      <LinearGradient
        colors={['#FFECB3', '#FFB300']}
        start={[0, 0]}
        end={[1, 1]}
        style={s.layerBottomLeft}
      />

      {/* Back Button */}
      <TouchableOpacity style={s.back} onPress={() => navSafe('CBAF3')}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>
        {/* TOP BAR */}
        <View style={s.topBarWrap}>
          <LinearGradient
            colors={['#FFD54F', '#FF8A00']}
            start={[0, 0]}
            end={[1, 1]}
            style={s.topBar}
          />
        </View>

        {/* BIG MAIN CARD */}
        <View style={s.bigCardWrapper}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={s.bigImageAbsolute}
              resizeMode="cover"
              onError={() => setImageUrl(null)}
            />
          ) : (
            <LinearGradient
              colors={['#FFD54F', '#FF8A00']}
              start={[0, 0]}
              end={[1, 1]}
              style={s.bigCard}
            />
          )}

          <View style={s.bigInnerBorder} pointerEvents="none" />

          <Animated.View style={s.bigGloss} pointerEvents="none" />
        </View>

        {/* BOTTOM BAR + RED SQUARE */}
        <View style={s.bottomRow}>
          <View style={s.bottomBarWrapper}>
            <LinearGradient
              colors={['#FFD54F', '#FF8A00']}
              start={[0, 0]}
              end={[1, 1]}
              style={s.bottomBar}
            />
            <Animated.View style={s.bottomBarGloss} pointerEvents="none" />
          </View>

          <View style={s.bottomOverlapSquare} />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES (THEME APPLIED) ---------------- */
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  bg: { ...StyleSheet.absoluteFillObject },

  /* Background shapes */
  layerTopRight: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    opacity: 0.35,
  },
  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    opacity: 0.45,
  },

  /* Back button */
  back: {
    position: 'absolute',
    right: 14,
    top: Platform.OS === 'android' ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  backImg: { width: 34, height: 34, tintColor: '#fff' },

  /* Layout container */
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  /* TOP bar */
  topBarWrap: {
    width: Math.min(320, width - 64),
    alignItems: 'center',
    marginBottom: 18,
  },
  topBar: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },

  /* BIG CARD */
  bigCardWrapper: {
    width: Math.min(400, width - 50),
    height: Math.min(300, height * 0.36),
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 10,
  },
  bigCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bigImageAbsolute: {
    position: 'absolute',
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
    borderColor: 'rgba(0,0,0,0.1)',
  },
  bigGloss: {
    position: 'absolute',
    left: -50,
    top: -40,
    width: 160,
    height: 360,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.2)',
    transform: [{ rotate: '22deg' }],
    zIndex: 4,
  },

  /* Bottom bar row */
  bottomRow: {
    width: Math.min(320, width - 64),
    flexDirection: 'row',
    alignItems: 'center',
  },

  bottomBarWrapper: {
    flex: 1,
    height: 100,
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
    backgroundColor: 'rgba(255,255,255,0.28)',
    transform: [{ rotate: '22deg' }],
  },

  bottomOverlapSquare: {
    width: 56,
    height: 56,
    backgroundColor: '#ff3b3b',
    marginLeft: -26,
    borderRadius: 6,
    shadowColor: '#ff3b3b',
    shadowOpacity: 0.34,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
});
