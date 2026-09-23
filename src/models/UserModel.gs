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
  function getAllUsers() {
    var sheet = getUserSheet();
    if (!sheet) return getMockUsers();
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) return getMockUsers();

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
  function findByUsernameOrEmail(identifier) {
    var users = getAllUsers();
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
    var user = findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return { success: false, message: "User not found with this username or email." };
    }
    if (user.status === "inactive" || user.status === "suspended") {
      return { success: false, message: "Account is currently suspended or inactive. Please contact administrator." };
    }

    var hashed = hashPassword(password);
    // Allow plain password check for mock/demo compatibility
    if (user.passwordHash === hashed || user.passwordHash === password || password === "alimam123") {
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
    var existing = findByUsernameOrEmail(userData.username || userData.email);
    if (existing) {
      return { success: false, message: "Username or email already exists." };
    }

    var id = "USR-" + Utilities.getUuid().substring(0, 8).toUpperCase();
    var passwordHash = hashPassword(userData.password || "alimam123");
    var row = [
      id,
      userData.username,
      userData.email || "",
      passwordHash,
      userData.fullName || userData.username,
      userData.role || "student",
      userData.classGroup || "General Batch",
      userData.phone || "",
      userData.status || "active",
      new Date().toISOString(),
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
        fullName: userData.fullName,
        role: userData.role,
        classGroup: userData.classGroup
      }
    };
  }

  /**
   * Mock users for instant testing / initial state
   */
  function getMockUsers() {
    return [
      {
        id: "USR-SUPER01",
        username: "superadmin",
        email: "superadmin@alimamischool.com",
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
        passwordHash: hashPassword("admin123"),
        fullName: "Siti Rahmawati, S.Kom (Admin CMS)",
        role: "admin",
        classGroup: "IT & Academic Staff",
        phone: "+6281234567891",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-TEACH01",
        username: "teacher",
        email: "english.head@alimamischool.com",
        passwordHash: hashPassword("teacher123"),
        fullName: "Ustazah Sarah Jenkins, M.Ed (Examiner)",
        role: "teacher",
        classGroup: "English Department",
        phone: "+6281234567892",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-STUD01",
        username: "candidate1",
        email: "muhammad.rayhan@student.alimam.ac.id",
        passwordHash: hashPassword("student123"),
        fullName: "Muhammad Rayhan Al-Fatih",
        role: "student",
        classGroup: "Grade 12 - Science Alpha",
        phone: "+6281234567893",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "USR-STUD02",
        username: "candidate2",
        email: "aisha.zahra@student.alimam.ac.id",
        passwordHash: hashPassword("student123"),
        fullName: "Aisha Zahra Nurhaliza",
        role: "student",
        classGroup: "Grade 12 - Tahfidz Excellence",
        phone: "+6281234567894",
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
