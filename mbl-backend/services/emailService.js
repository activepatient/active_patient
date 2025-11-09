// services/emailService.js
import nodemailer from "nodemailer";

/**
 * Sends an email using Gmail SMTP with your configured credentials.
 * Works perfectly with Gmail App Passwords (not normal account password).
 */
export async function sendEmail(to, subject, html) {
  try {
    // ✅ Create secure SMTP transporter for Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // SSL port
      secure: true, // use SSL directly
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // allows local testing
      },
    });

    // ✅ Define mail details
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Active Patient" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // ✅ Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}: ${info.response}`);

    return true;
  } catch (err) {
    console.error("❌ Email send error:", err.message);
    console.error("🔍 Full error:", err);
    return false;
  }
}
