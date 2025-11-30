// frontend/src/screens/CCJ/CCJF8.js
// CCJF8 – Tuition / fees screen for CCJ (dark theme)

import React, { useRef, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
  Text,
  TextInput,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getCurrentVisitorName } from "../../state/userSession";
import { loadDeptFees } from "../../lib/ccsMediaHelpers";

const { width, height } = Dimensions.get("window");
const BACK = require("../../../assets/back.png");
const GMAIL_IMG = require("../../../assets/gmail.png");
const DEPT = "CCJ";

export default function CCJF8({ navigation }) {
  const dummy = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dummy, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  function navSafe(route) {
    if (navigation?.navigate) navigation.navigate(route);
  }

  const initialName = getCurrentVisitorName() || "";
  const [name, setName] = useState(initialName);

  const [semester, setSemester] = useState("1st");
  const [year, setYear] = useState("1");
  const [acadYear, setAcadYear] = useState("2025–2026");

  const [tuition, setTuition] = useState("15000.00");
  const [lab, setLab] = useState("1200.00");
  const [nonLab, setNonLab] = useState("800.00");
  const [misc, setMisc] = useState("500.00");
  const [nstp, setNstp] = useState("200.00");
  const [otherFee, setOtherFee] = useState("0.00");
  const [discount, setDiscount] = useState("1000.00");
  const [downPayment, setDownPayment] = useState("3000.00");

  // Load CCJ fees from Supabase
  useEffect(() => {
    (async () => {
      try {
        const remote = await loadDeptFees(DEPT);
        console.log("[CCJF8] remote CCJ fees:", remote);
        if (!remote) return;

        if (remote.sem) setSemester(remote.sem);
        if (remote.year) setYear(remote.year);
        if (remote.acadYear) setAcadYear(remote.acadYear);
        if (remote.tuition) setTuition(remote.tuition);
        if (remote.lab) setLab(remote.lab);
        if (remote.nonLab) setNonLab(remote.nonLab);
        if (remote.misc) setMisc(remote.misc);
        if (remote.nstp) setNstp(remote.nstp);
        if (remote.otherFee) setOtherFee(remote.otherFee);
        if (remote.discount) setDiscount(remote.discount);
        if (remote.down) setDownPayment(remote.down);
      } catch (err) {
        console.log("[CCJF8] failed to load remote fees:", err);
      }
    })();
  }, []);

  const parseNum = (v) => {
    const n = parseFloat(String(v).replace(/[^0-9.-]+/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const totalFees =
    parseNum(tuition) +
    parseNum(lab) +
    parseNum(nonLab) +
    parseNum(misc) +
    parseNum(nstp) +
    parseNum(otherFee);

  const totalAfterDiscount = Math.max(0, totalFees - parseNum(discount));
  const balance = Math.max(0, totalAfterDiscount - parseNum(downPayment));

  function sendEmail() {
    const subject = encodeURIComponent("Computation of Fees");
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Department: CCJ`,
        `Semester: ${semester}`,
        `Year: ${year}`,
        `Academic Year: ${acadYear}`,
        "",
        "Computation of Fees:",
        `Tuition Fee: ${tuition}`,
        `Laboratory Fee: ${lab}`,
        `Non-Lab Fee: ${nonLab}`,
        `Misc Fee: ${misc}`,
        `NSTP/ROTC Fee: ${nstp}`,
        `Other Fee: ${otherFee}`,
        `Discount: ${discount}`,
        `TOTAL FEES: ${totalFees.toFixed(2)}`,
        `Down Payment: ${downPayment}`,
        `Balance: ${balance.toFixed(2)}`,
      ].join("\n")
    );

    const mailto = `mailto:?subject=${subject}&body=${body}`;
    Linking.openURL(mailto).catch(() => {
      Alert.alert("Error", "Unable to open mail client.");
    });
  }

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar
        barStyle={Platform.OS === "android" ? "light-content" : "light-content"}
      />

      {/* CCJ dark background (same layout as CCSF8) */}
      <LinearGradient colors={["#111111", "#050505"]} style={s.bg} />
      <View style={s.layerTopRight} />
      <View style={s.layerBottomLeft} />

      <TouchableWithoutFeedback onPress={() => navSafe("CCJF4")}>
        <View style={s.back}>
          <Image source={BACK} style={s.backImg} />
        </View>
      </TouchableWithoutFeedback>

      <View style={s.contentWrap}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* NAME full width */}
          <View style={{ marginBottom: 14 }}>
            <Text style={s.label}>Name:</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor="#888"
              style={s.input}
            />
          </View>

          {/* Semester + Year */}
          <View style={s.formRow}>
            <View style={s.formColHalf}>
              <Text style={s.label}>Semester:</Text>
              <TextInput
                value={semester}
                onChangeText={setSemester}
                placeholder="e.g. 1st"
                placeholderTextColor="#888"
                style={s.input}
              />
            </View>

            <View style={[s.formColHalf, { marginLeft: 10 }]}>
              <Text style={s.label}>Year:</Text>
              <TextInput
                value={year}
                onChangeText={setYear}
                placeholder="e.g. 1"
                placeholderTextColor="#888"
                style={s.input}
              />
            </View>
          </View>

          {/* Academic Year */}
          <View style={s.formRow}>
            <View style={s.formColHalf} />
            <View style={[s.formColHalf, { marginLeft: 10 }]}>
              <Text style={s.label}>Academic Year:</Text>
              <TextInput
                value={acadYear}
                onChangeText={setAcadYear}
                placeholder="e.g. 2024–2025"
                placeholderTextColor="#888"
                style={s.input}
              />
            </View>
          </View>

          {/* Fees Table */}
          <View style={s.tableCard}>
            <Text style={s.tableTitle}>Computation of Fees</Text>

            <View style={s.table}>
              {[
                { label: "Tuition Fee", value: tuition, onChange: setTuition },
                { label: "Laboratory Fee", value: lab, onChange: setLab },
                { label: "Non-Lab Fee", value: nonLab, onChange: setNonLab },
                { label: "Misc Fee", value: misc, onChange: setMisc },
                { label: "NSTP/ROTC Fee", value: nstp, onChange: setNstp },
                { label: "Other Fee", value: otherFee, onChange: setOtherFee },
                { label: "Discount", value: discount, onChange: setDiscount },
                {
                  label: "TOTAL FEES",
                  value: totalFees.toFixed(2),
                  static: true,
                },
                {
                  label: "Down Payment",
                  value: downPayment,
                  onChange: setDownPayment,
                },
                {
                  label: "Balance",
                  value: balance.toFixed(2),
                  static: true,
                },
              ].map((row, idx) => (
                <View key={idx} style={s.tableRow}>
                  <View style={s.tdLeft}>
                    <Text style={s.tdLabel}>{row.label}</Text>
                  </View>

                  <View style={s.tdRight}>
                    {row.static ? (
                      <Text style={s.tdValueStatic}>{row.value}</Text>
                    ) : (
                      <TextInput
                        value={row.value}
                        onChangeText={row.onChange}
                        placeholder="0.00"
                        placeholderTextColor="#777"
                        keyboardType="numeric"
                        style={s.tdInput}
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Gmail Button */}
          <View style={s.sendWrap}>
            <Text style={s.sendLabel}>Send copy via Email</Text>

            <TouchableOpacity style={s.gmailBtn} onPress={sendEmail}>
              <View style={s.gmailInner}>
                <Image source={GMAIL_IMG} style={s.gmailImg} />
                <Text style={s.gmailText}>Gmail</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000", alignItems: "center" },
  bg: { ...StyleSheet.absoluteFillObject },

  layerTopRight: {
    position: "absolute",
    right: -40,
    top: -20,
    width: 220,
    height: 220,
    borderRadius: 18,
    backgroundColor: "#2f2f2f",
    opacity: 0.28,
  },
  layerBottomLeft: {
    position: "absolute",
    left: -60,
    bottom: -80,
    width: 260,
    height: 260,
    borderRadius: 160,
    backgroundColor: "#444444",
    opacity: 0.4,
  },

  back: {
    position: "absolute",
    right: 14,
    top: 50,
    width: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  backImg: { width: 34, height: 34, tintColor: "#ffffff" },

  contentWrap: {
    marginTop: 36,
    width: Math.min(420, width - 28),
    height: Math.min(560, height * 0.72),
    backgroundColor: "#101010",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 6,
  },

  scrollContent: { padding: 14, paddingBottom: 30 },

  label: { fontSize: 13, fontWeight: "600", color: "#f5f5f5", marginBottom: 6 },

  input: {
    height: 38,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#181818",
    borderColor: "#333333",
    borderWidth: 1,
    color: "#ffffff",
  },

  formRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  formColHalf: {
    flex: 1,
  },

  tableCard: {
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#151515",
  },
  tableTitle: {
    padding: 10,
    backgroundColor: "#1f1f1f",
    fontSize: 14,
    fontWeight: "700",
    color: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  table: {},
  tableRow: {
    flexDirection: "row",
    minHeight: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    alignItems: "center",
  },
  tdLeft: { flex: 2, paddingHorizontal: 10 },
  tdRight: { flex: 1, paddingHorizontal: 10, alignItems: "flex-end" },
  tdLabel: { fontSize: 13, color: "#eeeeee" },
  tdInput: {
    height: 32,
    width: "100%",
    backgroundColor: "#181818",
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    textAlign: "right",
    color: "#ffffff",
  },
  tdValueStatic: { fontSize: 13, fontWeight: "700", color: "#ffffff" },

  sendWrap: { marginTop: 18, alignItems: "center" },
  sendLabel: { fontSize: 12, color: "#f0f0f0", marginBottom: 8 },
  gmailBtn: {
    width: 160,
    borderRadius: 26,
    backgroundColor: "#ffffff",
    elevation: 6,
  },
  gmailInner: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  gmailImg: { width: 26, height: 22, marginRight: 10, resizeMode: "contain" },
  gmailText: { fontSize: 14, fontWeight: "700", color: "#111111" },
});
