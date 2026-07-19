import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import campaignRoutes from "./routes/campaign.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AutoEmailSender/client
const clientPath = path.resolve(__dirname, "../../client");

console.log("Serving frontend from:", clientPath);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/campaigns", campaignRoutes);

// Serve frontend files
app.use(express.static(clientPath));

// Explicit homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// 404 handler must be after all routes and static middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;