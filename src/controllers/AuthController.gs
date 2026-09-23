/**
 * AL-IMAM PROFESSIONAL ENGLISH ASSESSMENT SYSTEM
 * AuthController.gs - Authentication Routing, Session Token & RBAC Guards
 */

var AuthController = (function () {
  /**
   * Handle user login request
   */
  function handleLogin(payload) {
    if (!payload || !payload.username || !payload.password) {
      return { success: false, message: "Username and password are required." };
    }
    return UserModel.authenticate(payload.username, payload.password);
  }

  /**
   * Handle new candidate registration (if enabled by admin)
   */
  function handleRegister(payload) {
    if (!payload || !payload.username || !payload.password) {
      return { success: false, message: "Missing required registration fields." };
    }
    return UserModel.createUser(payload);
  }

  /**
   * Validate session token from headers or payload
   */
  function validateToken(tokenString) {
    if (!tokenString) return null;
    try {
      var decoded = Utilities.newBlob(Utilities.base64DecodeWebSafe(tokenString)).getDataAsString();
      var data = JSON.parse(decoded);
      if (data.exp && data.exp > new Date().getTime()) {
        return data;
      }
    } catch (e) {
      console.warn("Invalid token string: " + e.message);
    }
    return null;
  }

  /**
   * Role guard check
   */
  function requireRole(tokenString, allowedRoles) {
    var user = validateToken(tokenString);
    if (!user) {
      return { authorized: false, error: "Session expired or invalid token." };
    }
    if (allowedRoles.indexOf(user.role) === -1 && user.role !== "superadmin") {
      return { authorized: false, error: "Unauthorized access: Insufficient privileges." };
    }
    return { authorized: true, user: user };
  }

  return {
    handleLogin: handleLogin,
    handleRegister: handleRegister,
    validateToken: validateToken,
    requireRole: requireRole
  };
})();
