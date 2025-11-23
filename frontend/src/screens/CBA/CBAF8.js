// CBAF8.js — CBAF Yellow→Orange theme; NAME larger (70%), Semester smaller (28%)

import React, { useRef, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Text,
  TextInput,
  Dimensions,
  Animated,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const BACK = require('../../../assets/back.png');
const GMAIL = require('../../../assets/gmail.png');

// (keep ACCENT_IMG path or replace with your uploaded image)
const ACCENT_IMG = { uri: 'file:///mnt/data/a73ddb0c-dec9-4345-8acf-e11ea19fb55c.png' };

export default function CBAF8({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');

  // FIXED values (no dropdowns)
  const semester = "1st";
  const year = "1";
  const academicYear = "2025–2026";

  // fees
  const [tuition, setTuition] = useState('');
  const [lab, setLab] = useState('');
  const [nonLab, setNonLab] = useState('');
  const [misc, setMisc] = useState('');
  const [nstp, setNstp] = useState('');
  const [other, setOther] = useState('');
  const [discount, setDiscount] = useState('');
  const [downPayment, setDownPayment] = useState('');

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  function toNum(s) {
    if (!s) return 0;
    const cleaned = s.replace(/[^0-9.-]/g, '');
    return cleaned ? Number(cleaned) : 0;
  }

  const totalFees =
    toNum(tuition) +
    toNum(lab) +
    toNum(nonLab) +
    toNum(misc) +
    toNum(nstp) +
    toNum(other) -
    toNum(discount);

  const balance = totalFees - toNum(downPayment);

  function formatMoney(n) {
    const fixed = (n || 0).toFixed(2);
    return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />

      {/* soft warm background */}
      <LinearGradient colors={['#fff9f0', '#fff5ea']} style={StyleSheet.absoluteFill} />

      {/* accent decorative image */}
      <Image source={ACCENT_IMG} style={styles.accentImg} />

      {/* small top shape */}
      <View style={styles.topShape} />

      {/* Back Button */}
      <TouchableWithoutFeedback onPress={() => navSafe('CBAF4')}>
        <View style={styles.back}>
          <Image source={BACK} style={styles.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <Animated.View style={{ flex: 1, opacity: fade }}>
        <ScrollView contentContainerStyle={styles.contentWrap}>

          {/* ---------- FIRST ROW ---------- */}
          <View style={styles.formRow}>
            {/* NAME enlarged (70%) */}
            <View style={[styles.inputCard, { width: '70%' }]}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                placeholderTextColor="#a88"
                style={styles.textInput}
              />
            </View>

            {/* SEMESTER small (28%) */}
            <View style={[styles.inputCard, { width: '28%' }]}>
              <Text style={styles.inputLabel}>Semester</Text>
              <View style={styles.fixedBox}>
                <Text style={styles.fixedText}>{semester}</Text>
              </View>
            </View>
          </View>

          {/* SECOND ROW */}
          <View style={styles.formRow}>
            <View style={[styles.inputCard, { width: '48%' }]}>
              <Text style={styles.inputLabel}>Year</Text>
              <View style={styles.fixedBox}>
                <Text style={styles.fixedText}>{year}</Text>
              </View>
            </View>

            <View style={[styles.inputCard, { width: '48%' }]}>
              <Text style={styles.inputLabel}>Academic Year</Text>
              <View style={styles.fixedBox}>
                <Text style={styles.fixedText}>{academicYear}</Text>
              </View>
            </View>
          </View>

          {/* ---------- COMPUTATION CARD (Yellow→Orange gradient) ---------- */}
          <View style={styles.computationWrap}>
            <LinearGradient
              colors={['#FFD54F', '#FFB300', '#FF8A00']}
              style={styles.computationCard}
            >
              <View style={styles.innerPanel}>
                <Text style={styles.cardTitle}>Computation of Fees</Text>

                <View style={styles.table}>
                  {[
                    { label: 'Tuition Fee', value: tuition, onChange: setTuition },
                    { label: 'Laboratory Fee', value: lab, onChange: setLab },
                    { label: 'Non-Lab Fee', value: nonLab, onChange: setNonLab },
                    { label: 'Misc Fee', value: misc, onChange: setMisc },
                    { label: 'NSTP/ROTC Fee', value: nstp, onChange: setNstp },
                    { label: 'Other Fee', value: other, onChange: setOther },
                    { label: 'Discount', value: discount, onChange: setDiscount },
                    { label: 'TOTAL FEES', computed: formatMoney(totalFees) },
                    { label: 'Down Payment', value: downPayment, onChange: setDownPayment },
                    { label: 'Balance', computed: formatMoney(balance) },
                  ].map((r, i) => (
                    <View key={i} style={[styles.row, i % 2 ? styles.rowOdd : styles.rowEven]}>
                      <Text style={styles.rowLabel}>{r.label}</Text>

                      {r.computed !== undefined ? (
                        <View style={styles.computedBox}>
                          <Text style={styles.computedText}>{r.computed}</Text>
                        </View>
                      ) : (
                        <TextInput
                          value={r.value}
                          onChangeText={r.onChange}
                          placeholder="0.00"
                          keyboardType="numeric"
                          placeholderTextColor="#a98"
                          style={styles.valueInput}
                        />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* ---------- SEND COPY ---------- */}
          <View style={styles.sendWrap}>
            <Text style={styles.sendLabel}>Send copy via Email</Text>

            <TouchableOpacity style={styles.gmailBtn}>
              <LinearGradient colors={['#fff', '#fff7e6']} style={styles.gmailInner}>
                <Image source={GMAIL} style={styles.gmailIcon} />
                <Text style={styles.gmailText}>Send via Gmail</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },

  accentImg: {
    position: 'absolute',
    left: -30,
    top: -60,
    width: 280,
    height: 280,
    opacity: 0.10,
    transform: [{ rotate: '-12deg' }],
  },

  topShape: {
    position: 'absolute',
    right: -40,
    top: -20,
    width: 240,
    height: 240,
    borderRadius: 20,
    backgroundColor: '#000',
    opacity: 0.03,
  },

  back: {
    position: 'absolute',
    right: 14,
    top: Platform.OS === 'ios' ? 52 : 30,
    zIndex: 20,
  },
  backImg: { width: 30, height: 30, tintColor: '#222' },

  contentWrap: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 50,
    alignItems: 'center',
  },

  formRow: {
    width: Math.min(760, width - 36),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(170,80,0,0.06)',
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b36b00',
    marginBottom: 6,
  },

  textInput: {
    fontSize: 15,
    paddingVertical: 4,
    color: '#111',
  },

  fixedBox: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },

  fixedText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  computationWrap: {
    width: Math.min(760, width - 36),
    marginTop: 12,
  },

  computationCard: { borderRadius: 16, padding: 10 },

  innerPanel: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: 12,
    borderRadius: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#b36b00',
    marginBottom: 10,
  },

  table: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(180,100,0,0.08)',
  },

  row: {
    height: 44,
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowEven: { backgroundColor: '#fff' },
  rowOdd: { backgroundColor: '#fffaf3' },

  rowLabel: {
    width: '54%',
    fontSize: 14,
    fontWeight: '600',
    color: '#4a2a00',
  },

  valueInput: {
    width: '44%',
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },

  computedBox: { width: '44%', alignItems: 'flex-end' },

  computedText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#b36b00',
  },

  sendWrap: {
    marginTop: 20,
    alignItems: 'center',
  },

  sendLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b36b00',
    marginBottom: 8,
  },

  gmailBtn: {
    width: 200,
    borderRadius: 28,
    overflow: 'hidden',
  },

  gmailInner: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gmailIcon: { width: 22, height: 22, marginRight: 10 },

  gmailText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#b36b00',
  },
});
