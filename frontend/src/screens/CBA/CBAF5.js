// CBAF5.js - BIG GRADIENT RECTANGLE (CBAF theme) with Firestore-synced image
import React, { useRef, useEffect, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient'; // added
// Note: original code uses Firestore helpers (doc, onSnapshot, db).
// Keep your existing firestore imports where this file is used.

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

export default function CBAF5({ navigation }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [fsErr, setFsErr] = useState(null);

  const entrance = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(-1)).current;
  const entranceRef = useRef(null);
  const shimmerLoopRef = useRef(null);

  useEffect(() => {
    // entrance animation
    entranceRef.current = Animated.timing(entrance, { toValue: 1, duration: 600, useNativeDriver: true });
    entranceRef.current.start();

    // shimmer loop
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: -1, duration: 0, useNativeDriver: true }),
      ])
    );
    shimmerLoopRef.current = loop;
    loop.start();

    // Firestore realtime listener for screens/CBAF5
    // (original code used doc, db, onSnapshot — keep behavior, ensure imports exist where you use Firestore)
    let unsub;
    try {
      const docRef = doc(db, 'screens', 'CBAF5');
      unsub = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists && snap.exists()) {
            const data = snap.data();
            setImageUrl(data?.imageUrl || null);
          } else {
            setImageUrl(null);
          }
        },
        (error) => {
          console.warn('CBAF5 onSnapshot error:', error);
          setFsErr(error);
        }
      );
    } catch (err) {
      // Firestore not available or imports missing — keep graceful fallback
      // eslint-disable-next-line no-console
      console.warn('Firestore listener not initialized in CBAF5.js —', err);
    }

    return () => {
      entranceRef.current && entranceRef.current.stop && entranceRef.current.stop();
      shimmerLoopRef.current && shimmerLoopRef.current.stop && shimmerLoopRef.current.stop();
      unsub && typeof unsub === 'function' && unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navSafe(route) {
    if (navigation && typeof navigation.navigate === 'function') navigation.navigate(route);
  }

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  const cardScale = entrance.interpolate({ inputRange: [0, 1], outputRange: [0.996, 1] });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
      
      {/* warm background gradient */}
      <LinearGradient colors={['#fff9f0', '#fff6ee']} style={s.bg} />

      {/* decorative gradient shapes */}
      <LinearGradient
        colors={['#FFE082', '#FFB300']}
        start={[0, 0]}
        end={[1, 1]}
        style={s.layerTopRight}
      />
      <LinearGradient
        colors={['#FFD54F', '#FF8A00']}
        start={[0, 0]}
        end={[1, 1]}
        style={s.layerBottomLeft}
      />

      <TouchableWithoutFeedback onPress={() => navSafe('CBAF3')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <View style={s.contentWrap}>
        <Animated.View style={[m.cardWrapper, { transform: [{ scale: cardScale }] }]}>
          {/* If there's an uploaded image show it (cover), otherwise show the gradient */}
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={m.imageAbsolute}
              resizeMode="cover"
              onError={(e) => {
                // fallback: clear imageUrl on error so gradient shows
                console.warn('CBAF5 image load error', e.nativeEvent);
                setImageUrl(null);
              }}
            />
          ) : (
            <LinearGradient colors={['#FFD54F', '#FF8A00']} start={[0, 0]} end={[1, 1]} style={m.bigCard} />
          )}

          {/* glossy shimmer overlay (warm tint preserved) */}
          <Animated.View
            pointerEvents="none"
            style={[
              m.gloss,
              {
                transform: [{ rotate: '22deg' }, { translateX: shimmerTranslate }],
                opacity: shimmer.interpolate({ inputRange: [-1, 1], outputRange: [0.16, 0.28] }),
              },
            ]}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
  },

  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    opacity: 0.9,
  },

  back: {
    position: 'absolute',
    right: 14,
    top: Platform.OS === 'android' ? 14 : 50,
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
    justifyContent: 'center',
  },
});

const m = StyleSheet.create({
  cardWrapper: {
    width: Math.min(360, width - 56),
    height: Math.min(690, height * 0.88),
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -1,
    shadowColor: '#8f5e00',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 32,
    elevation: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },

  bigCard: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },

  imageAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
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
    zIndex: 6,
  },
});
