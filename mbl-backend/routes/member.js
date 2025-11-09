
import express from "express";
import sql from "mssql";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

//
// ✅ Family hierarchy (with safe auto-create)
//
router.get("/hierarchy", verifyToken, async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  console.log("📡 [API Call] /api/member/hierarchy triggered for user:", userId);

  try {
    const pool = await sql.connect(global.dbConfig);

    // === Step 1: Try to find existing FamilyID ===
    const famRes = await pool
      .request()
      .input("UserID", sql.Int, userId)
      .query(`
        SELECT TOP 1 FamilyID
        FROM varahatech.Member
        WHERE (MappedMemberID = @UserID OR MemberID = @UserID)
          AND ISNULL(IsDelete, 0) = 0
        ORDER BY IsPrimaryMem DESC
      `);

    // === Step 2: If not found → safely auto-create ===
    let familyID = famRes.recordset[0]?.FamilyID;

    if (!familyID) {
      console.log("⚙️ No family found, attempting safe auto-create for user:", userId);

      const dupCheck = await pool
        .request()
        .input("MappedMemberID", sql.Int, userId)
        .query(`
          SELECT TOP 1 MemberID FROM varahatech.Member WHERE MappedMemberID=@MappedMemberID
        `);

      if (dupCheck.recordset.length === 0) {
        try {
          familyID = `FAB-${userId}`;
          await pool
            .request()
            .input("MappedMemberID", sql.Int, userId)
            .input("FamilyID", sql.NVarChar(50), familyID)
            .input("FirstName", sql.NVarChar(50), req.user?.username || "Self")
            .input("EmailID", sql.NVarChar(100), req.user?.email || "")
            .query(`
              INSERT INTO varahatech.Member (MappedMemberID, FamilyID, FirstName, EmailID, IsPrimaryMem, IsActive, IsDelete, AddDate)
              SELECT @MappedMemberID, @FamilyID, @FirstName, @EmailID, 1, 1, 0, GETDATE()
              WHERE NOT EXISTS (SELECT 1 FROM varahatech.Member WHERE MappedMemberID=@MappedMemberID)
            `);
          console.log("✅ Auto-created primary member for:", userId);
        } catch (err) {
          console.warn("⚠️ Auto-create skipped:", err.message);
        }
      } else {
        console.warn("⚠️ Member already exists, skipping auto-create");
      }
    } else {
      console.log("🏠 FamilyID resolved:", familyID);
    }

    if (!familyID) return res.status(200).json([]);

    // === Step 3: Fetch all members for this FamilyID ===
    const result = await pool
      .request()
      .input("FamilyID", sql.NVarChar(50), familyID)
      .query(`
        SELECT 
          M.MemberID, M.MappedMemberID, M.FamilyID, M.FirstName, M.LastName,
          M.Gender, M.DOB, M.MobileNo, M.EmailID, M.RelationshipTypeID,
          ISNULL(C.CodeValue, 'Dependent') AS RelationshipName,
          ISNULL(M.IsPrimaryMem, 0) AS IsPrimaryMem,
          M.Address1, M.Address2, M.City, M.State, M.ZipCode,
          M.MemberPhotoBase64, M.HasLogin, M.IsActive
        FROM varahatech.Member AS M
        LEFT JOIN varahatech.Codes AS C 
          ON M.RelationshipTypeID = C.CodeID
         AND C.CodeType = 'Relationship'
         AND C.IsActive = 1 AND C.IsDelete = 0
        WHERE M.FamilyID = @FamilyID AND ISNULL(M.IsDelete, 0) = 0
        ORDER BY M.IsPrimaryMem DESC, M.MemberID ASC;
      `);

    console.log(`✅ Found ${result.recordset.length} family members for FamilyID: ${familyID}`);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching hierarchy:", err);
    res.status(500).json({ error: "Server error while fetching family hierarchy" });
  } finally {
    console.log("🔚 [API Completed] /api/member/hierarchy");
  }
});

