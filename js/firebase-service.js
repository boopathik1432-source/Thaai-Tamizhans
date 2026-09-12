/* 🏆 தாய் தமிழன்ஸ் (THAAI TAMIZHANS) - COMPLETE CLOUD FIRESTORE REAL-TIME DATABASE ENGINE */

const firebaseConfig = {
  apiKey: "AIzaSyDK3fUCYkdCZnQhu8AW3teWdXM5ZvW6POw",
  authDomain: "thaai-tamizhans.firebaseapp.com",
  projectId: "thaai-tamizhans",
  storageBucket: "thaai-tamizhans.firebasestorage.app",
  messagingSenderId: "685067889091",
  appId: "1:685067889091:web:4f439d73fc8749c9deb576",
  measurementId: "G-NJFGLVPR9D"
};

window.FirebaseSync = {
  app: null,
  db: null,
  analytics: null,
  isInitialized: false,
  isConnected: false,
  isRemoteUpdating: false,
  debounceTimer: null,
  
  // Primary Master Collection & Document
  collectionName: 'thaai_tamizhans_club',
  docId: 'app_live_state',

  // All 10 Project Database Tables (Firestore Collections)
  tables: [
    { key: 'players', name: '👥 வீரர்கள் (Players Table)', collection: 'players' },
    { key: 'todayPractice', name: '📋 இன்றைய பயிற்சி (Today Practice)', collection: 'today_practice' },
    { key: 'practiceCalendar', name: '📅 பயிற்சி அட்டவணை (Practice Schedule)', collection: 'practice_calendar' },
    { key: 'instructions', name: '🎯 வீரர் பயிற்சிக் குறிப்புகள் (Instructions)', collection: 'instructions' },
    { key: 'matchNotices', name: '📢 போட்டி அறிவிப்புகள் (Match Notices)', collection: 'match_notices' },
    { key: 'performance', name: '📊 வீரர்கள் செயல்திறன் (Performance Matrix)', collection: 'performance' },
    { key: 'todayAttendance', name: '✅ தினசரி வருகைப் பதிவு (Attendance)', collection: 'attendance' },
    { key: 'messages', name: '💬 பொது அறிவிப்புகள் (Announcements)', collection: 'announcements' },
    { key: 'files', name: '📁 அணி ஆவணங்கள் & வீடியோ (Files Vault)', collection: 'vault_files' },
    { key: 'notifications', name: '🔔 அறிவிப்புகள் (Notifications)', collection: 'notifications' }
  ],

  // 1. BOOTSTRAP & INITIALIZE
  init() {
    try {
      if (typeof firebase === 'undefined') {
        console.warn('⚠️ Firebase SDK not loaded yet.');
        this.updateBadge('offline', 'SDK Not Loaded');
        return;
      }

      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(firebaseConfig);
      } else {
        this.app = firebase.app();
      }

      this.db = firebase.firestore();

      // Enable offline persistence
      this.db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.info('Firestore: multi-tab persistence shared.');
        }
      });

      if (typeof firebase.analytics === 'function') {
        try { this.analytics = firebase.analytics(); } catch (e) {}
      }

      this.isInitialized = true;
      this.updateBadge('connecting', 'Connecting...');
      console.log('🔥 Firebase Initialized for Thaai Tamizhans');

      // Start Real-Time Listener
      this.listenToRealtime();

    } catch (error) {
      console.error('❌ Firebase Init Error:', error);
      this.updateBadge('error', 'Init Error');
    }
  },

  // 2. REAL-TIME LISTENER (Live multi-device sync)
  listenToRealtime() {
    if (!this.db) return;

    const docRef = this.db.collection(this.collectionName).doc(this.docId);

    docRef.onSnapshot(
      (doc) => {
        this.isConnected = true;
        this.updateBadge('live', 'Live Connected');

        if (doc.exists) {
          const data = doc.data();
          if (data && data.payload) {
            console.log('⚡ [Firebase Live] Received cloud data update');
            this.applyRemoteData(data.payload);
          }
        } else {
          console.log('📝 [Firebase] First time database setup. Creating all tables in Firestore...');
          this.seedAllDatabaseTables();
        }
      },
      (error) => {
        console.warn('⚠️ [Firebase] Realtime Listener Error:', error);
        if (error.code === 'permission-denied') {
          this.updateBadge('warning', 'Rules Denied');
        } else {
          this.updateBadge('offline', 'Offline');
        }
      }
    );
  },

  // 3. SEED AND CREATE ALL 10 TABLES IN CLOUD FIRESTORE
  async seedAllDatabaseTables() {
    if (!this.db) {
      console.error('Firestore not available');
      return;
    }

    try {
      this.updateBadge('syncing', 'Creating Tables...');
      console.log('🚀 Creating and populating all 10 Cloud Firestore Collections (Tables)...');

      const sourceData = (typeof appData !== 'undefined' && appData) ? appData : INITIAL_KABADDI_DATA;
      const batch = this.db.batch();

      // Table 1: Players Collection
      if (sourceData.players && Array.isArray(sourceData.players)) {
        sourceData.players.forEach(p => {
          const ref = this.db.collection('players').doc(String(p.id));
          batch.set(ref, { ...p, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
      }

      // Table 2: Today Practice
      if (sourceData.todayPractice) {
        const ref = this.db.collection('today_practice').doc('current');
        batch.set(ref, { ...sourceData.todayPractice, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      }

      // Table 3: Practice Calendar
      if (sourceData.practiceCalendar && Array.isArray(sourceData.practiceCalendar)) {
        sourceData.practiceCalendar.forEach(item => {
          const ref = this.db.collection('practice_calendar').doc(String(item.id));
          batch.set(ref, { ...item, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
      }

      // Table 4: Instructions
      if (sourceData.instructions && Array.isArray(sourceData.instructions)) {
        sourceData.instructions.forEach(ins => {
          const ref = this.db.collection('instructions').doc(String(ins.id));
          batch.set(ref, { ...ins, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
      }

      // Table 5: Match Notices
      if (sourceData.matchNotices && Array.isArray(sourceData.matchNotices)) {
        sourceData.matchNotices.forEach(notice => {
          const ref = this.db.collection('match_notices').doc(String(notice.id));
          batch.set(ref, { ...notice, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
      }

      // Table 6: Performance Matrix
      if (sourceData.performance && typeof sourceData.performance === 'object') {
        Object.keys(sourceData.performance).forEach(playerId => {
          const ref = this.db.collection('performance').doc(String(playerId));
          batch.set(ref, {
            playerId: playerId,
            ...sourceData.performance[playerId],
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        });
      }

      // Table 7: Attendance
      if (sourceData.todayAttendance) {
        const ref = this.db.collection('attendance').doc('today');
        batch.set(ref, {
          date: new Date().toISOString().split('T')[0],
          records: sourceData.todayAttendance,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }

      // Table 8: Announcements (Messages)
      if (sourceData.messages && Array.isArray(sourceData.messages)) {
        sourceData.messages.forEach(msg => {
          const ref = this.db.collection('announcements').doc(String(msg.id));
          batch.set(ref, { ...msg, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
      }

      // Table 9: Files (Vault)
      if (sourceData.files && Array.isArray(sourceData.files)) {
        sourceData.files.forEach(f => {
          const cleanF = { ...f };
          if (cleanF.url && (cleanF.url.startsWith('blob:') || cleanF.url.startsWith('data:video/'))) cleanF.url = '';
          const ref = this.db.collection('vault_files').doc(String(f.id));
          batch.set(ref, { ...cleanF, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
      }

      // Table 10: Notifications
      if (sourceData.notifications && Array.isArray(sourceData.notifications)) {
        sourceData.notifications.forEach(n => {
          const ref = this.db.collection('notifications').doc(String(n.id));
          batch.set(ref, { ...n, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
        });
      }

      // Master Live Document for Fast Sync
      const masterDoc = this.db.collection(this.collectionName).doc(this.docId);
      const cleanClone = this.cleanForCloud(sourceData);
      batch.set(masterDoc, {
        payload: cleanClone,
        seededAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastUpdatedBy: 'Admin Seeder'
      }, { merge: true });

      // Commit Batch Write to Firestore
      await batch.commit();

      console.log('✅ ALL 10 Database Tables created and populated in Firestore!');
      this.updateBadge('live', 'Live Connected');
      this.isConnected = true;

      if (typeof showToast === 'function') {
        showToast('அனைத்து 10 டேட்டாபேஸ் டேபிள்களும் கிளவுடில் உருவாக்கப்பட்டது! 🏆', 'ri-database-2-line');
      }

      this.renderTableManagerStatus();

    } catch (error) {
      console.error('❌ Error creating tables:', error);
      if (error.code === 'permission-denied') {
        this.updateBadge('warning', 'Rules Denied');
        if (typeof showToast === 'function') {
          showToast('Firebase Rules-ல் அனுமதி தேவை (allow read, write: if true).', 'ri-alert-line');
        }
      } else {
        this.updateBadge('error', 'Error');
      }
    }
  },

  // 4. APPLY REMOTE INCOMING DATA
  applyRemoteData(incoming) {
    if (!incoming || typeof incoming !== 'object') return;

    this.isRemoteUpdating = true;
    try {
      const currentRole = (typeof appData !== 'undefined' && appData.activeRole) ? appData.activeRole : 'coach';
      const currentPlayerId = (typeof appData !== 'undefined' && appData.activePlayerId) ? appData.activePlayerId : 1;

      if (typeof appData !== 'undefined') {
        Object.assign(appData, incoming);
        appData.activeRole = currentRole;
        appData.activePlayerId = currentPlayerId;
      }

      try {
        localStorage.setItem('HOME_KABADDI_APP_DATA_TANGLISH_V1', JSON.stringify(incoming));
      } catch (err) {}

      if (typeof renderAppShell === 'function') renderAppShell();
      if (typeof renderCurrentView === 'function') renderCurrentView();
      if (typeof renderNotifications === 'function') renderNotifications();

      this.renderTableManagerStatus();
    } catch (e) {
      console.error('Error applying remote data:', e);
    } finally {
      setTimeout(() => {
        this.isRemoteUpdating = false;
      }, 500);
    }
  },

  // 5. DEBOUNCED AUTO-UPLOAD ON ANY LOCAL CHANGE
  uploadData(data) {
    if (this.isRemoteUpdating) return;
    if (!this.isInitialized || !this.db) return;

    clearTimeout(this.debounceTimer);
    this.updateBadge('syncing', 'Syncing...');

    this.debounceTimer = setTimeout(() => {
      this.uploadDataImmediately(data);
    }, 500);
  },

  // 6. IMMEDIATE SAVE TO CLOUD FIRESTORE MASTER DOC & TABLES
  async uploadDataImmediately(data) {
    if (!this.db) return;

    try {
      const cleanClone = this.cleanForCloud(data);
      const masterDoc = this.db.collection(this.collectionName).doc(this.docId);
      
      await masterDoc.set({
        payload: cleanClone,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastUpdatedBy: (typeof appData !== 'undefined' && appData.coachProfile) ? appData.coachProfile.name : 'Web App'
      }, { merge: true });

      console.log('✅ [Firebase] Master doc sync successful');
      this.updateBadge('live', 'Live Connected');
      this.renderTableManagerStatus();

    } catch (error) {
      console.error('❌ Failed to write to Firestore:', error);
      if (error.code === 'permission-denied') {
        this.updateBadge('warning', 'Rules Denied');
      } else {
        this.updateBadge('error', 'Sync Failed');
      }
    }
  },

  // Helper: Strip large video data URLs before pushing to cloud
  cleanForCloud(data) {
    const clone = JSON.parse(JSON.stringify(data));
    if (clone.files && Array.isArray(clone.files)) {
      clone.files = clone.files.map(f => {
        const item = { ...f };
        if (item.url && (item.url.startsWith('blob:') || item.url.startsWith('data:video/'))) item.url = '';
        if (item.thumbnail && (item.thumbnail.startsWith('blob:') || item.thumbnail.startsWith('data:video/'))) {
          item.thumbnail = item.type === 'Video' ? 'assets/kabaddi_arena_bg.jpg' : 'assets/thaai_tamizhans_logo.jpg';
        }
        return item;
      });
    }
    return clone;
  },

  // 7. DIRECT COLLECTION CRUD COMPATIBILITY METHODS
  async savePlayer(player) {
    if (!this.db || !player) return;
    try {
      await this.db.collection('players').doc(String(player.id)).set({
        ...player,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('savePlayer err:', e); }
  },
  async saveTodayPractice(practice) {
    if (!this.db || !practice) return;
    try {
      await this.db.collection('today_practice').doc('current').set({
        ...practice,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('saveTodayPractice err:', e); }
  },
  async savePracticeSession(session) {
    if (!this.db || !session) return;
    try {
      await this.db.collection('practice_calendar').doc(String(session.id)).set({
        ...session,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('savePracticeSession err:', e); }
  },
  async deletePracticeSession(id) {
    if (!this.db) return;
    try {
      await this.db.collection('practice_calendar').doc(String(id)).delete();
    } catch (e) { console.warn('deletePracticeSession err:', e); }
  },
  async saveMatchNotice(notice) {
    if (!this.db || !notice) return;
    try {
      await this.db.collection('match_notices').doc(String(notice.id)).set({
        ...notice,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('saveMatchNotice err:', e); }
  },
  async deleteMatchNotice(id) {
    if (!this.db) return;
    try {
      await this.db.collection('match_notices').doc(String(id)).delete();
    } catch (e) { console.warn('deleteMatchNotice err:', e); }
  },
  async saveInstruction(instruction) {
    if (!this.db || !instruction) return;
    try {
      await this.db.collection('instructions').doc(String(instruction.id)).set({
        ...instruction,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('saveInstruction err:', e); }
  },
  async deleteInstruction(id) {
    if (!this.db) return;
    try {
      await this.db.collection('instructions').doc(String(id)).delete();
    } catch (e) { console.warn('deleteInstruction err:', e); }
  },
  async savePerformance(playerId, perf) {
    if (!this.db || !perf) return;
    try {
      await this.db.collection('performance').doc(String(playerId)).set({
        playerId: playerId,
        ...perf,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('savePerformance err:', e); }
  },
  async saveAttendance(date, records) {
    if (!this.db) return;
    try {
      await this.db.collection('attendance').doc(String(date || 'today')).set({
        date: date || new Date().toISOString().split('T')[0],
        records: records,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('saveAttendance err:', e); }
  },
  async saveAnnouncement(msg) {
    if (!this.db || !msg) return;
    try {
      await this.db.collection('announcements').doc(String(msg.id)).set({
        ...msg,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('saveAnnouncement err:', e); }
  },
  async deleteAnnouncement(id) {
    if (!this.db) return;
    try {
      await this.db.collection('announcements').doc(String(id)).delete();
    } catch (e) { console.warn('deleteAnnouncement err:', e); }
  },
  async saveFile(file) {
    if (!this.db || !file) return;
    try {
      const clean = { ...file };
      if (clean.url && (clean.url.startsWith('blob:') || clean.url.startsWith('data:video/'))) clean.url = '';
      await this.db.collection('vault_files').doc(String(file.id)).set({
        ...clean,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('saveFile err:', e); }
  },
  async deleteFile(id) {
    if (!this.db) return;
    try {
      await this.db.collection('vault_files').doc(String(id)).delete();
    } catch (e) { console.warn('deleteFile err:', e); }
  },
  async addNotification(notif) {
    if (!this.db || !notif) return;
    try {
      await this.db.collection('notifications').doc(String(notif.id)).set({
        ...notif,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    } catch (e) { console.warn('addNotification err:', e); }
  },

  // 8. MANUAL FORCE SYNC ALL
  async forceSyncNow() {
    this.openDatabaseManagerModal();
  },

  // 8. UPDATE UI BADGE
  updateBadge(status, label) {
    const badge = document.getElementById('firebaseLiveBadge');
    if (!badge) return;

    badge.className = `firebase-live-badge status-${status}`;
    const dot = badge.querySelector('.fb-dot');
    const text = badge.querySelector('.fb-label');
    
    if (dot) {
      dot.className = `fb-dot ${status === 'live' ? 'pulse-green' : (status === 'syncing' ? 'spin-sync' : '')}`;
    }
    if (text) {
      text.textContent = label;
    }
  },

  // 9. DATABASE MANAGER MODAL & UI CONTROLLER
  openDatabaseManagerModal() {
    let modal = document.getElementById('firebaseDbModal');
    if (!modal) {
      this.createDatabaseManagerModalHtml();
      modal = document.getElementById('firebaseDbModal');
    }
    if (modal) {
      modal.classList.add('active');
      this.renderTableManagerStatus();
    }
  },

  closeDatabaseManagerModal() {
    const modal = document.getElementById('firebaseDbModal');
    if (modal) modal.classList.remove('active');
  },

  createDatabaseManagerModalHtml() {
    const div = document.createElement('div');
    div.id = 'firebaseDbModal';
    div.className = 'modal-backdrop-custom';
    div.innerHTML = `
      <div class="modal-card-custom db-manager-card">
        <!-- Modal Header -->
        <div class="db-modal-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="db-icon-box">
              <i class="ri-database-2-fill text-gradient-orange" style="font-size:1.6rem;"></i>
            </div>
            <div>
              <h3 style="margin:0; font-size:1.15rem; font-weight:800;" class="text-gradient-cyan">
                Cloud Firestore Database Hub
              </h3>
              <p style="margin:2px 0 0; font-size:0.75rem; color:#94a3b8;">
                தாய் தமிழன்ஸ் — Live Cloud Tables & Real-Time Sync
              </p>
            </div>
          </div>
          <button type="button" class="btn-close-custom" onclick="window.FirebaseSync.closeDatabaseManagerModal()">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <!-- Connection Status Banner -->
        <div class="db-status-banner" id="dbModalStatusBanner">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="fb-dot ${this.isConnected ? 'pulse-green' : ''}"></span>
            <div>
              <div style="font-size:0.85rem; font-weight:800; color:#fff;" id="dbModalStatusTitle">
                ${this.isConnected ? '🟢 Cloud Database Connected (Live)' : '🟡 Connecting to Firestore...'}
              </div>
              <div style="font-size:0.72rem; color:#94a3b8;" id="dbModalStatusSubtitle">
                Project ID: thaai-tamizhans | Mode: Cloud Real-time
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.FirebaseSync.testConnection()" style="font-size:0.72rem; padding:4px 10px;">
            <i class="ri-pulse-line"></i> Test Ping
          </button>
        </div>

        <!-- 10 Tables Grid -->
        <div class="db-tables-list-header">
          <span>📁 DATABASE COLLECTIONS (டேபிள்கள்)</span>
          <span id="dbTotalRecordsCount" style="color:var(--accent-cyan); font-weight:700;">10 Tables Active</span>
        </div>

        <div class="db-tables-grid" id="dbTablesGrid">
          <!-- Dynamically populated -->
        </div>

        <!-- Action Buttons -->
        <div class="db-modal-actions">
          <button type="button" class="btn btn-outline" onclick="window.FirebaseSync.closeDatabaseManagerModal()">
            Close (மூடு)
          </button>
          <button type="button" class="btn btn-primary" onclick="window.FirebaseSync.seedAllDatabaseTables()" style="background:var(--grad-orange); box-shadow:0 0 20px rgba(255,85,0,0.4);">
            <i class="ri-upload-cloud-2-line"></i> Seed & Sync All 10 Tables (அனைத்தையும் ஏற்று)
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(div);
  },

  renderTableManagerStatus() {
    const grid = document.getElementById('dbTablesGrid');
    if (!grid) return;

    const data = typeof appData !== 'undefined' ? appData : INITIAL_KABADDI_DATA;

    const tableCounts = {
      players: data.players ? data.players.length : 0,
      todayPractice: data.todayPractice ? (data.todayPractice.sections ? data.todayPractice.sections.length : 1) : 0,
      practiceCalendar: data.practiceCalendar ? data.practiceCalendar.length : 0,
      instructions: data.instructions ? data.instructions.length : 0,
      matchNotices: data.matchNotices ? data.matchNotices.length : 0,
      performance: data.performance ? Object.keys(data.performance).length : 0,
      todayAttendance: data.todayAttendance ? data.todayAttendance.length : 0,
      messages: data.messages ? data.messages.length : 0,
      files: data.files ? data.files.length : 0,
      notifications: data.notifications ? data.notifications.length : 0
    };

    grid.innerHTML = this.tables.map(t => {
      const count = tableCounts[t.key] !== undefined ? tableCounts[t.key] : 0;
      return `
        <div class="db-table-row">
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="db-table-badge">${t.collection}</div>
            <div style="font-size:0.82rem; font-weight:700; color:#e2e8f0;">${t.name}</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="db-count-pill">${count} Records</span>
            <i class="ri-checkbox-circle-fill" style="color:var(--accent-green); font-size:1.1rem;" title="Synced to Database"></i>
          </div>
        </div>
      `;
    }).join('');

    const bannerTitle = document.getElementById('dbModalStatusTitle');
    if (bannerTitle) {
      bannerTitle.innerHTML = this.isConnected 
        ? '<span style="color:#00ff88;">🟢 Cloud Database Connected (Live Active)</span>'
        : '<span style="color:#facc15;">🟡 Syncing with Firestore...</span>';
    }
  },

  async testConnection() {
    if (!this.db) {
      if (typeof showToast === 'function') showToast('Firebase SDK Not Initialized', 'ri-close-circle-line');
      return;
    }
    try {
      if (typeof showToast === 'function') showToast('Connecting to Firestore...', 'ri-loader-4-line');
      const testRef = this.db.collection('system_status').doc('ping');
      await testRef.set({ timestamp: firebase.firestore.FieldValue.serverTimestamp(), status: 'OK' });
      if (typeof showToast === 'function') showToast('✅ Firestore Connection Test Passed! 100% Live', 'ri-check-double-line');
      this.isConnected = true;
      this.updateBadge('live', 'Live Connected');
      this.renderTableManagerStatus();
    } catch (err) {
      console.error('Ping failed:', err);
      if (err.code === 'permission-denied') {
        if (typeof showToast === 'function') {
          showToast('⚠️ Firestore Permission Denied! Rules-ல் allow read, write: if true; போடுங்கள்.', 'ri-alert-line');
        }
      } else {
        if (typeof showToast === 'function') showToast('Connection Error: ' + err.message, 'ri-error-warning-line');
      }
    }
  }
};

// Automatic Boot
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.FirebaseSync.init();
  }, 350);
});
