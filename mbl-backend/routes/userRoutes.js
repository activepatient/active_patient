


// import bcrypt from "bcryptjs";
// import dotenv from "dotenv";
// import express from "express";
// import jwt from "jsonwebtoken";
// import sql from "mssql";
// import nodemailer from "nodemailer";

// dotenv.config(); // ✅ Load env

// const router = express.Router();

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// // ✅ Gmail transporter (uses App Password)
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true, // SSL
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: { rejectUnauthorized: false },
// });

// console.log("📧 Email transporter initialized for:", process.env.EMAIL_USER);

// // ==========================
// // 🟦 REGISTER API
// // ==========================
// router.post("/register", async (req, res) => {
//   const { email, password, firstName, lastName, mobile, gender, dob } = req.body;

//   try {
//     if (!email || !password)
//       return res.status(400).json({ status: "Error", message: "Email and password are required." });

//     const pool = await sql.connect(global.dbConfig);

//     // Check if email exists
//     const existing = await pool
//       .request()
//       .input("EmailID", sql.NVarChar(50), email)
//       .query("SELECT TOP 1 UserID FROM varahatech.[User] WHERE EmailID=@EmailID");

//     if (existing.recordset.length > 0)
//       return res.json({ status: "Error", message: "Email already registered." });

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const otp = generateOTP();
//     const expiry = new Date(Date.now() + 15 * 60 * 1000);
//     const now = new Date();

//     await pool.request()
//       .input("EmailID", sql.NVarChar(50), email)
//       .input("FirstName", sql.NVarChar(50), firstName || "")
//       .input("LastName", sql.NVarChar(50), lastName || "")
//       .input("Password", sql.NVarChar(256), hash)
//       .input("PasswordSalt", sql.NVarChar(256), salt)
//       .input("MobileNo", sql.NVarChar(15), mobile || "")
//       .input("Gender", sql.NVarChar(10), gender || "M")
//       .input("DOB", sql.DateTime2, dob || now)
//       .input("EmailConfirmed", sql.Bit, 0)
//       .input("EmailConfirmationToken", sql.NVarChar(20), otp)
//       .input("EmailConfirmationTokenExpiry", sql.DateTime2, expiry)
//       .input("MobileNoConfirmed", sql.Bit, 0)
//       .input("MobileConfirmationToken", sql.NVarChar(20), "")
//       .input("MobileConfirmationTokenExpiry", sql.DateTime2, now)
//       .input("IsPasswordlinkShow", sql.Bit, 0)
//       .input("RoleId", sql.Int, 1)
//       .input("FaiedLoginAttempt", sql.Int, 0)
//       .input("ProfilePhoto", sql.NVarChar(100), "")
//       .input("SessionToken", sql.NVarChar(700), "")
//       .input("RefreshToken", sql.NVarChar(700), "")
//       .input("IsLocked", sql.Bit, 0)
//       .input("ExpiresAt", sql.DateTime2, expiry)
//       .input("LastLoginDate", sql.DateTime2, now)
//       .input("AddDate", sql.DateTime2, now)
//       .input("ModifiedDate", sql.DateTime2, now)
//       .input("AddedBy", sql.NVarChar(50), firstName || "")
//       .input("ModifiedBy", sql.NVarChar(50), firstName || "")
//       .input("IsActive", sql.Bit, 1)
//       .input("IsDelete", sql.Bit, 0)
//       .query(`
//         INSERT INTO varahatech.[User] (
//           EmailID, FirstName, LastName, Password, PasswordSalt, MobileNo, Gender, DOB,
//           EmailConfirmed, EmailConfirmationToken, EmailConfirmationTokenExpiry,
//           MobileNoConfirmed, MobileConfirmationToken, MobileConfirmationTokenExpiry,
//           IsPasswordlinkShow, RoleId, FaiedLoginAttempt, ProfilePhoto,
//           SessionToken, RefreshToken, IsLocked, ExpiresAt, LastLoginDate,
//           AddDate, ModifiedDate, AddedBy, ModifiedBy, IsActive, IsDelete
//         )
//         VALUES (
//           @EmailID, @FirstName, @LastName, @Password, @PasswordSalt, @MobileNo, @Gender, @DOB,
//           @EmailConfirmed, @EmailConfirmationToken, @EmailConfirmationTokenExpiry,
//           @MobileNoConfirmed, @MobileConfirmationToken, @MobileConfirmationTokenExpiry,
//           @IsPasswordlinkShow, @RoleId, @FaiedLoginAttempt, @ProfilePhoto,
//           @SessionToken, @RefreshToken, @IsLocked, @ExpiresAt, @LastLoginDate,
//           @AddDate, @ModifiedDate, @AddedBy, @ModifiedBy, @IsActive, @IsDelete
//         )
//       `);

