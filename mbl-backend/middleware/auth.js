import jwt from "jsonwebtoken";
import sql from "mssql"; // ✅ needed for DB check

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  try {
    // 🔍 Decode and verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Preserve original mappings
    req.user = {
      userId: decoded.userId || decoded.UserID || decoded.id,
      email: decoded.email,
      username: decoded.username || decoded.name,
    };

    // ✅ Add fallback for older routes
    req.user.id = req.user.userId;

    // 🧾 Debug log
    console.log("🔐 JWT verified for:", {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    });

    if (!req.user.userId) {
      console.warn("⚠️ Token decoded but userId not found in payload:", decoded);
    }

    // ===============================================================
    // 🧩 AUTO-ENSURE "SELF" MEMBER EXISTS
    // ===============================================================
    try {
      const pool = await sql.connect(global.dbConfig);
      const checkQuery = `
        SELECT TOP 1 MemberID 
        FROM dbo.Member 
        WHERE IsMemberLinkID = @userId AND IsActive = 1 AND IsDelete = 0
      `;
      const result = await pool.request().input("userId", sql.Int, req.user.id).query(checkQuery);

      if (result.recordset.length === 0) {
        console.log(`⚙️ No member record found for user ${req.user.id}. Auto-creating...`);

        try {
          // Try to call stored procedure if available
          await pool.request()
            .input("UserID", sql.Int, req.user.id)
            .input("FirstName", sql.NVarChar(50), req.user.username || "Unknown")
            .input("LastName", sql.NVarChar(50), "")
            .input("EmailID", sql.NVarChar(100), req.user.email || "")
            .input("MobileNo", sql.NVarChar(15), "")
            .execute("sp_AddSelfMemberForUser");

          console.log(`👤 Auto-created 'Self' member for UserID ${req.user.id}`);
        } catch (procErr) {
          console.warn("⚠️ Stored procedure not found. Creating inline member instead.");
          const inlineInsert = `
            INSERT INTO dbo.Member
            (
              MappedMemberID, FamilyID, FirstName, LastName, Gender, DOB,
              MobileNo, EmailID, IsPrimaryMem, HasLogin, IsMemberLinkID,
              AddDate, IsActive, IsDelete
            )
            VALUES
            (
              1,
              CONCAT('FAM-', @userId),
              @firstName,
              @lastName,
              NULL,
              GETDATE(),
              @mobile,
              @email,
              1,
              1,
              @userId,
              SYSDATETIME(),
              1,
              0
            );
          `;
          await pool.request()
            .input("userId", sql.Int, req.user.id)
            .input("firstName", sql.NVarChar(50), req.user.username || "Unknown")
            .input("lastName", sql.NVarChar(50), "")
            .input("email", sql.NVarChar(100), req.user.email || "")
            .input("mobile", sql.NVarChar(15), "")
            .query(inlineInsert);

          console.log(`✅ Inline 'Self' member created for user ${req.user.id}`);
        }
      }
    } catch (memberCheckErr) {
      console.error("⚠️ Member auto-create check failed:", memberCheckErr.message);
    }

    // Continue to next middleware or route
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
