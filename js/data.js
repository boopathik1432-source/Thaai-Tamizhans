/* 🏆 தாய் தமிழன்ஸ் (THAAI TAMIZHANS) — KABADDI DATA & LOCAL STORAGE ENGINE */

const INITIAL_KABADDI_DATA = {
  activeRole: 'coach', // 'coach' | 'player'
  activePlayerId: 1,   // Current player (Boopathi K)
  
  coachProfile: {
    name: 'Coach Arun',
    phone: '+91 98765 43210',
    email: 'coach.arun@thaitamizhans.com',
    experience: '12+ Varuda Anubavam (Pro Kabaddi Certified Senior Coach)',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },

  players: [
    {
      id: 1,
      name: 'Boopathi K',
      jersey: '#06',
      position: 'All-Rounder',
      status: 'Active-la Irukaru',
      contact: '+91 91234 56789',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      attendance: { present: 28, absent: 1, late: 0, percentage: 97 }
    },
    {
      id: 2,
      name: 'Karthi S',
      jersey: '#07',
      position: 'Raider',
      status: 'Active-la Irukaru',
      contact: '+91 98123 45678',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      attendance: { present: 26, absent: 2, late: 1, percentage: 90 }
    },
    {
      id: 3,
      name: 'Bala M',
      jersey: '#03',
      position: 'Defender',
      status: 'Active-la Irukaru',
      contact: '+91 97890 12345',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      attendance: { present: 25, absent: 3, late: 1, percentage: 86 }
    },
    {
      id: 4,
      name: 'Kumar R',
      jersey: '#05',
      position: 'Defender',
      status: 'Active-la Irukaru',
      contact: '+91 96543 21098',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      attendance: { present: 27, absent: 2, late: 0, percentage: 93 }
    },
    {
      id: 5,
      name: 'Sanjay P',
      jersey: '#09',
      position: 'All-Rounder',
      status: 'Active-la Irukaru',
      contact: '+91 95432 10987',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      attendance: { present: 24, absent: 3, late: 2, percentage: 82 }
    },
    {
      id: 6,
      name: 'Vikram V',
      jersey: '#11',
      position: 'Raider',
      status: 'Active-la Irukaru',
      contact: '+91 94321 09876',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      attendance: { present: 26, absent: 1, late: 1, percentage: 92 }
    },
    {
      id: 7,
      name: 'Manoj K',
      jersey: '#04',
      position: 'Defender',
      status: 'Active-la Irukaru',
      contact: '+91 93210 98765',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      attendance: { present: 25, absent: 2, late: 1, percentage: 89 }
    }
  ],

  todayPractice: {
    title: 'Kabaddi Maalai Payirchi',
    date: 'Inaiku — 09 Sep 2026',
    time: 'Maalai 5:00 PM',
    location: 'Home Ground (Namma Ground)',
    sections: [
      { name: 'Warm-up', detail: '15 Mins dynamic stretching matrum leg drills' },
      { name: 'Raid Practice', detail: 'Toe touch & hand touch speed reps' },
      { name: 'Defence Practice', detail: 'Ankle hold & thigh hold grip tactics' },
      { name: 'Fitness Drill', detail: 'High intensity shuttle runs & stamina' },
      { name: 'Team Match Drill', detail: '7v7 match simulation strategy' },
      { name: 'Cool Down', detail: 'Light jogging & foam rolling recovery' }
    ]
  },

  practiceCalendar: [
    {
      id: 1,
      date: '2026-09-09',
      title: 'Maalai Kabaddi Payirchi',
      time: '5:00 PM - 7:00 PM',
      location: 'Home Ground (Mat Court)',
      intensity: 'High Intensity',
      focus: 'Raid Speed & Ankle Hold Grip Tactics',
      drills: '15 Mins warm-up stretching, 30 Mins Toe-touch reps, 30 Mins Ankle hold defense, 30 Mins 7v7 match practice',
      coachNotes: 'Ellaa players-um 4:45 PM kulla kit-oda ground-la irukanum.'
    },
    {
      id: 2,
      date: '2026-09-10',
      title: 'Kaalai Fitness & Stamina',
      time: '6:00 AM - 7:30 AM',
      location: 'Mud Ground (Outdoor Track)',
      intensity: 'Medium',
      focus: '5km Jogging & Core Strength',
      drills: '5km steady pace jogging, 20 Mins core planks & burpees, breathing recovery',
      coachNotes: 'Hydration bottle kandippa eduthutu vaanga.'
    },
    {
      id: 3,
      date: '2026-09-12',
      title: 'Tournament Match Tactical Prep',
      time: '5:00 PM - 7:30 PM',
      location: 'Home Ground (Mat Court)',
      intensity: 'Very High',
      focus: 'Do-or-Die Raid Specialization & Super Tackle',
      drills: 'Do-or-die simulation, 3-man defense chain trapping, bonus point snatch drills',
      coachNotes: 'Practice mudinjavudane video tactical analysis irukku.'
    },
    {
      id: 4,
      date: '2026-09-15',
      title: 'State Championship Pre-Match Drill',
      time: '4:30 PM - 6:30 PM',
      location: 'District Indoor Stadium',
      intensity: 'Competition Ready',
      focus: 'Full Squad Readiness & Official Rules',
      drills: 'Live scrimmage match with referee rules and match-time strategies',
      coachNotes: 'Practice mudinjavudane match jersey distribution nadakkum.'
    }
  ],

  practiceHistory: [
    { date: 'Sep 09', focus: 'Raid & Kaal Aasaivugal', status: 'Mudinthathu' },
    { date: 'Sep 08', focus: 'Defence Ankle Hold Tactics', status: 'Mudinthathu' },
    { date: 'Sep 07', focus: 'Fitness & Stamina Drills', status: 'Mudinthathu' }
  ],

  instructions: [
    {
      id: 101,
      playerId: 1, // Boopathi K
      playerName: 'Boopathi K',
      date: '09 Sep 2026',
      title: 'Toe Touch & Bonus Line Execution',
      instruction: 'Inaiku practice-la right corner defender-ku opposite-aa quick toe-touch matrum bonus point snatching timing nalla focus pannu.',
      priority: 'High Priority',
      status: 'Active'
    },
    {
      id: 102,
      playerId: 2, // Karthi S
      playerName: 'Karthi S',
      date: '09 Sep 2026',
      title: 'Frog Jump & Dubki Escape',
      instruction: 'Double thigh hold attempt varrappo sudden airborne frog jump panni midline touch panna practice pannu.',
      priority: 'High Priority',
      status: 'Active'
    },
    {
      id: 103,
      playerId: 3, // Bala M
      playerName: 'Bala M',
      date: '08 Sep 2026',
      title: 'Ankle Hold Lock Strength',
      instruction: 'Opponent main raider deep raid varrappo timing paathu strong ankle hold grip lock podu.',
      priority: 'Important',
      status: 'Active'
    },
    {
      id: 104,
      playerId: 4, // Kumar R
      playerName: 'Kumar R',
      date: '08 Sep 2026',
      title: 'Chain Tackle Support',
      instruction: 'Right corner attack pannumbothu center cover position-la irunthu immediate chain tackle support kudu.',
      priority: 'Normal',
      status: 'Active'
    }
  ],

  matchNotices: [
    {
      id: 201,
      image: 'assets/match_notice_poster.jpg',
      title: 'Pro Kabaddi Championship Match Day Notice',
      date: 'Saturday, October 26, 2026',
      time: '7:30 PM IST',
      location: 'Home Arena Stadium',
      message: 'Ella players-um 5:30 PM-kulla team jersey kit-oda stadium-ku varanum. Parents & fans entry free.',
      status: 'Published'
    }
  ],

  performance: {
    1: { // Boopathi K
      raid: 92, defence: 88, fitness: 95, speed: 94, stamina: 92, skill: 93, discipline: 98,
      starRating: 5,
      notes: 'All-rounder performance semma level! Bonus line attempt & corner defence coordination is top-notch.',
      history: [
        { date: 'Sep 08', raid: 90, defence: 86, fitness: 94 },
        { date: 'Sep 09', raid: 92, defence: 88, fitness: 95 }
      ]
    },
    2: { // Karthi S
      raid: 94, defence: 72, fitness: 90, speed: 96, stamina: 88, skill: 91, discipline: 92,
      starRating: 5,
      notes: 'Main lead raider speed explosive-aa irukku. Sudden turning raid techniques-la super improvement.',
      history: [
        { date: 'Sep 08', raid: 92, defence: 70, fitness: 89 },
        { date: 'Sep 09', raid: 94, defence: 72, fitness: 90 }
      ]
    },
    3: { // Bala M
      raid: 65, defence: 94, fitness: 89, speed: 82, stamina: 88, skill: 90, discipline: 95,
      starRating: 5,
      notes: 'Right corner ankle lock grip impenetrable! Super tackle execution is match-winning.',
      history: [
        { date: 'Sep 08', raid: 64, defence: 92, fitness: 88 },
        { date: 'Sep 09', raid: 65, defence: 94, fitness: 89 }
      ]
    },
    4: { // Kumar R
      raid: 60, defence: 91, fitness: 88, speed: 84, stamina: 86, skill: 89, discipline: 94,
      starRating: 4,
      notes: 'Left corner dash and chain tackle timing strong-aa irukku.',
      history: [
        { date: 'Sep 08', raid: 60, defence: 89, fitness: 87 },
        { date: 'Sep 09', raid: 60, defence: 91, fitness: 88 }
      ]
    },
    5: { // Sanjay P
      raid: 86, defence: 84, fitness: 91, speed: 88, stamina: 90, skill: 87, discipline: 93,
      starRating: 4,
      notes: 'Great all-round support in both do-or-die raids and cover defense.',
      history: [
        { date: 'Sep 08', raid: 84, defence: 82, fitness: 89 },
        { date: 'Sep 09', raid: 86, defence: 84, fitness: 91 }
      ]
    },
    6: { // Vikram V
      raid: 89, defence: 70, fitness: 88, speed: 92, stamina: 86, skill: 88, discipline: 90,
      starRating: 4,
      notes: 'Hand touch acceleration and toe-reach very sharp.',
      history: [
        { date: 'Sep 08', raid: 87, defence: 68, fitness: 86 },
        { date: 'Sep 09', raid: 89, defence: 70, fitness: 88 }
      ]
    },
    7: { // Manoj K
      raid: 62, defence: 88, fitness: 87, speed: 80, stamina: 85, skill: 86, discipline: 92,
      starRating: 4,
      notes: 'Cover position block and body charge execution solid-aa irukku.',
      history: [
        { date: 'Sep 08', raid: 60, defence: 86, fitness: 85 },
        { date: 'Sep 09', raid: 62, defence: 88, fitness: 87 }
      ]
    }
  },

  todayAttendance: [
    { playerId: 1, status: 'Present' },
    { playerId: 2, status: 'Present' },
    { playerId: 3, status: 'Present' },
    { playerId: 4, status: 'Present' },
    { playerId: 5, status: 'Present' },
    { playerId: 6, status: 'Present' },
    { playerId: 7, status: 'Present' }
  ],

  messages: [
    {
      id: 301,
      sender: 'Coach Arun',
      type: '📢 General Announcement',
      title: 'Pro Kabaddi State Championship Kit Distribution',
      content: 'All players must assemble tomorrow at 4:30 PM for official team jersey and kit distribution. Match Notice section-la ground details check pannikonga.',
      date: '09 Sep 2026 10:30 AM',
      unread: true
    },
    {
      id: 302,
      sender: 'Coach Arun',
      type: '🏋️ Practice Update',
      title: 'Evening Mat Practice Strategy',
      content: 'Inaiku evening 5:00 PM practice-la do-or-die raid strategies matrum 3-man defense chain trapping focus pannuvom.',
      date: '09 Sep 2026 02:15 PM',
      unread: true
    }
  ],

  files: [
    {
      id: 401,
      name: 'Kabaddi_Raid_Tactics_2026.pdf',
      type: 'Document',
      category: 'Tactics & Strategy',
      size: '2.4 MB',
      date: '08 Sep 2026',
      url: 'assets/match_notice_poster.jpg',
      thumbnail: 'assets/match_notice_poster.jpg',
      description: 'Super Raid strategies, Bonus line footwork guidelines and Corner tackle drill manual.'
    },
    {
      id: 402,
      name: 'Toe_Touch_Mastery_Drills.mp4',
      type: 'Video',
      category: 'Practice Video',
      size: '14.8 MB',
      date: '09 Sep 2026',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'assets/kabaddi_arena_bg.jpg',
      description: 'Slow motion video analysis of perfect toe touch and sudden frog jump escape from right corner.'
    },
    {
      id: 403,
      name: 'Thaai_Tamizhans_Official_Jersey_2026.png',
      type: 'Image',
      category: 'Jersey & Media',
      size: '1.2 MB',
      date: '09 Sep 2026',
      url: 'assets/thaai_tamizhans_logo.jpg',
      thumbnail: 'assets/thaai_tamizhans_logo.jpg',
      description: 'Official 2026 Gold & Cyber Neon Jersey layout with player numbers and sponsor placements.'
    }
  ],

  notifications: [
    {
      id: 501,
      title: '🎯 புது Instruction: Toe Touch & Bonus Line Execution',
      desc: 'Coach Boopathi K-க்கு Toe Touch & Bonus Line Practice assign பண்ணியுள்ளார். Footwork & timing focus பண்ணவும்.',
      time: '10 mins munnaadi',
      target: 'player',
      playerId: 1,
      type: 'instruction',
      icon: 'ri-file-list-3-line',
      actionView: 'my-instructions',
      senderRole: 'coach',
      senderName: 'Coach Arun',
      read: false,
      readByPlayers: []
    },
    {
      id: 502,
      title: '🏆 Pro Kabaddi Championship Match Day Notice',
      desc: 'Coach புதிய போட்டி அறிவிப்பு வெளியிட்டுள்ளார். Saturday 7:30 PM @ Home Arena Stadium.',
      time: '1 hour munnaadi',
      target: 'all',
      type: 'notice',
      icon: 'ri-megaphone-fill',
      actionView: 'match-notices',
      senderRole: 'coach',
      senderName: 'Coach Arun',
      read: false,
      readByPlayers: []
    },
    {
      id: 503,
      title: '⚡ Today\'s Practice Updated: Kabaddi Maalai Payirchi',
      desc: 'Coach இன்றைய பயிற்சி திட்டத்தை (Maalai 5:00 PM @ Home Ground) update பண்ணியுள்ளார்.',
      time: '2 hours munnaadi',
      target: 'all',
      type: 'practice',
      icon: 'ri-calendar-event-line',
      actionView: 'my-practice',
      senderRole: 'coach',
      senderName: 'Coach Arun',
      read: false,
      readByPlayers: []
    }
  ]
};

