// services/passwordService.js
import crypto from "crypto";

/**
 * PasswordService
 * ---------------
 * Provides methods to generate salts, hash passwords (SHA256 + salt),
 * verify passwords, and create secure random tokens.
 */
export class PasswordService {
  /**
   * Generates a random salt similar to .NET Guid.NewGuid()
   * Example: "3fd5b8b8-1dcf-4a60-9de4-7b0a2c1483a3"
   */
  static generateSalt() {
    return crypto.randomUUID();
  }

  /**
   * Hash a password using SHA256(password + salt), return Base64 string.
   * Matches .NET HashAlgorithm.Create("SHA256") behavior.
   */
  static hashPassword(password, salt) {
    if (!password || !salt) throw new Error("Password and salt are required.");
    const hash = crypto
      .createHash("sha256")
      .update(password + salt, "utf8")
      .digest("base64");
    return hash;
  }

  /**
   * Verify if a plain password matches the stored hash using its salt.
   * Returns true if password matches, false otherwise.
   */
  static verifyPassword(plainPassword, salt, storedHash) {
    const computedHash = this.hashPassword(plainPassword, salt);
    return computedHash === storedHash;
  }

  /**
   * Generates a secure random token (Base64URL format)
   * Example use: password reset token, API keys, etc.
   */
  static generateRandomToken() {
    return crypto.randomBytes(32).toString("base64url");
  }

  /**
   * Utility: generate both salt and hash together for new users
   * Returns an object: { salt, hash }
   */
  static generateSaltAndHash(password) {
    const salt = this.generateSalt();
    const hash = this.hashPassword(password, salt);
    return { salt, hash };
  }
}

/* ===== Example Usage =====
const pwd = "MySecret123!";
const { salt, hash } = PasswordService.generateSaltAndHash(pwd);
console.log("Salt:", salt);
console.log("Hash:", hash);
console.log("Verify:", PasswordService.verifyPassword(pwd, salt, hash));
=========================== */
