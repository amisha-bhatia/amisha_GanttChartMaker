// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(
  "C:/project/SMTScreenVision/src/storage/data/db/database.db"
);
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// API to get OCR records
app.get("/api/ocr_records", (req, res) => {
  const query = `
    SELECT production_day, register_time, program_status,
           item_01_code, item_01_value, item_02_value, item_03_value, note
    FROM ocr_records
    ORDER BY production_day ASC, register_time ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }

    const data = rows.map((r) => ({
      datetime: r.register_time,
      status: r.program_status || "稼働中",
      code01: r.item_01_code || "",
      value01: r.item_01_value || "",
      product_name: r.item_02_value || "",
      count: parseInt(r.item_03_value || 0),
      note: r.note || "",
      line: "LINE_A", // assign manually if needed
    }));

    res.json(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
