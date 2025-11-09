// mbl-backend/db.js
import dotenv from "dotenv";

dotenv.config();

export const sqlConfig = {
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
};
