// frontend/src/screens/AdminScreen.js
// CLEAN MULTI-DEPARTMENT VERSION (OPTION A) + Admin Panel Header + User Mode Button

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import * as ImagePicker from "expo-image-picker";

import {
  uploadDeptMedia,
  loadDeptMedia,
  saveDeptFees,
  loadDeptFees,
} from "../lib/ccsMediaHelpers";

import COAlogo from "../../assets/COAlogo.png";
import CCSlogo from "../../assets/CCSlogo.png";
import CBAlogo from "../../assets/CBAlogo.png";
import CCJlogo from "../../assets/CCJlogo.png";
import COElogo from "../../assets/COElogo.png";
import CASlogo from "../../assets/CASlogo.png";

const DEPARTMENTS = [
  { key: "COA", title: "College of Accountancy", logo: COAlogo },
  { key: "CCS", title: "College of Computer Studies", logo: CCSlogo },
  { key: "CBA", title: "College of Business Administration", logo: CBAlogo },
  { key: "CCJ", title: "College of Criminal Justice", logo: CCJlogo },
  { key: "COE", title: "College of Engineering", logo: COElogo },
  { key: "CAS", title: "College of Arts & Science", logo: CASlogo },
];

const MEDIA_SLOTS = [
  { key: "newsMain", label: "News main image", subtitle: "Used in F5 main highlight" },
  { key: "eventsTop", label: "Events: top", subtitle: "Used in F6 top block" },
  { key: "eventsBottom", label: "Events: bottom", subtitle: "Used in F6 lower block" },
  { key: "ann1", label: "Announcement #1", subtitle: "Used in F7" },
  { key: "ann2", label: "Announcement #2", subtitle: "Used in F7" },
  { key: "ann3", label: "Announcement #3", subtitle: "Used in F7" },
  { key: "essentials", label: "Student Essentials", subtitle: "Used in F10" },
];

const INITIAL_HIGHLIGHT = { title: "", body: "" };

const INITIAL_MEDIA = {
  newsMain: null,
  eventsTop: null,
  eventsBottom: null,
  ann1: null,
  ann2: null,
  ann3: null,
  essentials: null,
};

const INITIAL_FEES = {
  sem: "1st",
  year: "1",
  acadYear: "2025–2026",
  tuition: "15000.00",
  lab: "1200.00",
  nonLab: "800.00",
  misc: "500.00",
  nstp: "200.00",
  otherFee: "0.00",
  discount: "1000.00",
  down: "3000.00",
};

