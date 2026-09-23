/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * ExaminationModel.gs - Exam Scheduling, Sessions, and Anti-Cheating Tracking
 */

var ExaminationModel = (function () {
  function getExamSheet() {
    var ss = getDatabaseSpreadsheet();
    if (!ss) return null;
    var sheet = ss.getSheetByName(CONFIG.SHEETS.EXAMS);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.EXAMS);
      var headers = [
        "id", "title", "code", "type", "description", "durationMinutes",
        "sectionsJson", "totalQuestions", "passScore", "status",
        "scheduledStart", "scheduledEnd", "weightsJson", "createdAt"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    return sheet;
  }

  function getSubmissionSheet() {
    var ss = getDatabaseSpreadsheet();
    if (!ss) return null;
    var sheet = ss.getSheetByName(CONFIG.SHEETS.SUBMISSIONS);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.SUBMISSIONS);
      var headers = [
        "id", "examId", "studentId", "studentName", "sessionToken",
        "startedAt", "submittedAt", "status", "answersJson",
        "rawScoresJson", "proctoringLogsJson", "blurStrikes",
        "calculatedScore", "scaledScore", "gradeStatus"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    return sheet;
  }

  /**
   * Get all active and scheduled exams
   */
  function getAllExams() {
    var sheet = getExamSheet();
    if (!sheet) return getMockExams();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return getMockExams();

    var headers = data[0];
    var exams = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var exam = {};
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        var val = row[j];
        if (key === "sectionsJson" || key === "weightsJson") {
          try {
            val = JSON.parse(val || "{}");
          } catch (e) {
            val = {};
          }
        }
        exam[key] = val;
      }
      exams.push(exam);
    }
    return exams;
  }

  /**
   * Find exam by access code or ID
   */
  function findExamByCode(code) {
    var exams = getAllExams();
    var target = String(code).trim().toUpperCase();
    for (var i = 0; i < exams.length; i++) {
      if (String(exams[i].code).toUpperCase() === target || String(exams[i].id).toUpperCase() === target) {
        return exams[i];
      }
    }
    return null;
  }

  /**
   * Start or retrieve an active exam session for a student
   */
  function startSession(examId, student) {
    var exam = null;
    var allExams = getAllExams();
    for (var i = 0; i < allExams.length; i++) {
      if (allExams[i].id === examId || allExams[i].code === examId) {
        exam = allExams[i];
        break;
      }
    }
    if (!exam) {
      return { success: false, message: "Assessment package not found." };
    }

    var sessionToken = "SES-" + Utilities.getUuid().substring(0, 12).toUpperCase();
    var session = {
      id: "SUB-" + Utilities.getUuid().substring(0, 8).toUpperCase(),
      examId: exam.id,
      examTitle: exam.title,
      examType: exam.type,
      studentId: student.id || "GUEST",
      studentName: student.fullName || student.username || "Candidate",
      sessionToken: sessionToken,
      startedAt: new Date().toISOString(),
      durationMinutes: exam.durationMinutes || 120,
      status: "in_progress",
      answers: {},
      proctoring: {
        blurStrikes: 0,
        maxStrikes: CONFIG.PROCTORING.MAX_BLUR_WARNINGS,
        fullscreenExits: 0,
        violations: [],
        snapshots: []
      }
    };

    return {
      success: true,
      session: session,
      exam: exam
    };
  }

  /**
   * Record anti-cheat violation event
   */
  function logViolation(sessionToken, violationType, details) {
    var violation = {
      type: violationType, // 'tab_blur', 'fullscreen_exit', 'shortcut_attempt', 'camera_blocked'
      details: details || "Security violation detected by proctoring engine.",
      timestamp: new Date().toISOString()
    };
    return {
      success: true,
      violation: violation
    };
  }

  /**
   * Mock exams list for initial state
   */
  function getMockExams() {
    return [
      {
        id: "EXAM-TOEFL-01",
        title: "Al-Imam Standardized TOEFL ITP Full Diagnostic",
        code: "TOEFL2026",
        type: "TOEFL_ITP",
        description: "Official diagnostic test covering Section 1 (Listening), Section 2 (Structure & Written Expression), and Section 3 (Reading Comprehension).",
        durationMinutes: 115,
        sectionsJson: ["listening", "structure", "reading"],
        totalQuestions: 140,
        passScore: 500,
        status: "published",
        scheduledStart: "2026-09-01T08:00:00Z",
        scheduledEnd: "2026-12-31T23:59:59Z",
        weightsJson: { listening: 35, structure: 30, reading: 35 },
        createdAt: new Date().toISOString()
      },
      {
        id: "EXAM-IELTS-01",
        title: "Al-Imam Comprehensive IELTS Academic Simulation",
        code: "IELTS2026",
        type: "IELTS_ACADEMIC",
        description: "Complete 4-Skill assessment: Listening, Reading, Task 2 Essay Writing, and Live Microphone Speaking Part 2.",
        durationMinutes: 160,
        sectionsJson: ["listening", "reading", "writing", "speaking"],
        totalQuestions: 82,
        passScore: 6.5,
        status: "published",
        scheduledStart: "2026-09-01T08:00:00Z",
        scheduledEnd: "2026-12-31T23:59:59Z",
        weightsJson: { listening: 25, reading: 25, writing: 25, speaking: 25 },
        createdAt: new Date().toISOString()
      },
      {
        id: "EXAM-EPT-01",
        title: "Al-Imam Institutional EPT (English Proficiency Test)",
        code: "EPT2026",
        type: "EPT",
        description: "Institutional Placement and Graduation English Assessment for Al-Imam Senior Academic candidates.",
        durationMinutes: 90,
        sectionsJson: ["listening", "structure", "reading"],
        totalQuestions: 100,
        passScore: 475,
        status: "published",
        scheduledStart: "2026-09-01T08:00:00Z",
        scheduledEnd: "2026-12-31T23:59:59Z",
        weightsJson: { listening: 33, structure: 33, reading: 34 },
        createdAt: new Date().toISOString()
      }
    ];
  }

  return {
    getAllExams: getAllExams,
    findExamByCode: findExamByCode,
    startSession: startSession,
    logViolation: logViolation,
    getMockExams: getMockExams
  };
})();
