import React, { useEffect, useState } from "react";
import { getProductionRange } from "./utils";

const calculateEffectiveCount = (rows) => {
  let total = 0;
  let prev = 0;

  rows.forEach((row) => {
    const current = Number(row.count || 0);

    if (current >= prev) {
      total += current - prev; // normal increase
    } else {
      total += current; // counter reset
    }

    prev = current;
  });

  return total;
};

const EffectiveCountSummary = ({ lineName, selectedDate }) => {
  const [effectiveCount, setEffectiveCount] = useState(0);

  useEffect(() => {
    if (!lineName || !selectedDate) return;

    const fetchData = () => {
      fetch("http://localhost:5000/api/ocr_records")
        .then((res) => res.json())
        .then((data) => {
          const { start, end } = getProductionRange(selectedDate);

          const filtered = data
            .map((r) => ({
              datetime: new Date(r.datetime),
              count: r.count,
              line: r.line,
            }))
            .filter(
              (r) =>
                r.line === lineName &&
                r.datetime >= start &&
                r.datetime <= end
            )
            .sort((a, b) => a.datetime - b.datetime);

          const total = calculateEffectiveCount(filtered);
          setEffectiveCount(total);
        })
        .catch((err) =>
          console.error("Failed to fetch effective count data:", err)
        );
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [lineName, selectedDate]);

  return (
    <div
      style={{
        marginTop: "12px",
        padding: "10px 14px",
        border: "1px solid #e5e9ef",
        borderRadius: "8px",
        backgroundColor: "#f9fafc",
        fontSize: "14px",
        fontWeight: "500",
      }}
    >
      {lineName} の合計カウント: {effectiveCount.toLocaleString()}
    </div>
  );
};

export default EffectiveCountSummary;