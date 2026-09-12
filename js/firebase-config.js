/* 🏆 THAAI TAMIZHANS (தாய் தமிழன்ஸ்) KABADDI CLUB — FIREBASE CONFIGURATION */

// Firebase Web Modular SDK v10 (ESM CDN)
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

// Default Firebase Configuration for தாய் தமிழன்ஸ் KABADDI Portal
// Keys can be overridden via:
// 1. window.__FIREBASE_CONFIG__ (Injected in deployment / HTML)
// 2. localStorage item 'thaai_tamizhans_firebase_config' (Config modal)
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB_ThaaiTamizhansKabaddiClub_Prod2026",
  authDomain: "thaai-tamizhans-kabaddi.firebaseapp.com",
  projectId: "thaai-tamizhans-kabaddi",
  storageBucket: "thaai-tamizhans-kabaddi.appspot.com",
  messagingSenderId: "987654321000",
  appId: "1:987654321000:web:thaaitamizhans2026club"
};

function getActiveConfig() {
  // Check window injection (Vercel build or inline script)
  if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__ && window.__FIREBASE_CONFIG__.projectId) {
    return window.__FIREBASE_CONFIG__;
  }
  // Check localStorage override
  try {
    const local = localStorage.getItem('thaai_tamizhans_firebase_config');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && parsed.projectId) return parsed;
    }
  } catch (e) {
    console.warn('Could not read firebase config from storage:', e);
  }
  return DEFAULT_FIREBASE_CONFIG;
}

let app = null;
let auth = null;
let db = null;
let storage = null;
let isInitialized = false;

try {
  const config = getActiveConfig();
  if (getApps().length === 0) {
    app = initializeApp(config);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  isInitialized = true;
  console.log('🔥 Firebase Modular SDK v10 Initialized for தாய் தமிழன்ஸ் (Project:', config.projectId, ')');
} catch (error) {
  console.warn('⚠️ Firebase initialization deferred or running in local offline cache mode:', error.message);
  isInitialized = false;
}

export {
  app,
  auth,
  db,
  storage,
  isInitialized,
  getActiveConfig
};
