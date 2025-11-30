// frontend/src/screens/COA/COAF10.js
// COAF10 – COA Student Essentials (yellow theme + blur card + Supabase image)

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// 🔁 ADJUST THIS IMPORT IF YOUR HELPER NAME IS DIFFERENT
import { getDeptMediaUrl } from "../../lib/ccsMediaHelpers";


const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

const DEPT = "COA";
const SLOT = "essentials";

export default function COAF10({ navigation }) {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  useEffect(() => {
    let isActive = true;

    (async () => {
      try {
        // same slot name pattern as CCSF10, just COA helper
        const url = await getDeptMediaUrl(DEPT, SLOT);
        console.log('[COAF10] essentials url =', url);
        if (!isActive) return;
        setImgUrl(url);
      } catch (err) {
        console.log('[COAF10] failed to load essentials image:', err);
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" />

      {/* soft yellow background like other COA screens */}
      <LinearGradient
        colors={['#FFFFFF', '#FFF9D9']}
        style={s.bg}
      />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* BACK BUTTON */}
      <TouchableWithoutFeedback onPress={() => navSafe('COAF4')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CENTER BLURRED RECTANGLE WITH REMOTE IMAGE */}
      <View style={s.centerWrap}>
        <BlurView intensity={45} tint="light" style={s.blurCard}>
          {/* remote essentials image */}
          {imgUrl && (
            <Image
              source={{ uri: imgUrl }}
              style={s.cardImage}
              resizeMode="cover"
              onError={(e) =>
                console.log('[COAF10] image error:', e.nativeEvent)
              }
            />
          )}

          {/* loading overlay */}
          {loading && (
            <View style={s.loadingOverlay}>
              <ActivityIndicator color="#000" />
              <Text style={s.loadingText}>Loading essentials…</Text>
            </View>
          )}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },

  layerTopRight: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: '#F4D03F',
    opacity: 0.25,
  },
  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: '#F8C400',
    opacity: 0.35,
  },

  back: {
    position: 'absolute',
    right: 14,
    top: Platform.OS === 'android' ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backImg: { width: 34, height: 34, tintColor: '#000' },

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  blurCard: {
    width: width * 0.82,
    height: height * 0.45,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  loadingText: {
    marginTop: 6,
    fontSize: 12,
    color: '#333',
  },
});
