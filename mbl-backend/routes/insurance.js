// // routes/insurance.js
// import express from "express";
// import sql from "mssql";
// import { verifyToken } from "../middleware/auth.js";

// const router = express.Router();

// // Helper for image short URLs
// const shortUrl = (filename) => (filename ? `/u/ins/${filename}` : "");

// /**
//  * ✅ GetPolicyType
//  */
// router.get("/GetPolicyType", async (_req, res) => {
//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const result = await pool.request().query(`
//       SELECT CodeID AS id, CodeValue AS [type]
//       FROM varahatech.Codes
//       WHERE CodeType = 'PolicyType' AND IsActive = 1 AND IsDelete = 0
//       ORDER BY CodeID
//     `);
//     return res.json(result.recordset);
//   } catch (e) {
//     console.error("GetPolicyType error", e);
//     return res.status(500).json([]);
//   }
// });

// /**
//  * ✅ GetBenifitType
//  */
// router.get("/GetBenifitType", async (_req, res) => {
//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const result = await pool.request().query(`
//       SELECT CodeID AS id, CodeValue AS [type]
//       FROM varahatech.Codes
//       WHERE CodeType = 'BenefitType' AND IsActive = 1 AND IsDelete = 0
//       ORDER BY CodeID
//     `);
//     return res.json(result.recordset);
//   } catch (e) {
//     console.error("GetBenifitType error", e);
//     return res.status(500).json([]);
//   }
// });

// // ✅ Get all family dependents for Add Insurance
// router.get("/GetFamilyDepedent", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user?.userId || req.user?.id;
//     if (!userId) return res.status(401).json({ error: "Unauthorized" });

//     const pool = await sql.connect(global.dbConfig);

//     // 1️⃣ Get the FamilyID linked to this user
//     const famRes = await pool
//       .request()
//       .input("UserID", sql.Int, userId)
//       .query(`
//         SELECT TOP 1 FamilyID
//         FROM varahatech.Member
//         WHERE (MappedMemberID = @UserID OR MemberID = @UserID)
//           AND ISNULL(IsDelete, 0) = 0
//         ORDER BY IsPrimaryMem DESC
//       `);

//     if (!famRes.recordset.length)
//       return res.json([]);

//     const familyID = famRes.recordset[0].FamilyID;

//     // 2️⃣ Fetch all active family members under this FamilyID
//     const { recordset } = await pool
//       .request()
//       .input("FamilyID", sql.NVarChar(50), familyID)
//       .query(`
//         SELECT 
//           M.MemberID AS memberID,
//           M.FirstName AS firstName,
//           ISNULL(C.CodeValue, 'Dependent') AS relationshipType
//         FROM varahatech.Member M
//         LEFT JOIN varahatech.Codes C 
//           ON M.RelationshipTypeID = C.CodeID
//          AND C.CodeType = 'Relationship'
//          AND C.IsActive = 1
//          AND C.IsDelete = 0
//         WHERE M.FamilyID = @FamilyID
//           AND ISNULL(M.IsDelete, 0) = 0
//         ORDER BY M.IsPrimaryMem DESC, M.MemberID ASC;
//       `);

//     console.log(`✅ [GetFamilyDepedent] Found ${recordset.length} members in family ${familyID}`);
//     res.json(recordset);
//   } catch (e) {
//     console.error("❌ GetFamilyDepedent error", e);
//     res.status(500).json([]);
//   }
// });



// /**
//  * ✅ SaveInsuranceAsync (Base64 Version)
//  * Now supports direct Base64 image uploads from mobile app
//  */
// /**
//  * ✅ SaveInsuranceAsync (Improved Base64 Version)
//  * Handles missing images gracefully and avoids NULL insert errors
//  */
// router.post("/SaveInsuranceAsync", verifyToken, async (req, res) => {
//   const b = req.body;
//   let transaction;

//   console.log("🚀 [API] SaveInsuranceAsync called with body:", b);

//   try {
//     const pool = await sql.connect(global.dbConfig);
//     transaction = new sql.Transaction(pool);
//     await transaction.begin();
//     console.log("✅ SQL transaction started");

//     // === Extract & validate inputs ===
//     const MemberID = parseInt(b.MemberID || "0", 10);
//     const BenefitTypeID = parseInt(b.BenefitTypeID || "0", 10);
//     const PolicyTypeID = parseInt(b.PolicyTypeID || "0", 10);
//     const SubscriberID = parseInt(b.SubscriberID || "0", 10);
//     const DependentsID = (b.DependentsID || "").trim();
//     const now = new Date();

//     const AddedBy = req.user?.name || String(req.user?.id || "system");
//     const ModifiedBy = AddedBy;

