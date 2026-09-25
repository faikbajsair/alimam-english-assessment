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
  function getAllQuestions() {
    var sheet = getQuestionSheet();
    if (!sheet) return getMockQuestions();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return getMockQuestions();

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
    var id = "Q-" + Utilities.getUuid().substring(0, 8).toUpperCase();
    var row = [
      id,
      qData.examType || "TOEFL_ITP",
      qData.section || "listening",
      qData.type || "multiple_choice",
      qData.passage || "",
      qData.prompt || "",
      qData.audioUrl || "",
      qData.imageUrl || "",
      qData.videoUrl || "",
      typeof qData.options === "string" ? qData.options : JSON.stringify(qData.options || []),
      qData.correctAnswer || "",
      typeof qData.rubric === "string" ? qData.rubric : JSON.stringify(qData.rubric || {}),
      qData.points || 1,
      qData.tags || "",
      new Date().toISOString()
    ];

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
    return { success: true, count: added };
  }

  /**
   * Mock questions library with authentic TOEFL ITP, IELTS Academic, and Al-Imam EPT items
   */
  function getMockQuestions() {
    return [
      // SECTION 1: LISTENING COMPREHENSION
      {
        id: "Q-LIST-01",
        examType: "TOEFL_ITP",
        section: "listening",
        type: "multiple_choice",
        passage: "Short Dialogue: On a University Campus",
        prompt: "Man: 'Are you going to the international symposium on renewable energy this Friday?'\nWoman: 'I wouldn't miss it for the world!'\nNarrator: 'What does the woman mean?'",
        audioUrl: "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "She definitely plans on attending the symposium." },
          { key: "B", text: "She is not interested in renewable energy." },
          { key: "C", text: "She will travel around the world on Friday." },
          { key: "D", text: "She missed the registration deadline." }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "TOEFL, Listening Part A, Idiom"
      },
      {
        id: "Q-LIST-02",
        examType: "TOEFL_ITP",
        section: "listening",
        type: "multiple_choice",
        passage: "Academic Lecture: Islamic Astronomy during the Golden Age",
        prompt: "Based on the audio lecture, which instrument was perfected by Muslim astronomers in 9th century Baghdad for calculating celestial coordinates?",
        audioUrl: "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
        optionsJson: [
          { key: "A", text: "The Astrolabe" },
          { key: "B", text: "The Optical Microscope" },
          { key: "C", text: "The Magnetic Barometer" },
          { key: "D", text: "The Digital Chronometer" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "TOEFL, Listening Part C, History"
      },
      {
        id: "Q-LIST-03",
        examType: "IELTS_ACADEMIC",
        section: "listening",
        type: "fill_blank",
        passage: "Conversation between a Student Advisor and New Candidate",
        prompt: "Candidate Registration Form:\n- Student Surname: AL-FATIH\n- Target IELTS Band: [blank_1]\n- Preferred Module: [blank_2]\n- Accommodation Type: Campus [blank_3]",
        audioUrl: "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "7.5 | Academic | Residence",
        points: 3,
        tags: "IELTS, Listening Section 1, Form Completion"
      },

      // SECTION 2: STRUCTURE & WRITTEN EXPRESSION
      {
        id: "Q-STRUC-01",
        examType: "TOEFL_ITP",
        section: "structure",
        type: "multiple_choice",
        passage: "",
        prompt: "Not only _______ the fundamental laws of optics, but Ibn al-Haytham also established the foundation for the modern scientific method.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "he formulated" },
          { key: "B", text: "did he formulate" },
          { key: "C", text: "he did formulate" },
          { key: "D", text: "was formulating" }
        ],
        correctAnswer: "B",
        points: 1,
        tags: "TOEFL, Structure, Inversion"
      },
      {
        id: "Q-STRUC-02",
        examType: "TOEFL_ITP",
        section: "structure",
        type: "multiple_choice",
        passage: "Written Expression Error Identification (Select the underlined incorrect part):",
        prompt: "The Al-Imam (A)[faculty members] has (B)[unanimously] agreed that every student must (C)[submit their] research proposal (D)[before deadline].",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "faculty members" },
          { key: "B", text: "unanimously" },
          { key: "C", text: "has -> have (Subject-Verb Agreement error)" },
          { key: "D", text: "before deadline" }
        ],
        correctAnswer: "C",
        points: 1,
        tags: "TOEFL, Written Expression, Agreement"
      },
      {
        id: "Q-STRUC-03",
        examType: "EPT",
        section: "structure",
        type: "matching_pairs",
        passage: "Match the grammatical collocations with their appropriate prepositions:",
        prompt: "Grammar & Collocations Matching",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { left: "Comply", right: "with institutional regulations" },
          { left: "Refrain", right: "from unauthorized actions" },
          { left: "Contribute", right: "to global academic excellence" },
          { left: "Capable", right: "of solving complex equations" }
        ],
        correctAnswer: "Comply:with institutional regulations|Refrain:from unauthorized actions|Contribute:to global academic excellence|Capable:of solving complex equations",
        points: 4,
        tags: "EPT, Collocation, Preposition"
      },

      // SECTION 3: READING COMPREHENSION
      {
        id: "Q-READ-01",
        examType: "TOEFL_ITP",
        section: "reading",
        type: "multiple_choice",
        passage: "Passage 1: The House of Wisdom (Bayt al-Hikmah)\n\nEstablished in Baghdad in the early 9th century during the Abbasid Caliphate, the House of Wisdom served as an unrivaled epicenter of intellectual translation, astronomical research, and mathematical discovery. Scholars from diverse backgrounds congregated to translate ancient Hellenistic, Persian, and Indian treatises into Arabic. This monumental scholarly movement not only preserved classical knowledge that might otherwise have vanished, but also catalyzed revolutionary advancements in algebra, medicine, optics, and philosophy that subsequently ignited the European Renaissance.",
        prompt: "The word 'catalyzed' in the passage is closest in meaning to which of the following?",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "Accelerated or triggered" },
          { key: "B", text: "Delayed significantly" },
          { key: "C", text: "Replaced entirely" },
          { key: "D", text: "Contradicted" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "TOEFL, Reading, Vocabulary in Context"
      },
      {
        id: "Q-READ-02",
        examType: "TOEFL_ITP",
        section: "reading",
        type: "multiple_choice",
        passage: "Passage 1: The House of Wisdom (Bayt al-Hikmah)\n\nEstablished in Baghdad in the early 9th century during the Abbasid Caliphate, the House of Wisdom served as an unrivaled epicenter of intellectual translation, astronomical research, and mathematical discovery. Scholars from diverse backgrounds congregated to translate ancient Hellenistic, Persian, and Indian treatises into Arabic. This monumental scholarly movement not only preserved classical knowledge that might otherwise have vanished, but also catalyzed revolutionary advancements in algebra, medicine, optics, and philosophy that subsequently ignited the European Renaissance.",
        prompt: "According to the passage, what was a primary accomplishment of the scholars at the House of Wisdom?",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "They translated and synthesized major works from Hellenistic, Persian, and Indian traditions into Arabic." },
          { key: "B", text: "They restricted philosophical discourse strictly to local dialects." },
          { key: "C", text: "They built maritime navigation fleets for trans-Atlantic expeditions." },
          { key: "D", text: "They replaced mathematical arithmetic with symbolic alchemy." }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "TOEFL, Reading, Detail"
      },

      // SECTION 4: WRITING SECTION (ESSAY)
      {
        id: "Q-WRIT-01",
        examType: "IELTS_ACADEMIC",
        section: "writing",
        type: "essay",
        passage: "IELTS Task 2 Academic Essay Prompt",
        prompt: "Write at least 250 words on the following topic:\n\n'In the era of rapid artificial intelligence adoption, some educators argue that foundational ethics and human empathy must become the core focus of academic institutions rather than pure technical specialization. To what extent do you agree or disagree? Support your position with relevant examples and reasoned arguments.'",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "",
        rubricJson: {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRangeAccuracy: 25,
          minWords: 250
        },
        points: 100,
        tags: "IELTS, Writing Task 2, Rubric Assessment"
      },

      // SECTION 5: SPEAKING SECTION (AUDIO RECORDING)
      {
        id: "Q-SPK-01",
        examType: "IELTS_ACADEMIC",
        section: "speaking",
        type: "speaking_record",
        passage: "IELTS Speaking Part 2: Long Turn Presentation",
        prompt: "You will have 1 minute to prepare your response and up to 2 minutes to record your speech:\n\n'Describe an inspiring leader, teacher, or visionary scholar whose principles have significantly shaped your worldview.'\n\nYou should state:\n- Who this person is\n- What key values or achievements they exemplify\n- How their guidance influenced your personal or academic aspirations\n- And explain why their legacy remains profoundly impactful.",
        audioUrl: "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "",
        rubricJson: {
          fluencyCoherence: 25,
          lexicalResource: 25,
          grammaticalRange: 25,
          pronunciation: 25,
          maxRecordSeconds: 120
        },
        points: 100,
        tags: "IELTS, Speaking Part 2, Audio Recorder"
      }
    ];
  }

  return {
    getAllQuestions: getAllQuestions,
    getQuestionsBySection: getQuestionsBySection,
    addQuestion: addQuestion,
    bulkImportQuestions: bulkImportQuestions,
    getMockQuestions: getMockQuestions
  };
})();
