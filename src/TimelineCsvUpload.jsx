import React, { useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import "./TimelineCsvUpload.css";

const STATUS_COLOR = {
  自動運転: "#2ecc71",
  停止: "#e74c3c",
};

const TimelineCsvUpload = () => {
  const [traces, setTraces] = useState([]);
  const [linesArray, setLinesArray] = useState([]);

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
          x: [t.duration],
          y: [t.line],
          base: [t.start],
          marker: { color: STATUS_COLOR[t.status] || "#3498db" },
          text: `Count: ${t.count}<br>Product: ${t.product_name}`,
          textposition: "inside",
          hovertemplate:
            `開始: %{base}<br>` +
            `終了: %{x}<br>` +
            `状態: ${t.status}<br>` +
            `数量: ${t.count}<br>` +
            `製品名: ${t.product_name}<extra></extra>`,
          showlegend: false,
        }));

       
        setTraces((prev) => {
          const filtered = prev.filter((t) => t.y[0] !== LineName);
          return [...filtered, ...newTraces];
        });
      },
    });
  };


  return (
    <div className="timeline-wrapper">
      <div className="timeline-csv-upload">

        {/* LINE A INPUT */}
        <div className="upload-group">
          <label> ラインA </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => processFile(e.target.files[0], "LINE_A")}
          />
        </div>

        {/* LINE B INPUT */}
        <div className="upload-group">
          <label> ラインB </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => processFile(e.target.files[0], "LINE_B")}
          />
        </div>

        {traces.length > 0 && (
          <div className="timeline-plot">
            <Plot
              data={traces}
              layout={{
                title: "稼働タイムライン",
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