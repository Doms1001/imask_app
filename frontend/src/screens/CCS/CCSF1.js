import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = Math.min(380, width - 24);

// Replace with your own CCS logo
const logo = require('../../assets/LP2.png');

export default function CCSF1({ navigation, onProceed }) {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'}
        translucent={false}
      />

      {/* Top Left Red Circle */}
      <View style={styles.topLeftCircle} />

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack && navigation.goBack()}>
        <Text style={styles.backArrow}>↩</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.cardShadow}>
          <LinearGradient
            colors={["#8B0000", "#B11212"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.card}
          >
            <Image source={logo} style={styles.logo} resizeMode="contain" />
            <Text style={styles.cardSubtitle}>College of Computer Studies</Text>
          </LinearGradient>
        </View>

        <Text style={styles.description}>
          This track is for students who plan to pursue a college degree. It provides a strong core
          subjects and includes specialized strands to suit various interests.
        </Text>

        <TouchableOpacity style={styles.buttonWrapper} onPress={() => onProceed && onProceed()}>
          <LinearGradient colors={["#6f0000", "#c31717"]} style={styles.proceedBtn}>
            <Text style={styles.proceedText}>Proceed</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topLeftCircle: {
    position: 'absolute',
    left: 12,
    top: 6,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#e60000',
  },
  backBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#e60000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: 'white',
    fontSize: 22,
  },
  content: {
    marginTop: 120,
    width: CONTAINER_WIDTH,
    alignItems: 'center',
  },
  cardShadow: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    borderRadius: 12,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: CONTAINER_WIDTH * 0.6,
    height: CONTAINER_WIDTH * 0.35,
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  description: {
    marginTop: 18,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#222',
    lineHeight: 20,
    paddingHorizontal: 6,
  },
  buttonWrapper: {
    marginTop: 22,
    width: '86%',
  },
  proceedBtn: {
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proceedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
