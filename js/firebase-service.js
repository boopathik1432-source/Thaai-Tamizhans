/* 🏆 THAAI TAMIZHANS (தாய் தமிழன்ஸ்) KABADDI CLUB — FIREBASE REAL-TIME SERVICE */

import { auth, db, storage, isInitialized } from './firebase-config.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  writeBatch 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import {
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js';

import {
  signInAnonymously,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

class FirebaseSyncService {
  constructor() {
    this.unsubscribers = [];
    this.status = 'idle'; // 'idle' | 'syncing' | 'live' | 'offline'
    this.onStatusChange = null;
    this.onDataUpdate = null;
    this.currentUser = null;
    this.isListening = false;
    this.lastSync = null;
  }

  updateStatus(status, message = '') {
    this.status = status;
    if (status === 'live') this.lastSync = new Date();
    if (typeof this.onStatusChange === 'function') {
      this.onStatusChange(status, message);
    }
  }

  isReady() {
    return isInitialized && db !== null;
  }

  // ----------------------------------------------------
  // AUTHENTICATION & SESSION HANDLING
  // ----------------------------------------------------
  initAuth(callback) {
    if (!auth) {
      if (callback) callback(null);
      return;
    }
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      if (callback) callback(user);
    });
  }

  async login(role, identity, pin) {
    if (!this.isReady()) {
      return { success: true, offline: true, role, identity };
    }
    try {
      this.updateStatus('syncing', 'Signing in...');
      // Sign in anonymously to authenticate with Firebase Auth
      const credential = await signInAnonymously(auth);
      const uid = credential.user.uid;

      // Sync user profile to users/{uid}
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        uid,
        name: identity.name || (role === 'coach' ? 'Coach Arun' : 'Player'),
        role,
        playerId: identity.playerId || null,
        phone: identity.phone || '',
        updatedAt: serverTimestamp()
      }, { merge: true });

      this.updateStatus('live', 'Connected');
      return { success: true, uid, role, identity };
    } catch (err) {
      console.warn('Firebase auth falling back to offline session:', err.message);
      this.updateStatus('offline', 'Local Session');
      return { success: true, offline: true, role, identity };
    }
  }

  async logout() {
    this.unsubscribeAll();
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Signout warning:', e);
      }
    }
    this.currentUser = null;
    this.updateStatus('idle', 'Logged Out');
  }

  // ----------------------------------------------------
  // REAL-TIME FIRESTORE LISTENERS (onSnapshot)
  // ----------------------------------------------------
  startRealtimeSync({ onDataUpdate, onStatusChange }) {
    if (this.isListening) {
      return;
    }

    this.onDataUpdate = onDataUpdate;
    this.onStatusChange = onStatusChange;

    if (!this.isReady()) {
      console.log('⚡ Firebase not initialized; using offline local storage mode.');
      this.updateStatus('offline', 'Local Cache');
      return;
    }

    this.updateStatus('syncing', 'Connecting to Cloud...');

    try {
      // 1. Players Collection
      const unsubPlayers = onSnapshot(collection(db, 'players'), (snapshot) => {
        if (!snapshot.empty) {
          const players = [];
          snapshot.forEach(docSnap => {
            players.push({ id: docSnap.id, ...docSnap.data() });
          });
          // Preserve numeric sorting if possible
          players.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
          this.notifyUpdate('players', players);
        }
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('players', err));
      this.unsubscribers.push(unsubPlayers);

      // 2. Today's Practice Singleton Doc: todayPractice/current
      const unsubToday = onSnapshot(doc(db, 'todayPractice', 'current'), (docSnap) => {
        if (docSnap.exists()) {
          this.notifyUpdate('todayPractice', docSnap.data());
        }
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('todayPractice', err));
      this.unsubscribers.push(unsubToday);

      // 3. Practice Calendar Collection
      const unsubCalendar = onSnapshot(collection(db, 'practiceCalendar'), (snapshot) => {
        const sessions = [];
        snapshot.forEach(docSnap => {
          sessions.push({ id: docSnap.id, ...docSnap.data() });
        });
        sessions.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        this.notifyUpdate('practiceCalendar', sessions);
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('practiceCalendar', err));
      this.unsubscribers.push(unsubCalendar);

      // 4. Instructions Collection
      const unsubInstructions = onSnapshot(collection(db, 'instructions'), (snapshot) => {
        const list = [];
        snapshot.forEach(docSnap => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        this.notifyUpdate('instructions', list);
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('instructions', err));
      this.unsubscribers.push(unsubInstructions);

      // 5. Match Notices Collection
      const unsubNotices = onSnapshot(collection(db, 'matchNotices'), (snapshot) => {
        const notices = [];
        snapshot.forEach(docSnap => {
          notices.push({ id: docSnap.id, ...docSnap.data() });
        });
        notices.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        this.notifyUpdate('matchNotices', notices);
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('matchNotices', err));
      this.unsubscribers.push(unsubNotices);

      // 6. Performance Collection
      const unsubPerf = onSnapshot(collection(db, 'performance'), (snapshot) => {
        const perfMap = {};
        snapshot.forEach(docSnap => {
          perfMap[docSnap.id] = docSnap.data();
        });
        this.notifyUpdate('performance', perfMap);
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('performance', err));
      this.unsubscribers.push(unsubPerf);

      // 7. Attendance Collection
      const unsubAttendance = onSnapshot(collection(db, 'attendance'), (snapshot) => {
        const attendanceList = [];
        snapshot.forEach(docSnap => {
          attendanceList.push({ date: docSnap.id, ...docSnap.data() });
        });
        this.notifyUpdate('attendanceRecords', attendanceList);
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('attendance', err));
      this.unsubscribers.push(unsubAttendance);

      // 8. Announcements Collection
      const unsubAnnounce = onSnapshot(collection(db, 'announcements'), (snapshot) => {
        const msgs = [];
        snapshot.forEach(docSnap => {
          msgs.push({ id: docSnap.id, ...docSnap.data() });
        });
        this.notifyUpdate('messages', msgs);
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('announcements', err));
      this.unsubscribers.push(unsubAnnounce);

      // 9. Files Collection
      const unsubFiles = onSnapshot(collection(db, 'files'), (snapshot) => {
        const fileList = [];
        snapshot.forEach(docSnap => {
          fileList.push({ id: docSnap.id, ...docSnap.data() });
        });
        this.notifyUpdate('files', fileList);
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('files', err));
      this.unsubscribers.push(unsubFiles);

      // 10. Notifications Collection
      const unsubNotifs = onSnapshot(collection(db, 'notifications'), (snapshot) => {
        const notifList = [];
        snapshot.forEach(docSnap => {
          notifList.push({ id: docSnap.id, ...docSnap.data() });
        });
        notifList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        this.notifyUpdate('notifications', notifList);
        this.updateStatus('live', '🟢 Firebase Live');
      }, (err) => this.handleListenerError('notifications', err));
      this.unsubscribers.push(unsubNotifs);

      this.isListening = true;
      console.log('✅ Real-time Firestore synchronization active across all 11 collections.');
    } catch (err) {
      console.warn('Real-time listener setup error:', err);
      this.updateStatus('offline', 'Local Cache');
    }
  }

  notifyUpdate(key, data) {
    if (typeof this.onDataUpdate === 'function') {
      this.onDataUpdate(key, data);
    }
  }

  handleListenerError(collectionName, err) {
    console.warn(`Firestore listener warning for [${collectionName}]:`, err.message);
    this.updateStatus('offline', 'Offline Cache');
  }

  unsubscribeAll() {
    this.unsubscribers.forEach(unsub => {
      try {
        if (typeof unsub === 'function') unsub();
      } catch (e) {
        console.warn('Unsubscribe error:', e);
      }
    });
    this.unsubscribers = [];
    this.isListening = false;
  }

  // ----------------------------------------------------
  // STORAGE HELPERS (Posters, Avatars, Strategy PDFs, Videos)
  // ----------------------------------------------------
  async uploadFile(path, fileOrDataUrl, contentType = 'image/jpeg') {
    if (!this.isReady() || !storage) {
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl);
    }
    try {
      this.updateStatus('syncing', 'Uploading file...');
      const storageRef = ref(storage, path);
      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
        await uploadString(storageRef, fileOrDataUrl, 'data_url');
      } else {
        await uploadBytes(storageRef, fileOrDataUrl, { contentType });
      }
      const downloadUrl = await getDownloadURL(storageRef);
      this.updateStatus('live', 'Uploaded');
      return downloadUrl;
    } catch (err) {
      console.warn('Storage upload warning (using fallback data):', err.message);
      this.updateStatus('offline', 'Storage Offline');
      return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl);
    }
  }

  async deleteFileByUrl(url) {
    if (!this.isReady() || !storage || !url || !url.includes('firebase')) return;
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (e) {
      console.warn('Storage delete skipped:', e.message);
    }
  }

  // ----------------------------------------------------
  // CLOUD FIRESTORE CRUD OPERATIONS
  // ----------------------------------------------------

  // 1. Players
  async savePlayer(player) {
    if (!this.isReady()) return;
    try {
      const docId = String(player.id || Date.now());
      await setDoc(doc(db, 'players', docId), {
        ...player,
        id: isNaN(player.id) ? player.id : Number(player.id),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('savePlayer failed:', err.message);
    }
  }

  async deletePlayer(id) {
    if (!this.isReady()) return;
    try {
      await deleteDoc(doc(db, 'players', String(id)));
    } catch (err) {
      console.warn('deletePlayer failed:', err.message);
    }
  }

  // 2. Today's Practice Singleton
  async saveTodayPractice(practice) {
    if (!this.isReady()) return;
    try {
      await setDoc(doc(db, 'todayPractice', 'current'), {
        ...practice,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('saveTodayPractice failed:', err.message);
    }
  }

  // 3. Practice Calendar
  async savePracticeSession(session) {
    if (!this.isReady()) return;
    try {
      const docId = String(session.id || Date.now());
      await setDoc(doc(db, 'practiceCalendar', docId), {
        ...session,
        id: isNaN(session.id) ? session.id : Number(session.id),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('savePracticeSession failed:', err.message);
    }
  }

  async deletePracticeSession(id) {
    if (!this.isReady()) return;
    try {
      await deleteDoc(doc(db, 'practiceCalendar', String(id)));
    } catch (err) {
      console.warn('deletePracticeSession failed:', err.message);
    }
  }

  // 4. Instructions
  async saveInstruction(instruction) {
    if (!this.isReady()) return;
    try {
      const docId = String(instruction.id || Date.now());
      await setDoc(doc(db, 'instructions', docId), {
        ...instruction,
        id: isNaN(instruction.id) ? instruction.id : Number(instruction.id),
        updatedAt: serverTimestamp(),
        createdAt: instruction.createdAt || Date.now()
      }, { merge: true });
    } catch (err) {
      console.warn('saveInstruction failed:', err.message);
    }
  }

  async deleteInstruction(id) {
    if (!this.isReady()) return;
    try {
      await deleteDoc(doc(db, 'instructions', String(id)));
    } catch (err) {
      console.warn('deleteInstruction failed:', err.message);
    }
  }

  // 5. Match Notices (with Storage image support)
  async saveMatchNotice(notice, imageFileOrBase64 = null) {
    if (!this.isReady()) return;
    try {
      const docId = String(notice.id || Date.now());
      let imageUrl = notice.image || notice.imageUrl || '';

      if (imageFileOrBase64) {
        const path = `match-notices/notice_${docId}_${Date.now()}.jpg`;
        imageUrl = await this.uploadFile(path, imageFileOrBase64, 'image/jpeg');
      }

      await setDoc(doc(db, 'matchNotices', docId), {
        ...notice,
        id: isNaN(notice.id) ? notice.id : Number(notice.id),
        imageUrl,
        image: imageUrl,
        updatedAt: serverTimestamp(),
        createdAt: notice.createdAt || Date.now()
      }, { merge: true });
    } catch (err) {
      console.warn('saveMatchNotice failed:', err.message);
    }
  }

  async deleteMatchNotice(id) {
    if (!this.isReady()) return;
    try {
      await deleteDoc(doc(db, 'matchNotices', String(id)));
    } catch (err) {
      console.warn('deleteMatchNotice failed:', err.message);
    }
  }

  // 6. Performance
  async savePerformance(playerId, perfData) {
    if (!this.isReady()) return;
    try {
      const docId = String(playerId);
      await setDoc(doc(db, 'performance', docId), {
        ...perfData,
        playerId: Number(playerId) || playerId,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('savePerformance failed:', err.message);
    }
  }

  // 7. Attendance
  async saveAttendance(dateStr, records) {
    if (!this.isReady()) return;
    try {
      const docId = dateStr || new Date().toISOString().slice(0, 10);
      await setDoc(doc(db, 'attendance', docId), {
        date: docId,
        records,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('saveAttendance failed:', err.message);
    }
  }

  // 8. Announcements
  async saveAnnouncement(announcement) {
    if (!this.isReady()) return;
    try {
      const docId = String(announcement.id || Date.now());
      await setDoc(doc(db, 'announcements', docId), {
        ...announcement,
        id: isNaN(announcement.id) ? announcement.id : Number(announcement.id),
        readBy: announcement.readBy || [],
        createdAt: announcement.createdAt || Date.now(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('saveAnnouncement failed:', err.message);
    }
  }

  async deleteAnnouncement(id) {
    if (!this.isReady()) return;
    try {
      await deleteDoc(doc(db, 'announcements', String(id)));
    } catch (err) {
      console.warn('deleteAnnouncement failed:', err.message);
    }
  }

  // 9. Files & Media Vault
  async saveFile(fileMetadata, fileBlob = null) {
    if (!this.isReady()) return;
    try {
      const docId = String(fileMetadata.id || Date.now());
      let storageUrl = fileMetadata.url || fileMetadata.storageUrl || '';

      if (fileBlob) {
        const ext = (fileMetadata.name || '').split('.').pop() || 'dat';
        const path = `vault-files/file_${docId}_${Date.now()}.${ext}`;
        storageUrl = await this.uploadFile(path, fileBlob, fileBlob.type || 'application/octet-stream');
      }

      await setDoc(doc(db, 'files', docId), {
        ...fileMetadata,
        id: isNaN(fileMetadata.id) ? fileMetadata.id : Number(fileMetadata.id),
        storageUrl,
        url: storageUrl,
        thumbnailUrl: fileMetadata.thumbnailUrl || fileMetadata.thumbnail || storageUrl,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn('saveFile failed:', err.message);
    }
  }

  async deleteFile(id) {
    if (!this.isReady()) return;
    try {
      await deleteDoc(doc(db, 'files', String(id)));
    } catch (err) {
      console.warn('deleteFile failed:', err.message);
    }
  }

  // 10. Notifications
  async addNotification(notif) {
    if (!this.isReady()) return;
    try {
      const docId = String(notif.id || Date.now());
      await setDoc(doc(db, 'notifications', docId), {
        ...notif,
        id: isNaN(notif.id) ? notif.id : Number(notif.id),
        readBy: notif.readBy || [],
        createdAt: notif.createdAt || Date.now()
      }, { merge: true });
    } catch (err) {
      console.warn('addNotification failed:', err.message);
    }
  }

  async markNotificationRead(notifId, userId) {
    if (!this.isReady()) return;
    try {
      const notifRef = doc(db, 'notifications', String(notifId));
      const notifSnap = await getDoc(notifRef);
      if (notifSnap.exists()) {
        const readBy = notifSnap.data().readBy || [];
        if (!readBy.includes(userId)) {
          readBy.push(userId);
          await setDoc(notifRef, { readBy }, { merge: true });
        }
      }
    } catch (err) {
      console.warn('markNotificationRead failed:', err.message);
    }
  }

  // 11. Initial Data Cloud Seed (1-Click migration from INITIAL_KABADDI_DATA)
  async seedInitialData(data) {
    if (!this.isReady() || !data) return;
    try {
      this.updateStatus('syncing', 'Seeding initial squad data...');

      // Seed Players
      if (Array.isArray(data.players)) {
        for (const p of data.players) {
          await this.savePlayer(p);
        }
      }

      // Seed Today Practice
      if (data.todayPractice) {
        await this.saveTodayPractice(data.todayPractice);
      }

      // Seed Practice Calendar
      if (Array.isArray(data.practiceCalendar)) {
        for (const s of data.practiceCalendar) {
          await this.savePracticeSession(s);
        }
      }

      // Seed Instructions
      if (Array.isArray(data.instructions)) {
        for (const inst of data.instructions) {
          await this.saveInstruction(inst);
        }
      }

      // Seed Match Notices
      if (Array.isArray(data.matchNotices)) {
        for (const n of data.matchNotices) {
          await this.saveMatchNotice(n);
        }
      }

      // Seed Performance
      if (data.performance) {
        for (const [pId, pData] of Object.entries(data.performance)) {
          await this.savePerformance(pId, pData);
        }
      }

      // Seed Announcements
      if (Array.isArray(data.messages)) {
        for (const m of data.messages) {
          await this.saveAnnouncement(m);
        }
      }

      // Seed Files
      if (Array.isArray(data.files)) {
        for (const f of data.files) {
          await this.saveFile(f);
        }
      }

      // Seed Notifications
      if (Array.isArray(data.notifications)) {
        for (const notif of data.notifications) {
          await this.addNotification(notif);
        }
      }

      this.updateStatus('live', '🟢 Firebase Seeded');
      console.log('✅ தாய் தமிழன்ஸ் initial data seeded successfully to Cloud Firestore.');
    } catch (err) {
      console.error('Error seeding initial data to Firestore:', err);
      this.updateStatus('offline', 'Seed Error');
    }
  }
}

// Instantiate and attach to global window
const firebaseSync = new FirebaseSyncService();
if (typeof window !== 'undefined') {
  window.FirebaseSync = firebaseSync;
}

export default firebaseSync;