//     const PayerName = b.PayerName || "Unknown";
//     const PolicyID = b.PolicyID || `POL-${Date.now()}`;
//     const IsActive = 1;
//     const IsDelete = 0;

//     let InsFrontImgBase64 = b.InsFrontImgBase64?.trim() || "";
//     let InsBackImgBase64 = b.InsBackImgBase64?.trim() || "";

//     // === Validate required fields ===
//     if (!MemberID || !BenefitTypeID || !PolicyTypeID || !SubscriberID) {
//       console.log("❌ Missing required fields");
//       return res.status(400).json({
//         status: "Error",
//         message:
//           "Missing required fields: MemberID, BenefitTypeID, PolicyTypeID, SubscriberID",
//       });
//     }

//     if (!InsFrontImgBase64 || !InsBackImgBase64) {
//       console.log("⚠️ One or both insurance images missing");
//       return res.status(400).json({
//         status: "Error",
//         message: "Both front and back insurance card images are required.",
//       });
//     }

//     // === Step 1️⃣: Insert into InsuranceQuestionnaire ===
//     console.log("🧾 Inserting into InsuranceQuestionnaire...");
//     const request1 = new sql.Request(transaction);
//     request1
//       .input("PaymentMethodId", sql.Int, parseInt(b.PaymentMethodId || "0"))
//       .input("OtherPaymentMethod", sql.NVarChar(50), b.OtherPaymentMethod || "")
//       .input("CoverangeTypeIds", sql.NVarChar(sql.MAX), b.CoverageTypeIds || "")
//       .input(
//         "IsAssistanceRequired",
//         sql.Bit,
//         b.IsAssistanceRequired === "1" ? 1 : 0
//       )
//       .input("AddDate", sql.DateTime2, now)
//       .input("ModifiedDate", sql.DateTime2, now)
//       .input("AddedBy", sql.NVarChar(sql.MAX), AddedBy)
//       .input("ModifiedBy", sql.NVarChar(sql.MAX), ModifiedBy)
//       .input("IsActive", sql.Bit, IsActive)
//       .input("IsDelete", sql.Bit, IsDelete);

//     const q1 = `
//       INSERT INTO varahatech.InsuranceQuestionnaire
//       (PaymentMethodId, OtherPaymentMethod, CoverangeTypeIds, IsAssistanceRequired,
//        AddDate, ModifiedDate, AddedBy, ModifiedBy, IsActive, IsDelete)
//       OUTPUT INSERTED.QuestionnaireId
//       VALUES
//       (@PaymentMethodId, @OtherPaymentMethod, @CoverangeTypeIds, @IsAssistanceRequired,
//        @AddDate, @ModifiedDate, @AddedBy, @ModifiedBy, @IsActive, @IsDelete)
//     `;

//     const result1 = await request1.query(q1);
//     const questionnaireId = result1.recordset?.[0]?.QuestionnaireId;

//     if (!questionnaireId) {
//       console.log("❌ Failed to insert InsuranceQuestionnaire");
//       await transaction.rollback();
//       console.log("🔁 Transaction rolled back (failed at questionnaire)");
//       return res.status(500).json({
//         status: "Error",
//         message: "Failed to insert InsuranceQuestionnaire.",
//       });
//     }
//     console.log("✅ InsuranceQuestionnaire inserted:", questionnaireId);

//     // === Step 2️⃣: Insert into MemberInsurance ===
//     console.log("💾 Inserting into MemberInsurance...");
//     const request2 = new sql.Request(transaction);
//     request2
//       .input("MemberID", sql.Int, MemberID)
//       .input("InsFrontImgBase64", sql.NVarChar(sql.MAX), InsFrontImgBase64)
//       .input("InsBackImgBase64", sql.NVarChar(sql.MAX), InsBackImgBase64)
//       .input("InsFrontImgURL", sql.NVarChar(255), "")
//       .input("InsBackImgURL", sql.NVarChar(255), "")
//       .input("BenefitTypeID", sql.Int, BenefitTypeID)
//       .input("PolicyTypeID", sql.Int, PolicyTypeID)
//       .input("SubscriberID", sql.Int, SubscriberID)
//       .input("DependentsID", sql.NVarChar(sql.MAX), DependentsID)
//       .input("PayerName", sql.NVarChar(100), PayerName)
//       .input("PolicyID", sql.NVarChar(100), PolicyID)
//       .input("QuestionnaireId", sql.Int, questionnaireId)
//       .input("AddDate", sql.DateTime2, now)
//       .input("ModifiedDate", sql.DateTime2, now)
//       .input("AddedBy", sql.NVarChar(sql.MAX), AddedBy)
//       .input("ModifiedBy", sql.NVarChar(sql.MAX), ModifiedBy)
//       .input("IsActive", sql.Bit, IsActive)
//       .input("IsDelete", sql.Bit, IsDelete);