const DATA_VERSION_KEY = 'HOME_KABADDI_DATA_VERSION_V2';

function getAppData() {
  const currentVersion = localStorage.getItem(DATA_VERSION_KEY);
  const saved = localStorage.getItem('HOME_KABADDI_APP_DATA_TANGLISH_V1');

  // If user opens the freshly updated version, auto-merge or use updated initial data
  if (!currentVersion || currentVersion !== 'v2.1') {
    localStorage.setItem(DATA_VERSION_KEY, 'v2.1');
    saveAppData(INITIAL_KABADDI_DATA);
    return INITIAL_KABADDI_DATA;
  }

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (!parsed.players || parsed.players.length === 0) {
        parsed.players = INITIAL_KABADDI_DATA.players;
      }
      if (!parsed.practiceCalendar || parsed.practiceCalendar.length === 0) {
        parsed.practiceCalendar = INITIAL_KABADDI_DATA.practiceCalendar;
      }
      if (!parsed.files || parsed.files.length === 0 || (parsed.files.length === 1 && parsed.files[0].id === 401 && !parsed.files[0].description)) {
        parsed.files = INITIAL_KABADDI_DATA.files;
      }
      if (!parsed.notifications || parsed.notifications.length === 0 || !parsed.notifications[0].target) {
        parsed.notifications = INITIAL_KABADDI_DATA.notifications;
      }
      if (!parsed.performance) {
        parsed.performance = INITIAL_KABADDI_DATA.performance;
      }
      return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  saveAppData(INITIAL_KABADDI_DATA);
  return INITIAL_KABADDI_DATA;
}

