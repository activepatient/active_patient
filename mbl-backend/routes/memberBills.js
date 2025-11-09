import express from "express";
import sql from "mssql";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// --- Upload folder ---
const uploadDir = path.join(process.cwd(), "mbl-backend", "uploads", "bills");
fs.mkdirSync(uploadDir, { recursive: true });

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// --- POST: Upload new bill & file ---
router.post("/", upload.single("billFile"), async (req, res) => {
  const pool = await sql.connect();
  const { memberId, billDate, addedBy } = req.body;
  const filePath = req.file ? `/uploads/bills/${req.file.filename}` : null;

  try {
    // Insert bill entry
    const billResult = await pool.request()
      .input("MemberID", sql.Int, memberId)
      .input("BillDate", sql.Date, billDate)
      .input("FileType", sql.NVarChar, req.file.mimetype)
      .input("BillFile", sql.NVarChar, filePath)
      .input("AddedBy", sql.NVarChar, addedBy)
      .query(`
        INSERT INTO varahatech.MemberBills (MemberID, BillDate, FileType, BillFile, AddedBy)
        OUTPUT INSERTED.BillID AS BillID
        VALUES (@MemberID, @BillDate, @FileType, @BillFile, @AddedBy)
      `);

    const billId = billResult.recordset[0].BillID;

    // Insert file entry (BillFiles)
    await pool.request()
      .input("BillID", sql.Int, billId)
      .input("FileName", sql.NVarChar, req.file.originalname)
      .input("FilePath", sql.NVarChar, filePath)
      .input("FileType", sql.NVarChar, req.file.mimetype)
      .input("UploadedBy", sql.NVarChar, addedBy)
      .query(`
        INSERT INTO varahatech.BillFiles (BillID, FileName, FilePath, FileType, UploadedBy)
        VALUES (@BillID, @FileName, @FilePath, @FileType, @UploadedBy)
      `);

    res.json({ status: "success", message: "Bill & file saved successfully." });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ status: "error", message: "Failed to save bill." });
  }
});

// --- GET: Fetch all bills with files for a member ---
router.get("/:memberId", async (req, res) => {
  const pool = await sql.connect();
  const { memberId } = req.params;

  try {
    const result = await pool.request()
      .input("MemberID", sql.Int, memberId)
      .query(`
        SELECT b.BillID, b.MemberID, b.BillDate, b.AddedBy, b.AddDate,
               f.FileID, f.FileName, f.FilePath, f.FileType
        FROM varahatech.MemberBills b
        LEFT JOIN varahatech.BillFiles f ON b.BillID = f.BillID
        WHERE b.MemberID = @MemberID AND b.IsDelete = 0
        ORDER BY b.AddDate DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ status: "error", message: "Failed to fetch bills." });
  }
});

export default router;