//     const q2 = `
//       INSERT INTO varahatech.MemberInsurance
//       (MemberID, InsFrontImgBase64, InsBackImgBase64, InsFrontImgURL, InsBackImgURL,
//        BenefitTypeID, PolicyTypeID, SubscriberID, DependentsID, PayerName, PolicyID,
//        QuestionnaireId, AddDate, ModifiedDate, AddedBy, ModifiedBy, IsActive, IsDelete)
//       OUTPUT INSERTED.MemInsID
//       VALUES
//       (@MemberID, @InsFrontImgBase64, @InsBackImgBase64, @InsFrontImgURL, @InsBackImgURL,
//        @BenefitTypeID, @PolicyTypeID, @SubscriberID, @DependentsID, @PayerName, @PolicyID,
//        @QuestionnaireId, @AddDate, @ModifiedDate, @AddedBy, @ModifiedBy, @IsActive, @IsDelete)
//     `;

//     const result2 = await request2.query(q2);
//     const memInsId = result2.recordset?.[0]?.MemInsID;

//     if (!memInsId) {
//       console.log("❌ Failed to insert MemberInsurance");
//       await transaction.rollback();
//       console.log("🔁 Transaction rolled back (failed at insurance)");
//       return res.status(500).json({
//         status: "Error",
//         message: "Failed to insert MemberInsurance.",
//       });
//     }

//     console.log("✅ MemberInsurance inserted:", memInsId);

//     // === Step 3️⃣: Commit transaction ===
//     await transaction.commit();
//     console.log("🎉 Transaction committed successfully");

//     // === Success Response ===
//     res.json({
//       status: "Success",
//       message: "Insurance and Questionnaire saved successfully.",
//       MemInsID: memInsId,
//       QuestionnaireId: questionnaireId,
//     });
//   } catch (e) {
//     console.error("❌ SaveInsuranceAsync error:", e);
//     if (transaction) {
//       await transaction.rollback();
//       console.log("🔁 Transaction rolled back (exception)");
//     }
//     res.status(500).json({
//       status: "Error",
//       message: e.message || "Transaction failed while saving insurance.",
//     });
//   }
// });



// // 🔎 Get insurance list for a member (query)
// router.get("/GetMemberInsuranceList", async (req, res) => {
//   const memberId = parseInt(req.query.memberId || "0", 10);
//   if (!memberId)
//     return res
//       .status(400)
//       .json({ status: "Error", message: "memberId required" });
//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const q = `
//       SELECT TOP 20
//         mi.MemInsID,
//         mi.MemberID,
//         mi.SubscriberID,
//         mi.BenefitTypeID,
//         mi.PolicyTypeID,
//         mi.DependentsID,
//         mi.PayerName,
//         mi.PolicyID,
//         mi.InsFrontImgURL,
//         mi.InsBackImgURL,
//         mi.AddDate,
//         mi.ModifiedDate
//       FROM varahatech.MemberInsurance mi
//       WHERE mi.MemberID = @memberId AND mi.IsDelete = 0
//       ORDER BY mi.MemInsID DESC
//     `;
//     const r = await pool.request().input("memberId", sql.Int, memberId).query(q);
//     res.json({ status: "Success", data: r.recordset });
//   } catch (e) {
//     console.error("GetMemberInsuranceList error", e);
//     res.status(500).json({ status: "Error", message: "Server error" });
//   }
// });

// // 🔎 Get single insurance by MemInsID
// router.get("/GetMemberInsuranceById", async (req, res) => {
//   const id = parseInt(req.query.id || "0", 10);
//   if (!id)
//     return res.status(400).json({ status: "Error", message: "id required" });
//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const q = `
//       SELECT
//         mi.MemInsID,
//         mi.MemberID,
//         mi.SubscriberID,
//         mi.BenefitTypeID,
//         mi.PolicyTypeID,
//         mi.DependentsID,
//         mi.PayerName,
//         mi.PolicyID,
//         mi.InsFrontImgURL,
//         mi.InsBackImgURL,
//         mi.QuestionnaireId,
//         mi.AddDate,
//         mi.ModifiedDate
//       FROM varahatech.MemberInsurance mi
//       WHERE mi.MemInsID = @id
//     `;
//     const r = await pool.request().input("id", sql.Int, id).query(q);
//     if (!r.recordset.length) return res.json({ status: "NotFound" });
//     res.json({ status: "Success", data: r.recordset[0] });
//   } catch (e) {
//     console.error("GetMemberInsuranceById error", e);
//     res.status(500).json({ status: "Error", message: "Server error" });
//   }
// });

// /**
//  * ✅ New: GET /api/insurance/:memberId
//  * Used by fetchMemberInsurance() in the app
//  */
// router.get("/:memberId", async (req, res) => {
//   const memberId = parseInt(req.params.memberId || "0", 10);
//   if (!memberId)
//     return res.status(400).json({ status: "Error", message: "Invalid memberId" });

