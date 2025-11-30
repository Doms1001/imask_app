// src/lib/appCache.js
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MEDIA_DIR = FileSystem.cacheDirectory + "dept_media";

const MEDIA_CACHE_KEY = (dept, slot) => `mediaCache:${dept}:${slot}`;
const FEES_CACHE_KEY = (dept) => `feesCache:${dept}`;

/* ====================== MEDIA CACHE ====================== */

async function ensureMediaDir() {
  try {
    const info = await FileSystem.getInfoAsync(MEDIA_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(MEDIA_DIR, { intermediates: true });
    }
  } catch (e) {
    console.log("ensureMediaDir error", e);
  }
}

// Get cached image if available (file:// URI or null)
export async function getCachedImage(dept, slot) {
  const cacheKey = MEDIA_CACHE_KEY(dept, slot);
  try {
    const cachedStr = await AsyncStorage.getItem(cacheKey);
    if (!cachedStr) return null;

    const cached = JSON.parse(cachedStr);
    if (!cached.localUri) return null;

    const info = await FileSystem.getInfoAsync(cached.localUri);
    if (info.exists) return cached.localUri;

    return null;
  } catch (e) {
    console.log("getCachedImage error", e);
    return null;
  }
}

// Download remote image, store to file://, and cache metadata
export async function cacheDownloadImage(dept, slot, remoteUrl) {
  await ensureMediaDir();

  const localPath = `${MEDIA_DIR}/${dept}_${slot}`;

  const { uri } = await FileSystem.downloadAsync(remoteUrl, localPath);

  const cacheKey = MEDIA_CACHE_KEY(dept, slot);
  const cacheData = {
    dept,
    slot,
    localUri: uri,
    remoteUrl,
    updatedAt: Date.now(),
  };

  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (e) {
    console.log("cacheDownloadImage save error", e);
  }

  return uri;
}

/* ====================== FEES CACHE ====================== */

// Save one dept fees row (object) into cache
export async function saveFeesCache(dept, feesRow) {
  try {
    await AsyncStorage.setItem(
      FEES_CACHE_KEY(dept),
      JSON.stringify(feesRow || null)
    );
  } catch (e) {
    console.log("saveFeesCache error", e);
  }
}

// Load one dept fees row (object or null)
export async function loadFeesCache(dept) {
  try {
    const str = await AsyncStorage.getItem(FEES_CACHE_KEY(dept));
    if (!str) return null;
    return JSON.parse(str);
  } catch (e) {
    console.log("loadFeesCache error", e);
    return null;
  }
}
