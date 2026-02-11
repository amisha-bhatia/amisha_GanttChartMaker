const path = require("path");

require("dotenv").config();

const config = {
  port: process.env.PORT || 5000,
  dbPath:
    process.env.DB_PATH ||
    "C:/project/SMTScreenVision/src/storage/data/db/database.db",
  frontendBuildPath:
    process.env.FRONTEND_BUILD_PATH ||
    path.resolve(__dirname, "..", "frontend", "build"),
};

module.exports = config;
