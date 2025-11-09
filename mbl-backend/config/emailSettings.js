// config/emailSettings.js
export const emailSettings = {
  SmtpServer: process.env.EMAIL_HOST,
  SmtpPort: Number(process.env.EMAIL_PORT || 587),
  SmtpUsername: process.env.EMAIL_USER,
  SmtpPassword: process.env.EMAIL_PASS,
  EnableSsl: String(process.env.EMAIL_SECURE).toLowerCase() === "true",
  From: process.env.EMAIL_FROM || process.env.EMAIL_USER
};
