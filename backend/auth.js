import dotenv from "dotenv";

dotenv.config();

// Middleware untuk validasi API Key
export function authenticateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"] || req.headers["apikey"];

  if (!apiKey) {
    return res.status(401).json({ error: "API Key required" });
  }

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API Key" });
  }

  next();
}