//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const q = `
//       SELECT
//         mi.MemInsID,
//         mi.MemberID,
//         mi.SubscriberID,
//         mi.BenefitTypeID,
//         mi.PolicyTypeID,
//         mi.DependentsID,
//         mi.PayerName,
//         mi.PolicyID,
//         mi.InsFrontImgURL,
//         mi.InsBackImgURL,
//         mi.AddDate,
//         mi.ModifiedDate
//       FROM varahatech.MemberInsurance mi
//       WHERE mi.MemberID = @memberId AND mi.IsDelete = 0
//       ORDER BY mi.MemInsID DESC
//     `;
//     const r = await pool.request().input("memberId", sql.Int, memberId).query(q);
//     res.json({ status: "Success", data: r.recordset });
//   } catch (e) {
//     console.error("❌ /api/insurance/:memberId error:", e);
//     res.status(500).json({ status: "Error", message: "Server error" });
//   }
// });

// /**
//  * ✅ New: DELETE /api/insurance/:id
//  * Used by deleteMemberInsurance() in the app
//  */
// router.delete("/:id", async (req, res) => {
//   const id = parseInt(req.params.id || "0", 10);
//   if (!id)
//     return res.status(400).json({ status: "Error", message: "Invalid insurance id" });

//   try {
//     const pool = await sql.connect(global.dbConfig);
//     const q = `
//       UPDATE varahatech.MemberInsurance
//       SET IsDelete = 1, ModifiedDate = GETDATE()
//       WHERE MemInsID = @id
//     `;
//     await pool.request().input("id", sql.Int, id).query(q);
//     res.json({ status: "Success", message: "Insurance record deleted successfully" });
//   } catch (e) {
//     console.error("❌ DELETE /api/insurance/:id error:", e);
//     res.status(500).json({ status: "Error", message: "Server error" });
//   }
// });


// /**
//  * ✅ Save Insurance Questionnaire
//  * Inserts a new record into varahatech.InsuranceQuestionnaire
//  */
// router.post("/questionnaire", async (req, res) => {
//   try {
//     const {
//       PaymentMethodId,
//       OtherPaymentMethod,
//       CoverageTypeIds,
//       IsAssistanceRequired,
//       AddedBy,
//     } = req.body;

//     if (!PaymentMethodId) {
//       return res
//         .status(400)
//         .json({ status: "Error", message: "PaymentMethodId is required" });
//     }

//     const pool = await sql.connect(global.dbConfig);

//     await pool
//       .request()
//       .input("PaymentMethodId", sql.Int, PaymentMethodId)
//       .input("OtherPaymentMethod", sql.NVarChar(50), OtherPaymentMethod || "")
//       .input("CoverangeTypeIds", sql.NVarChar(sql.MAX), CoverageTypeIds || "")
//       .input(
//         "IsAssistanceRequired",
//         sql.Bit,
//         IsAssistanceRequired === "1" ? 1 : 0
//       )
//       .input("AddDate", sql.DateTime2, new Date())
//       .input("ModifiedDate", sql.DateTime2, new Date())
//       .input("AddedBy", sql.NVarChar(sql.MAX), AddedBy || "MobileAppUser")
//       .input("ModifiedBy", sql.NVarChar(sql.MAX), AddedBy || "MobileAppUser")
//       .input("IsActive", sql.Bit, 1)
//       .input("IsDelete", sql.Bit, 0)
//       .query(`
//         INSERT INTO varahatech.InsuranceQuestionnaire
//         (PaymentMethodId, OtherPaymentMethod, CoverangeTypeIds, IsAssistanceRequired,
//          AddDate, ModifiedDate, AddedBy, ModifiedBy, IsActive, IsDelete)
//         VALUES
//         (@PaymentMethodId, @OtherPaymentMethod, @CoverangeTypeIds, @IsAssistanceRequired,
//          @AddDate, @ModifiedDate, @AddedBy, @ModifiedBy, @IsActive, @IsDelete)
//       `);

//     res.json({
//       status: "Success",
//       message: "Questionnaire saved successfully",
//     });
//   } catch (err) {
//     console.error("❌ Questionnaire Save Error:", err);
//     res.status(500).json({
//       status: "Error",
//       message: "Failed to save questionnaire",
//       error: err.message,
//     });
//   }
// });
// // ==========================================================
// // ✅ Fetch Member Insurance (Joined Data for Mobile Display)
// // ==========================================================



// // router.get("/fetchMemberInsurance/:familyId", verifyToken, async (req, res) => {
// //   const { familyId } = req.params;  // Accept familyId as a parameter from the request
// //   console.log("📡 [API] Fetching insurance for FamilyID:", familyId);  // Log the familyId for debugging