//     const html = `
//       <h3>Active Patient - Email Verification</h3>
//       <p>Dear ${firstName || "User"},</p>
//       <p>Your verification code is:</p>
//       <h2>${otp}</h2>
//       <p>This code will expire in 15 minutes.</p>
//       <p>Thank you,<br/>Active Patient Team</p>
//     `;

//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: email,
//       subject: "Verify your Active Patient account",
//       html,
//     });

//     console.log(`📧 OTP sent to ${email}: ${otp}`);
//     res.json({ status: "Success", message: "User registered. OTP sent to email." });
//   } catch (err) {
//     console.error("❌ Register Error:", err);
//     res.status(500).json({ status: "Error", message: "Server error during registration." });
//   }
// });

// // ==========================
// // 🟩 VERIFY EMAIL
// // ==========================
// router.post("/verifyEmail", async (req, res) => {
//   const { email, otp } = req.body;
//   if (!email || !otp)
//     return res.status(400).json({ status: "Error", message: "Email and OTP required." });

//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const result = await pool
//       .request()
//       .input("EmailID", sql.NVarChar(50), email)
//       .input("OTP", sql.NVarChar(20), otp)
//       .query(`
//         SELECT TOP 1 * FROM varahatech.[User]
//         WHERE EmailID=@EmailID AND EmailConfirmationToken=@OTP
//       `);

//     if (result.recordset.length === 0)
//       return res.status(400).json({ status: "Error", message: "Invalid OTP." });

//     const user = result.recordset[0];
//     const now = new Date();
//     if (new Date(user.EmailConfirmationTokenExpiry) < now)
//       return res.status(400).json({ status: "Error", message: "OTP expired." });

//     await pool.request()
//       .input("EmailID", sql.NVarChar(50), email)
//       .query(`
//         UPDATE varahatech.[User]
//         SET EmailConfirmed = 1,
//             EmailConfirmationToken = '',
//             EmailConfirmationTokenExpiry = GETDATE()
//         WHERE EmailID = @EmailID
//       `);

//     res.json({ status: "Success", message: "Email verified successfully." });
//   } catch (err) {
//     console.error("❌ Verify Error:", err);
//     res.status(500).json({ status: "Error", message: "Server error during verification." });
//   }
// });

// // ==========================
// // 🟢 LOGIN
// // ==========================
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ status: "Error", message: "Email and password required." });

//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const result = await pool
//       .request()
//       .input("EmailID", sql.NVarChar(50), email)
//       .query("SELECT TOP 1 * FROM varahatech.[User] WHERE EmailID=@EmailID");

//     if (result.recordset.length === 0)
//       return res.status(404).json({ status: "Error", message: "User not found." });

//     const user = result.recordset[0];
//     if (!user.EmailConfirmed)
//       return res.json({ status: "Error", message: "Email not verified. Please verify first." });

//     const valid = await bcrypt.compare(password, user.Password);
//     if (!valid)
//       return res.status(401).json({ status: "Error", message: "Invalid password." });

//     const token = jwt.sign(
//       { id: user.UserID, email: user.EmailID, name: user.FirstName },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       status: "Success",
//       message: "Login successful.",
//       token,
//       user: {
//         id: user.UserID,
//         email: user.EmailID,
//         name: `${user.FirstName} ${user.LastName}`,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login Error:", err);
//     res.status(500).json({ status: "Error", message: "Server error during login." });
//   }
// });

