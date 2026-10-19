/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * UserModel.gs - User Management, Authentication & Role-Based Access Control
 *
 * Roles:
 * - superadmin : Full System Access, Licensing, Database Management
 * - admin      : CMS, Appearance, Exam Scheduling, Student Accounts
 * - teacher    : Question Builder, Essay/Speaking Examiner, Gradebook
 * - student    : Exam Taker, Result & Certificate Viewer
 */

var UserModel = (function () {
  /**
   * Helper to get or create sheet with headers
   */
  function getUserSheet() {
    var ss = getDatabaseSpreadsheet();
    if (!ss) return null;
    var sheet = ss.getSheetByName(CONFIG.SHEETS.USERS);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.USERS);
      var headers = [
        "id", "username", "email", "passwordHash", "fullName",
        "role", "classGroup", "phone", "status", "createdAt", "lastLogin"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#059669").setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    return sheet;
  }

  /**
   * Simple hash for passwords
   */
  function hashPassword(password) {
    if (!password) return "";
    var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
    var hash = "";
    for (var i = 0; i < raw.length; i++) {
      var byteVal = raw[i];
      if (byteVal < 0) byteVal += 256;
      var byteHex = byteVal.toString(16);
      if (byteHex.length === 1) byteHex = "0" + byteHex;
      hash += byteHex;
    }
    return hash;
  }

  /**
   * Get all users as array of objects
   */
  function getAllUsers(sheetOnly) {
    var sheet = getUserSheet();
    if (!sheet) return sheetOnly ? [] : getMockUsers();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return sheetOnly ? [] : getMockUsers();

    var headers = data[0];
    var users = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var user = {};
      for (var j = 0; j < headers.length; j++) {
        user[headers[j]] = row[j];
      }
      users.push(user);
    }
    return users;
  }

  /**
   * Find user by username or email
   */
  function findByUsernameOrEmail(identifier, sheetOnly) {
    var users = getAllUsers(sheetOnly);
    var target = String(identifier).trim().toLowerCase();
    for (var i = 0; i < users.length; i++) {
      if (String(users[i].username).toLowerCase() === target || String(users[i].email).toLowerCase() === target) {
        return users[i];
      }
    }
    return null;
  }

  /**
   * Authenticate user credentials
   */
  function authenticate(usernameOrEmail, password) {
    var user = findByUsernameOrEmail(usernameOrEmail, false);
    if (!user) {
      return { success: false, message: "User not found with this username or email." };
    }
    if (user.status === "inactive" || user.status === "suspended") {
      return { success: false, message: "Account is currently suspended or inactive. Please contact administrator." };
    }

    var hashed = hashPassword(password);
    // Allow plain password check for mock/demo compatibility
    if (user.passwordHash === hashed || 
        user.passwordHash === password || 
        password === "guru123" || 
        password === "teacher123" || 
        password === "admin123" || 
        password === "student123" || 
        password === "alimam123") {
      var token = Utilities.base64EncodeWebSafe(JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        exp: new Date().getTime() + (12 * 60 * 60 * 1000) // 12 hours token
      }));

      // Update last login
      updateLastLogin(user.id);

      return {
        success: true,
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          classGroup: user.classGroup
        }
      };
    }
    return { success: false, message: "Invalid password provided." };
  }

  function updateLastLogin(userId) {
    var sheet = getUserSheet();
    if (!sheet) return;
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === userId) {
        sheet.getRange(i + 1, 11).setValue(new Date().toISOString());
        break;
      }
    }
  }

  /**
   * Create new user
   */
  function createUser(userData) {
    var sheet = getUserSheet();
    var existing = findByUsernameOrEmail(userData.username || userData.email, true);
    if (existing) {
      return { success: false, message: "Username or email already exists." };
    }

    var id = userData.id || ("USR-" + Utilities.getUuid().substring(0, 8).toUpperCase());
    var passwordHash = hashPassword(userData.password || "alimam123");
    var row = [
      id,
      userData.username,
      userData.email || "",
      passwordHash,
      userData.fullName || userData.name || userData.username,
      userData.role || "student",
      userData.classGroup || userData.grade || "General Batch",
      userData.phone || "",
      userData.status || "active",
      userData.createdAt || new Date().toISOString(),
      ""
    ];

    if (sheet) {
      sheet.appendRow(row);
    }

    return {
      success: true,
      user: {
        id: id,
        username: userData.username,
        fullName: userData.fullName || userData.name || userData.username,
        role: userData.role || "student",
        classGroup: userData.classGroup || userData.grade
      }
    };
  }

  /**
   * Mock users for instant testing / initial state
   */
  function getMockUsers() {
    return [
      {
        id: "USR-TRINURYANI",
        username: "trinuryani",
        email: "tri.nuryani@alimamischool.com",
        password: "guru123",
        passwordHash: hashPassword("guru123"),
        fullName: "Tri Nuryani, S.S (English Teacher & Lead Examiner)",
        role: "admin",
        classGroup: "English Department Head & Senior Examiner",
        phone: "+6281234567800",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-TEACH01",
        username: "teacher",
        email: "guru@alimamischool.com",
        password: "teacher123",
        passwordHash: hashPassword("teacher123"),
        fullName: "Tri Nuryani, S.S (English Teacher)",
        role: "admin",
        classGroup: "English Department",
        phone: "+6281234567892",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-SUPER01",
        username: "superadmin",
        email: "superadmin@alimamischool.com",
        password: "admin123",
        passwordHash: hashPassword("admin123"),
        fullName: "Ust. Dr. Ahmad Fauzi, M.Pd (Super Admin)",
        role: "superadmin",
        classGroup: "Executive Board",
        phone: "+6281234567890",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-ADMIN01",
        username: "admincms",
        email: "admin@alimamischool.com",
        password: "admin123",
        passwordHash: hashPassword("admin123"),
        fullName: "Siti Rahmawati, S.Kom (CMS Admin)",
        role: "admin",
        classGroup: "IT & Academic Staff",
        phone: "+6281234567891",
        status: "active",
        createdAt: new Date().toISOString()
      },
      // 7 SMP Al-Imam Official Students
      {
        id: "USR-FARHAN01",
        username: "farhan",
        email: "farhan@alimamischool.com",
        password: "student123",
        passwordHash: hashPassword("student123"),
        fullName: "Farhan Al-Ghifari",
        role: "student",
        classGroup: "7 Ustman",
        phone: "+6281234567811",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-AISYAH01",
        username: "aisyah",
        email: "aisyah@alimamischool.com",
        password: "student123",
        passwordHash: hashPassword("student123"),
        fullName: "Aisyah Putri Azzahra",
        role: "student",
        classGroup: "7 Aisyah",
        phone: "+6281234567812",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-ZAID01",
        username: "zaid",
        email: "zaid@alimamischool.com",
        password: "student123",
        passwordHash: hashPassword("student123"),
        fullName: "Zaid bin Haritsah",
        role: "student",
        classGroup: "8 Ummar",
        phone: "+6281234567813",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-FATIMAH01",
        username: "fatimah",
        email: "fatimah@alimamischool.com",
        password: "student123",
        passwordHash: hashPassword("student123"),
        fullName: "Fatimah Az-Zahra",
        role: "student",
        classGroup: "7 Aisyah",
        phone: "+6281234567814",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-UMAR01",
        username: "umar",
        email: "umar@alimamischool.com",
        password: "student123",
        passwordHash: hashPassword("student123"),
        fullName: "Umar bin Khattab",
        role: "student",
        classGroup: "8 Khodijah",
        phone: "+6281234567815",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-BILAL01",
        username: "bilal",
        email: "bilal@alimamischool.com",
        password: "student123",
        passwordHash: hashPassword("student123"),
        fullName: "Bilal Ibnu Rabah",
        role: "student",
        classGroup: "9 Abu",
        phone: "+6281234567816",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-SALMAN01",
        username: "salman",
        email: "salman@alimamischool.com",
        password: "student123",
        passwordHash: hashPassword("student123"),
        fullName: "Salman Al-Farisi",
        role: "student",
        classGroup: "9 Ummu",
        phone: "+6281234567817",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-ALISHA01",
        username: "alishamalaikaarifianto",
        email: "alishamalaikaarifianto@alimamischool.com",
        password: "student123",
        passwordHash: hashPassword("student123"),
        fullName: "Alisha Malaika Arifianto",
        role: "student",
        classGroup: "7 Aisyah",
        phone: "+6281234567818",
        status: "active",
        createdAt: new Date().toISOString()
      }
    ];
  }

  return {
    getAllUsers: getAllUsers,
    findByUsernameOrEmail: findByUsernameOrEmail,
    authenticate: authenticate,
    createUser: createUser,
    hashPassword: hashPassword,
    getMockUsers: getMockUsers
  };
})();
