// frontend/src/screens/CCS/CCSF4.js
import React, { useRef, useEffect } from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomPager from '../../components/BottomPager';

const { width } = Dimensions.get('window');
const LOGO = require('../../../assets/CCSlogo.png');
const BACK = require('../../../assets/back.png');

export default function CCSF4({ navigation }) {
  const dummy = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dummy, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [dummy]);

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={['#fff', '#f7f7f9']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableOpacity style={s.back} onPress={() => navigation?.navigate && navigation.navigate('CCSF3')}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      {/* main content */}
      <View style={{ flex: 1 }} />

      {/* BottomPager: right circle rises on this screen */}
      <BottomPager navigation={navigation} activeIndex={2} targets={['CCSF2', 'CCSF3', 'CCSF4']} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  bg: { ...StyleSheet.absoluteFillObject },
  layerTopRight: { position: 'absolute', right: -40, top: -20, width: 220, height: 220, borderRadius: 18, backgroundColor: '#2f2f2f' },
  layerBottomLeft: { position: 'absolute', left: -60, bottom: -80, width: 260, height: 260, borderRadius: 160, backgroundColor: '#ff2b2b', opacity: 0.70 },

  back: { position: 'absolute', right: 14, top: 50, width: 50, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  backImg: { width: 34, height: 34, tintColor: '#fff' },
});
