/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * Code.gs - Google Apps Script Entrypoint, Web App Router & Serverless REST API
 *
 * @author Al-Imam EdTech Architecture Team
 * @version 2.5.0 Enterprise
 */

/**
 * Handle HTTP GET requests (Web App & API)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || "";

  // REST API Endpoints
  if (action === "getSettings") {
    return createJsonResponse(CmsController.getSettings());
  }
  if (action === "getExams") {
    return createJsonResponse({ success: true, exams: ExaminationModel.getAllExams() });
  }
  if (action === "getQuestions") {
    var examType = e.parameter.examType || "";
    var section = e.parameter.section || "";
    return createJsonResponse({ success: true, questions: QuestionModel.getQuestionsBySection(examType, section) });
  }
  if (action === "getAnalytics") {
    return createJsonResponse({ success: true, analytics: ReportController.getExecutiveAnalytics() });
  }
  if (action === "getReport") {
    var subId = e.parameter.submissionId || "";
    return createJsonResponse(ReportController.getStudentReport(subId));
  }

  // HTML Web App Renderer
  var page = (e && e.parameter && e.parameter.page) || "index";
  var template;

  if (page === "exam" || page === "student-exam") {
    template = HtmlService.createTemplateFromFile("views/student-exam");
  } else if (page === "admin" || page === "admin-dashboard") {
    template = HtmlService.createTemplateFromFile("views/admin-dashboard");
  } else if (page === "cms" || page === "cms-appearance") {
    template = HtmlService.createTemplateFromFile("views/cms-appearance");
  } else if (page === "guide" || page === "onboarding-guide") {
    template = HtmlService.createTemplateFromFile("views/onboarding-guide");
  } else {
    template = HtmlService.createTemplateFromFile("views/index");
  }

  template.config = CONFIG;
  template.theme = CmsController.getSettings().theme;

  return template.evaluate()
    .setTitle(CONFIG.APP_NAME + " | " + CONFIG.INSTITUTION_NAME)
    .setFaviconUrl(CONFIG.FAVICON_URL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Handle HTTP POST requests (Authentication, Exam submission, Auto-save, etc.)
 */
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || "{}";
    var payload = JSON.parse(raw);
    var action = payload.action || (e && e.parameter && e.parameter.action) || "";

    var response = { success: false, message: "Unknown action parameter." };

    switch (action) {
      case "login":
        response = AuthController.handleLogin(payload);
        break;

      case "register":
        response = AuthController.handleRegister(payload);
        break;

      case "startExam":
        response = ExamController.handleStartExam(payload);
        break;

      case "logProctoring":
        response = ExamController.handleProctoringLog(payload);
        break;

      case "saveAnswers":
        response = ExamController.handleSaveAnswers(payload);
        break;

      case "submitExam":
        response = ExamController.handleSubmitExam(payload);
        break;

      case "addQuestion":
        response = QuestionModel.addQuestion(payload.question);
        break;

      case "bulkImportQuestions":
        response = QuestionModel.bulkImportQuestions(payload.questions || []);
        break;

      case "saveAppearance":
        response = CmsController.saveAppearanceSettings(payload);
        break;

      case "saveSubmission":
      case "recordSubmission":
        response = ExaminationModel.recordSubmission(
          payload.submission || payload,
          payload.answers || {},
          payload.scoreResult || {},
          payload.proctoringLogs || []
        );
        break;

      case "syncQuestions":
        response = QuestionModel.bulkImportQuestions(payload.questions || []);
        break;

      case "syncStudents":
        var students = payload.students || [];
        var createdCount = 0;
        students.forEach(function (st) {
          try {
            UserModel.createUser({
              username: st.username || st.email,
              email: st.email || "",
              fullName: st.name || st.fullName || st.username,
              role: st.role || "student",
              classGroup: st.classGroup || st.grade || "7 Ustman",
              password: st.password || "student123"
            });
            createdCount++;
          } catch (e) {}
        });
        response = { success: true, count: createdCount, message: "Synchronized " + createdCount + " students." };
        break;

      case "syncAll":
        var qCount = (payload.questions && payload.questions.length) ? QuestionModel.bulkImportQuestions(payload.questions).importedCount : 0;
        var sCount = 0;
        if (payload.students && Array.isArray(payload.students)) {
          payload.students.forEach(function (st) {
            try {
              UserModel.createUser({
                username: st.username || st.email,
                email: st.email || "",
                fullName: st.name || st.fullName || st.username,
                role: st.role || "student",
                classGroup: st.classGroup || st.grade || "7 Ustman",
                password: st.password || "student123"
              });
              sCount++;
            } catch (e) {}
          });
        }
        if (payload.submission) {
          ExaminationModel.recordSubmission(payload.submission, payload.answers || {}, payload.scoreResult || {}, []);
        }
        response = { success: true, questionsSynced: qCount, studentsSynced: sCount, message: "Full database synchronization completed." };
        break;

      case "validateLicense":
        response = CmsController.validateLicense(payload.licenseKey);
        break;

      case "exportBackup":
        response = CmsController.exportDatabaseBackup();
        break;

      default:
        response = { success: false, message: "Action '" + action + "' is not supported." };
    }

    return createJsonResponse(response);
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.message,
      stack: err.stack
    });
  }
}