// // ==========================
// // 🔵 FORGOT PASSWORD FLOW
// // ==========================

// // 1️⃣ Send OTP
// router.post("/forgotPassword/send-otp", async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ status: "Error", message: "Email required." });

//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const result = await pool.request().input("EmailID", sql.NVarChar(50), email)
//       .query("SELECT TOP 1 * FROM varahatech.[User] WHERE EmailID=@EmailID");

//     if (result.recordset.length === 0)
//       return res.status(404).json({ status: "Error", message: "User not found." });

//     const otp = generateOTP();
//     const expiry = new Date(Date.now() + 15 * 60 * 1000);

//     await pool.request()
//       .input("EmailID", sql.NVarChar(50), email)
//       .input("OTP", sql.NVarChar(20), otp)
//       .input("Expiry", sql.DateTime2, expiry)
//       .query(`
//         UPDATE varahatech.[User]
//         SET EmailConfirmationToken=@OTP,
//             EmailConfirmationTokenExpiry=@Expiry
//         WHERE EmailID=@EmailID
//       `);

//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: email,
//       subject: "Password Reset OTP",
//       html: `<p>Your password reset OTP is:</p><h2>${otp}</h2><p>Valid for 15 minutes.</p>`,
//     });

//     console.log(`📧 Forgot password OTP sent to ${email}: ${otp}`);
//     res.json({ status: "Success", message: "OTP sent to email." });
//   } catch (err) {
//     console.error("❌ ForgotPassword Send OTP Error:", err);
//     res.status(500).json({ status: "Error", message: "Error sending OTP." });
//   }
// });

// // 2️⃣ Verify OTP
// router.post("/forgotPassword/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;
//   if (!email || !otp)
//     return res.status(400).json({ status: "Error", message: "Email and OTP required." });

//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const result = await pool.request()
//       .input("EmailID", sql.NVarChar(50), email)
//       .input("OTP", sql.NVarChar(20), otp)
//       .query(`
//         SELECT TOP 1 * FROM varahatech.[User]
//         WHERE EmailID=@EmailID AND EmailConfirmationToken=@OTP
//       `);

//     if (result.recordset.length === 0)
//       return res.status(400).json({ status: "Error", message: "Invalid OTP." });

//     const user = result.recordset[0];
//     if (new Date(user.EmailConfirmationTokenExpiry) < new Date())
//       return res.status(400).json({ status: "Error", message: "OTP expired." });

//     res.json({ status: "Success", message: "OTP verified successfully." });
//   } catch (err) {
//     console.error("❌ ForgotPassword Verify Error:", err);
//     res.status(500).json({ status: "Error", message: "Error verifying OTP." });
//   }
// });

// // 3️⃣ Reset Password
// router.post("/forgotPassword/reset", async (req, res) => {
//   const { email, newPassword } = req.body;
//   if (!email || !newPassword)
//     return res.status(400).json({ status: "Error", message: "Email and new password required." });

//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(newPassword, salt);

//     const pool = await sql.connect(global.dbConfig);
//     await pool.request()
//       .input("EmailID", sql.NVarChar(50), email)
//       .input("Password", sql.NVarChar(256), hash)
//       .input("PasswordSalt", sql.NVarChar(256), salt)
//       .query(`
//         UPDATE varahatech.[User]
//         SET Password=@Password, PasswordSalt=@PasswordSalt
//         WHERE EmailID=@EmailID
//       `);

//     res.json({ status: "Success", message: "Password reset successful." });
//   } catch (err) {
//     console.error("❌ ForgotPassword Reset Error:", err);
//     res.status(500).json({ status: "Error", message: "Error resetting password." });
//   }
// });

// // ==========================
// // 🔐 CHANGE PASSWORD (NEW)
// // ==========================
// router.post("/change-password", async (req, res) => {
//   const { oldPassword, newPassword } = req.body;
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ status: "Error", message: "No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const pool = await sql.connect(global.dbConfig);
//     const result = await pool
//       .request()
//       .input("UserID", sql.Int, userId)
//       .query("SELECT TOP 1 * FROM varahatech.[User] WHERE UserID=@UserID");