// //   try {
// //     // Connect to the SQL Server database
// //     const pool = await sql.connect(global.dbConfig);

// //     // Define the SQL query to fetch the insurance records
// //     const q = `
// //       SELECT 
// //         mi.MemInsID,  -- Insurance record ID
// //         mi.MemberID,  -- Member ID
// //         mi.InsFrontImgURL,  -- Front image URL
// //         mi.InsBackImgURL,   -- Back image URL
// //         mi.BenefitTypeID,   -- Benefit type ID
// //         mi.PolicyTypeID,    -- Policy type ID
// //         mi.PayerName,       -- Payer name
// //         mi.PolicyID,        -- Policy ID
// //         mi.IsActive,        -- Active status
// //         mi.AddDate,         -- Date added
// //         mi.ModifiedDate,    -- Last modified date
// //         mi.SubscriberID,    -- Subscriber ID
// //         -- Concatenate FirstName and LastName to create FullName
// //         s.FirstName + ' ' + s.LastName AS SubscriberName, 
// //         mi.DependentsID,    -- Dependents IDs
// //         CASE 
// //           WHEN mi.InsFrontImgURL IS NOT NULL AND mi.InsFrontImgURL <> '' THEN mi.InsFrontImgURL
// //           WHEN mi.InsFrontImgBase64 IS NOT NULL AND mi.InsFrontImgBase64 <> '' THEN 'data:image/jpeg;base64,' + mi.InsFrontImgBase64
// //           ELSE NULL 
// //         END AS InsFrontImgURL,  -- Use base64 if image URL is not available
// //         CASE 
// //           WHEN mi.InsBackImgURL IS NOT NULL AND mi.InsBackImgURL <> '' THEN mi.InsBackImgURL
// //           WHEN mi.InsBackImgBase64 IS NOT NULL AND mi.InsBackImgBase64 <> '' THEN 'data:image/jpeg;base64,' + mi.InsBackImgBase64
// //           ELSE NULL 
// //         END AS InsBackImgURL   -- Use base64 if image URL is not available
// //       FROM varahatech.MemberInsurance mi
// //       LEFT JOIN varahatech.Member s ON mi.SubscriberID = s.MemberID  -- Join to get Subscriber's full name
// //       WHERE s.FamilyID = @FamilyID AND mi.IsDelete = 0  -- Fetch records based on familyId and active status
// //       ORDER BY mi.MemInsID DESC  -- Order by insurance record ID in descending order
// //     `;
    
// //     // Execute the query with familyId as the parameter
// //     const result = await pool
// //       .request()
// //       .input("FamilyID", sql.NVarChar(50), familyId)  // Pass the familyId parameter
// //       .query(q);

// //     // Log the number of records found for debugging
// //     console.log("✅ Insurance records found:", result.recordset.length);

// //     // Send the fetched data as a response
// //     res.json(result.recordset);
// //   } catch (err) {
// //     // Log the error and send a 500 response if something goes wrong
// //     console.error("❌ Error fetching insurance:", err);
// //     res.status(500).json({ status: "Error", message: err.message });
// //   }
// // });

// // In routes/insurance.js

// // Fetch Member Insurance by familyId
// router.get("/fetchMemberInsurance/:familyId", verifyToken, async (req, res) => {
//   const { familyId } = req.params;  // Retrieve familyId from the route parameters
//   console.log("📡 [API] Fetching insurance for FamilyID:", familyId);  // Log the FamilyID for tracking

//   try {
//     const pool = await sql.connect(global.dbConfig);

//     // Step 1: Query to fetch members based on FamilyID
//     const memberQuery = `
//       SELECT MemberID
//       FROM varahatech.Member
//       WHERE FamilyID = @FamilyID AND IsDelete = 0  -- Check for active members
//     `;

//     const memberResult = await pool
//       .request()
//       .input("FamilyID", sql.NVarChar(50), familyId)
//       .query(memberQuery);

//     // Extract the Member IDs from the result set
//     const memberIds = memberResult.recordset.map(member => member.MemberID);

//     // Log the found member IDs to track what was fetched
//     if (memberIds.length > 0) {
//       console.log("👥 Found member IDs for FamilyID:", memberIds);
//     } else {
//       console.log("❌ No members found for FamilyID:", familyId);
//     }

//     // If no members were found, return an empty array
//     if (memberIds.length === 0) {
//       return res.json([]);
//     }

