// COAF10.js – plain background + centered blurred rectangle (ALL computations removed)

import React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

export default function COAF10({ navigation }) {
  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="dark-content" />

      {/* BACK BUTTON */}
      <TouchableWithoutFeedback onPress={() => navSafe('COAF4')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      {/* CENTER BLURRED RECTANGLE */}
      <BlurView intensity={45} tint="light" style={s.blurCard} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF', // plain background
    alignItems: 'center',
    justifyContent: 'center',
  },

  back: {
    position: 'absolute',
    right: 14,
    top: 50,
    width: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backImg: { width: 34, height: 34, tintColor: '#000' },

  blurCard: {
    width: width * 0.82,
    height: height * 0.45,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
});