export default function AdminScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);

  const [highlightByDept, setHighlightByDept] = useState(() => {
    const obj = {};
    DEPARTMENTS.forEach((d) => (obj[d.key] = { ...INITIAL_HIGHLIGHT }));
    return obj;
  });

  const [mediaByDept, setMediaByDept] = useState(() => {
    const obj = {};
    DEPARTMENTS.forEach((d) => (obj[d.key] = { ...INITIAL_MEDIA }));
    return obj;
  });

  const [feesByDept, setFeesByDept] = useState(() => {
    const obj = {};
    DEPARTMENTS.forEach((d) => (obj[d.key] = { ...INITIAL_FEES }));
    return obj;
  });

  const currentHighlight = highlightByDept[selectedDept.key];
  const currentMedia = mediaByDept[selectedDept.key];
  const currentFees = feesByDept[selectedDept.key];

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(24)).current;
  const saveGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(cardTranslateY, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(saveGlow, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(saveGlow, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const dept = selectedDept.key;

    (async () => {
      try {
        const [fees, media] = await Promise.all([
          loadDeptFees(dept),
          loadDeptMedia(dept),
        ]);

        if (fees) {
          setFeesByDept((prev) => ({
            ...prev,
            [dept]: { ...prev[dept], ...fees },
          }));
        }

        if (media) {
          setMediaByDept((prev) => ({
            ...prev,
            [dept]: { ...prev[dept], ...media },
          }));
        }
      } catch (e) {
        console.log("[AdminScreen] load error:", e);
      }
    })();
  }, [selectedDept.key]);

  const handleSelectImage = async (slotKey) => {
    try {
      const dept = selectedDept.key;

      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return Alert.alert("Permission required");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (result.canceled) return;

      const uri = result.assets?.[0]?.uri;
      if (!uri) return;

      const publicUrl = await uploadDeptMedia(dept, slotKey, uri);

      if (!publicUrl) return Alert.alert("Upload failed");

      setMediaByDept((prev) => ({
        ...prev,
        [dept]: { ...prev[dept], [slotKey]: publicUrl },
      }));

      Alert.alert("Success", "Image uploaded.");
    } catch (err) {
      console.log("[handleSelectImage] ERROR:", err);
    }
  };

  const handleSave = async () => {
    const dept = selectedDept.key;
    const payload = { ...feesByDept[dept], dept };

    const ok = await saveDeptFees(dept, payload);
    if (!ok) return Alert.alert("Error", "Failed to save fees.");

    Alert.alert("Success", `${dept} fees saved.`);
  };

  const renderMediaSection = () => {
    const activeMedia = mediaByDept[selectedDept.key];

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionLabel}>{selectedDept.key} Media</Text>
        <Text style={styles.sectionHint}>Images used in screens F5–F7 & F10.</Text>

        {MEDIA_SLOTS.map((slot) => {
          const hasImage = !!activeMedia[slot.key];

          return (
            <View key={slot.key} style={styles.mediaRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mediaLabel}>{slot.label}</Text>
                <Text style={styles.mediaSub}>{slot.subtitle}</Text>
              </View>

              <TouchableOpacity
                style={[styles.mediaThumb, hasImage && styles.mediaThumbActive]}
                onPress={() => handleSelectImage(slot.key)}
              >
                <Text style={styles.mediaThumbText}>
                  {hasImage ? "Change" : "Upload"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  const renderFeesSection = () => {
    const f = currentFees;

    const setFee = (field, value) => {
      setFeesByDept((prev) => ({
        ...prev,
        [selectedDept.key]: { ...prev[selectedDept.key], [field]: value },
      }));
    };

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionLabel}>
          {selectedDept.key} F8 – Tuition Fees
        </Text>
        <Text style={styles.sectionHint}>
          These values appear in the department’s F8 fees screen.
        </Text>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>Semester</Text>
            <TextInput
              value={f.sem}
              onChangeText={(v) => setFee("sem", v)}
              style={[styles.textInput, styles.smallInput]}
            />
          </View>
          <View style={[styles.col, { marginLeft: 10 }]}>
            <Text style={styles.fieldLabel}>Year</Text>
            <TextInput
              value={f.year}
              onChangeText={(v) => setFee("year", v)}
              style={[styles.textInput, styles.smallInput]}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col} />
          <View style={[styles.col, { marginLeft: 10 }]}>
            <Text style={styles.fieldLabel}>Academic Year</Text>
            <TextInput
              value={f.acadYear}
              onChangeText={(v) => setFee("acadYear", v)}
              style={[styles.textInput, styles.smallInput]}
            />
          </View>
        </View>

        <View style={styles.feesCard}>
          <Text style={styles.feesTitle}>Computation Fields</Text>

          {[
            ["Tuition Fee", "tuition"],
            ["Laboratory Fee", "lab"],
            ["Non-Lab Fee", "nonLab"],
            ["Misc Fee", "misc"],
            ["NSTP / ROTC", "nstp"],
            ["Other Fee", "otherFee"],
            ["Discount", "discount"],
            ["Down Payment", "down"],
          ].map(([label, field]) => (
            <View key={field} style={styles.feeRow}>
              <Text style={styles.feeLabel}>{label}</Text>
              <TextInput
                value={f[field]}
                onChangeText={(v) => setFee(field, v)}
                keyboardType="numeric"
                style={[styles.textInput, styles.feeInput]}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top + 6 }]}>
      
      {/* --------------------------- */}
      {/*   USER MODE BUTTON (TOP)   */}
      {/* --------------------------- */}
      <TouchableOpacity
        style={styles.userModeBtn}
        onPress={() => navigation.navigate("OnboardingScreen")}
      >
        <Text style={styles.userModeText}>User Mode</Text>
      </TouchableOpacity>

      {/* --------------------------- */}
      {/*      ADMIN PANEL HEADER     */}
      {/* --------------------------- */}
      <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 6 }}>
        <Text style={styles.adminTitle}>Admin Content Panel</Text>
        <Text style={styles.adminSubtitle}>
          Here admin can upload photos for updates and modify sample tuition computations.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }],
              width: SCREEN_W * 0.94,
              paddingHorizontal: 16,
              paddingVertical: 18,
            },
          ]}
        >
          {/* SELECT DEPARTMENT */}
          <Text style={styles.sectionLabel}>Select Department</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {DEPARTMENTS.map((dept) => {
              const active = dept.key === selectedDept.key;
              return (
                <TouchableOpacity
                  key={dept.key}
                  style={[
                    styles.deptChip,
                    active ? styles.deptChipActive : styles.deptChipInactive,
                  ]}
                  onPress={() => setSelectedDept(dept)}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: active ? "#ff423d" : "#333",
                    }}
                  >
                    {dept.key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Highlight Title */}
          <Text style={styles.fieldLabel}>Highlight Title</Text>
          <TextInput
            value={currentHighlight.title}
            onChangeText={(t) =>
              setHighlightByDept((prev) => ({
                ...prev,
                [selectedDept.key]: { ...prev[selectedDept.key], title: t },
              }))
            }
            style={[styles.textInput, { marginTop: 6 }]}
          />

          {/* Highlight Desc */}
          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
            Highlight Description
          </Text>
          <TextInput
            value={currentHighlight.body}
            onChangeText={(t) =>
              setHighlightByDept((prev) => ({
                ...prev,
                [selectedDept.key]: { ...prev[selectedDept.key], body: t },
              }))
            }
            multiline
            style={[
              styles.textInput,
              { height: 100, marginTop: 6, textAlignVertical: "top" },
            ]}
          />

          {renderMediaSection()}
          {renderFeesSection()}

          {/* SAVE */}
          <View style={{ marginTop: 30, alignItems: "center" }}>
            <Animated.View
              style={[
                styles.saveGlow,
                {
                  opacity: saveGlow.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.25, 0.6],
                  }),
                  transform: [
                    {
                      scale: saveGlow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.06],
                      }),
                    },
                  ],
                },
              ]}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// -------------------