//     if (result.recordset.length === 0) {
//       return res.status(404).json({ status: "Error", message: "User not found." });
//     }

//     const user = result.recordset[0];
//     const isMatch = await bcrypt.compare(oldPassword, user.Password);
//     if (!isMatch) {
//       return res.status(400).json({ status: "Error", message: "Old password is incorrect." });
//     }

//     const newSalt = await bcrypt.genSalt(10);
//     const newHash = await bcrypt.hash(newPassword, newSalt);

//     await pool
//       .request()
//       .input("UserID", sql.Int, userId)
//       .input("Password", sql.NVarChar(256), newHash)
//       .input("PasswordSalt", sql.NVarChar(256), newSalt)
//       .input("ModifiedDate", sql.DateTime2, new Date())
//       .query(`
//         UPDATE varahatech.[User]
//         SET Password=@Password,
//             PasswordSalt=@PasswordSalt,
//             ModifiedDate=@ModifiedDate
//         WHERE UserID=@UserID
//       `);

//     // ✅ Optional: Send email notification
//     await transporter.sendMail({
//       from: process.env.EMAIL_FROM,
//       to: user.EmailID,
//       subject: "Password Changed - Active Patient",
//       html: `
//         <h3>Password Changed Successfully</h3>
//         <p>Hello ${user.FirstName || "User"},</p>
//         <p>Your password was changed successfully.</p>
//         <p>If this wasn’t you, please reset your password immediately.</p>
//         <p>– Active Patient Team</p>
//       `,
//     });

//     res.json({
//       status: "Success",
//       message: "Password updated successfully.",
//     });
//   } catch (err) {
//     console.error("❌ Change Password Error:", err);
//     res.status(500).json({
//       status: "Error",
//       message: "Server error during password change.",
//     });
//   }
// });

// export default router;



import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import sql from "mssql";
import nodemailer from "nodemailer";

dotenv.config();

const router = express.Router();

// 🔹 OTP Generator
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔹 Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

console.log("📧 Email transporter initialized for:", process.env.EMAIL_USER);