//     // Step 2: Query to fetch insurance records for each member
//     const insuranceQuery = `
//       SELECT 
//         mi.MemInsID,
//         mi.MemberID,
//         mi.InsFrontImgURL,
//         mi.InsBackImgURL,
//         mi.BenefitTypeID,
//         mi.PolicyTypeID,
//         mi.PayerName,
//         mi.PolicyID,
//         mi.IsActive,
//         mi.AddDate,
//         mi.ModifiedDate,
//         mi.SubscriberID,
//         s.FirstName + ' ' + s.LastName AS SubscriberName
//       FROM varahatech.MemberInsurance mi
//       LEFT JOIN varahatech.Member s ON mi.SubscriberID = s.MemberID
//       WHERE mi.MemberID IN (@MemberIDs) AND mi.IsDelete = 0  -- Use the member IDs to fetch insurance data
//       ORDER BY mi.MemInsID DESC
//     `;

//     const result = await pool
//       .request()
//       .input("MemberIDs", sql.Int, memberIds)  // Pass the list of MemberIDs
//       .query(insuranceQuery);

//     // Log the number of insurance records fetched
//     console.log("✅ Insurance records found:", result.recordset.length);

//     // Log the insurance records for debugging (optional)
//     console.log("🔍 Insurance records:", result.recordset);

//     // Send back the insurance records for each member
//     res.json(result.recordset);  

//   } catch (err) {
//     console.error("❌ Error fetching insurance:", err);
//     res.status(500).json({ status: "Error", message: err.message });
//   }
// });

// export default router;


import express from "express";
import sql from "mssql";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Helper for image short URLs
const shortUrl = (filename) => (filename ? `/u/ins/${filename}` : "");

/**
 * ✅ GetPolicyType
 */
router.get("/GetPolicyType", async (_req, res) => {
  try {
    const pool = await sql.connect(global.dbConfig);
    const result = await pool.request().query(`
      SELECT CodeID AS id, CodeValue AS [type]
      FROM varahatech.Codes
      WHERE CodeType = 'PolicyType' AND IsActive = 1 AND IsDelete = 0
      ORDER BY CodeID
    `);
    return res.json(result.recordset);
  } catch (e) {
    console.error("GetPolicyType error", e);
    return res.status(500).json([]);
  }
});

/**
 * ✅ GetBenefitType
 */
router.get("/GetBenefitType", async (_req, res) => {
  try {
    const pool = await sql.connect(global.dbConfig);
    const result = await pool.request().query(`
      SELECT CodeID AS id, CodeValue AS [type]
      FROM varahatech.Codes
      WHERE CodeType = 'BenefitType' AND IsActive = 1 AND IsDelete = 0
      ORDER BY CodeID
    `);
    return res.json(result.recordset);
  } catch (e) {
    console.error("GetBenefitType error", e);
    return res.status(500).json([]);
  }
});

// ✅ Get all family dependents for Add Insurance
router.get("/GetFamilyDepedent", verifyToken, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const pool = await sql.connect(global.dbConfig);

    // 1️⃣ Get the FamilyID linked to this user
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

    if (!famRes.recordset.length)
      return res.json([]);

    const familyID = famRes.recordset[0].FamilyID;

    // 2️⃣ Fetch all active family members under this FamilyID
    const { recordset } = await pool
      .request()
      .input("FamilyID", sql.NVarChar(50), familyID)
      .query(`
        SELECT 
          M.MemberID AS memberID,
          M.FirstName AS firstName,
          ISNULL(C.CodeValue, 'Dependent') AS relationshipType
        FROM varahatech.Member M
        LEFT JOIN varahatech.Codes C 
          ON M.RelationshipTypeID = C.CodeID
         AND C.CodeType = 'Relationship'
         AND C.IsActive = 1
         AND C.IsDelete = 0
        WHERE M.FamilyID = @FamilyID
          AND ISNULL(M.IsDelete, 0) = 0
        ORDER BY M.IsPrimaryMem DESC, M.MemberID ASC;
      `);

    console.log(`✅ [GetFamilyDepedent] Found ${recordset.length} members in family ${familyID}`);
    res.json(recordset);
  } catch (e) {
    console.error("❌ GetFamilyDepedent error", e);
    res.status(500).json([]);
  }
});

/**
 * ✅ SaveInsuranceAsync (Base64 Version)
 * Now supports direct Base64 image uploads from mobile app
 */
