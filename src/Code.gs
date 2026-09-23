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
 * Initial Setup Function: Run this once from GAS Script Editor to initialize sheets & seed data
 */
function initialSetupDatabase() {
  var ss = getDatabaseSpreadsheet();
  if (!ss) {
    console.error("Spreadsheet initialization failed: No active spreadsheet linked.");
    return;
  }

  // 1. Initialize Users Sheet
  var userSheet = ss.getSheetByName(CONFIG.SHEETS.USERS);
  if (!userSheet) {
    UserModel.getMockUsers().forEach(function (u) {
      UserModel.createUser(u);
    });
  }

  // 2. Initialize Questions Sheet
  var qSheet = ss.getSheetByName(CONFIG.SHEETS.QUESTIONS);
  if (!qSheet) {
    QuestionModel.bulkImportQuestions(QuestionModel.getMockQuestions());
  }

  // 3. Initialize Exams Sheet
  var examSheet = ss.getSheetByName(CONFIG.SHEETS.EXAMS);
  if (!examSheet) {
    var exams = ExaminationModel.getMockExams();
    examSheet = ss.insertSheet(CONFIG.SHEETS.EXAMS);
    var h = ["id", "title", "code", "type", "description", "durationMinutes", "sectionsJson", "totalQuestions", "passScore", "status", "scheduledStart", "scheduledEnd", "weightsJson", "createdAt"];
    examSheet.appendRow(h);
    exams.forEach(function (ex) {
      examSheet.appendRow([
        ex.id, ex.title, ex.code, ex.type, ex.description, ex.durationMinutes,
        JSON.stringify(ex.sectionsJson), ex.totalQuestions, ex.passScore, ex.status,
        ex.scheduledStart, ex.scheduledEnd, JSON.stringify(ex.weightsJson), ex.createdAt
      ]);
    });
  }

  console.log("Al-Imam Assessment Database Successfully Initialized & Seeded!");
}
