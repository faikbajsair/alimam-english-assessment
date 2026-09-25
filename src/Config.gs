/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * Config.gs - Core Configuration, Schema Definitions, and Scoring Conversion Matrices
 *
 * @author Al-Imam EdTech Architecture Team
 * @version 2.5.0 Enterprise
 */

var CONFIG = {
  // Institutional Branding
  APP_NAME: "Al-Imam English Assessment System",
  APP_VERSION: "2.5.0 Enterprise",
  FOUNDATION_NAME: "Yayasan SAPIN Darussalam",
  INSTITUTION_NAME: "SMP Al-Imam Islamic School (AI IS)",
  INSTITUTION_ADDRESS: "Limus Pratama Regency Jl. Blitar Blok E.12/7B RT 004/ RW 011, Ds./ Kel Limus Nunggal, Kec. Cileungsi, Kab. Bogor, Prop. Jawa Barat. 16820",
  INSTITUTION_MOTTO: "Berakidah, Berakhlak dan Berprestasi",
  DEVELOPER_CREDIT: "Development by Al-Imam EduTech",
  INSTITUTION_WEBSITE: "https://alimamischool.com",
  LOGO_URL: "https://alimamischool.com/wp-content/uploads/2020/08/Al-Imam-Islamic-School-alimamischool.com-sekolah-sunnah-logo.png",
  FAVICON_URL: "https://alimamischool.com/wp-content/uploads/2020/08/Al-Imam-Islamic-School-alimamischool.com-sekolah-sunnah-logo.png",
  SIGNATURE_1_TITLE: "Principal",
  SIGNATURE_1_ORG: "SMP Al-Imam Islamic School (AI IS)",
  SIGNATURE_2_TITLE: "Chairman of Foundation",
  SIGNATURE_2_ORG: "Yayasan SAPIN Darussalam",

  // Theme & Appearance Defaults
  DEFAULT_THEME: {
    primaryColor: "#059669",      // Emerald 600
    primaryLight: "#10b981",      // Emerald 500
    primaryDark: "#047857",       // Emerald 700
    secondaryColor: "#d97706",    // Amber 600
    accentColor: "#4f46e5",       // Indigo 600
    fontFamily: "Plus Jakarta Sans, sans-serif",
    darkMode: false,
    headerTitle: "SMP Al-Imam Assessment Center",
    headerSubtitle: "Standardized Testing for Academic & Islamic Character Excellence",
    footerText: "© " + new Date().getFullYear() + " SMP Al-Imam Islamic School (AI IS). Development by Al-Imam EduTech."
  },

  // Security & Anti-Cheating Settings
  PROCTORING: {
    FULLSCREEN_REQUIRED: true,
    MAX_BLUR_WARNINGS: 3,         // Max tab switch / blur strikes before auto-submit
    AUTO_SUBMIT_ON_STRIKE: true,
    ENABLE_WEBCAM_SNAPSHOT: true,
    SNAPSHOT_INTERVAL_SEC: 120,    // Snapshot every 2 minutes
    DISABLE_RIGHT_CLICK: true,
    DISABLE_COPY_PASTE: true,
    DISABLE_DEV_TOOLS: true,
    RANDOMIZE_QUESTIONS: true,
    RANDOMIZE_OPTIONS: true
  },

  // Commercial Licensing & Quota Tiers
  LICENSE_TIERS: {
    STARTER: { name: "Starter", maxStudents: 100, maxExams: 10, price: "$99 / month" },
    PRO: { name: "Professional", maxStudents: 500, maxExams: 50, price: "$199 / month" },
    ENTERPRISE: { name: "Enterprise SaaS", maxStudents: 5000, maxExams: 999, price: "Custom / On-Premise" }
  },

  // Google Sheets DB Sheet Names
  SHEETS: {
    USERS: "DB_Users",
    EXAMS: "DB_Exams",
    QUESTIONS: "DB_Questions",
    SUBMISSIONS: "DB_Submissions",
    GRADES: "DB_Grades",
    SETTINGS: "DB_Settings",
    AUDIT_LOGS: "DB_AuditLogs"
  },

  // Supported Assessment Standards
  EXAM_TYPES: {
    TOEFL_ITP: "TOEFL ITP / PBT",
    IELTS_ACADEMIC: "IELTS Academic",
    IELTS_GENERAL: "IELTS General Training",
    TOEIC: "TOEIC Standard",
    EPT: "Al-Imam EPT (English Proficiency Test)",
    CUSTOM: "Custom Institutional Exam"
  },

  // Dynamic Assessment Section Weights (Standard English Rubric)
  DEFAULT_WEIGHTS: {
    listening: 30,
    structure: 25,
    reading: 30,
    writing: 10,
    speaking: 5
  },

  // TOEFL PBT/ITP Raw Score to Converted Score Lookup Table (Section 1: Listening, Section 2: Structure, Section 3: Reading)
  // Maps raw score (0-50) to scaled score (approx 20-68)
  TOEFL_CONVERSION_TABLE: {
    listening: [
      24, 25, 26, 27, 28, 29, 30, 31, 32, 32,
      33, 35, 37, 37, 38, 41, 41, 42, 43, 44,
      45, 45, 46, 47, 48, 48, 49, 50, 51, 51,
      52, 52, 53, 54, 54, 55, 56, 57, 57, 58,
      59, 60, 61, 62, 63, 65, 66, 67, 68, 68, 68
    ],
    structure: [
      20, 20, 21, 22, 23, 25, 26, 27, 29, 31,
      33, 35, 36, 37, 38, 40, 40, 41, 42, 43,
      44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
      54, 55, 56, 57, 58, 60, 61, 63, 65, 67, 68
    ],
    reading: [
      21, 22, 23, 23, 24, 25, 26, 27, 28, 28,
      29, 30, 31, 32, 34, 35, 36, 37, 38, 39,
      40, 41, 42, 43, 43, 44, 45, 46, 46, 47,
      48, 48, 49, 50, 51, 52, 52, 53, 54, 54,
      55, 56, 57, 58, 59, 60, 61, 63, 65, 66, 67
    ]
  },

  // IELTS Raw to Band Conversion Table (Academic & General)
  IELTS_CONVERSION_TABLE: {
    listening: [
      { min: 39, max: 40, band: 9.0 },
      { min: 37, max: 38, band: 8.5 },
      { min: 35, max: 36, band: 8.0 },
      { min: 32, max: 34, band: 7.5 },
      { min: 30, max: 31, band: 7.0 },
      { min: 26, max: 29, band: 6.5 },
      { min: 23, max: 25, band: 6.0 },
      { min: 18, max: 22, band: 5.5 },
      { min: 16, max: 17, band: 5.0 },
      { min: 13, max: 15, band: 4.5 },
      { min: 10, max: 12, band: 4.0 },
      { min: 8,  max: 9,  band: 3.5 },
      { min: 6,  max: 7,  band: 3.0 },
      { min: 4,  max: 5,  band: 2.5 },
      { min: 2,  max: 3,  band: 2.0 },
      { min: 0,  max: 1,  band: 1.0 }
    ],
    reading_academic: [
      { min: 39, max: 40, band: 9.0 },
      { min: 37, max: 38, band: 8.5 },
      { min: 35, max: 36, band: 8.0 },
      { min: 33, max: 34, band: 7.5 },
      { min: 30, max: 32, band: 7.0 },
      { min: 27, max: 29, band: 6.5 },
      { min: 23, max: 26, band: 6.0 },
      { min: 19, max: 22, band: 5.5 },
      { min: 15, max: 18, band: 5.0 },
      { min: 13, max: 14, band: 4.5 },
      { min: 10, max: 12, band: 4.0 },
      { min: 8,  max: 9,  band: 3.5 },
      { min: 6,  max: 7,  band: 3.0 },
      { min: 4,  max: 5,  band: 2.5 },
      { min: 2,  max: 3,  band: 2.0 },
      { min: 0,  max: 1,  band: 1.0 }
    ]
  },

  // CEFR Benchmark Level Mapping
  CEFR_MAPPING: [
    { level: "C2", name: "Mastery / Proficient", toeflMin: 640, ieltsMin: 8.5, toeicMin: 950, color: "#10b981", badge: "Expert" },
    { level: "C1", name: "Effective Operational Proficiency", toeflMin: 590, ieltsMin: 7.0, toeicMin: 850, color: "#059669", badge: "Advanced" },
    { level: "B2", name: "Vantage / Upper Intermediate", toeflMin: 510, ieltsMin: 5.5, toeicMin: 700, color: "#2563eb", badge: "Upper Intermediate" },
    { level: "B1", name: "Threshold / Intermediate", toeflMin: 430, ieltsMin: 4.0, toeicMin: 550, color: "#f59e0b", badge: "Intermediate" },
    { level: "A2", name: "Waystage / Elementary", toeflMin: 340, ieltsMin: 3.0, toeicMin: 350, color: "#ea580c", badge: "Elementary" },
    { level: "A1", name: "Breakthrough / Beginner", toeflMin: 0,   ieltsMin: 0.0, toeicMin: 0,   color: "#dc2626", badge: "Beginner" }
  ]
};

/**
 * Returns active spreadsheet instance or creates one if not linked
 */
function getDatabaseSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty("SPREADSHEET_ID");
  if (sheetId) {
    try {
      return SpreadsheetApp.openById(sheetId);
    } catch (e) {
      console.warn("Configured sheet ID not accessible, falling back to active sheet: " + e.message);
    }
  }
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    console.error("No active spreadsheet found: " + e.message);
    return null;
  }
}