router.post("/SaveInsuranceAsync", verifyToken, async (req, res) => {
  const b = req.body;
  let transaction;

  console.log("🚀 [API] SaveInsuranceAsync called with body:", b);

  try {
    const pool = await sql.connect(global.dbConfig);
    transaction = new sql.Transaction(pool);
    await transaction.begin();
    console.log("✅ SQL transaction started");

    // === Extract & validate inputs ===
    const MemberID = parseInt(b.MemberID || "0", 10);
    const BenefitTypeID = parseInt(b.BenefitTypeID || "0", 10);
    const PolicyTypeID = parseInt(b.PolicyTypeID || "0", 10);
    const SubscriberID = parseInt(b.SubscriberID || "0", 10);
    const DependentsID = (b.DependentsID || "").trim();
    const now = new Date();

    const AddedBy = req.user?.name || String(req.user?.id || "system");
    const ModifiedBy = AddedBy;

    const PayerName = b.PayerName || "Unknown";
    const PolicyID = b.PolicyID || `POL-${Date.now()}`;
    const IsActive = 1;
    const IsDelete = 0;

    let InsFrontImgBase64 = b.InsFrontImgBase64?.trim() || "";
    let InsBackImgBase64 = b.InsBackImgBase64?.trim() || "";

    // === Validate required fields ===
    if (!MemberID || !BenefitTypeID || !PolicyTypeID || !SubscriberID) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        status: "Error",
        message:
          "Missing required fields: MemberID, BenefitTypeID, PolicyTypeID, SubscriberID",
      });
    }

    if (!InsFrontImgBase64 || !InsBackImgBase64) {
      console.log("⚠️ One or both insurance images missing");
      return res.status(400).json({
        status: "Error",
        message: "Both front and back insurance card images are required.",
      });
    }

    // === Step 1️⃣: Insert into InsuranceQuestionnaire ===
    console.log("🧾 Inserting into InsuranceQuestionnaire...");
    const request1 = new sql.Request(transaction);
    request1
      .input("PaymentMethodId", sql.Int, parseInt(b.PaymentMethodId || "0"))
      .input("OtherPaymentMethod", sql.NVarChar(50), b.OtherPaymentMethod || "")
      .input("CoverangeTypeIds", sql.NVarChar(sql.MAX), b.CoverageTypeIds || "")
      .input(
        "IsAssistanceRequired",
        sql.Bit,
        b.IsAssistanceRequired === "1" ? 1 : 0
      )
      .input("AddDate", sql.DateTime2, now)
      .input("ModifiedDate", sql.DateTime2, now)
      .input("AddedBy", sql.NVarChar(sql.MAX), AddedBy)
      .input("ModifiedBy", sql.NVarChar(sql.MAX), ModifiedBy)
      .input("IsActive", sql.Bit, IsActive)
      .input("IsDelete", sql.Bit, IsDelete);

    const q1 = `
      INSERT INTO varahatech.InsuranceQuestionnaire
      (PaymentMethodId, OtherPaymentMethod, CoverangeTypeIds, IsAssistanceRequired,
       AddDate, ModifiedDate, AddedBy, ModifiedBy, IsActive, IsDelete)
      OUTPUT INSERTED.QuestionnaireId
      VALUES
      (@PaymentMethodId, @OtherPaymentMethod, @CoverangeTypeIds, @IsAssistanceRequired,
       @AddDate, @ModifiedDate, @AddedBy, @ModifiedBy, @IsActive, @IsDelete)
    `;

    const result1 = await request1.query(q1);
    const questionnaireId = result1.recordset?.[0]?.QuestionnaireId;

    if (!questionnaireId) {
      console.log("❌ Failed to insert InsuranceQuestionnaire");
      await transaction.rollback();
      console.log("🔁 Transaction rolled back (failed at questionnaire)");
      return res.status(500).json({
        status: "Error",
        message: "Failed to insert InsuranceQuestionnaire.",
      });
    }
    console.log("✅ InsuranceQuestionnaire inserted:", questionnaireId);

    // === Step 2️⃣: Insert into MemberInsurance ===
    console.log("💾 Inserting into MemberInsurance...");
    const request2 = new sql.Request(transaction);
    request2
      .input("MemberID", sql.Int, MemberID)
      .input("InsFrontImgBase64", sql.NVarChar(sql.MAX), InsFrontImgBase64)
      .input("InsBackImgBase64", sql.NVarChar(sql.MAX), InsBackImgBase64)
      .input("InsFrontImgURL", sql.NVarChar(255), "")
      .input("InsBackImgURL", sql.NVarChar(255), "")
      .input("BenefitTypeID", sql.Int, BenefitTypeID)
      .input("PolicyTypeID", sql.Int, PolicyTypeID)
      .input("SubscriberID", sql.Int, SubscriberID)
      .input("DependentsID", sql.NVarChar(sql.MAX), DependentsID)
      .input("PayerName", sql.NVarChar(100), PayerName)
      .input("PolicyID", sql.NVarChar(100), PolicyID)
      .input("QuestionnaireId", sql.Int, questionnaireId)
      .input("AddDate", sql.DateTime2, now)
      .input("ModifiedDate", sql.DateTime2, now)
      .input("AddedBy", sql.NVarChar(sql.MAX), AddedBy)
      .input("ModifiedBy", sql.NVarChar(sql.MAX), ModifiedBy)
      .input("IsActive", sql.Bit, IsActive)
      .input("IsDelete", sql.Bit, IsDelete);

    const q2 = `
      INSERT INTO varahatech.MemberInsurance
      (MemberID, InsFrontImgBase64, InsBackImgBase64, InsFrontImgURL, InsBackImgURL,
       BenefitTypeID, PolicyTypeID, SubscriberID, DependentsID, PayerName, PolicyID,
       QuestionnaireId, AddDate, ModifiedDate, AddedBy, ModifiedBy, IsActive, IsDelete)
      OUTPUT INSERTED.MemInsID
      VALUES
      (@MemberID, @InsFrontImgBase64, @InsBackImgBase64, @InsFrontImgURL, @InsBackImgURL,
       @BenefitTypeID, @PolicyTypeID, @SubscriberID, @DependentsID, @PayerName, @PolicyID,
       @QuestionnaireId, @AddDate, @ModifiedDate, @AddedBy, @ModifiedBy, @IsActive, @IsDelete)
    `;

    const result2 = await request2.query(q2);
    const memInsId = result2.recordset?.[0]?.MemInsID;

    if (!memInsId) {
      console.log("❌ Failed to insert MemberInsurance");
      await transaction.rollback();
      console.log("🔁 Transaction rolled back (failed at insurance)");
      return res.status(500).json({
        status: "Error",
        message: "Failed to insert MemberInsurance.",
      });
    }

    console.log("✅ MemberInsurance inserted:", memInsId);

    // === Step 3️⃣: Commit transaction ===
    await transaction.commit();
    console.log("🎉 Transaction committed successfully");

    // === Success Response ===
    res.json({
      status: "Success",
      message: "Insurance and Questionnaire saved successfully.",
      MemInsID: memInsId,
      QuestionnaireId: questionnaireId,
    });
  } catch (e) {
    console.error("❌ SaveInsuranceAsync error:", e);
    if (transaction) {
      await transaction.rollback();
      console.log("🔁 Transaction rolled back (exception)");
    }
    res.status(500).json({
      status: "Error",
      message: e.message || "Transaction failed while saving insurance.",
    });
  }
});

