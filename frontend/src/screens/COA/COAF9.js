// frontend/src/screens/COA/COAF9.js
// COAF9 - BIG YELLOW GRADIENT RECTANGLE with embedded FAQ inside the card
// Based on CBAF9 but using COA yellow/white theme

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

export default function COAF9({ navigation }) {
  const entrance = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(-1)).current;
  const entranceRef = useRef(null);
  const shimmerLoopRef = useRef(null);

  useEffect(() => {
    console.log('COAF9 mounted (static FAQ card)');

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
      entranceRef.current &&
        entranceRef.current.stop &&
        entranceRef.current.stop();
      shimmerLoopRef.current &&
        shimmerLoopRef.current.stop &&
        shimmerLoopRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function navSafe(route) {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate(route);
    }
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
        barStyle={Platform.OS === 'android' ? 'dark-content' : 'dark-content'}
      />

      {/* warm yellow background */}
      <LinearGradient colors={['#fffaf0', '#fff7e0']} style={s.bg} />

      {/* decorative yellow shapes */}
      <LinearGradient
        colors={['#FFE066', '#FFD43B']}
        start={[0, 0]}
        end={[1, 1]}
        style={s.layerTopRight}
      />
      <LinearGradient
        colors={['#FFEAA7', '#FFC300']}
        start={[0, 0]}
        end={[1, 1]}
        style={s.layerBottomLeft}
      />

      <TouchableWithoutFeedback onPress={() => navSafe('COAF4')}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <View style={s.contentWrap}>
        <Animated.View
          style={[m.cardWrapper, { transform: [{ scale: cardScale }] }]}
        >
          {/* big yellow gradient card */}
          <LinearGradient
            colors={['#FFE066', '#FFC300']}
            start={[0, 0]}
            end={[1, 1]}
            style={m.bigCard}
          />

          {/* animated gloss */}
          <Animated.View
            pointerEvents="none"
            style={[
              m.gloss,
              {
                transform: [
                  { rotate: '22deg' },
                  { translateX: shimmerTranslate },
                ],
                opacity: shimmer.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [0.14, 0.26],
                }),
              },
            ]}
          />

          {/* Content inside the card */}
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
                    Application form, Form 138 (report card), PSA-authenticated
                    Birth Certificate, 2x2 ID photos, and Certificate of Good
                    Moral Character.
                  </Text>
                  <View style={m.highlight}>
                    <Text style={m.highlightText}>
                      Tip: Prepare Form 138, valid IDs, and your Good Moral
                      Certificate early.
                    </Text>
                  </View>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Is there an entrance exam?</Text>
                  <Text style={m.a}>
                    No. Trimesx Colleges does not require an entrance exam for
                    admission.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: How long do the programs take?</Text>
                  <Text style={m.a}>
                    • College Program: around 4 years (depending on the course).
                    {'\n'}
                    • Senior High School: 2 years (Grades 11 and 12).{'\n'}
                    • TESDA Programs: from 1 to 2 years for longer courses.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: Do graduates receive certificates?</Text>
                  <Text style={m.a}>
                    Yes. Graduates are awarded degrees or diplomas, and some
                    programs also issue TESDA certificates where applicable.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>
                    Q: Can I transfer to Trimesx Colleges from another school?
                  </Text>
                  <Text style={m.a}>
                    Yes — transfers are accepted for College, Senior High School,
                    and TESDA programs, subject to evaluation and required
                    documents.
                  </Text>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>
                    Q: How much is the downpayment for college enrollment?
                  </Text>
                  <Text style={m.a}>
                    The downpayment is P2,000, paid during registration and
                    credited toward your total tuition fee.
                  </Text>
                  <View style={m.highlight}>
                    <Text style={m.highlightText}>
                      Note: The downpayment must be settled before or during
                      enrollment to secure your slot.
                    </Text>
                  </View>
                </View>

                <View style={m.qBlock}>
                  <Text style={m.q}>Q: When must the downpayment be paid?</Text>
                  <Text style={m.a}>
                    The downpayment should be paid before or during registration
                    to confirm your slot. Late payment may delay your enrollment.
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
    opacity: 0.38,
  },

  layerBottomLeft: {
    position: 'absolute',
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    opacity: 0.6,
  },

  back: {
    position: 'absolute',
    right: 14,
    top: Platform.OS === 'android' ? 14 : 50,
    width: 50,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },

  backImg: { width: 34, height: 34, tintColor: '#000' },

  contentWrap: {
    marginTop: 48,
    width: Math.min(420, width - 40),
    height: Math.min(640, height * 0.82),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const m = StyleSheet.create({
  cardWrapper: {
    width: Math.min(360, width - 56),
    height: Math.min(640, height * 0.82),
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -1,
    shadowColor: '#e0a800',
    shadowOpacity: 0.12,
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
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 8,
    padding: 10,
  },

  faqTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
    textAlign: 'left',
  },

  qBlock: {
    marginBottom: 12,
  },

  q: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    backgroundColor: '#F8F5E9',
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
    backgroundColor: '#FFF7E0',
    padding: 8,
    borderRadius: 6,
  },

  highlightText: {
    fontSize: 12,
    color: '#222',
    fontWeight: '600',
  },
});
