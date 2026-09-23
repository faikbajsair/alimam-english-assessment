/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * CmsController.gs - Appearance Configurator, Theme Customizer & SaaS Licensing
 */

var CmsController = (function () {
  function getSettingsSheet() {
    var ss = getDatabaseSpreadsheet();
    if (!ss) return null;
    var sheet = ss.getSheetByName(CONFIG.SHEETS.SETTINGS);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.SETTINGS);
      var headers = ["key", "value", "updatedAt"];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    return sheet;
  }

  /**
   * Get current appearance & institution settings
   */
  function getSettings() {
    var sheet = getSettingsSheet();
    var defaultSettings = {
      theme: CONFIG.DEFAULT_THEME,
      institution: {
        name: CONFIG.INSTITUTION_NAME,
        motto: CONFIG.INSTITUTION_MOTTO,
        logoUrl: CONFIG.LOGO_URL,
        website: CONFIG.INSTITUTION_WEBSITE
      },
      proctoring: CONFIG.PROCTORING,
      license: {
        tier: "ENTERPRISE",
        tierName: "Enterprise Unlimited License",
        licenseKey: "ALIMAM-ENT-2026-PRO-UNLIMITED",
        maxStudents: 5000,
        activeStudents: 142,
        validUntil: "2027-12-31",
        status: "ACTIVE_VALID"
      },
      seo: {
        metaTitle: "Al-Imam English Assessment System - Enterprise CBT & TOEFL/IELTS Center",
        metaDescription: "Standardized English Proficiency Assessment System with strict proctoring and international scoring scale for Lembaga Pendidikan Al-Imam."
      }
    };

    if (!sheet) return defaultSettings;

    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return defaultSettings;

    for (var i = 1; i < data.length; i++) {
      var k = data[i][0];
      var v = data[i][1];
      if (k === "THEME_SETTINGS") {
        try { defaultSettings.theme = JSON.parse(v); } catch (e) {}
      } else if (k === "INSTITUTION_SETTINGS") {
        try { defaultSettings.institution = JSON.parse(v); } catch (e) {}
      } else if (k === "LICENSE_SETTINGS") {
        try { defaultSettings.license = JSON.parse(v); } catch (e) {}
      }
    }

    return defaultSettings;
  }

  /**
   * Save appearance & theme updates
   */
  function saveAppearanceSettings(payload) {
    var sheet = getSettingsSheet();
    var now = new Date().toISOString();

    if (payload.theme) {
      updateSettingValue("THEME_SETTINGS", JSON.stringify(payload.theme));
    }
    if (payload.institution) {
      updateSettingValue("INSTITUTION_SETTINGS", JSON.stringify(payload.institution));
    }
    if (payload.seo) {
      updateSettingValue("SEO_SETTINGS", JSON.stringify(payload.seo));
    }

    return {
      success: true,
      message: "Appearance and institutional settings updated successfully.",
      updatedAt: now
    };
  }

  function updateSettingValue(key, value) {
    var sheet = getSettingsSheet();
    if (!sheet) return;
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === key) {
        sheet.getRange(i + 1, 2).setValue(value);
        sheet.getRange(i + 1, 3).setValue(new Date().toISOString());
        return;
      }
    }
    sheet.appendRow([key, value, new Date().toISOString()]);
  }

  /**
   * Validate commercial license key
   */
  function validateLicense(licenseKey) {
    var key = String(licenseKey).trim().toUpperCase();
    if (key.indexOf("ALIMAM-ENT") === 0) {
      return {
        valid: true,
        tier: "ENTERPRISE",
        maxStudents: 5000,
        validUntil: "2027-12-31",
        message: "Enterprise Unlimited License Verified."
      };
    } else if (key.indexOf("ALIMAM-PRO") === 0) {
      return {
        valid: true,
        tier: "PRO",
        maxStudents: 500,
        validUntil: "2027-06-30",
        message: "Professional 500-Candidate License Verified."
      };
    } else if (key.indexOf("ALIMAM-START") === 0) {
      return {
        valid: true,
        tier: "STARTER",
        maxStudents: 100,
        validUntil: "2026-12-31",
        message: "Starter 100-Candidate License Verified."
      };
    }
    return {
      valid: false,
      message: "Invalid or expired license key. Please verify your subscription."
    };
  }

  /**
   * Export full database in JSON format for one-click backup
   */
  function exportDatabaseBackup() {
    var users = UserModel.getAllUsers();
    var questions = QuestionModel.getAllQuestions();
    var exams = ExaminationModel.getAllExams();
    var settings = getSettings();

    return {
      appName: CONFIG.APP_NAME,
      exportedAt: new Date().toISOString(),
      version: CONFIG.APP_VERSION,
      database: {
        users: users,
        questions: questions,
        exams: exams,
        settings: settings
      }
    };
  }

  return {
    getSettings: getSettings,
    saveAppearanceSettings: saveAppearanceSettings,
    validateLicense: validateLicense,
    exportDatabaseBackup: exportDatabaseBackup
  };
})();