function saveAppData(data) {
  try {
    // Sanitize files array so heavy data URLs / blob URLs do not crash LocalStorage 5MB quota
    const clone = JSON.parse(JSON.stringify(data));
    if (clone.files && Array.isArray(clone.files)) {
      clone.files = clone.files.map(f => {
        const item = Object.assign({}, f);
        if (item.url && (item.url.startsWith('blob:') || item.url.startsWith('data:video/'))) {
          item.url = '';
        }
        if (item.thumbnail && (item.thumbnail.startsWith('blob:') || item.thumbnail.startsWith('data:video/'))) {
          item.thumbnail = item.type === 'Video' ? 'assets/kabaddi_arena_bg.jpg' : 'assets/thaai_tamizhans_logo.jpg';
        }
        return item;
      });
    }
    localStorage.setItem('HOME_KABADDI_APP_DATA_TANGLISH_V1', JSON.stringify(clone));
  } catch (e) {
    console.warn('LocalStorage quota limit reached, saving lean data:', e);
    try {
      const lean = JSON.parse(JSON.stringify(data));
      if (lean.files) {
        lean.files = lean.files.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          category: f.category,
          size: f.size,
          date: f.date,
          description: f.description,
          hasIndexedDB: true,
          thumbnail: f.type === 'Video' ? 'assets/kabaddi_arena_bg.jpg' : 'assets/thaai_tamizhans_logo.jpg',
          url: ''
        }));
      }
      localStorage.setItem('HOME_KABADDI_APP_DATA_TANGLISH_V1', JSON.stringify(lean));
    } catch (err) {
      console.error('Critical storage error:', err);
    }
  }
}