// Fetch Member Insurance by familyId
router.get("/fetchMemberInsurance/:familyId", verifyToken, async (req, res) => {
  const { familyId } = req.params;  // Retrieve familyId from the route parameters
  console.log("📡 [API] Fetching insurance for FamilyID:", familyId);  // Log the FamilyID for tracking

  try {
    const pool = await sql.connect(global.dbConfig);

    // Step 1: Query to fetch members based on FamilyID
    const memberQuery = `
      SELECT MemberID
      FROM varahatech.Member
      WHERE FamilyID = @FamilyID AND IsDelete = 0  -- Check for active members
    `;

    const memberResult = await pool
      .request()
      .input("FamilyID", sql.NVarChar(50), familyId)
      .query(memberQuery);

    // Extract the Member IDs from the result set
    const memberIds = memberResult.recordset.map(member => member.MemberID);

    // Log the found member IDs to track what was fetched
    if (memberIds.length > 0) {
      console.log("👥 Found member IDs for FamilyID:", memberIds);
    } else {
      console.log("❌ No members found for FamilyID:", familyId);
    }

    // If no members were found, return an empty array
    if (memberIds.length === 0) {
      return res.json([]);
    }

    // Step 2: Query to fetch insurance records for each member
    const insuranceQuery = `
      SELECT 
        mi.MemInsID,
        mi.MemberID,
        mi.InsFrontImgURL,
        mi.InsBackImgURL,
        mi.BenefitTypeID,
        mi.PolicyTypeID,
        mi.PayerName,
        mi.PolicyID,
        mi.IsActive,
        mi.AddDate,
        mi.ModifiedDate,
        mi.SubscriberID,
        s.FirstName + ' ' + s.LastName AS SubscriberName
      FROM varahatech.MemberInsurance mi
      LEFT JOIN varahatech.Member s ON mi.SubscriberID = s.MemberID
      WHERE mi.MemberID IN (@MemberIDs) AND mi.IsDelete = 0  -- Use the member IDs to fetch insurance data
      ORDER BY mi.MemInsID DESC
    `;

    const result = await pool
      .request()
      .input("MemberIDs", sql.Int, memberIds)  // Pass the list of MemberIDs
      .query(insuranceQuery);

    // Log the number of insurance records fetched
    console.log("✅ Insurance records found:", result.recordset.length);

    // Log the insurance records for debugging (optional)
    console.log("🔍 Insurance records:", result.recordset);

    // Send back the insurance records for each member
    res.json(result.recordset);  

  } catch (err) {
    console.error("❌ Error fetching insurance:", err);
    res.status(500).json({ status: "Error", message: err.message });
  }
});

export default router;
