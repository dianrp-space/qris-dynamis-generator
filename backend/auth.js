import dotenv from "dotenv";

dotenv.config();

// Middleware untuk validasi API Key
export function authenticateApiKey(req, res, next) {
  // Allowlist origin FE (bisa ditambah sesuai kebutuhan)
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost/qris",
    "http://127.0.0.1:3000",
    "http://127.0.0.1/qris",
  ];
  const origin = req.headers.origin || req.headers.referer || "";
  const isFrontend = allowedOrigins.some((o) => origin.startsWith(o));

  if (isFrontend) {
    // Bypass API key jika dari FE yang diizinkan
    return next();
  }

  // Untuk request lain (curl, Postman, dsb), tetap wajib API key
  const apiKey = req.headers["x-api-key"] || req.headers["apikey"];
  if (!apiKey) {
    return res.status(401).json({ error: "API Key required" });
  }
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API Key" });
  }
  next();
}
