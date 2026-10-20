/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * QuestionModel.gs - Question Bank, Section Management & Multi-Format Parsing
 *
 * Supported Question Types:
 * - multiple_choice : A/B/C/D/E with optional audio/image specimen
 * - fill_blank      : C-Test or inline blank completion
 * - essay           : Long-form writing with word-count & scoring rubrics
 * - speaking_record : Audio recording prompt with time limit & audio playback
 * - matching_pairs  : Collocation and definition matching pairs
 */

var QuestionModel = (function () {
  function getQuestionSheet() {
    var ss = getDatabaseSpreadsheet();
    if (!ss) return null;
    var sheet = ss.getSheetByName(CONFIG.SHEETS.QUESTIONS);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.QUESTIONS);
      var headers = [
        "id", "examType", "section", "type", "passage", "prompt",
        "audioUrl", "imageUrl", "videoUrl", "optionsJson", "correctAnswer",
        "rubricJson", "points", "tags", "createdAt"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    return sheet;
  }

  /**
   * Get all questions, fallback to comprehensive sample banks
   */
  function getAllQuestions(sheetOnly) {
    var sheet = getQuestionSheet();
    if (!sheet) return sheetOnly ? [] : getMockQuestions();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return sheetOnly ? [] : getMockQuestions();

    var headers = data[0];
    var questions = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var q = {};
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        var val = row[j];
        if (key === "optionsJson" || key === "rubricJson") {
          try {
            val = JSON.parse(val || "[]");
          } catch (e) {
            val = [];
          }
        }
        q[key] = val;
      }
      questions.push(q);
    }
    return questions;
  }

  /**
   * Filter questions by exam type and section
   */
  function getQuestionsBySection(examType, section) {
    var all = getAllQuestions();
    return all.filter(function (q) {
      var matchExam = !examType || q.examType === examType || q.examType === "ALL";
      var matchSec = !section || q.section === section;
      return matchExam && matchSec;
    });
  }

  /**
   * Add a new question to the bank
   */
  function addQuestion(qData) {
    var sheet = getQuestionSheet();
    var id = qData.id || ("Q-" + Utilities.getUuid().substring(0, 8).toUpperCase());
    
    // Check headers of the sheet to map columns accurately
    var headers = sheet ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    if (!headers || headers.length === 0) {
      headers = [
        "id", "examType", "section", "type", "passage", "prompt",
        "audioUrl", "imageUrl", "optionsJson", "correctAnswer",
        "rubricJson", "points", "tags", "createdAt"
      ];
    }

    var optionsStr = "";
    var rawOptions = qData.optionsJson || qData.options || [];
    optionsStr = typeof rawOptions === "string" ? rawOptions : JSON.stringify(rawOptions);

    var rubricStr = "";
    var rawRubric = qData.rubricJson || qData.rubric || {};
    rubricStr = typeof rawRubric === "string" ? rawRubric : JSON.stringify(rawRubric);

    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var h = headers[i];
      switch(h) {
        case "id": row.push(id); break;
        case "examType": row.push(qData.examType || "TOEFL_ITP"); break;
        case "section": row.push(qData.section || "listening"); break;
        case "type": row.push(qData.type || "multiple_choice"); break;
        case "passage": row.push(qData.passage || ""); break;
        case "prompt": row.push(qData.prompt || ""); break;
        case "audioUrl": row.push(qData.audioUrl || ""); break;
        case "imageUrl": row.push(qData.imageUrl || ""); break;
        case "videoUrl": row.push(qData.videoUrl || ""); break;
        case "optionsJson": row.push(optionsStr); break;
        case "correctAnswer": row.push(qData.correctAnswer || qData.correct || ""); break;
        case "rubricJson": row.push(rubricStr); break;
        case "points": row.push(qData.points || 1); break;
        case "tags": row.push(qData.tags || (qData.examType + ", " + qData.section)); break;
        case "createdAt": row.push(new Date().toISOString()); break;
        default: row.push(""); break;
      }
    }

    if (sheet) {
      sheet.appendRow(row);
    }

    return {
      success: true,
      questionId: id,
      message: "Question successfully registered to the bank."
    };
  }

  /**
   * Bulk import questions from JSON or CSV rows
   */
  function bulkImportQuestions(items) {
    var added = 0;
    for (var i = 0; i < items.length; i++) {
      var res = addQuestion(items[i]);
      if (res.success) added++;
    }
    return { success: true, count: added, importedCount: added };
  }

  /**
   * Mock questions library with authentic 43 SMP Al-Imam examination questions
   * (TOEFL ITP, IELTS Academic, Grade 7, Grade 8, and Grade 9)
   */
  function getMockQuestions() {
    return [
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "TOEFL_ITP, listening"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "TOEFL_ITP, listening"
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
    "optionsJson": [
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
    "correctAnswer": "B",
    "rubricJson": {},
    "points": 1,
    "tags": "TOEFL_ITP, structure"
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
    "optionsJson": [
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
    "correctAnswer": "C",
    "rubricJson": {},
    "points": 1,
    "tags": "TOEFL_ITP, structure"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "TOEFL_ITP, structure, Hints Included"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "TOEFL_ITP, structure, Hints Included"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "TOEFL_ITP, reading"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "TOEFL_ITP, reading"
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
    "optionsJson": [],
    "correctAnswer": "Standard Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "IELTS_ACADEMIC, writing"
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
    "optionsJson": [],
    "correctAnswer": "Examiner Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "IELTS_ACADEMIC, speaking"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 7, listening"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 7, listening"
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
    "optionsJson": [
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
    "correctAnswer": "B",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 7, structure"
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
    "optionsJson": [
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
    "correctAnswer": "B",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 7, structure"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 7, structure, Hints Included"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 7, reading"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 7, reading"
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
    "optionsJson": [],
    "correctAnswer": "Standard Descriptive Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 7, writing"
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
    "optionsJson": [],
    "correctAnswer": "Standard Writing Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 7, writing"
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
    "optionsJson": [],
    "correctAnswer": "Examiner Speaking Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 7, speaking"
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
    "optionsJson": [],
    "correctAnswer": "Examiner Speaking Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 7, speaking"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 8, listening"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 8, listening"
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
    "optionsJson": [
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
    "correctAnswer": "B",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 8, structure"
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
    "optionsJson": [
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
    "correctAnswer": "C",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 8, structure"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 8, structure, Hints Included"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 8, reading"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 8, reading"
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
    "optionsJson": [],
    "correctAnswer": "Standard Recount Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 8, writing"
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
    "optionsJson": [],
    "correctAnswer": "Standard Narrative Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 8, writing"
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
    "optionsJson": [],
    "correctAnswer": "Examiner Speaking Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 8, speaking"
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
    "optionsJson": [],
    "correctAnswer": "Examiner Speaking Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 8, speaking"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 9, listening"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 9, listening"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 9, structure"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 9, structure"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 9, structure, Hints Included"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 9, reading"
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
    "optionsJson": [
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
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 9, reading"
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
    "optionsJson": [],
    "correctAnswer": "Standard Analytical Exposition Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 9, writing"
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
    "optionsJson": [],
    "correctAnswer": "Standard Argumentative Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 9, writing"
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
    "optionsJson": [],
    "correctAnswer": "Examiner Speaking Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 9, speaking"
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
    "optionsJson": [],
    "correctAnswer": "Examiner Speaking Rubric",
    "rubricJson": {
      "criteria": "Standard Rubric"
    },
    "points": 100,
    "tags": "Grade 9, speaking"
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
    "optionsJson": [
      { "key": "A", "text": "To ask about his achievements and experience in the school project" },
      { "key": "B", "text": "To invite him to join the student council committee" },
      { "key": "C", "text": "To offer him an immediate part-time tutoring position" },
      { "key": "D", "text": "To give a formal warning about his attendance record" }
    ],
    "correctAnswer": "A",
    "rubricJson": {},
    "points": 1,
    "tags": "Grade 9, listening"
  }
];
  }

  return {
    getAllQuestions: getAllQuestions,
    getQuestionsBySection: getQuestionsBySection,
    addQuestion: addQuestion,
    bulkImportQuestions: bulkImportQuestions,
    getMockQuestions: getMockQuestions,
    getQuestionSheet: getQuestionSheet
  };
})();