// ======================================================
// 🟦 REGISTER USER + AUTO-CREATE “SELF” MEMBER
// ======================================================
router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, mobile, gender, dob } = req.body;

  try {
    if (!email || !password || !firstName || !lastName || !mobile || !dob) {
      return res.status(400).json({
        status: "Error",
        message: "All fields are mandatory: First Name, Last Name, Email, Password, Mobile, DOB.",
      });
    }

    const pool = await sql.connect(global.dbConfig);

    // 🔹 Check duplicate email
    const existing = await pool
      .request()
      .input("EmailID", sql.NVarChar(50), email)
      .query("SELECT TOP 1 UserID FROM varahatech.[User] WHERE EmailID=@EmailID AND IsDelete=0");

    if (existing.recordset.length > 0)
      return res.json({ status: "Error", message: "Email already registered." });

    // 🔹 Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);
    const now = new Date();

    // 🔹 Insert User
    const userInsert = await pool
      .request()
      .input("EmailID", sql.NVarChar(50), email)
      .input("FirstName", sql.NVarChar(50), firstName)
      .input("LastName", sql.NVarChar(50), lastName)
      .input("Password", sql.NVarChar(256), hash)
      .input("PasswordSalt", sql.NVarChar(256), salt)
      .input("MobileNo", sql.NVarChar(15), mobile)
      .input("Gender", sql.NVarChar(10), gender || "U")
      .input("DOB", sql.DateTime2, dob ? new Date(dob) : now)
      .input("EmailConfirmed", sql.Bit, 0)
      .input("EmailConfirmationToken", sql.NVarChar(20), otp)
      .input("EmailConfirmationTokenExpiry", sql.DateTime2, expiry)
      .input("MobileNoConfirmed", sql.Bit, 0)
      .input("MobileConfirmationToken", sql.NVarChar(20), "")
      .input("MobileConfirmationTokenExpiry", sql.DateTime2, now)
      .input("IsPasswordlinkShow", sql.Bit, 0)
      .input("RoleId", sql.Int, 1)
      .input("FaiedLoginAttempt", sql.Int, 0)
      .input("ProfilePhoto", sql.NVarChar(100), "")
      .input("SessionToken", sql.NVarChar(700), "")
      .input("RefreshToken", sql.NVarChar(700), "")
      .input("IsLocked", sql.Bit, 0)
      .input("ExpiresAt", sql.DateTime2, expiry)
      .input("LastLoginDate", sql.DateTime2, now)
      .input("AddDate", sql.DateTime2, now)
      .input("ModifiedDate", sql.DateTime2, now)
      .input("AddedBy", sql.NVarChar(50), firstName)
      .input("ModifiedBy", sql.NVarChar(50), firstName)
      .input("IsActive", sql.Bit, 1)
      .input("IsDelete", sql.Bit, 0)
      .query(`
        INSERT INTO varahatech.[User] (
          EmailID, FirstName, LastName, Password, PasswordSalt, MobileNo, Gender, DOB,
          EmailConfirmed, EmailConfirmationToken, EmailConfirmationTokenExpiry,
          MobileNoConfirmed, MobileConfirmationToken, MobileConfirmationTokenExpiry,
          IsPasswordlinkShow, RoleId, FaiedLoginAttempt, ProfilePhoto,
          SessionToken, RefreshToken, IsLocked, ExpiresAt, LastLoginDate,
          AddDate, ModifiedDate, AddedBy, ModifiedBy, IsActive, IsDelete
        )
        OUTPUT inserted.UserID AS NewUserID
        VALUES (
          @EmailID, @FirstName, @LastName, @Password, @PasswordSalt, @MobileNo, @Gender, @DOB,
          @EmailConfirmed, @EmailConfirmationToken, @EmailConfirmationTokenExpiry,
          @MobileNoConfirmed, @MobileConfirmationToken, @MobileConfirmationTokenExpiry,
          @IsPasswordlinkShow, @RoleId, @FaiedLoginAttempt, @ProfilePhoto,
          @SessionToken, @RefreshToken, @IsLocked, @ExpiresAt, @LastLoginDate,
          @AddDate, @ModifiedDate, @AddedBy, @ModifiedBy, @IsActive, @IsDelete
        );
      `);

    const newUserId = userInsert.recordset[0].NewUserID;
    const familyID = `FAB-${newUserId}`;
    console.log(`✅ User created successfully (UserID: ${newUserId})`);

    // 🔹 Auto-create Self (Head of Household)
    try {
      await pool
        .request()
        .input("MappedMemberID", sql.Int, newUserId)
        .input("FamilyID", sql.NVarChar(50), familyID)
        .input("FirstName", sql.NVarChar(50), firstName)
        .input("LastName", sql.NVarChar(50), lastName)
        .input("Gender", sql.NVarChar(10), gender || "U")
        .input("DOB", sql.DateTime2, dob ? new Date(dob) : now)
        .input("MobileNo", sql.NVarChar(15), mobile)
        .input("EmailID", sql.NVarChar(100), email)
        .input("RelationshipTypeID", sql.Int, 1)
        .input("HasLogin", sql.Bit, 1)
        .input("IsPrimaryMem", sql.Bit, 1)
        .input("IsActive", sql.Bit, 1)
        .input("IsDelete", sql.Bit, 0)
        .query(`
          INSERT INTO varahatech.Member (
            MappedMemberID, FamilyID, FirstName, LastName, Gender, DOB,
            MobileNo, EmailID, RelationshipTypeID, HasLogin, IsPrimaryMem,
            IsActive, IsDelete, AddDate
          )
          VALUES (
            @MappedMemberID, @FamilyID, @FirstName, @LastName, @Gender, @DOB,
            @MobileNo, @EmailID, @RelationshipTypeID, @HasLogin, @IsPrimaryMem,
            @IsActive, @IsDelete, GETDATE()
          );
        `);
      console.log(`🏠 'Self' member created for FamilyID ${familyID}`);
    } catch (memberErr) {
      console.error("⚠️ Error creating Self member:", memberErr.message);
    }

    // 🔹 Send OTP
    const html = `
      <h3>Active Patient - Email Verification</h3>
      <p>Dear ${firstName},</p>
      <p>Your verification code is:</p>
      <h2>${otp}</h2>
      <p>This code will expire in 15 minutes.</p>
      <p>Thank you,<br/>Active Patient Team</p>
    `;
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your Active Patient account",
      html,
    });

    console.log(`📧 OTP sent to ${email}: ${otp}`);
    res.json({ status: "Success", message: "User registered. OTP sent to email." });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ status: "Error", message: "Server error during registration." });
  }
});

