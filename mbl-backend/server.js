


// server.js
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sql from "mssql";
import path from "path";
import Stripe from "stripe";

import insuranceRoutes from "./routes/insurance.js";
import memberRoutes from "./routes/member.js";
import memberBillsRoutes from "./routes/memberBills.js";
import userRoutes from "./routes/userRoutes.js";
import { sendEmail } from "./services/emailService.js";

dotenv.config();

// ==============================
// 🔍 ENV CHECK
// ==============================
console.log("📧 Email ENV check:");
console.log("  EMAIL_USER:", process.env.EMAIL_USER);
console.log("  EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

// ==============================
// 🚀 EXPRESS INIT
// ==============================
const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ✅ Serve uploaded insurance images via short URLs
app.use("/u/ins", express.static(path.join(process.cwd(), "uploads", "insurance")));

// ==============================
// 💾 SQL Server Connection Config
// ==============================
global.dbConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  port: parseInt(process.env.SQL_PORT || "1433"),
  options: {
    encrypt: process.env.SQL_ENCRYPT === "true",
    trustServerCertificate:
      process.env.SQL_TRUST_SERVER_CERTIFICATE === "true",
  },

  // ✅ NEW: Improve reliability and prevent ETIMEOUT
  pool: {
    max: 10, // max connections in pool
    min: 0,
    idleTimeoutMillis: 30000, // close idle connections after 30s
  },
  requestTimeout: 60000, // 60s query timeout
  connectionTimeout: 60000, // 60s connection timeout
};

// ==============================
// 🟩 Test SQL Connection (Once)
// ==============================
(async () => {
  try {
    const pool = await sql.connect(global.dbConfig);
    console.log(`✅ Connected to SQL Server: ${process.env.SQL_DATABASE}`);
    pool.close();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// ==============================
// 🧭 API ROUTES
// ==============================
console.log("🛣️ Registering routes...");

app.use("/api/Users", userRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/insurance", insuranceRoutes);
// app.use("/api/Users", insuranceRoutes);
app.use("/api/member/bills", memberBillsRoutes);

// ✅ Log mounted routes
app.on("mount", () => {
  console.log("📋 Mounted routes:");
  if (app._router?.stack) {
    app._router.stack
      .filter((r) => r.route && r.route.path)
      .forEach((r) =>
        console.log(
          `➡️ ${Object.keys(r.route.methods)
            .join(",")
            .toUpperCase()} ${r.route.path}`
        )
      );
  }
});

process.nextTick(() => {
  if (app._router?.stack) {
    console.log("📋 Final route map:");
    app._router.stack
      .filter((r) => r.route && r.route.path)
      .forEach((r) =>
        console.log(
          `➡️ ${Object.keys(r.route.methods)
            .join(",")
            .toUpperCase()} ${r.route.path}`
        )
      );
  } else {
    console.log("⚠️ Router stack not available yet.");
  }
});

// ==============================
// 🧪 EMAIL TEST ENDPOINT
// ==============================
app.get("/api/test-email", async (req, res) => {
  try {
    const to = req.query.to || process.env.EMAIL_USER;
    const result = await sendEmail(
      to,
      "✅ Test Email from Active Patient",
      `<h2>Hello from Active Patient API!</h2><p>This is a test email sent using Gmail SMTP and NodeMailer.</p>`
    );

    if (result) {
      res.json({
        status: "Success",
        message: `Email sent successfully to ${to}`,
      });
    } else {
      res
        .status(500)
        .json({ status: "Error", message: "Failed to send email" });
    }
  } catch (err) {
    console.error("❌ Email test error:", err);
    res.status(500).json({ status: "Error", message: err.message });
  }
});

// ==============================
// 🟦 HEALTH CHECK ENDPOINT
// ==============================
app.get("/", (req, res) => {
  res.send({
    status: "OK",
    message: "Active Patient API is running 🚀",
    database: process.env.SQL_DATABASE,
    time: new Date().toISOString(),
  });
});


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;

    const customer = await stripe.customers.create({
      name: "Active Patient User",
      email: "demo@activepatient.com",
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (err) {
    console.error("❌ Stripe Error:", err);
    res.status(400).json({ error: err.message });
  }
});

// ==============================
// 🚀 START SERVER
// ==============================
const PORT = process.env.PORT || 7233;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log("✅ Routes registered successfully.");
});

// ==============================
// 🧹 Graceful Shutdown
// ==============================
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down server...");
  await sql.close();
  server.close(() => {
    console.log("✅ Server stopped cleanly.");
    process.exit(0);
  });
});

