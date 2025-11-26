// frontend/src/screens/AdminScreen.js

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
import { uploadCcsMedia } from "../lib/ccsMediaHelpers";


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

// CCS media slots for CCSF5–7 & CCSF10 (7 total)
const CCS_MEDIA_SLOTS = [
  {
    key: "newsMain",
    label: "News main image",
    subtitle: "Used in CCSF5 (big rectangle)",
  },
  {
    key: "eventsTop",
    label: "Events image – top",
    subtitle: "Used in CCSF6 (top blurred box)",
  },
  {
    key: "eventsBottom",
    label: "Events image – bottom",
    subtitle: "Used in CCSF6 (bottom blurred box)",
  },
  {
    key: "ann1",
    label: "Announcement image #1",
    subtitle: "Used in CCSF7",
  },
  {
    key: "ann2",
    label: "Announcement image #2",
    subtitle: "Used in CCSF7",
  },
  {
    key: "ann3",
    label: "Announcement image #3",
    subtitle: "Used in CCSF7",
  },
  {
    key: "essentials",
    label: "Student Essentials image",
    subtitle: "Used in CCSF10 (center rectangle)",
  },
];

export default function AdminScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_W, height: SCREEN_H } = useWindowDimensions();

  // dynamic scaling
  const BASE_W = 390;
  const BASE_H = 844;
  const scale = SCREEN_W / BASE_W;
  const vScale = SCREEN_H / BASE_H;
  const normalize = (size) => size * scale;
  const vNormalize = (size) => size * vScale;
  const isTablet = SCREEN_W > 600;

  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0]);

  // shared highlight text (later you can store per-dept if you want)
  const [titleText, setTitleText] = useState("");
  const [bodyText, setBodyText] = useState("");

  // CCS media local preview state (public_url once uploaded)
  const [ccsMedia, setCcsMedia] = useState({
    newsMain: null,
    eventsTop: null,
    eventsBottom: null,
    ann1: null,
    ann2: null,
    ann3: null,
    essentials: null,
  });

  // which slot is currently uploading (to show "Uploading...")
  const [uploadingSlot, setUploadingSlot] = useState(null);

  // CCSF8-like config values (only UI for now)
  const [ccsSem, setCcsSem] = useState("1st");
  const [ccsYear, setCcsYear] = useState("1");
  const [ccsAcadYear, setCcsAcadYear] = useState("2025–2026");

  const [ccsTuition, setCcsTuition] = useState("15000.00");
  const [ccsLab, setCcsLab] = useState("1200.00");
  const [ccsNonLab, setCcsNonLab] = useState("800.00");
  const [ccsMisc, setCcsMisc] = useState("500.00");
  const [ccsNstp, setCcsNstp] = useState("200.00");
  const [ccsOtherFee, setCcsOtherFee] = useState("0.00");
  const [ccsDiscount, setCcsDiscount] = useState("1000.00");
  const [ccsDown, setCcsDown] = useState("3000.00");

  // animations
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(24)).current;
  const blobTop = useRef(new Animated.Value(0)).current;
  const blobBottom = useRef(new Animated.Value(0)).current;
  const saveGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobTop, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(blobTop, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(blobBottom, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(blobBottom, {
          toValue: 0,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(saveGlow, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(saveGlow, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blobTop, blobBottom, cardOpacity, cardTranslateY, saveGlow]);

  const blobSize = Math.max(SCREEN_W * 0.9, 320);
  const blobTopTransX = blobTop.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 30],
  });
  const blobTopTransY = blobTop.interpolate({
    inputRange: [0, 1],
    outputRange: [-16, 10],
  });
  const blobTopScale = blobTop.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.08],
  });

  const blobBottomTransX = blobBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [40, -20],
  });
  const blobBottomTransY = blobBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [24, -12],
  });
  const blobBottomScale = blobBottom.interpolate({
    inputRange: [0, 1],
    outputRange: [1.05, 0.9],
  });

  const saveGlowScale = saveGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });
  const saveGlowOpacity = saveGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.6],
  });

  // REAL image picker + upload to Supabase
  const handleSelectImage = async (slotKey) => {
    if (selectedDept.key !== "CCS") {
      Alert.alert(
        "Not yet supported",
        "Per-screen uploads are currently wired only for CCS in this prototype."
      );
      return;
    }

    try {
      // ask permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please allow access to your photos to upload images."
        );
        return;
      }

      // open gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets && result.assets[0];
      if (!asset?.uri) {
        Alert.alert("Error", "Could not read image file.");
        return;
      }

      setUploadingSlot(slotKey);

      // upload to Supabase (bucket: department_images, table: ccs_media)
      const publicUrl = await uploadCcsMedia(slotKey, asset.uri);

      // update local preview
      setCcsMedia((prev) => ({
        ...prev,
        [slotKey]: publicUrl,
      }));

      Alert.alert("Uploaded", "Image updated successfully.");
    } catch (e) {
      console.log("[handleSelectImage] error:", e);
      Alert.alert("Upload failed", "Something went wrong. Please try again.");
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleSave = () => {
    if (selectedDept.key === "CCS") {
      console.log("CCS highlight:", { titleText, bodyText });
      console.log("CCS media slots:", ccsMedia);
      console.log("CCS tuition config:", {
        ccsSem,
        ccsYear,
        ccsAcadYear,
        ccsTuition,
        ccsLab,
        ccsNonLab,
        ccsMisc,
        ccsNstp,
        ccsOtherFee,
        ccsDiscount,
        ccsDown,
      });
      Alert.alert(
        "Saved (UI only)",
        "CCS settings logged in console. Later this can also be stored in Supabase."
      );
    } else {
      Alert.alert(
        "Saved (UI only)",
        `Department: ${selectedDept.key}\nWe’ll add real save logic later.`
      );
    }
  };

  const renderCcsMediaSection = () => {
    return (
      <View style={{ marginTop: vNormalize(18) }}>
        <Text style={styles.sectionLabel}>CCS screens media</Text>
        <Text style={styles.sectionHint}>
          These images appear in CCSF5–CCSF7 & CCSF10.
        </Text>

        {CCS_MEDIA_SLOTS.map((slot) => {
          const hasImage = !!ccsMedia[slot.key];
          const isUploading = uploadingSlot === slot.key;

          return (
            <View key={slot.key} style={styles.mediaRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mediaLabel}>{slot.label}</Text>
                <Text style={styles.mediaSub}>{slot.subtitle}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.mediaThumb,
                  hasImage && styles.mediaThumbActive,
                  isUploading && { opacity: 0.6 },
                ]}
                activeOpacity={0.9}
                onPress={() => handleSelectImage(slot.key)}
                disabled={isUploading}
              >
                <Text style={styles.mediaThumbText}>
                  {isUploading ? "Uploading..." : hasImage ? "Change" : "Upload"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  const renderCcsFeesSection = () => {
    return (
      <View style={{ marginTop: vNormalize(18) }}>
        <Text style={styles.sectionLabel}>CCSF8 – Tuition computation</Text>
        <Text style={styles.sectionHint}>
          These values will later be used by the CCSF8 “Computation of Fees”
          screen.
        </Text>

        {/* Row: Semester + Year */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.fieldLabel}>Semester</Text>
            <TextInput
              value={ccsSem}
              onChangeText={setCcsSem}
              placeholder="1st"
              placeholderTextColor="rgba(0,0,0,0.35)"
              style={[styles.textInput, styles.smallInput]}
            />
          </View>
          <View style={[styles.col, { marginLeft: 10 }]}>
            <Text style={styles.fieldLabel}>Year</Text>
            <TextInput
              value={ccsYear}
              onChangeText={setCcsYear}
              placeholder="1"
              placeholderTextColor="rgba(0,0,0,0.35)"
              style={[styles.textInput, styles.smallInput]}
            />
          </View>
        </View>

        {/* Row: Academic year */}
        <View style={styles.row}>
          <View style={styles.col} />
          <View style={[styles.col, { marginLeft: 10 }]}>
            <Text style={styles.fieldLabel}>Academic Year</Text>
            <TextInput
              value={ccsAcadYear}
              onChangeText={setCcsAcadYear}
              placeholder="2025–2026"
              placeholderTextColor="rgba(0,0,0,0.35)"
              style={[styles.textInput, styles.smallInput]}
            />
          </View>
        </View>

        {/* Fees table style – simple stacked inputs */}
        <View style={styles.feesCard}>
          <Text style={styles.feesTitle}>Computation fields</Text>

          {[
            { label: "Tuition Fee", value: ccsTuition, setter: setCcsTuition },
            { label: "Laboratory Fee", value: ccsLab, setter: setCcsLab },
            { label: "Non-Lab Fee", value: ccsNonLab, setter: setCcsNonLab },
            { label: "Misc Fee", value: ccsMisc, setter: setCcsMisc },
            { label: "NSTP / ROTC Fee", value: ccsNstp, setter: setCcsNstp },
            { label: "Other Fee", value: ccsOtherFee, setter: setCcsOtherFee },
            { label: "Discount", value: ccsDiscount, setter: setCcsDiscount },
            {
              label: "Down Payment",
              value: ccsDown,
              setter: setCcsDown,
            },
          ].map((row) => (
            <View key={row.label} style={styles.feeRow}>
              <Text style={styles.feeLabel}>{row.label}</Text>
              <TextInput
                value={row.value}
                onChangeText={row.setter}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="rgba(0,0,0,0.35)"
                style={[styles.textInput, styles.feeInput]}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const isCCS = selectedDept.key === "CCS";

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* base white */}
      <View style={styles.whiteLayer} />

      {/* top blob */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: blobSize,
            height: blobSize,
            top: -blobSize * 0.35,
            left: -blobSize * 0.3,
            backgroundColor: "#ff6b3b",
            opacity: 0.23,
            transform: [
              { translateX: blobTopTransX },
              { translateY: blobTopTransY },
              { scale: blobTopScale },
            ],
          },
        ]}
      />

      {/* bottom blob */}
      <Animated.View
        style={[
          styles.blob,
          {
            width: blobSize * 1.1,
            height: blobSize * 1.1,
            bottom: -blobSize * 0.45,
            right: -blobSize * 0.35,
            backgroundColor: "#0b0b0f",
            opacity: 0.2,
            transform: [
              { translateX: blobBottomTransX },
              { translateY: blobBottomTransY },
              { scale: blobBottomScale },
            ],
          },
        ]}
      />

      {/* header */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: normalize(18),
            marginTop: vNormalize(6),
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.headerTitle,
              { fontSize: normalize(isTablet ? 26 : 22) },
            ]}
          >
            Admin Control Center
          </Text>
          <Text
            style={[
              styles.headerSub,
              { fontSize: normalize(isTablet ? 13 : 12) },
            ]}
          >
            Manage images and highlight text for each department.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Onboarding")}
          style={styles.headerBadge}
          activeOpacity={0.9}
        >
          <Text style={styles.headerBadgeText}>User mode</Text>
        </TouchableOpacity>
      </View>

      {/* content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            minHeight: SCREEN_H * 0.9,
            paddingHorizontal: normalize(16),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={[
            styles.card,
            {
              width: SCREEN_W * (isTablet ? 0.8 : 0.94),
              paddingHorizontal: normalize(18),
              paddingVertical: vNormalize(18),
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }],
            },
          ]}
        >
          {/* dept pills */}
          <Text style={styles.sectionLabel}>Select department</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: vNormalize(10),
            }}
          >
            {DEPARTMENTS.map((dept) => {
              const isActive = dept.key === selectedDept.key;
              return (
                <TouchableOpacity
                  key={dept.key}
                  style={[
                    styles.deptChip,
                    {
                      borderColor: isActive
                        ? "rgba(255,66,61,0.9)"
                        : "rgba(0,0,0,0.12)",
                      backgroundColor: isActive
                        ? "rgba(255,66,61,0.06)"
                        : "rgba(255,255,255,0.85)",
                    },
                  ]}
                  onPress={() => setSelectedDept(dept)}
                  activeOpacity={0.85}
                >
                  <View style={styles.deptAvatar}>
                    <View style={styles.deptAvatarInner} />
                  </View>
                  <Text
                    style={[
                      styles.deptChipText,
                      {
                        color: isActive ? "#ff423d" : "#222",
                      },
                    ]}
                  >
                    {dept.key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* current dept label */}
          <View style={styles.selectedRow}>
            <Text style={styles.selectedLabel}>Editing</Text>
            <Text style={styles.selectedValue}>{selectedDept.title}</Text>
          </View>

          {/* upload area (generic cover) */}
          <View
            style={[
              styles.uploadBox,
              {
                height: vNormalize(120),
                marginTop: vNormalize(14),
              },
            ]}
          >
            <View style={styles.uploadBorderLayer} />
            <View style={styles.uploadInner}>
              <Text style={styles.uploadTitle}>Department cover image</Text>
              <Text style={styles.uploadSub}>
                This could appear on the main Departments listing or hero screen
                later.
              </Text>

              <TouchableOpacity
                style={[styles.uploadButton, { marginTop: vNormalize(10) }]}
                onPress={() =>
                  Alert.alert(
                    "Upload cover",
                    "Later this will upload a per-department cover image."
                  )
                }
                activeOpacity={0.9}
              >
                <Text style={styles.uploadButtonText}>
                  Upload / Change cover
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* text editors (highlight text) */}
          <View style={{ marginTop: vNormalize(18) }}>
            <Text style={styles.fieldLabel}>Highlight title</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  height: vNormalize(44),
                  paddingHorizontal: normalize(10),
                  marginTop: vNormalize(6),
                },
              ]}
              value={titleText}
              onChangeText={setTitleText}
              placeholder="e.g., Be future-ready with CCS."
              placeholderTextColor="rgba(0,0,0,0.35)"
            />

            <Text
              style={[
                styles.fieldLabel,
                { marginTop: vNormalize(12) },
              ]}
            >
              Highlight description
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  height: vNormalize(90),
                  paddingHorizontal: normalize(10),
                  paddingTop: vNormalize(8),
                  textAlignVertical: "top",
                  marginTop: vNormalize(6),
                },
              ]}
              value={bodyText}
              onChangeText={setBodyText}
              placeholder="Short pitch or description shown to students..."
              placeholderTextColor="rgba(0,0,0,0.35)"
              multiline
            />
          </View>

          {/* CCS-only extra sections */}
          {isCCS ? (
            <>
              {renderCcsMediaSection()}
              {renderCcsFeesSection()}
            </>
          ) : (
            <View style={{ marginTop: vNormalize(18) }}>
              <Text style={styles.sectionLabel}>Per-screen media</Text>
              <Text style={styles.sectionHint}>
                For {selectedDept.key}, we will add specific upload slots later.
                For now, only CCS is fully wired in this prototype.
              </Text>
            </View>
          )}

          {/* Save button with glow */}
          <View style={{ marginTop: vNormalize(24), alignItems: "center" }}>
            <Animated.View
              style={[
                styles.saveGlow,
                {
                  opacity: saveGlowOpacity,
                  transform: [{ scale: saveGlowScale }],
                },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  paddingVertical: vNormalize(12),
                  paddingHorizontal: normalize(38),
                },
              ]}
              activeOpacity={0.92}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f3f3f6",
  },
  whiteLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
  },
  blob: {
    position: "absolute",
    borderRadius: 9999,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#111",
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  headerSub: {
    marginTop: 2,
    color: "#555",
    fontWeight: "500",
  },
  headerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.85)",
  },
  headerBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 24,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#777",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sectionHint: {
    marginTop: 4,
    fontSize: 11,
    color: "#999",
  },

  deptChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
  },
  deptAvatar: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  deptAvatarInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#ff423d",
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: "700",
  },

  selectedRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 6,
  },
  selectedLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    marginRight: 4,
  },
  selectedValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
    flexShrink: 1,
  },

  uploadBox: {
    borderRadius: 18,
    overflow: "hidden",
    justifyContent: "center",
  },
  uploadBorderLayer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,66,61,0.55)",
    borderStyle: "dashed",
  },
  uploadInner: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "center",
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#222",
  },
  uploadSub: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  uploadButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#ff423d",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  fieldLabel: {
    fontSize: 12,
    color: "#222",
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    color: "#000",
  },

  // CCS media rows
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
    marginTop: 2,
  },
  mediaThumb: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.16)",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  mediaThumbActive: {
    borderColor: "#ff423d",
    backgroundColor: "rgba(255,66,61,0.08)",
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
    height: 40,
    paddingHorizontal: 10,
    marginTop: 6,
  },

  feesCard: {
    marginTop: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingVertical: 8,
  },
  feesTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#444",
    paddingHorizontal: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
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
    color: "#222",
  },
  feeInput: {
    flex: 1,
    height: 34,
    paddingHorizontal: 8,
    textAlign: "right",
  },

  saveGlow: {
    position: "absolute",
    width: 200,
    height: 54,
    borderRadius: 999,
    backgroundColor: "rgba(255,66,61,0.55)",
  },
  saveButton: {
    borderRadius: 999,
    backgroundColor: "#0b1113",
    justifyContent: "center",
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
