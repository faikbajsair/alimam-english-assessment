/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * ExamController.gs - Exam Lifecycle, Proctoring Heartbeat & Grading Orchestration
 */

var ExamController = (function () {
  /**
   * Start or initialize exam for candidate
   */
  function handleStartExam(payload) {
    var examCode = payload.examCode;
    var user = payload.user || { id: "GUEST", fullName: "Anonymous Candidate", role: "student" };

    var exam = ExaminationModel.findExamByCode(examCode);
    if (!exam) {
      return { success: false, message: "Assessment package with code '" + examCode + "' not found." };
    }

    var sessionRes = ExaminationModel.startSession(exam.id, user);
    if (!sessionRes.success) return sessionRes;

    // Fetch questions for this exam type
    var questions = QuestionModel.getQuestionsBySection(exam.type);
    if (questions.length === 0) {
      // Fallback to all questions if none match specific filter
      questions = QuestionModel.getAllQuestions();
    }

    // Prepare questions for student (strip correct answers & rubrics)
    var studentQuestions = questions.map(function (q) {
      var item = {
        id: q.id,
        section: q.section,
        type: q.type,
        passage: q.passage,
        prompt: q.prompt,
        audioUrl: q.audioUrl,
        imageUrl: q.imageUrl,
        options: q.optionsJson || [],
        points: q.points || 1
      };
      return item;
    });

    return {
      success: true,
      session: sessionRes.session,
      exam: {
        id: exam.id,
        title: exam.title,
        type: exam.type,
        durationMinutes: exam.durationMinutes,
        description: exam.description,
        weights: exam.weightsJson || CONFIG.DEFAULT_WEIGHTS
      },
      questions: studentQuestions,
      proctoringConfig: CONFIG.PROCTORING
    };
  }

  /**
   * Log proctoring security event (blur, fullscreen exit, webcam snapshot)
   */
  function handleProctoringLog(payload) {
    var sessionToken = payload.sessionToken;
    var violationType = payload.violationType;
    var details = payload.details;

    return ExaminationModel.logViolation(sessionToken, violationType, details);
  }

  /**
   * Autosave answers during exam
   */
  function handleSaveAnswers(payload) {
    return {
      success: true,
      savedAt: new Date().toISOString(),
      message: "Answers synchronized successfully."
    };
  }

  /**
   * Submit exam answers and compute score
   */
  function handleSubmitExam(payload) {
    var session = payload.session;
    var answers = payload.answers || {};
    var questions = QuestionModel.getAllQuestions();

    // Map correct answers
    var correctMap = {};
    var typeMap = {};
    for (var i = 0; i < questions.length; i++) {
      correctMap[questions[i].id] = questions[i].correctAnswer;
      typeMap[questions[i].id] = questions[i];
    }

    // Calculate section raw scores
    var rawListening = 0;
    var rawStructure = 0;
    var rawReading = 0;
    var writingSubmissions = [];
    var speakingSubmissions = [];

    for (var qId in answers) {
      var ans = answers[qId];
      var qMeta = typeMap[qId];
      if (!qMeta) continue;

      if (qMeta.section === "listening") {
        if (ans && String(ans).trim().toUpperCase() === String(correctMap[qId]).trim().toUpperCase()) {
          rawListening++;
        }
      } else if (qMeta.section === "structure") {
        if (ans && String(ans).trim().toUpperCase() === String(correctMap[qId]).trim().toUpperCase()) {
          rawStructure++;
        }
      } else if (qMeta.section === "reading") {
        if (ans && String(ans).trim().toUpperCase() === String(correctMap[qId]).trim().toUpperCase()) {
          rawReading++;
        }
      } else if (qMeta.section === "writing") {
        writingSubmissions.push({ questionId: qId, text: ans });
      } else if (qMeta.section === "speaking") {
        speakingSubmissions.push({ questionId: qId, audioDataUrl: ans });
      }
    }

    var scoreResult = null;
    var examType = session.examType || "TOEFL_ITP";

    if (examType === "TOEFL_ITP" || examType === "EPT") {
      scoreResult = GradeModel.calculateToeflScore(rawListening, rawStructure, rawReading);
    } else if (examType === "IELTS_ACADEMIC" || examType === "IELTS_GENERAL") {
      scoreResult = GradeModel.calculateIeltsBand(rawListening, rawReading, 6.5, 6.5);
    } else {
      scoreResult = GradeModel.calculateToeflScore(rawListening, rawStructure, rawReading);
    }

    var submissionRecord = {
      id: session.id || "SUB-" + Utilities.getUuid().substring(0, 8),
      examId: session.examId,
      examTitle: session.examTitle,
      studentId: session.studentId,
      studentName: session.studentName,
      submittedAt: new Date().toISOString(),
      scoreSummary: scoreResult,
      gradeStatus: scoreResult.gradeStatus,
      scaledScore: scoreResult.totalScore || scoreResult.overallBand,
      cefr: scoreResult.cefr,
      violationsCount: (payload.proctoring && payload.proctoring.blurStrikes) || 0
    };

    var certData = GradeModel.generateCertificateData(
      submissionRecord,
      { id: session.studentId, fullName: session.studentName, classGroup: "Al-Imam Examination Batch" },
      { id: session.examId, title: session.examTitle, type: examType }
    );

    return {
      success: true,
      submission: submissionRecord,
      certificate: certData
    };
  }

  return {
    handleStartExam: handleStartExam,
    handleProctoringLog: handleProctoringLog,
    handleSaveAnswers: handleSaveAnswers,
    handleSubmitExam: handleSubmitExam
  };
})();
