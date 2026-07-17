import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

console.log("Starting server...");

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`\n${signal} Shutting down server...`);

  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));