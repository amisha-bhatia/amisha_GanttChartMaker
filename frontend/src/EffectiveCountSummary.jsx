import React, { useState, useEffect } from "react";
import Papa from "papaparse";

const calculateEffectiveCount = (rows) => {
  let total = 0;
  let prev = 0;

  rows.forEach((row) => {
    const current = Number(row["値03"] || 0);

    if (current >= prev) {
      total += current - prev; 
    } else {
      total += current; 
    }

    prev = current;
  });

  return total;
};


const EffectiveCountSummary = ({ lineName, file }) => {
  const [effectiveCount, setEffectiveCount] = useState(0);

  useEffect(() => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const total = calculateEffectiveCount(data);
        setEffectiveCount(total);
      },
    });
  }, [file]);

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
      {lineName} の合計カウント: {effectiveCount}
    </div>
  );
};

export default EffectiveCountSummary;