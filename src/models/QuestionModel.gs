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
      },

      // ================= GRADE 7 (SMP CLASS 7) QUESTIONS =================
      {
        id: "Q-G7-LIST-01",
        examType: "Grade 7",
        section: "listening",
        type: "multiple_choice",
        passage: "Classroom Dialogue: First Day at SMP Al-Imam",
        prompt: "Ahmad: 'Excuse me, is this the English classroom for Grade 7?'\nTeacher: 'Yes, Ahmad! Welcome to our class. Please take a seat next to Bilal.'\nNarrator: 'Where does Ahmad sit?'",
        audioUrl: "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "Next to Bilal in the Grade 7 classroom" },
          { key: "B", text: "Near the teacher's office" },
          { key: "C", text: "Outside the school gate" },
          { key: "D", text: "In the Grade 8 laboratory" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "Grade 7, Listening, Daily Conversation"
      },
      {
        id: "Q-G7-STRUC-01",
        examType: "Grade 7",
        section: "structure",
        type: "multiple_choice",
        passage: "",
        prompt: "Bilal and his classmates _______ English together in the school library every Tuesday afternoon.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "studies" },
          { key: "B", text: "study" },
          { key: "C", text: "studying" },
          { key: "D", text: "studied" }
        ],
        correctAnswer: "B",
        points: 1,
        tags: "Grade 7, Simple Present Tense, Subject-Verb Agreement"
      },
      {
        id: "Q-G7-READ-01",
        examType: "Grade 7",
        section: "reading",
        type: "multiple_choice",
        passage: "Daily Routine at SMP Al-Imam Islamic School:\n\nSMP Al-Imam Islamic School provides a balanced curriculum blending modern academic sciences with Islamic character building. Grade 7 students begin their day at 07:00 AM with morning Dhuha prayer and Al-Quran tahfidz session. Afterward, they attend general subjects including English, Mathematics, and Natural Sciences in state-of-the-art classrooms. During lunchtime, students practice Islamic table manners (adab) and perform congregational Dhuhr prayer together.",
        prompt: "What is the first activity Grade 7 students perform when they arrive at school in the morning?",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "Morning Dhuha prayer and Al-Quran tahfidz session" },
          { key: "B", text: "English mid-term examination" },
          { key: "C", text: "Science laboratory experiments" },
          { key: "D", text: "Playing football in the school yard" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "Grade 7, Reading Comprehension, Factual Information"
      },
      {
        id: "Q-G7-WRIT-01",
        examType: "Grade 7",
        section: "writing",
        type: "essay",
        passage: "Descriptive Text Writing Task",
        prompt: "Write a short descriptive paragraph (60-80 words) introducing yourself, your favorite subject at SMP Al-Imam, and your daily hobby.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "",
        rubricJson: { content: 30, grammar: 35, vocabulary: 35, minWords: 60 },
        points: 100,
        tags: "Grade 7, Writing, Descriptive Text"
      },
      {
        id: "Q-G7-SPK-01",
        examType: "Grade 7",
        section: "speaking",
        type: "speaking_record",
        passage: "Speaking Part 1: Self-Introduction & Aspirations",
        prompt: "Record your voice (1 minute) answering these 3 prompts:\n1. Introduce your full name and your Grade 7 class.\n2. What is your favorite subject and why do you like it?\n3. What is your future goal or dream?",
        audioUrl: "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "",
        rubricJson: { fluency: 30, pronunciation: 35, grammar: 35, maxRecordSeconds: 60 },
        points: 100,
        tags: "Grade 7, Speaking, Self-Introduction"
      },

      // ================= GRADE 8 (SMP CLASS 8) QUESTIONS =================
      {
        id: "Q-G8-LIST-01",
        examType: "Grade 8",
        section: "listening",
        type: "multiple_choice",
        passage: "Dialogue: School Science Fair Preparation",
        prompt: "Fatimah: 'Have you finished building the water filtration model for the science exhibition?'\nAisyah: 'Not yet, I still need to add the activated charcoal layer this afternoon.'\nNarrator: 'What is Aisyah going to do this afternoon?'",
        audioUrl: "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "Add the activated charcoal layer to the water filtration model" },
          { key: "B", text: "Buy a new aquarium for the classroom" },
          { key: "C", text: "Cancel the science project presentation" },
          { key: "D", text: "Visit the principal's office" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "Grade 8, Listening, Dialogue Detail"
      },
      {
        id: "Q-G8-STRUC-01",
        examType: "Grade 8",
        section: "structure",
        type: "multiple_choice",
        passage: "",
        prompt: "While the students _______ an experiment in the chemistry lab yesterday, the school bell rang.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "are conducting" },
          { key: "B", text: "were conducting" },
          { key: "C", text: "conduct" },
          { key: "D", text: "have conducted" }
        ],
        correctAnswer: "B",
        points: 1,
        tags: "Grade 8, Past Continuous Tense, Time Clauses"
      },
      {
        id: "Q-G8-STRUC-02",
        examType: "Grade 8",
        section: "structure",
        type: "multiple_choice",
        passage: "",
        prompt: "Mount Everest is __________________ mountain in the world, attracting climbers from every continent.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "highest" },
          { key: "B", text: "higher than" },
          { key: "C", text: "the highest" },
          { key: "D", text: "as high as" }
        ],
        correctAnswer: "C",
        points: 1,
        tags: "Grade 8, Degree of Comparison, Superlative"
      },
      {
        id: "Q-G8-READ-01",
        examType: "Grade 8",
        section: "reading",
        type: "multiple_choice",
        passage: "Passage: The Legacy of Abbas Ibn Firnas\n\nIn the 9th century in Cordoba, Andalusia, the polymath Abbas Ibn Firnas designed a winged glider apparatus and attempted one of the earliest recorded human flights in history. Beyond aviation, Ibn Firnas also invented a water clock, devised colorless glass manufacturing techniques, and created a mechanized planetarium simulating planetary movements. His courageous spirit and scientific curiosity inspire modern youth to pursue aerospace and technological frontiers.",
        prompt: "According to the passage, which invention was created by Abbas Ibn Firnas besides his aviation glider?",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "A water clock and a mechanized planetarium" },
          { key: "B", text: "A digital electronic smartwatch" },
          { key: "C", text: "A solar-powered automobile engine" },
          { key: "D", text: "A mechanical movable printing press" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "Grade 8, Reading Comprehension, Historical Recount"
      },
      {
        id: "Q-G8-WRIT-01",
        examType: "Grade 8",
        section: "writing",
        type: "essay",
        passage: "Recount Text Writing Task",
        prompt: "Write a recount text (100-150 words) about a memorable school trip, science competition, or outdoor activity you participated in. Describe the orientation, sequence of events, and personal reflection.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "",
        rubricJson: { orientation: 25, events: 35, grammar: 25, vocabulary: 15, minWords: 100 },
        points: 100,
        tags: "Grade 8, Writing, Recount Text"
      },
      {
        id: "Q-G8-SPK-01",
        examType: "Grade 8",
        section: "speaking",
        type: "speaking_record",
        passage: "Speaking Part 2: Recount a Past Experience",
        prompt: "Record your voice (1.5 minutes) describing a memorable experience in your life:\n- What happened and when did it take place?\n- Who was with you during the event?\n- What did you learn from this experience?",
        audioUrl: "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "",
        rubricJson: { fluency: 30, coherence: 25, grammar: 25, vocabulary: 20, maxRecordSeconds: 90 },
        points: 100,
        tags: "Grade 8, Speaking, Past Experience"
      },

      // ================= GRADE 9 (SMP CLASS 9) QUESTIONS =================
      {
        id: "Q-G9-LIST-01",
        examType: "Grade 9",
        section: "listening",
        type: "multiple_choice",
        passage: "Academic Announcement: International STEM & English Olympiad",
        prompt: "Principal: 'Attention to all Grade 9 candidates. Registration for the International STEM Olympiad closes this Friday at 3:00 PM. Make sure your research abstracts are endorsed by your academic advisor.'\nNarrator: 'What is required before Grade 9 candidates can submit their Olympiad registration?'",
        audioUrl: "https://actions.google.com/sounds/v1/speech/announcement_chime.ogg",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "Obtain academic advisor endorsement for their abstracts" },
          { key: "B", text: "Pay a late submission penalty fee" },
          { key: "C", text: "Cancel all scheduled afternoon classes" },
          { key: "D", text: "Travel to an overseas university campus" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "Grade 9, Listening, Formal Announcement"
      },
      {
        id: "Q-G9-STRUC-01",
        examType: "Grade 9",
        section: "structure",
        type: "multiple_choice",
        passage: "",
        prompt: "The new renewable energy guideline __________________ by the academic committee before the next school term begins.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "will be implemented" },
          { key: "B", text: "will implement" },
          { key: "C", text: "is implementing" },
          { key: "D", text: "was implement" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "Grade 9, Passive Voice, Future Tense"
      },
      {
        id: "Q-G9-STRUC-02",
        examType: "Grade 9",
        section: "structure",
        type: "multiple_choice",
        passage: "",
        prompt: "If students __________________ consistent reading habits today, they will achieve outstanding academic results in high school.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "prioritize" },
          { key: "B", text: "prioritized" },
          { key: "C", text: "had prioritized" },
          { key: "D", text: "will prioritize" }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "Grade 9, Conditional Sentence Type 1"
      },
      {
        id: "Q-G9-READ-01",
        examType: "Grade 9",
        section: "reading",
        type: "multiple_choice",
        passage: "Report Text: Artificial Intelligence in Modern Education\n\nArtificial Intelligence (AI) is transforming academic environments by enabling adaptive learning pathways tailored to individual student needs. Intelligent tutoring systems analyze performance metrics in real time, identifying knowledge gaps and generating customized practice modules. However, leading education experts emphasize that AI should augment rather than replace human educators, as ethical guidance, empathy, and moral leadership remain fundamentally human virtues.",
        prompt: "According to the report, what is the primary conclusion regarding the relationship between AI and human educators?",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [
          { key: "A", text: "AI should assist educators while human teachers provide essential moral and empathetic guidance." },
          { key: "B", text: "AI systems should completely replace human teachers in secondary schools." },
          { key: "C", text: "AI technologies have no practical benefits in educational environments." },
          { key: "D", text: "Adaptive learning systems must be restricted to university postgraduate levels." }
        ],
        correctAnswer: "A",
        points: 1,
        tags: "Grade 9, Reading Comprehension, Report Text"
      },
      {
        id: "Q-G9-WRIT-01",
        examType: "Grade 9",
        section: "writing",
        type: "essay",
        passage: "Analytical Exposition Essay Task",
        prompt: "Write an analytical exposition essay (150-200 words) on the topic:\n'Why Mastery of the English Language is Essential for Junior High Students in the Global Digital Era.'\nInclude a clear thesis statement, two supporting arguments with evidence, and a reiteration conclusion.",
        audioUrl: "",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "",
        rubricJson: { thesis: 25, arguments: 35, cohesion: 20, languageAccuracy: 20, minWords: 150 },
        points: 100,
        tags: "Grade 9, Writing, Analytical Exposition"
      },
      {
        id: "Q-G9-SPK-01",
        examType: "Grade 9",
        section: "speaking",
        type: "speaking_record",
        passage: "Speaking Part 2: Persuasive Speech on Environmental Action",
        prompt: "Record your voice (2 minutes) presenting your viewpoint:\n'How can junior high students contribute to environmental preservation and renewable energy in their school community?'\nProvide at least two practical action steps with reasoned justification.",
        audioUrl: "https://actions.google.com/sounds/v1/speech/bell_ring.ogg",
        imageUrl: "",
        optionsJson: [],
        correctAnswer: "",
        rubricJson: { fluency: 25, coherence: 25, lexicalResource: 25, grammaticalRange: 25, maxRecordSeconds: 120 },
        points: 100,
        tags: "Grade 9, Speaking, Persuasive Speech"
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
