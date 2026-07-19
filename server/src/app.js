
import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.join(__dirname, "../../client");


import campaignRoutes from "./routes/campaign.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(clientPath));

// for checking health of the server
app.get("/health", (req, res) => {
    res.status(200).json({
        sucess: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/campaigns", campaignRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    
    console.error(err),

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;