// ======================================================
// 🟩 VERIFY EMAIL
// ======================================================
router.post("/verifyEmail", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ status: "Error", message: "Email and OTP required." });

  try {
    const pool = await sql.connect(global.dbConfig);
    const result = await pool
      .request()
      .input("EmailID", sql.NVarChar(50), email)
      .input("OTP", sql.NVarChar(20), otp)
      .query(`
        SELECT TOP 1 * FROM varahatech.[User]
        WHERE EmailID=@EmailID AND EmailConfirmationToken=@OTP
      `);

    if (result.recordset.length === 0)
      return res.status(400).json({ status: "Error", message: "Invalid OTP." });

    const user = result.recordset[0];
    const now = new Date();
    if (new Date(user.EmailConfirmationTokenExpiry) < now)
      return res.status(400).json({ status: "Error", message: "OTP expired." });

    await pool.request()
      .input("EmailID", sql.NVarChar(50), email)
      .query(`
        UPDATE varahatech.[User]
        SET EmailConfirmed = 1,
            EmailConfirmationToken = '',
            EmailConfirmationTokenExpiry = GETDATE()
        WHERE EmailID = @EmailID
      `);

    res.json({ status: "Success", message: "Email verified successfully." });
  } catch (err) {
    console.error("❌ Verify Error:", err);
    res.status(500).json({ status: "Error", message: "Server error during verification." });
  }
});

// ======================================================
// 🟢 LOGIN
// ======================================================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ status: "Error", message: "Email and password required." });

  try {
    const pool = await sql.connect(global.dbConfig);
    const result = await pool
      .request()
      .input("EmailID", sql.NVarChar(50), email)
      .query("SELECT TOP 1 * FROM varahatech.[User] WHERE EmailID=@EmailID");

    if (result.recordset.length === 0)
      return res.status(404).json({ status: "Error", message: "User not found." });

    const user = result.recordset[0];
    if (!user.EmailConfirmed)
      return res.json({ status: "Error", message: "Email not verified. Please verify first." });

    const valid = await bcrypt.compare(password, user.Password);
    if (!valid)
      return res.status(401).json({ status: "Error", message: "Invalid password." });

    const token = jwt.sign(
      { userId: user.UserID, email: user.EmailID, username: user.FirstName },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      status: "Success",
      message: "Login successful.",
      token,
      user: {
        id: user.UserID,
        email: user.EmailID,
        name: `${user.FirstName} ${user.LastName}`,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ status: "Error", message: "Server error during login." });
  }
});

