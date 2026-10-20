/**
 * SCRIPT OTOMATIS: ISI SEMUA SOAL (43 BUTIR) & AKUN KE GOOGLE SPREADSHEET
 * Jalankan fungsi "isiSemuaDataKeSpreadsheetSekarang" ini sekali saja dari Google Apps Script.
 */

function isiSemuaDataKeSpreadsheetSekarang() {
  try {
    var SPREADSHEET_ID = "151L_zDaJblEZmn-xXMFdlZXZTaH2hg68-oK23Difih0";
    var ss = null;

    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e1) {
      Logger.log("openById gagal: " + e1.message);
      try {
        ss = SpreadsheetApp.getActiveSpreadsheet();
      } catch (e2) {}
    }

    if (!ss) {
      Logger.log("ERROR: Spreadsheet dengan ID " + SPREADSHEET_ID + " tidak dapat dibuka. Pastikan akun Google yang aktif memiliki izin edit.");
      return;
    }

    var now = new Date().toISOString();

    // 1. ISI AKUN KE SHEET "DB_Users"
    var userSheet = ss.getSheetByName("DB_Users");
    if (!userSheet) {
      userSheet = ss.insertSheet("DB_Users");
    }
    if (userSheet.getLastRow() === 0) {
      var uHeaders = ["id", "username", "email", "passwordHash", "fullName", "role", "classGroup", "phone", "status", "createdAt", "lastLogin"];
      userSheet.appendRow(uHeaders);
      userSheet.getRange(1, 1, 1, uHeaders.length).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
      userSheet.setFrozenRows(1);
    }

    var existingUsersData = userSheet.getDataRange().getValues();
    var existingUsernames = existingUsersData.slice(1).map(function(r) { return String(r[1]).toLowerCase().trim(); });

    var usersList = [
  {
    "id": "USR-TRINURYANI",
    "username": "trinuryani",
    "email": "tri.nuryani@alimamischool.com",
    "password": "guru123",
    "fullName": "Tri Nuryani, S.S (English Teacher & Lead Examiner)",
    "role": "admin",
    "classGroup": "English Department Head & Senior Examiner",
    "phone": "+6281234567800",
    "status": "active"
  },
  {
    "id": "USR-TEACH01",
    "username": "teacher",
    "email": "guru@alimamischool.com",
    "password": "teacher123",
    "fullName": "Tri Nuryani, S.S (English Teacher)",
    "role": "admin",
    "classGroup": "English Department",
    "phone": "+6281234567892",
    "status": "active"
  },
  {
    "id": "USR-SUPER01",
    "username": "superadmin",
    "email": "superadmin@alimamischool.com",
    "password": "admin123",
    "fullName": "Ust. Dr. Ahmad Fauzi, M.Pd (Super Admin)",
    "role": "superadmin",
    "classGroup": "Executive Board",
    "phone": "+6281234567890",
    "status": "active"
  },
  {
    "id": "USR-ADMIN01",
    "username": "admincms",
    "email": "admin@alimamischool.com",
    "password": "admin123",
    "fullName": "Siti Rahmawati, S.Kom (CMS Admin)",
    "role": "admin",
    "classGroup": "IT & Academic Staff",
    "phone": "+6281234567891",
    "status": "active"
  },
  {
    "id": "USR-FARHAN01",
    "username": "farhan",
    "email": "farhan@alimamischool.com",
    "password": "student123",
    "fullName": "Farhan Al-Ghifari",
    "role": "student",
    "classGroup": "7 Ustman",
    "phone": "+6281234567811",
    "status": "active"
  },
  {
    "id": "USR-AISYAH01",
    "username": "aisyah",
    "email": "aisyah@alimamischool.com",
    "password": "student123",
    "fullName": "Aisyah Putri Azzahra",
    "role": "student",
    "classGroup": "7 Aisyah",
    "phone": "+6281234567812",
    "status": "active"
  },
  {
    "id": "USR-ZAID01",
    "username": "zaid",
    "email": "zaid@alimamischool.com",
    "password": "student123",
    "fullName": "Zaid bin Haritsah",
    "role": "student",
    "classGroup": "8 Ummar",
    "phone": "+6281234567813",
    "status": "active"
  },
  {
    "id": "USR-FATIMAH01",
    "username": "fatimah",
    "email": "fatimah@alimamischool.com",
    "password": "student123",
    "fullName": "Fatimah Az-Zahra",
    "role": "student",
    "classGroup": "7 Aisyah",
    "phone": "+6281234567814",
    "status": "active"
  },
  {
    "id": "USR-UMAR01",
    "username": "umar",
    "email": "umar@alimamischool.com",
    "password": "student123",
    "fullName": "Umar bin Khattab",
    "role": "student",
    "classGroup": "8 Khodijah",
    "phone": "+6281234567815",
    "status": "active"
  },
  {
    "id": "USR-BILAL01",
    "username": "bilal",
    "email": "bilal@alimamischool.com",
    "password": "student123",
    "fullName": "Bilal Ibnu Rabah",
    "role": "student",
    "classGroup": "9 Abu",
    "phone": "+6281234567816",
    "status": "active"
  },
  {
    "id": "USR-SALMAN01",
    "username": "salman",
    "email": "salman@alimamischool.com",
    "password": "student123",
    "fullName": "Salman Al-Farisi",
    "role": "student",
    "classGroup": "9 Ummu",
    "phone": "+6281234567817",
    "status": "active"
  },
  {
    "id": "USR-ALISHA01",
    "username": "alishamalaikaarifianto",
    "email": "alishamalaikaarifianto@alimamischool.com",
    "password": "student123",
    "fullName": "Alisha Malaika Arifianto",
    "role": "student",
    "classGroup": "7 Aisyah",
    "phone": "+6281234567818",
    "status": "active"
  }
];

  var addedUsers = 0;
  usersList.forEach(function(u) {
    if (existingUsernames.indexOf(u.username.toLowerCase()) === -1) {
      userSheet.appendRow([
        u.id,
        u.username,
        u.email,
        u.password, // Plain password / hash
        u.fullName,
        u.role,
        u.classGroup,
        u.phone,
        u.status,
        now,
        ""
      ]);
      addedUsers++;
    }
  });

  // 2. ISI 43 BUTIR SOAL KE SHEET "DB_Questions"
  var qSheet = ss.getSheetByName("DB_Questions");
  if (!qSheet) {
    qSheet = ss.insertSheet("DB_Questions");
  }
  if (qSheet.getLastRow() === 0) {
    var qHeaders = ["id", "examType", "section", "type", "passage", "prompt", "audioUrl", "imageUrl", "optionsJson", "correctAnswer", "rubricJson", "points", "tags", "createdAt"];
    qSheet.appendRow(qHeaders);
    qSheet.getRange(1, 1, 1, qHeaders.length).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
    qSheet.setFrozenRows(1);
  }

  var existingQsData = qSheet.getDataRange().getValues();
  var existingPrompts = existingQsData.slice(1).map(function(r) { return String(r[5]).toLowerCase().trim(); });
  var existingIds = existingQsData.slice(1).map(function(r) { return String(r[0]).toUpperCase().trim(); });

  var allQuestions = [
  {
    "id": "Q-LIST-01",
    "examType": "TOEFL_ITP",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "Short Dialogue: University Campus Academic Inquiry",
    "prompt": "Man: 'Are you going to the international symposium on renewable energy this Friday?'\nWoman: 'I wouldn't miss it for the world!'\nNarrator: 'What does the woman mean?'",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "She definitely plans on attending the symposium."
      },
      {
        "key": "B",
        "text": "She is not interested in renewable energy."
      },
      {
        "key": "C",
        "text": "She will travel around the world on Friday."
      },
      {
        "key": "D",
        "text": "She missed the registration deadline."
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-LIST-02",
    "examType": "TOEFL_ITP",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "Academic Lecture: Classical Islamic Astronomy in Baghdad",
    "prompt": "Based on the audio lecture and visual reference, which historical instrument was perfected in 9th century Baghdad for calculating celestial coordinates and prayer times?",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
    "imageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "The Astrolabe"
      },
      {
        "key": "B",
        "text": "The Optical Microscope"
      },
      {
        "key": "C",
        "text": "The Magnetic Barometer"
      },
      {
        "key": "D",
        "text": "The Digital Chronometer"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-STRUC-01",
    "examType": "TOEFL_ITP",
    "section": "structure",
    "type": "multiple_choice",
    "passage": "",
    "prompt": "Not only _______ the fundamental laws of optics, but Ibn al-Haytham also established the foundation for the modern empirical scientific method.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "he formulated"
      },
      {
        "key": "B",
        "text": "did he formulate"
      },
      {
        "key": "C",
        "text": "he did formulate"
      },
      {
        "key": "D",
        "text": "was formulating"
      }
    ],
    "correct": "B",
    "points": 1
  },
  {
    "id": "Q-STRUC-02",
    "examType": "TOEFL_ITP",
    "section": "structure",
    "type": "multiple_choice",
    "passage": "Written Expression Error Analysis (Identify the incorrect underlined section):",
    "prompt": "The Al-Imam (A)[faculty members] has (B)[unanimously] agreed that every student must (C)[submit their] research proposal (D)[before deadline].",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "faculty members"
      },
      {
        "key": "B",
        "text": "unanimously"
      },
      {
        "key": "C",
        "text": "has -> have (Subject-Verb Agreement error)"
      },
      {
        "key": "D",
        "text": "before deadline"
      }
    ],
    "correct": "C",
    "points": 1
  },
  {
    "id": "Q-VOCAB-01",
    "examType": "TOEFL_ITP",
    "section": "structure",
    "type": "sentence_blank",
    "passage": "",
    "prompt": "The rookie's __________________ celebration after his first goal went on so long the referee had to walk over and remind him the game wasn't over, him sprinting the length of the field, arms out, before sliding on his knees into the corner flag.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "exuberant"
      },
      {
        "key": "B",
        "text": "aggressive"
      },
      {
        "key": "C",
        "text": "competitive"
      },
      {
        "key": "D",
        "text": "nervous"
      }
    ],
    "correct": "A",
    "points": 1,
    "hints": [
      "Hint 1: Look for an adjective that describes unrestrained, enthusiastic energy and joyful excitement.",
      "Hint 2: The sentence describes sprinting the length of the field and sliding on knees out of pure happiness.",
      "Hint 3: The correct word is synonymous with 'ebullient' or 'high-spirited'."
    ]
  },
  {
    "id": "Q-VOCAB-02",
    "examType": "TOEFL_ITP",
    "section": "structure",
    "type": "sentence_blank",
    "passage": "",
    "prompt": "Despite facing harsh desert conditions, the ancient botanists developed __________________ irrigation techniques that allowed date palms and citrus groves to thrive across arid oases.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "ingenious"
      },
      {
        "key": "B",
        "text": "negligent"
      },
      {
        "key": "C",
        "text": "fragile"
      },
      {
        "key": "D",
        "text": "obsolete"
      }
    ],
    "correct": "A",
    "points": 1,
    "hints": [
      "Hint 1: The context highlights remarkable innovation ('allowed date palms to thrive in arid oases').",
      "Hint 2: It means clever, brilliantly inventive, or resourceful.",
      "Hint 3: Originates from the Latin root related to 'genius'."
    ]
  },
  {
    "id": "Q-READ-01",
    "examType": "TOEFL_ITP",
    "section": "reading",
    "type": "multiple_choice",
    "passage": "Passage 1: The House of Wisdom (Bayt al-Hikmah)\n\nEstablished in Baghdad in the early 9th century during the Abbasid Caliphate, the House of Wisdom served as an unrivaled epicenter of intellectual translation, astronomical research, and mathematical discovery. Scholars from diverse backgrounds congregated to translate ancient Hellenistic, Persian, and Indian treatises into Arabic. This scholarly movement not only preserved classical knowledge that might otherwise have vanished, but also catalyzed revolutionary advancements in algebra, medicine, optics, and philosophy that subsequently ignited the European Renaissance.",
    "prompt": "The word 'catalyzed' in the passage is closest in meaning to which of the following?",
    "audioUrl": "",
    "imageUrl": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Accelerated or triggered"
      },
      {
        "key": "B",
        "text": "Delayed significantly"
      },
      {
        "key": "C",
        "text": "Replaced entirely"
      },
      {
        "key": "D",
        "text": "Contradicted"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-READ-02",
    "examType": "TOEFL_ITP",
    "section": "reading",
    "type": "multiple_choice",
    "passage": "Passage 1: The House of Wisdom (Bayt al-Hikmah)\n\nEstablished in Baghdad in the early 9th century during the Abbasid Caliphate, the House of Wisdom served as an unrivaled epicenter of intellectual translation, astronomical research, and mathematical discovery.",
    "prompt": "According to the passage, what was a primary accomplishment of the scholars at the House of Wisdom?",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "They translated and synthesized major works from Hellenistic, Persian, and Indian traditions into Arabic."
      },
      {
        "key": "B",
        "text": "They restricted philosophical discourse strictly to local dialects."
      },
      {
        "key": "C",
        "text": "They built maritime navigation fleets for trans-Atlantic expeditions."
      },
      {
        "key": "D",
        "text": "They replaced mathematical arithmetic with symbolic alchemy."
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-WRIT-01",
    "examType": "IELTS_ACADEMIC",
    "section": "writing",
    "type": "essay",
    "passage": "IELTS Task 2 Academic Essay Prompt",
    "prompt": "In the era of rapid artificial intelligence adoption, some educators argue that foundational ethics and human empathy must become the core focus of academic institutions rather than pure technical specialization. To what extent do you agree or disagree? (Write at least 250 words)",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Standard Rubric",
    "points": 100
  },
  {
    "id": "Q-SPK-01",
    "examType": "IELTS_ACADEMIC",
    "section": "speaking",
    "type": "speaking_record",
    "passage": "IELTS Speaking Part 2: Long Turn Presentation (Visual Cue Card)",
    "prompt": "Describe an inspiring leader, teacher, or visionary scholar whose principles have significantly shaped your worldview.\n\nYou should state:\n- Who this person is\n- What key values or achievements they exemplify\n- How their guidance influenced your personal aspirations\n- And explain why their legacy remains profoundly impactful.",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
    "imageUrl": "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    "videoUrl": "",
    "options": [],
    "correct": "Examiner Rubric",
    "points": 100
  },
  {
    "id": "Q-G7-LIST-01",
    "examType": "Grade 7",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "Classroom Dialogue: First Day at SMP Al-Imam",
    "prompt": "Ahmad: 'Excuse me, is this the English classroom for Grade 7?'\nTeacher: 'Yes, Ahmad! Welcome to our class. Please take a seat next to Bilal.'\nNarrator: 'Where does Ahmad sit?'",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Next to Bilal in the Grade 7 classroom"
      },
      {
        "key": "B",
        "text": "Near the teacher's office"
      },
      {
        "key": "C",
        "text": "Outside the school gate"
      },
      {
        "key": "D",
        "text": "In the Grade 8 laboratory"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G7-LIST-02",
    "examType": "Grade 7",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "Dialogue: School Library Book Borrowing",
    "prompt": "Librarian: 'Assalamu'alaikum Fatimah. Are you borrowing the English grammar book or the Islamic science encyclopedia today?'\nFatimah: 'I need the grammar book for Mrs. Tri's assignment tomorrow.'\nNarrator: 'Which book does Fatimah borrow?'",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "The English grammar book for Mrs. Tri's assignment"
      },
      {
        "key": "B",
        "text": "The Islamic science encyclopedia"
      },
      {
        "key": "C",
        "text": "A comic book from the store"
      },
      {
        "key": "D",
        "text": "A dictionary from Grade 9"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G7-STRUC-01",
    "examType": "Grade 7",
    "section": "structure",
    "type": "multiple_choice",
    "passage": "",
    "prompt": "Bilal and his classmates _______ English together in the school library every Tuesday afternoon.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "studies"
      },
      {
        "key": "B",
        "text": "study"
      },
      {
        "key": "C",
        "text": "studying"
      },
      {
        "key": "D",
        "text": "studied"
      }
    ],
    "correct": "B",
    "points": 1
  },
  {
    "id": "Q-G7-STRUC-02",
    "examType": "Grade 7",
    "section": "structure",
    "type": "multiple_choice",
    "passage": "",
    "prompt": "_______ new notebooks on Mrs. Tri's desk belong to the students of Grade 7 Ustman.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "This"
      },
      {
        "key": "B",
        "text": "These"
      },
      {
        "key": "C",
        "text": "That"
      },
      {
        "key": "D",
        "text": "It"
      }
    ],
    "correct": "B",
    "points": 1
  },
  {
    "id": "Q-G7-VOCAB-01",
    "examType": "Grade 7",
    "section": "structure",
    "type": "sentence_blank",
    "passage": "",
    "prompt": "Every morning before class starts, the Grade 7 students gather in the mosque to recite the Holy Quran with great __________________.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "devotion"
      },
      {
        "key": "B",
        "text": "careless"
      },
      {
        "key": "C",
        "text": "noisy"
      },
      {
        "key": "D",
        "text": "angry"
      }
    ],
    "correct": "A",
    "points": 1,
    "hints": [
      "Hint 1: Look for a positive noun related to sincerity, focus, and spiritual reverence.",
      "Hint 2: It is synonymous with dedication and deep respect."
    ]
  },
  {
    "id": "Q-G7-READ-01",
    "examType": "Grade 7",
    "section": "reading",
    "type": "multiple_choice",
    "passage": "Daily Routine at SMP Al-Imam Islamic School:\n\nSMP Al-Imam Islamic School provides a balanced curriculum blending modern academic sciences with Islamic character building. Grade 7 students begin their day at 07:00 AM with morning Dhuha prayer and Al-Quran tahfidz session. Afterward, they attend general subjects including English, Mathematics, and Natural Sciences in state-of-the-art classrooms. During lunchtime, students practice Islamic table manners (adab) and perform congregational Dhuhr prayer together.",
    "prompt": "What is the first activity Grade 7 students perform when they arrive at school in the morning?",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Morning Dhuha prayer and Al-Quran tahfidz session"
      },
      {
        "key": "B",
        "text": "English mid-term examination"
      },
      {
        "key": "C",
        "text": "Science laboratory experiments"
      },
      {
        "key": "D",
        "text": "Playing football in the school yard"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G7-READ-02",
    "examType": "Grade 7",
    "section": "reading",
    "type": "multiple_choice",
    "passage": "School Announcement - English Speech Contest:\n\nAttention to all students of 7 Ustman and 7 Aisyah! The SMP Al-Imam English Department is holding the annual English Speech Competition on Monday, October 20th. The theme is 'Noble Character and Global Leadership'. All participants must submit their written speech scripts to Mrs. Tri Nuryani, S.S by Friday afternoon. Exciting trophies, certificates, and educational book vouchers await the winners!",
    "prompt": "To whom must participants submit their written speech scripts before the contest?",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "To Mrs. Tri Nuryani, S.S by Friday afternoon"
      },
      {
        "key": "B",
        "text": "To the school security guard on Monday"
      },
      {
        "key": "C",
        "text": "To the Grade 9 classroom captain"
      },
      {
        "key": "D",
        "text": "To the canteen staff"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G7-WRIT-01",
    "examType": "Grade 7",
    "section": "writing",
    "type": "essay",
    "passage": "Descriptive Text Writing Task (Part 1)",
    "prompt": "Write a short descriptive paragraph (60-80 words) introducing yourself, your favorite subject at SMP Al-Imam, and your daily hobby.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Standard Descriptive Rubric",
    "points": 100
  },
  {
    "id": "Q-G7-WRIT-02",
    "examType": "Grade 7",
    "section": "writing",
    "type": "essay",
    "passage": "Short Message Writing Task (Part 2)",
    "prompt": "Write a short friendly message (60-80 words) to your classmate inviting them to study English together at the library this Thursday. Mention the time and what topic you want to discuss.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Standard Writing Rubric",
    "points": 100
  },
  {
    "id": "Q-G7-SPK-01",
    "examType": "Grade 7",
    "section": "speaking",
    "type": "speaking_record",
    "passage": "Speaking Part 1: Self-Introduction & Aspirations",
    "prompt": "Record your voice (1 minute) answering these 3 prompts:\n1. Introduce your full name and your Grade 7 class (7 Ustman / 7 Aisyah).\n2. What is your favorite subject and why do you like it?\n3. What is your future goal or dream?",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Examiner Speaking Rubric",
    "points": 100
  },
  {
    "id": "Q-G7-SPK-02",
    "examType": "Grade 7",
    "section": "speaking",
    "type": "speaking_record",
    "passage": "Speaking Part 2: Daily Routine & Islamic Character",
    "prompt": "Record your voice (1 minute) describing your daily morning routine before coming to school:\n- What time do you wake up for Subuh prayer?\n- What do you do after prayer to prepare for school?\n- Why is punctuality important in Islam?",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Examiner Speaking Rubric",
    "points": 100
  },
  {
    "id": "Q-G8-LIST-01",
    "examType": "Grade 8",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "Dialogue: School Science Fair Preparation",
    "prompt": "Fatimah: 'Have you finished building the water filtration model for the science exhibition?'\nAisyah: 'Not yet, I still need to add the activated charcoal layer this afternoon.'\nNarrator: 'What is Aisyah going to do this afternoon?'",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Add the activated charcoal layer to the water filtration model"
      },
      {
        "key": "B",
        "text": "Buy a new aquarium for the classroom"
      },
      {
        "key": "C",
        "text": "Cancel the science project presentation"
      },
      {
        "key": "D",
        "text": "Visit the principal's office"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G8-LIST-02",
    "examType": "Grade 8",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "School Announcement: Outdoor Sports and Weather Notice",
    "prompt": "Coach Farhan: 'Because heavy rain is forecast for this afternoon, all archery and futsal practices will move inside the multipurpose gymnasium at 03:30 PM.'\nNarrator: 'Why is the practice moving to the gymnasium?'",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Heavy rain is forecast for this afternoon"
      },
      {
        "key": "B",
        "text": "The school field is being repainted"
      },
      {
        "key": "C",
        "text": "All students passed the English exam"
      },
      {
        "key": "D",
        "text": "The gymnasium has a new archery target"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G8-STRUC-01",
    "examType": "Grade 8",
    "section": "structure",
    "type": "multiple_choice",
    "passage": "",
    "prompt": "While the students _______ an experiment in the chemistry lab yesterday, the school bell rang.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "are conducting"
      },
      {
        "key": "B",
        "text": "were conducting"
      },
      {
        "key": "C",
        "text": "conduct"
      },
      {
        "key": "D",
        "text": "have conducted"
      }
    ],
    "correct": "B",
    "points": 1
  },
  {
    "id": "Q-G8-STRUC-02",
    "examType": "Grade 8",
    "section": "structure",
    "type": "multiple_choice",
    "passage": "",
    "prompt": "Mount Everest is __________________ mountain in the world, attracting climbers from every continent.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "highest"
      },
      {
        "key": "B",
        "text": "higher than"
      },
      {
        "key": "C",
        "text": "the highest"
      },
      {
        "key": "D",
        "text": "as high as"
      }
    ],
    "correct": "C",
    "points": 1
  },
  {
    "id": "Q-G8-VOCAB-01",
    "examType": "Grade 8",
    "section": "structure",
    "type": "sentence_blank",
    "passage": "",
    "prompt": "The robotics club won first place in the national competition because their invention was highly __________________ and solved real agricultural challenges.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "innovative"
      },
      {
        "key": "B",
        "text": "useless"
      },
      {
        "key": "C",
        "text": "ordinary"
      },
      {
        "key": "D",
        "text": "confusing"
      }
    ],
    "correct": "A",
    "points": 1,
    "hints": [
      "Hint 1: An adjective that describes something original, clever, and newly created.",
      "Hint 2: Directly related to innovation and cutting-edge design."
    ]
  },
  {
    "id": "Q-G8-READ-01",
    "examType": "Grade 8",
    "section": "reading",
    "type": "multiple_choice",
    "passage": "Passage: The Legacy of Abbas Ibn Firnas\n\nIn the 9th century in Cordoba, Andalusia, the polymath Abbas Ibn Firnas designed a winged glider apparatus and attempted one of the earliest recorded human flights in history. Beyond aviation, Ibn Firnas also invented a water clock, devised colorless glass manufacturing techniques, and created a mechanized planetarium simulating planetary movements. His courageous spirit and scientific curiosity inspire modern youth to pursue aerospace and technological frontiers.",
    "prompt": "According to the passage, which invention was created by Abbas Ibn Firnas besides his aviation glider?",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "A water clock and a mechanized planetarium"
      },
      {
        "key": "B",
        "text": "A digital electronic smartwatch"
      },
      {
        "key": "C",
        "text": "A solar-powered automobile engine"
      },
      {
        "key": "D",
        "text": "A mechanical movable printing press"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G8-READ-02",
    "examType": "Grade 8",
    "section": "reading",
    "type": "multiple_choice",
    "passage": "Passage: Al-Khwarizmi, Father of Algebra\n\nMuhammad ibn Musa al-Khwarizmi was a 9th-century Muslim mathematician and astronomer who worked at the House of Wisdom in Baghdad. His landmark treatise introduced systematic solutions to linear and quadratic equations. The word 'algebra' originates from 'al-jabr', an operation he formalized. Al-Khwarizmi also helped popularize the Hindu-Arabic numeral system, which forms the numerical foundation used worldwide today.",
    "prompt": "What mathematical breakthrough is credited to Al-Khwarizmi in the passage?",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Systematic solutions for linear and quadratic equations"
      },
      {
        "key": "B",
        "text": "The discovery of quantum mechanics"
      },
      {
        "key": "C",
        "text": "Inventing electronic calculators"
      },
      {
        "key": "D",
        "text": "Formulating modern aerodynamic flight formulas"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G8-WRIT-01",
    "examType": "Grade 8",
    "section": "writing",
    "type": "essay",
    "passage": "Recount Text Writing Task (Part 1)",
    "prompt": "Write a recount text (100-150 words) about a memorable school trip, science competition, or outdoor activity you participated in. Describe the orientation, sequence of events, and personal reflection.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Standard Recount Rubric",
    "points": 100
  },
  {
    "id": "Q-G8-WRIT-02",
    "examType": "Grade 8",
    "section": "writing",
    "type": "essay",
    "passage": "Narrative Text Writing Task (Part 2)",
    "prompt": "Write a short narrative story (100-150 words) about honesty and friendship. Include a complication where a character faces a tough moral choice and a resolution showing positive character.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Standard Narrative Rubric",
    "points": 100
  },
  {
    "id": "Q-G8-SPK-01",
    "examType": "Grade 8",
    "section": "speaking",
    "type": "speaking_record",
    "passage": "Speaking Part 1: Recount a Past Experience",
    "prompt": "Record your voice (1.5 minutes) describing a memorable experience in your life:\n- What happened and when did it take place?\n- Who was with you during the event?\n- What did you learn from this experience?",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Examiner Speaking Rubric",
    "points": 100
  },
  {
    "id": "Q-G8-SPK-02",
    "examType": "Grade 8",
    "section": "speaking",
    "type": "speaking_record",
    "passage": "Speaking Part 2: Technology in Learning",
    "prompt": "Record your voice (1.5 minutes) giving your opinion:\n'How do you use computers and the internet to support your learning at SMP Al-Imam?'\nMention benefits and how you avoid distractions.",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Examiner Speaking Rubric",
    "points": 100
  },
  {
    "id": "Q-G9-LIST-01",
    "examType": "Grade 9",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "Academic Announcement: International STEM & English Olympiad",
    "prompt": "Principal: 'Attention to all Grade 9 candidates. Registration for the International STEM Olympiad closes this Friday at 3:00 PM. Make sure your research abstracts are endorsed by your academic advisor.'\nNarrator: 'What is required before Grade 9 candidates can submit their Olympiad registration?'",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Obtain academic advisor endorsement for their abstracts"
      },
      {
        "key": "B",
        "text": "Pay a late submission penalty fee"
      },
      {
        "key": "C",
        "text": "Cancel all scheduled afternoon classes"
      },
      {
        "key": "D",
        "text": "Travel to an overseas university campus"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G9-LIST-02",
    "examType": "Grade 9",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "Lecture Snippet: Career and Senior High School Preparation",
    "prompt": "Counselor: 'When choosing your high school concentration next year, consider both your academic passion and the future skills demanded by renewable engineering and digital technology.'\nNarrator: 'What advice does the counselor give to Grade 9 students?'",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Consider their academic passion and future demanded skills"
      },
      {
        "key": "B",
        "text": "Stop studying English in high school"
      },
      {
        "key": "C",
        "text": "Avoid all technology and engineering careers"
      },
      {
        "key": "D",
        "text": "Postpone graduation until next decade"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G9-STRUC-01",
    "examType": "Grade 9",
    "section": "structure",
    "type": "multiple_choice",
    "passage": "",
    "prompt": "The new renewable energy guideline __________________ by the academic committee before the next school term begins.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "will be implemented"
      },
      {
        "key": "B",
        "text": "will implement"
      },
      {
        "key": "C",
        "text": "is implementing"
      },
      {
        "key": "D",
        "text": "was implement"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G9-STRUC-02",
    "examType": "Grade 9",
    "section": "structure",
    "type": "multiple_choice",
    "passage": "",
    "prompt": "If students __________________ consistent reading habits today, they will achieve outstanding academic results in high school.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "prioritize"
      },
      {
        "key": "B",
        "text": "prioritized"
      },
      {
        "key": "C",
        "text": "had prioritized"
      },
      {
        "key": "D",
        "text": "will prioritize"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G9-VOCAB-01",
    "examType": "Grade 9",
    "section": "structure",
    "type": "sentence_blank",
    "passage": "",
    "prompt": "The researcher presented compelling empirical evidence to __________________ the hypothesis that renewable solar arrays significantly decrease urban carbon emissions.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "substantiate"
      },
      {
        "key": "B",
        "text": "contradict"
      },
      {
        "key": "C",
        "text": "diminish"
      },
      {
        "key": "D",
        "text": "disregard"
      }
    ],
    "correct": "A",
    "points": 1,
    "hints": [
      "Hint 1: A verb meaning to prove, confirm, or provide evidence in support of an assertion.",
      "Hint 2: Synonym of 'validate', 'corroborate', or 'verify'."
    ]
  },
  {
    "id": "Q-G9-READ-01",
    "examType": "Grade 9",
    "section": "reading",
    "type": "multiple_choice",
    "passage": "Report Text: Artificial Intelligence in Modern Education\n\nArtificial Intelligence (AI) is transforming academic environments by enabling adaptive learning pathways tailored to individual student needs. Intelligent tutoring systems analyze performance metrics in real time, identifying knowledge gaps and generating customized practice modules. However, leading education experts emphasize that AI should augment rather than replace human educators, as ethical guidance, empathy, and moral leadership remain fundamentally human virtues.",
    "prompt": "According to the report, what is the primary conclusion regarding the relationship between AI and human educators?",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "AI should assist educators while human teachers provide essential moral and empathetic guidance."
      },
      {
        "key": "B",
        "text": "AI systems should completely replace human teachers in secondary schools."
      },
      {
        "key": "C",
        "text": "AI technologies have no practical benefits in educational environments."
      },
      {
        "key": "D",
        "text": "Adaptive learning systems must be restricted to university postgraduate levels."
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G9-READ-02",
    "examType": "Grade 9",
    "section": "reading",
    "type": "multiple_choice",
    "passage": "Expository Text: Clean Solar Energy at Islamic Schools\n\nSolar energy harnessing has gained momentum across educational institutions seeking energy independence and environmental stewardship. By installing photovoltaic rooftop panels, SMP Al-Imam reduces conventional electrical grid dependence by over forty percent. Furthermore, the installation serves as an interactive outdoor science laboratory where students calculate kilowatt-hour yields, inspect inverter circuits, and embody the Islamic duty of stewardship over the Earth (khalifah fil-ardh).",
    "prompt": "What dual benefit does solar panel installation provide for SMP Al-Imam according to the passage?",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      {
        "key": "A",
        "text": "Reduces grid electricity dependence and serves as an interactive science learning lab"
      },
      {
        "key": "B",
        "text": "Provides free high-speed wifi and eliminates sports classes"
      },
      {
        "key": "C",
        "text": "Powers electric school buses and cancels homework"
      },
      {
        "key": "D",
        "text": "Replaces traditional textbooks with diesel generators"
      }
    ],
    "correct": "A",
    "points": 1
  },
  {
    "id": "Q-G9-WRIT-01",
    "examType": "Grade 9",
    "section": "writing",
    "type": "essay",
    "passage": "Analytical Exposition Essay Task (Part 1)",
    "prompt": "Write an analytical exposition essay (150-200 words) on the topic:\n'Why Mastery of the English Language is Essential for Junior High Students in the Global Digital Era.'\nInclude a clear thesis statement, two supporting arguments with evidence, and a reiteration conclusion.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Standard Analytical Exposition Rubric",
    "points": 100
  },
  {
    "id": "Q-G9-WRIT-02",
    "examType": "Grade 9",
    "section": "writing",
    "type": "essay",
    "passage": "Argumentative Essay Task (Part 2)",
    "prompt": "Write an argumentative essay (150-200 words) addressing:\n'Should Smartphones be Used as Learning Tools in Junior High Classrooms?'\nState your position clearly, present arguments with examples, address a counterargument, and conclude.",
    "audioUrl": "",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Standard Argumentative Rubric",
    "points": 100
  },
  {
    "id": "Q-G9-SPK-01",
    "examType": "Grade 9",
    "section": "speaking",
    "type": "speaking_record",
    "passage": "Speaking Part 1: Persuasive Speech on Environmental Action",
    "prompt": "Record your voice (2 minutes) presenting your viewpoint:\n'How can junior high students contribute to environmental preservation and renewable energy in their school community?'\nProvide at least two practical action steps with reasoned justification.",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Examiner Speaking Rubric",
    "points": 100
  },
  {
    "id": "Q-G9-SPK-02",
    "examType": "Grade 9",
    "section": "speaking",
    "type": "speaking_record",
    "passage": "Speaking Part 2: Leadership, Ethics & Islamic Principles",
    "prompt": "Record your voice (2 minutes) reflecting on the following topic:\n'What qualities make a great student leader according to Islamic values, and how will you apply them as you graduate to Senior High School?'\nExplain with real examples from school or daily life.",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [],
    "correct": "Examiner Speaking Rubric",
    "points": 100
  },
  {
    "id": "Q-LIST-671",
    "examType": "Grade 9",
    "section": "listening",
    "type": "multiple_choice",
    "passage": "Listening Comprehension: School Radio Interview with Dan",
    "prompt": "Why does the interviewer speak to Dan?",
    "audioUrl": "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
    "imageUrl": "",
    "videoUrl": "",
    "options": [
      { "key": "A", "text": "To ask about his achievements and experience in the school project" },
      { "key": "B", "text": "To invite him to join the student council committee" },
      { "key": "C", "text": "To offer him an immediate part-time tutoring position" },
      { "key": "D", "text": "To give a formal warning about his attendance record" }
    ],
    "correct": "A",
    "points": 1
  }
];

  var addedQs = 0;
  allQuestions.forEach(function(q) {
    var promptClean = String(q.prompt || "").toLowerCase().trim();
    var idClean = String(q.id || "").toUpperCase().trim();
    if (existingPrompts.indexOf(promptClean) === -1 && existingIds.indexOf(idClean) === -1) {
      var optionsStr = q.options ? JSON.stringify(q.options) : "[]";
      var rubricStr = q.rubric ? JSON.stringify(q.rubric) : (q.type === "essay" || q.type === "speaking_record" ? JSON.stringify({ criteria: "Standard Rubric" }) : "{}");
      qSheet.appendRow([
        q.id,
        q.examType || "TOEFL_ITP",
        q.section || "listening",
        q.type || "multiple_choice",
        q.passage || "",
        q.prompt || "",
        q.audioUrl || "",
        q.imageUrl || "",
        optionsStr,
        q.correct || "",
        rubricStr,
        q.points || 1,
        (q.examType || "") + ", " + (q.section || ""),
        now
      ]);
      addedQs++;
    }
  });

  Logger.log("=== SINKRONISASI SUKSES ===");
  Logger.log("User Baru Ditambahkan: " + addedUsers);
  Logger.log("Soal Baru Ditambahkan: " + addedQs);
  Logger.log("Total Soal di Sheet Sekarang: " + (qSheet.getLastRow() - 1));
  } catch (err) {
    Logger.log("ERROR RUNTIME: " + err.message + " \nStack: " + err.stack);
  }
}