//
// ✅ Relationship list
//
router.get("/relationships/list", verifyToken, async (req, res) => {
  console.log("📡 [API Call] /api/member/relationships/list triggered");
  try {
    const pool = await sql.connect(global.dbConfig);
    const result = await pool.request().query(`
      SELECT CodeID AS RelationshipTypeID, CodeValue AS RelationshipName
      FROM varahatech.Codes
      WHERE CodeType = 'Relationship' AND IsActive = 1 AND IsDelete = 0
      ORDER BY CodeID;
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error fetching relationship list:", err);
    res.status(500).json({ error: "Failed to fetch relationship list" });
  } finally {
    console.log("🔚 [API Completed] /api/member/relationships/list");
  }
});

//
// ✅ Add a new member
//
router.post("/add", verifyToken, async (req, res) => {
  console.log("📡 [API Call] /api/member/add triggered");
  const mappedId = req.user?.userId || req.user?.id;

  try {
    const {
      FirstName, LastName, Gender, DOB, MobileNo,
      EmailID, RelationshipTypeID, MemberPhotoBase64,
      Address1, Address2, City, State, ZipCode, HasLogin
    } = req.body;

    const pool = await sql.connect(global.dbConfig);

    const famRes = await pool
      .request()
      .input("MappedMemberID", sql.Int, mappedId)
      .query(`
        SELECT TOP 1 FamilyID 
        FROM varahatech.Member 
        WHERE MappedMemberID = @MappedMemberID AND IsPrimaryMem = 1 AND IsDelete = 0
      `);

    let familyID = famRes.recordset[0]?.FamilyID || `FAB-${mappedId}`;

    if (!famRes.recordset.length) {
      console.log("⚙️ Auto-creating head of family...");
      await pool
        .request()
        .input("MappedMemberID", sql.Int, mappedId)
        .input("FamilyID", sql.NVarChar(50), familyID)
        .input("FirstName", sql.NVarChar(50), req.user?.username || "Self")
        .input("EmailID", sql.NVarChar(100), req.user?.email || "")
        .query(`
          INSERT INTO varahatech.Member (MappedMemberID, FamilyID, FirstName, EmailID, IsPrimaryMem, IsActive, IsDelete, AddDate)
          SELECT @MappedMemberID, @FamilyID, @FirstName, @EmailID, 1, 1, 0, GETDATE()
          WHERE NOT EXISTS (SELECT 1 FROM varahatech.Member WHERE MappedMemberID=@MappedMemberID)
        `);
    }

    await pool
      .request()
      .input("MappedMemberID", sql.Int, mappedId)
      .input("FamilyID", sql.NVarChar(50), familyID)
      .input("FirstName", sql.NVarChar(50), FirstName)
      .input("LastName", sql.NVarChar(50), LastName || '')
      .input("Gender", sql.NVarChar(10), Gender)
      .input("DOB", sql.DateTime2, DOB ? new Date(DOB) : null)
      .input("MobileNo", sql.NVarChar(15), MobileNo || null)
      .input("EmailID", sql.NVarChar(100), EmailID || null)
      .input("RelationshipTypeID", sql.Int, RelationshipTypeID)
      .input("MemberPhotoBase64", sql.NVarChar(sql.MAX), MemberPhotoBase64 || null)
      .input("Address1", sql.NVarChar(100), Address1 || null)
      .input("Address2", sql.NVarChar(100), Address2 || null)
      .input("City", sql.NVarChar(50), City || null)
      .input("State", sql.NVarChar(50), State || null)
      .input("ZipCode", sql.NVarChar(20), ZipCode || null)
      .input("HasLogin", sql.Bit, HasLogin ? 1 : 0)
      .input("IsPrimaryMem", sql.Bit, 0)
      .input("IsActive", sql.Bit, 1)
      .input("IsDelete", sql.Bit, 0)
      .query(`
        INSERT INTO varahatech.Member (
          MappedMemberID, FamilyID, FirstName, LastName, Gender, DOB,
          MobileNo, EmailID, RelationshipTypeID, MemberPhotoBase64, Address1, Address2,
          City, State, ZipCode, HasLogin, IsPrimaryMem, IsActive, IsDelete, AddDate
        )
        VALUES (
          @MappedMemberID, @FamilyID, @FirstName, @LastName, @Gender, @DOB,
          @MobileNo, @EmailID, @RelationshipTypeID, @MemberPhotoBase64, @Address1, @Address2,
          @City, @State, @ZipCode, @HasLogin, @IsPrimaryMem, @IsActive, @IsDelete, GETDATE()
        );
      `);

    console.log(`✅ Added member "${FirstName}" under ${familyID}`);
    res.json({ status: "Success", message: "Member added successfully", FamilyID: familyID });
  } catch (err) {
    console.error("❌ Error adding family member:", err);
    res.status(500).json({ status: "Error", message: err.message || "Failed to add member." });
  } finally {
    console.log("🔚 [API Completed] /api/member/add");
  }
});

//
// ✅ Update member
//
router.put("/update/:memberId", verifyToken, async (req, res) => {
  const { memberId } = req.params;
  console.log("✏️ [API Call] /api/member/update for MemberID:", memberId);

  try {
    const pool = await sql.connect(global.dbConfig);
    const existing = await pool
      .request()
      .input("MemberID", sql.Int, memberId)
      .query(`SELECT TOP 1 * FROM varahatech.Member WHERE MemberID = @MemberID AND IsDelete = 0`);

    if (!existing.recordset.length)
      return res.status(404).json({ status: "Error", message: "Member not found" });

    const old = existing.recordset[0];
    const u = req.body;
    const updated = {
      FirstName: u.FirstName || old.FirstName,
      LastName: u.LastName || old.LastName,
      Gender: u.Gender || old.Gender,
      DOB: u.DOB ? new Date(u.DOB) : old.DOB,
      MobileNo: u.MobileNo || old.MobileNo,
      EmailID: u.EmailID || old.EmailID,
      RelationshipTypeID: u.RelationshipTypeID || old.RelationshipTypeID,
      Address1: u.Address1 || old.Address1,
      Address2: u.Address2 || old.Address2,
      City: u.City || old.City,
      State: u.State || old.State,
      ZipCode: u.ZipCode || old.ZipCode,
      HasLogin: u.HasLogin !== undefined ? u.HasLogin : old.HasLogin,
    };

    await pool
      .request()
      .input("MemberID", sql.Int, memberId)
      .input("FirstName", sql.NVarChar(50), updated.FirstName)
      .input("LastName", sql.NVarChar(50), updated.LastName)
      .input("Gender", sql.NVarChar(10), updated.Gender)
      .input("DOB", sql.DateTime2, updated.DOB)
      .input("MobileNo", sql.NVarChar(15), updated.MobileNo)
      .input("EmailID", sql.NVarChar(100), updated.EmailID)
      .input("RelationshipTypeID", sql.Int, updated.RelationshipTypeID)
      .input("Address1", sql.NVarChar(100), updated.Address1)
      .input("Address2", sql.NVarChar(100), updated.Address2)
      .input("City", sql.NVarChar(50), updated.City)
      .input("State", sql.NVarChar(50), updated.State)
      .input("ZipCode", sql.NVarChar(20), updated.ZipCode)
      .input("HasLogin", sql.Bit, updated.HasLogin)
      .query(`
        UPDATE varahatech.Member
        SET 
          FirstName=@FirstName, LastName=@LastName, Gender=@Gender, DOB=@DOB,
          MobileNo=@MobileNo, EmailID=@EmailID, RelationshipTypeID=@RelationshipTypeID,
          Address1=@Address1, Address2=@Address2, City=@City, State=@State, ZipCode=@ZipCode,
          HasLogin=@HasLogin, ModifiedDate=GETDATE()
        WHERE MemberID=@MemberID
      `);

    console.log(`✅ Member (${updated.FirstName}) updated successfully`);
    res.json({ status: "Success", message: "Member updated successfully" });
  } catch (err) {
    if (err.number === 2601) {
      return res.status(409).json({
        status: "Error",
        message: "Mobile number already linked to another member.",
      });
    }
    console.error("❌ Error updating member:", err);
    res.status(500).json({ status: "Error", message: "Server error updating member" });
  } finally {
    console.log("🔚 [API Completed] /api/member/update");
  }
});

//
// ✅ Soft Delete
//
router.delete("/:memberId", verifyToken, async (req, res) => {
  const { memberId } = req.params;
  console.log("🗑 [API Call] /api/member DELETE for MemberID:", memberId);

  try {
    const pool = await sql.connect(global.dbConfig);
    await pool.request()
      .input("MemberID", sql.Int, memberId)
      .query(`
        UPDATE varahatech.Member 
        SET IsDelete = 1, ModifiedDate = GETDATE(), ModifiedBy = 'System'
        WHERE MemberID = @MemberID
      `);
    res.json({ status: "Success", message: "Member deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting member:", err);
    res.status(500).json({ status: "Error", message: "Server error deleting member" });
  } finally {
    console.log("🔚 [API Completed] /api/member DELETE");
  }
});

export default router;