// ======================================================
// 🟣 FORGOT PASSWORD - SEND OTP / VERIFY / RESET
// ======================================================
router.post("/forgotPassword/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ status: "Error", message: "Email required." });

  try {
    const pool = await sql.connect(global.dbConfig);
    const result = await pool.request().input("EmailID", sql.NVarChar(50), email)
      .query("SELECT TOP 1 * FROM varahatech.[User] WHERE EmailID=@EmailID");

    if (result.recordset.length === 0)
      return res.status(404).json({ status: "Error", message: "User not found." });

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await pool.request()
      .input("EmailID", sql.NVarChar(50), email)
      .input("OTP", sql.NVarChar(20), otp)
      .input("Expiry", sql.DateTime2, expiry)
      .query(`
        UPDATE varahatech.[User]
        SET EmailConfirmationToken=@OTP,
            EmailConfirmationTokenExpiry=@Expiry
        WHERE EmailID=@EmailID
      `);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your password reset OTP is:</p><h2>${otp}</h2><p>Valid for 15 minutes.</p>`,
    });

    console.log(`📧 Forgot password OTP sent to ${email}: ${otp}`);
    res.json({ status: "Success", message: "OTP sent to email." });
  } catch (err) {
    console.error("❌ ForgotPassword Send OTP Error:", err);
    res.status(500).json({ status: "Error", message: "Error sending OTP." });
  }
});

router.post("/forgotPassword/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ status: "Error", message: "Email and OTP required." });

  try {
    const pool = await sql.connect(global.dbConfig);
    const result = await pool.request()
      .input("EmailID", sql.NVarChar(50), email)
      .input("OTP", sql.NVarChar(20), otp)
      .query(`
        SELECT TOP 1 * FROM varahatech.[User]
        WHERE EmailID=@EmailID AND EmailConfirmationToken=@OTP
      `);

    if (result.recordset.length === 0)
      return res.status(400).json({ status: "Error", message: "Invalid OTP." });

    const user = result.recordset[0];
    if (new Date(user.EmailConfirmationTokenExpiry) < new Date())
      return res.status(400).json({ status: "Error", message: "OTP expired." });

    res.json({ status: "Success", message: "OTP verified successfully." });
  } catch (err) {
    console.error("❌ ForgotPassword Verify Error:", err);
    res.status(500).json({ status: "Error", message: "Error verifying OTP." });
  }
});

router.post("/forgotPassword/reset", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    return res.status(400).json({ status: "Error", message: "Email and new password required." });

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    const pool = await sql.connect(global.dbConfig);
    await pool.request()
      .input("EmailID", sql.NVarChar(50), email)
      .input("Password", sql.NVarChar(256), hash)
      .input("PasswordSalt", sql.NVarChar(256), salt)
      .query(`
        UPDATE varahatech.[User]
        SET Password=@Password, PasswordSalt=@PasswordSalt
        WHERE EmailID=@EmailID
      `);

    res.json({ status: "Success", message: "Password reset successful." });
  } catch (err) {
    console.error("❌ ForgotPassword Reset Error:", err);
    res.status(500).json({ status: "Error", message: "Error resetting password." });
  }
});

// ======================================================
// 🔐 CHANGE PASSWORD
// ======================================================
router.post("/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ status: "Error", message: "No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const pool = await sql.connect(global.dbConfig);
    const result = await pool.request()
      .input("UserID", sql.Int, userId)
      .query("SELECT TOP 1 * FROM varahatech.[User] WHERE UserID=@UserID");

    if (result.recordset.length === 0)
      return res.status(404).json({ status: "Error", message: "User not found." });

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(oldPassword, user.Password);
    if (!isMatch)
      return res.status(400).json({ status: "Error", message: "Old password is incorrect." });

    const newSalt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, newSalt);

    await pool.request()
      .input("UserID", sql.Int, userId)
      .input("Password", sql.NVarChar(256), newHash)
      .input("PasswordSalt", sql.NVarChar(256), newSalt)
      .input("ModifiedDate", sql.DateTime2, new Date())
      .query(`
        UPDATE varahatech.[User]
        SET Password=@Password, PasswordSalt=@PasswordSalt, ModifiedDate=@ModifiedDate
        WHERE UserID=@UserID
      `);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.EmailID,
      subject: "Password Changed - Active Patient",
      html: `<h3>Password Changed Successfully</h3><p>Hello ${user.FirstName},</p><p>Your password was changed successfully.</p>`,
    });

    res.json({ status: "Success", message: "Password updated successfully." });
  } catch (err) {
    console.error("❌ Change Password Error:", err);
    res.status(500).json({ status: "Error", message: "Error changing password." });
  }
});

export default router;
