// frontend/src/screens/CAS/CASF9.js
// CAS – FAQ screen (static content, CAS violet theme, big gradient rectangle with FAQ inside)

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
  Text,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');

export default function CASF9({ navigation }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(-1)).current;
  const entranceRef = useRef(null);
  const shimmerLoopRef = useRef(null);

  useEffect(() => {
    entranceRef.current = Animated.timing(entrance, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    });
    entranceRef.current.start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: -1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerLoopRef.current = loop;
    loop.start();

    return () => {
      entranceRef.current && entranceRef.current.stop && entranceRef.current.stop();
      shimmerLoopRef.current && shimmerLoopRef.current.stop && shimmerLoopRef.current.stop();
    };
  }, []);

  function navSafe(route) {
    if (navigation && typeof navigation.navigate === 'function') navigation.navigate(route);
  }

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width * 0.6, width * 0.8],
  });

  const cardScale = entrance.interpolate({
    inputRange: [0, 1],
    outputRange: [0.996, 1],
  });

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
      />

      {/* CAS background */}
      <LinearGradient colors={['#fbf7ff', '#efe6ff']} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      {/* Back → CASF4 (same flow as CCSF9 → CCSF4) */}
      <TouchableWithoutFeedback onPress={() => navSafe('CASF4')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <View style={s.contentWrap}>
        <Animated.View style={[m.cardWrapper, { transform: [{ scale: cardScale }] }]}>
          {/* Big violet gradient card */}
          <LinearGradient
            colors={['#9d4edd', '#6a2fb1']}
            start={[0, 0]}
            end={[1, 1]}
            style={m.bigCard}
          />

          {/* Shimmer gloss */}
          <Animated.View
            pointerEvents="none"
            style={[
              m.gloss,
              {
                transform: [{ rotate: '22deg' }, { translateX: shimmerTranslate }],
                opacity: shimmer.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [0.14, 0.26],
                }),
              },
            ]}
          />

          {/* Inner scrollable FAQ content */}
          <View style={m.innerContent}>
            <ScrollView
              contentContainerStyle={m.scrollInner}
              showsVerticalScrollIndicator={false}
            >
              <View style={m.faqCard}>
                <Text style={m.faqTitle}>Frequently Asked Questions</Text>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: What are the admission requirements?</Text>
                  <Text style={m.a}>
                    Application form, Form 138 (report card), PSA-authenticated Birth
                    Certificate, 2x2 ID photos, and Certificate of Good Moral Character.
                  </Text>
                  <View style={m.highlight}>
                    <Text style={m.highlightText}>
                      Tip: Submit Form 138 (report card) and valid IDs.
                    </Text>
                  </View>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Is there an entrance exam?</Text>
                  <Text style={m.a}>
                    No. Trimex Colleges does not require an entrance exam for admission.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: How long do the programs take?</Text>
                  <Text style={m.a}>
                    • College Program: 4 years (depending on the course).{'\n'}
                    • Senior High School: 2 years (Grades 11 and 12).{'\n'}
                    • TESDA Programs: From 1 to 2 years for longer courses.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Do graduates receive certificates?</Text>
                  <Text style={m.a}>
                    Yes. Graduates are awarded degrees/diplomas. Some programs also issue
                    TESDA certificates where applicable.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>
                    Q: Can I transfer to Trimex Colleges from another school?
                  </Text>
                  <Text style={m.a}>
                    Yes — transfers are accepted for College, Senior High School, and
                    TESDA programs, subject to evaluation and required documents.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: How much is the downpayment for college enrollment?</Text>
                  <Text style={m.a}>
                    The downpayment is ₱2,000, paid during registration and credited toward
                    your total tuition fee.
                  </Text>
                  <View style={m.highlight}>
                    <Text style={m.highlightText}>
                      Note: The downpayment must be settled before or during enrollment
                      to secure your slot.
                    </Text>
                  </View>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: When must the downpayment be paid?</Text>
                  <Text style={m.a}>
                    The downpayment must be settled before or during registration to
                    secure your slot. Late payments may delay enrollment.
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

/* outer layout styles */
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
    backgroundColor: '#7b2cbf',
    opacity: 0.18,
  },

  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: '#c9a6ff',
    opacity: 0.32,
  },

  back: {
    position: 'absolute',
    right: 14,
    top: Platform.OS === 'android' ? 18 : 50,
    width: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },

  backImg: { width: 34, height: 34, tintColor: '#fff' },

  contentWrap: {
    marginTop: 72,
    marginBottom: 24,
    width: Math.min(420, width - 32),
    alignItems: 'center',
    justifyContent: 'center',
    height: Math.min(640, height * 0.82),
  },
});

/* card + FAQ styles */
const m = StyleSheet.create({
  cardWrapper: {
    width: Math.min(360, width - 56),
    height: Math.min(640, height * 0.82),
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -1,
    shadowColor: '#6f42c1',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 32,
    elevation: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'transparent',
  },

  bigCard: {
    position: 'absolute',
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

  innerContent: {
    position: 'relative',
    width: '92%',
    marginTop: 18,
    paddingBottom: 18,
  },

  scrollInner: {
    paddingBottom: 24,
  },

  faqCard: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 10,
    padding: 12,
  },

  faqTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },

  qBlock: {
    marginBottom: 12,
  },

  q: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    backgroundColor: '#F2F2F8',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },

  a: {
    fontSize: 13,
    color: '#333',
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 6,
  },

  highlight: {
    marginTop: 8,
    backgroundColor: '#F4E8FF',
    padding: 8,
    borderRadius: 6,
  },

  highlightText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
  },
});
