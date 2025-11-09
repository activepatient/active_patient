import express from "express";
import sql from "mssql";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/upload", verifyToken, async (req, res) => {
  const { MemberID, BillDate, FileType, BillFile, AddedBy } = req.body;
  try {
    const pool = await sql.connect(global.dbConfig);
    await pool.request()
      .input("MemberID", sql.Int, MemberID)
      .input("BillDate", sql.Date, BillDate)
      .input("FileType", sql.NVarChar(10), FileType)
      .input("BillFile", sql.NVarChar(sql.MAX), BillFile)
      .input("AddedBy", sql.NVarChar(100), AddedBy)
      .query(`
        INSERT INTO varahatech.MemberBills (MemberID, BillDate, FileType, BillFile, AddedBy, AddDate, IsActive, IsDelete)
        VALUES (@MemberID, @BillDate, @FileType, @BillFile, @AddedBy, GETDATE(), 1, 0)
      `);

    res.json({ status: "Success", message: "Bill uploaded successfully" });
  } catch (err) {
    console.error("❌ Error uploading bill:", err);
    res.status(500).json({ status: "Error", message: "Failed to upload bill" });
  }
});

export default router;