//       STYLES
// -------------------
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f2f2f5",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 40,
  },

  // USER MODE BUTTON
  userModeBtn: {
    position: "absolute",
    top: 60,
    right: 16,
    zIndex: 99,
    backgroundColor: "#111",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  userModeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },

  // ADMIN HEADER
  adminTitle: {
    fontSize: 50,
    fontWeight: "900",
    color: "red",
  },
  adminSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#444",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777",
    textTransform: "uppercase",
  },
  sectionHint: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    marginBottom: 10,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },

  textInput: {
    backgroundColor: "rgba(0,0,0,0.04)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 10,
    color: "#111",
    height: 40,
  },

  deptChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
  },
  deptChipActive: {
    borderColor: "#ff423d",
    backgroundColor: "rgba(255,66,61,0.08)",
  },
  deptChipInactive: {
    borderColor: "rgba(0,0,0,0.15)",
    backgroundColor: "#fff",
  },

  mediaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  mediaLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#222",
  },
  mediaSub: {
    fontSize: 11,
    color: "#777",
  },
  mediaThumb: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "rgba(0,0,0,0.12)",
    marginLeft: 10,
  },
  mediaThumbActive: {
    borderColor: "#ff423d",
    backgroundColor: "rgba(255,66,61,0.10)",
  },
  mediaThumbText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ff423d",
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
  },
  col: {
    flex: 1,
  },

  smallInput: {
    marginTop: 6,
  },

  feesCard: {
    marginTop: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
    paddingVertical: 8,
  },
  feesTitle: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  feeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  feeLabel: {
    flex: 1.2,
    fontSize: 12,
  },
  feeInput: {
    flex: 1,
    height: 34,
    textAlign: "right",
    paddingHorizontal: 8,
  },

  saveGlow: {
    position: "absolute",
    width: 200,
    height: 50,
    borderRadius: 999,
    backgroundColor: "rgba(255,66,61,0.5)",
  },

  saveButton: {
    paddingHorizontal: 34,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: "#111",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
