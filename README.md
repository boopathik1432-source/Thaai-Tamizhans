# 🏆 தாய் தமிழன்ஸ் (THAAI TAMIZHANS) — Kabaddi Club Portal

Official Squad, Coach & Match Management Portal for **Thaai Tamizhans Kabaddi Club**.

🌐 **Official Live URL:** [https://thaaitamizhans.vercel.app](https://thaaitamizhans.vercel.app/)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Portal-00F2FE?style=for-the-badge&logo=vercel&logoColor=white)](https://thaaitamizhans.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-FF5500?style=for-the-badge&logo=github&logoColor=white)](https://github.com/boopathik1432-source/Thaai-Tamizhans)

## 🌟 Key Features

- **🔥 3D Real-Time Animated Arena**: 7 interactive 3D kabaddi themes (Pro Kabaddi Court, Super Raider Lightning, Ankle Lock Defence, Frog Jump Super Raid, Thigh Hold Iron Grip, Toe Touch Laser Raid, Tamil Thalaivas Mass) with 60FPS canvas physics.
- **👑 Role-Based Authentication**: Dedicated portals for Coaches and Athletes with PIN security.
- **👥 Squad & Player Management**: Complete player roster, contact directories, position tracking, and real-time attendance stats.
- **✂️ Interactive Photo Adjuster & Cropper**: Integrated visual face framing with real-time zooming, panning, and instant presets for high-resolution jersey badge exports.
- **📋 Training Drills & Interactive Calendar**: Daily drill routines, multi-month calendar scheduling, intensity level tracking, and coach instructions.
- **📢 Match Notices & Announcements**: Match day poster broadcasting with instant image pasting (`Ctrl+V`) and local file pickers.
- **📁 Squad Cloud Vault**: Document tactics playbook, HD training videos with integrated HTML5 player, and media asset manager.
- **📊 Performance Analytics**: Raider and defender radar metrics with historical progress logging.

## 🛠️ Tech Stack & Real-Time Cloud Architecture

- **Frontend**: HTML5 & Vanilla CSS3 (Custom Glassmorphism, 9 Cyber & 3D Themes, Responsive Layout)
- **3D Animation Engine**: 60FPS Real-Time Canvas 2D/3D Arena with Theme Presets
- **Real-Time Backend**: **Firebase Web Modular SDK (v10 via ESM)**
  - **Cloud Firestore**: Real-time NoSQL synchronization (`onSnapshot`) across 11 squad collections
  - **Firebase Authentication**: Role-based access control (Coach & Athlete PIN authentication)
  - **Firebase Storage**: Match Day posters, athlete badges, playbook PDFs, and training drill videos
  - **Security Rules**: Enforced Coach write authority and player-restricted data isolation
- **Offline-First Storage Engine**: LocalStorage & IndexedDB fallbacks for zero-hang resilience

## 📂 Firestore Data Collections Schema

1. `users/{uid}`: Coach & Athlete account mappings and permissions.
2. `players/{playerId}`: Squad roster, positions, contacts, and attendance summaries.
3. `instructions/{instructionId}`: Coach drills & tactical instructions with real-time push.
4. `todayPractice/current`: 6-section daily drill routine (singleton document).
5. `practiceCalendar/{sessionId}`: Calendar scheduling, drill focuses, and coach notes.
6. `matchNotices/{noticeId}`: Match notices with Firebase Storage poster URLs.
7. `performance/{playerId}`: Performance radar metrics, star ratings, and history.
8. `attendance/{dateString}`: Daily attendance records (Present / Absent / Late).
9. `announcements/{messageId}`: Team broadcast announcements and read receipts.
10. `files/{fileId}`: Squad Vault tactics PDFs, training videos, and media metadata.
11. `notifications/{notificationId}`: Real-time notification drawer items and badge counts.

## 🚀 Environment Configuration (Vercel & Local)

For production deployment on Vercel, configure the following environment variables under **Project Settings > Environment Variables**:

```env
VITE_FIREBASE_API_KEY=AIzaSyB_ThaaiTamizhansKabaddiClub_Prod2026
VITE_FIREBASE_AUTH_DOMAIN=thaai-tamizhans-kabaddi.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=thaai-tamizhans-kabaddi
VITE_FIREBASE_STORAGE_BUCKET=thaai-tamizhans-kabaddi.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=987654321000
VITE_FIREBASE_APP_ID=1:987654321000:web:thaaitamizhans2026club
```

## 💻 Local Development

Serve the repository with any static web server:

```bash
# Using Node.js http-server
npx http-server -p 8080

# Or using Python
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your web browser.

---
© 2026 Thaai Tamizhans Kabaddi Club. All rights reserved.

