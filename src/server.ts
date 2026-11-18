import express from "express";
import cors from "cors";
import { loadCity, createSampleCity, type City } from "./schema.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "127.0.0.1";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// In-memory city (resets on restart)
let currentCity: City = createSampleCity();

app.get("/api/health", (_req, res) => {
  res.json({
    status: "online",
    service: "Project Tron API",
    buildingCount: currentCity.buildings.length,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/city", (_req, res) => {
  res.json(currentCity);
});

app.post("/api/city", (req, res) => {
  try {
    const city = loadCity(req.body);
    currentCity = city;
    res.json({ ok: true, city });
  } catch (err: any) {
    res.status(400).json({
      ok: false,
      error: "Schema validation failed",
      issues: err.issues ?? err.message,
    });
  }
});

app.put("/api/city", (req, res) => {
  try {
    const city = loadCity(req.body);
    currentCity = city;
    res.json({ ok: true, city });
  } catch (err: any) {
    res.status(400).json({
      ok: false,
      error: "Schema validation failed",
      issues: err.issues ?? err.message,
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`\n  Project Tron API online`);
  console.log(`  → http://${HOST}:${PORT}`);
  console.log(`  Disc Core + schema boundary active\n`);
});