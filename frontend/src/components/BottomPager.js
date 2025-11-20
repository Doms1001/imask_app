// frontend/src/components/BottomPager.js
import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const LOGO = require('../../assets/CCSlogo.png');

export default function BottomPager({
  navigation,
  activeIndex = 0,
  targets = ['CCSF2', 'CCSF3', 'CCSF4'],
}) {
  const dotAnims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Animate active circle (rise + scale + glow)
  useEffect(() => {
    dotAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === activeIndex ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [activeIndex]);

  function handlePress(i) {
    const target = targets[i];
    if (target) navigation.navigate(target);
  }

  return (
    <View style={styles.bottomWrap}>
      <View style={styles.pagerBox}>
        {[0, 1, 2].map((i) => {
          const rise = dotAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -10],
          });

          const scale = dotAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.10],
          });

          const glowOpacity = dotAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          });

          return (
            <TouchableOpacity key={i} onPress={() => handlePress(i)}>
              <Animated.View
                style={[
                  styles.outerRing,
                  { transform: [{ translateY: rise }, { scale }] },
                ]}
              >
                <Animated.View
                  style={[styles.glow, { opacity: glowOpacity }]}
                />
                <View style={styles.innerDot}>
                  <Image source={LOGO} style={styles.logo} />
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomWrap: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  pagerBox: {
    width: Math.min(380, width - 24),
    height: 84,
    borderRadius: 16,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8,
  },
  outerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 85,
    height: 85,
    borderRadius: 42,
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
  innerDot: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#b71c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b0000',
  },
  logo: {
    width: 28,
    height: 28,
    tintColor: '#5f0000',
  },
});
