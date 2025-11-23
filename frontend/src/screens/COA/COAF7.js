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

export default function COAF7({ navigation }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  const bigGlossStyle = {
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.25] }),
    transform: [
      { rotate: '22deg' },
      {
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, 80],
        }),
      },
    ],
  };

  const bottomBarGlossStyle = {
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.18] }),
    transform: [
      { rotate: '22deg' },
      {
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, 30],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'dark-content' : 'dark-content'}
      />

      {/* Background gradient */}
      <LinearGradient
        colors={['#FFFFFF', '#FFF9D9']}
        style={s.bg}
      />

      {/* Yellow decorative layers */}
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back BTN */}
      <TouchableOpacity style={s.back} onPress={() => navSafe('COAF3')}>
        <Image source={BACK} style={s.backImg} />
      </TouchableOpacity>

      <View style={s.container}>
        {/* Top Bar */}
        <View style={s.topBarWrap}>
          <LinearGradient
            colors={['#FFD93D', '#FFFFFF']}
            start={[0, 0]}
            end={[1, 1]}
            style={s.topBar}
          />
        </View>

        {/* Big Card */}
        <View style={s.bigCardWrapper}>
          <LinearGradient
            colors={['#FFD93D', '#FFFFFF']}
            start={[0, 0]}
            end={[1, 1]}
            style={s.bigCard}
          />
          <View style={s.bigInnerBorder} pointerEvents="none" />
          <Animated.View
            style={[s.bigGloss, bigGlossStyle]}
            pointerEvents="none"
          />
        </View>

        {/* Bottom Bar */}
        <View style={s.bottomRow}>
          <View style={s.bottomBarWrapper}>
            <LinearGradient
              colors={['#FFD93D', '#FFFFFF']}
              start={[0, 0]}
              end={[1, 1]}
              style={s.bottomBar}
            />
            <Animated.View
              style={[s.bottomBarGloss, bottomBarGlossStyle]}
              pointerEvents="none"
            />
          </View>

          {/* Overlap square (yellow) */}
          <View style={s.bottomOverlapSquare} />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* styles */
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },

  /* Decorative shapes */
  layerTopRight: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: '#F4D03F', // yellow
    opacity: 0.25,
  },
  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: '#F8C400', // deeper yellow
    opacity: 0.35,
  },

  back: {
    position: 'absolute',
    left: 14,
    top: 50,
    width: 50,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
  },
  backImg: {
    width: 34,
    height: 34,
    tintColor: '#000', // black on yellow theme
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  /* Top bar */
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

  /* Big card */
  bigCardWrapper: {
    width: Math.min(400, width - 50),
    height: Math.min(300, height * 0.36),
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  bigCard: {
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
    borderColor: 'rgba(0,0,0,0.10)',
  },
  bigGloss: {
    position: 'absolute',
    left: -50,
    top: -40,
    width: 160,
    height: 360,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  /* Bottom section */
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
    backgroundColor: 'rgba(255,255,255,0.20)',
  },

  /* Yellow square */
  bottomOverlapSquare: {
    width: 56,
    height: 56,
    backgroundColor: '#FFD93D',
    marginLeft: -26,
    borderRadius: 6,
    shadowColor: '#F8C400',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
  },
});