/**
 * Helper to include partial HTML files in GAS templates
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Standard JSON Response builder with CORS headers
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Full Sync & Setup Function:
 * Run this function from the GAS Script Editor to guarantee that:
 * 1. DB_Users is seeded with Tri Nuryani, S.S, admin accounts, and all 7 students.
 * 2. DB_Questions is seeded with all 43 questions (TOEFL, Grade 7, Grade 8, Grade 9).
 * 3. DB_Exams is seeded with standard examination packages.
 */
function syncAllMockDataToDatabase() {
  var ss = getDatabaseSpreadsheet();
  if (!ss) {
    console.error("Spreadsheet initialization failed: No active spreadsheet linked.");
    return { success: false, message: "No active spreadsheet linked." };
  }

  // 1. Sync Users into DB_Users
  var userSheet = UserModel.getUserSheet();
  if (userSheet) {
    var existingUsers = UserModel.getAllUsers(true);
    var existingUsernames = existingUsers.map(function(u) { return String(u.username).toLowerCase(); });
    var mockUsers = UserModel.getMockUsers();
    var addedUsers = 0;
    mockUsers.forEach(function (u) {
      if (existingUsernames.indexOf(String(u.username).toLowerCase()) === -1) {
        UserModel.createUser(u);
        addedUsers++;
      }
    });
    console.log("Users synced: " + addedUsers + " new users added to DB_Users.");
  }

  // 2. Sync Questions into DB_Questions (All 43 Questions)
  var qSheet = QuestionModel.getQuestionSheet();
  if (qSheet) {
    var existingQs = QuestionModel.getAllQuestions(true);
    var existingIds = existingQs.map(function(q) { return String(q.id).trim().toUpperCase(); });
    var existingPrompts = existingQs.map(function(q) { return String(q.prompt).trim().toLowerCase(); });
    var mockQs = QuestionModel.getMockQuestions();
    var addedQs = 0;
    mockQs.forEach(function (q) {
      var isDuplicate = existingIds.indexOf(String(q.id).trim().toUpperCase()) !== -1 ||
                        existingPrompts.indexOf(String(q.prompt).trim().toLowerCase()) !== -1;
      if (!isDuplicate) {
        QuestionModel.addQuestion(q);
        addedQs++;
      }
    });
    console.log("Questions synced: " + addedQs + " new questions added to DB_Questions.");
  }

  // 3. Sync Exams into DB_Exams
  var examSheet = ss.getSheetByName(CONFIG.SHEETS.EXAMS);
  if (!examSheet) {
    examSheet = ss.insertSheet(CONFIG.SHEETS.EXAMS);
    var h = ["id", "title", "code", "type", "description", "durationMinutes", "sectionsJson", "totalQuestions", "passScore", "status", "scheduledStart", "scheduledEnd", "weightsJson", "createdAt"];
    examSheet.appendRow(h);
    examSheet.getRange(1, 1, 1, h.length).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
    examSheet.setFrozenRows(1);
  }
  if (examSheet.getLastRow() <= 1) {
    var exams = ExaminationModel.getMockExams();
    exams.forEach(function (ex) {
      examSheet.appendRow([
        ex.id, ex.title, ex.code, ex.type, ex.description, ex.durationMinutes,
        JSON.stringify(ex.sectionsJson), ex.totalQuestions, ex.passScore, ex.status,
        ex.scheduledStart, ex.scheduledEnd, JSON.stringify(ex.weightsJson), ex.createdAt
      ]);
    });
  }

  console.log("Al-Imam Assessment Database Successfully Initialized & Seeded with All Users and 43 Questions!");
  return { success: true, message: "Database synced successfully." };
}

/**
 * Standard Initial Setup Function (alias to syncAllMockDataToDatabase)
 */
function initialSetupDatabase() {
  return syncAllMockDataToDatabase();
}
