import React, { useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import "./TimelineCsvUpload.css";
import EffectiveCountSummary from "./EffectiveCountSummary";

const STATUS_COLOR = {
  自動運転: "#2ecc71",
  停止: "#e74c3c",
};

const ALL_STATUSES = Object.keys(STATUS_COLOR);

const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const TimelineCsvUpload = () => {
  const [traces, setTraces] = useState([]);
  const [linesArray, setLinesArray] = useState([]);
  const [statusFilter, setStatusFilter] = useState([...ALL_STATUSES]);
  // Store uploaded CSV files
  const [lineAFile, setLineAFile] = useState(null);
  const [lineBFile, setLineBFile] = useState(null);

  const processFile = (file, LineName) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const rows = data
          .map((r) => {
            const date = r["作業日"]?.replace(/\//g, "-");
            const time = r["読取時刻"];
            const status = r["読取り値01"];
            const count = Number(r["値03"] || 0);
            const line = LineName;
            const product_name = r["読取り値02"] || "";

            if (!date || !time) return null;
            const [h, m, s] = time.split(":");
            return {
              datetime: new Date(`${date}T${h.padStart(2, "0")}:${m}:${s}`),
              status,
              count,
              line,
              product_name,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.datetime - b.datetime);

        setLinesArray((prev) =>
          prev.includes(LineName) ? prev : [...prev, LineName]
        );

        const timeline = [];
        for (let i = 0; i < rows.length - 1; i++) {
          const start = rows[i];
          const end = rows[i + 1];
          timeline.push({
            start: start.datetime,
            end: end.datetime,
            duration: end.datetime - start.datetime,
            status: start.status,
            count: end.count,
            line: start.line,
            product_name: start.product_name,
          });
        }

        const newTraces = timeline.map((t) => ({
          type: "bar",
          orientation: "h",
          x: [t.end - t.start],  
          base: [t.start],       
          y: [t.line],
          marker: { color: STATUS_COLOR[t.status] || "#3498db" },
          width: 0.35,
          text: `${t.count}<br> ${t.product_name}`,
          textposition: "inside",
          hovertemplate:
            `開始: ${t.start.toLocaleTimeString()}<br>` +
            `終了: ${t.end.toLocaleTimeString()}<br>` +
            `期間: ${formatDuration(t.duration)}<br>` +
            `状態: ${t.status}<br>` +
            `数量: ${t.count}<br>` +
            `製品名: ${t.product_name}<extra></extra>`,
          showlegend: false,
          status: t.status, 
        }));

        setTraces((prev) => {
          const filtered = prev.filter((t) => t.y[0] !== LineName);
          return [...filtered, ...newTraces];
        });
      },
    });
  };

  const toggleStatus = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Apply status filter
  const filteredTraces = traces.filter((t) => statusFilter.includes(t.status));

  return (
  <div className="timeline-wrapper">
    <div className="timeline-csv-upload">

      {/* LINE A INPUT + COUNTER */}
      <div className="upload-row">
        <div className="upload-input-container">
          <label>ラインA</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files[0];
              setLineAFile(file);         
              processFile(file, "LINE_A"); 
            }}
          />
        </div>
        <div className="upload-counter-container">
          {lineAFile && <EffectiveCountSummary lineName="LINE_A" file={lineAFile} />}
        </div>
      </div>

      {/* LINE B INPUT + COUNTER */}
      <div className="upload-row">
        <div className="upload-input-container">
          <label>ラインB</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files[0];
              setLineBFile(file);         
              processFile(file, "LINE_B"); 
            }}
          />
        </div>
        <div className="upload-counter-container">
          {lineBFile && <EffectiveCountSummary lineName="LINE_B" file={lineBFile} />}
        </div>
      </div>

      {/* STATUS FILTER */}
      <div className="status-filter">
        <label>フィルター: </label>
        {ALL_STATUSES.map((status) => (
          <label key={status} style={{ marginRight: "15px" }}>
            <input
              type="checkbox"
              checked={statusFilter.includes(status)}
              onChange={() => toggleStatus(status)}
            />
            {status}
          </label>
        ))}
      </div>

      {/* TIMELINE PLOT */}
      {filteredTraces.length > 0 && (
        <div className="timeline-plot">
          <Plot
            data={filteredTraces}
            layout={{
              title: "稼働タイムライン",
              barmode: "overlay",
              xaxis: {
                type: "date",
                tickformat: "%H:%M:%S",
                title: "Time",
              },
              yaxis: {
                title: "Line",
                categoryorder: "array",
                categoryarray: linesArray,
                automargin: true,
              },
              margin: { t: 90, b: 80, l: 100, r: 40 },
              height: 220 + linesArray.length * 60,
            }}
            style={{ width: "100%", maxWidth: "3000px", margin: "0 auto" }}
          />
        </div>
      )}
    </div>
  </div>
);

};

export default TimelineCsvUpload;
