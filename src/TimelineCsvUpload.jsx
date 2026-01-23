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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        // normalize + sort
        const rows = data
          .map((r) => {
            const [h, m, s] = r.time.split(":");
            return {
              ...r,
              datetime: new Date(
                `${r.date}T${h.padStart(2, "0")}:${m}:${s}`
              ),
              count: Number(r.count),
            };
          })
          .sort((a, b) => a.datetime - b.datetime);

        const timeline = [];

        for (let i = 0; i < rows.length - 1; i++) {
          const start = rows[i];
          const end = rows[i + 1];

          timeline.push({
            start: start.datetime,
            duration: end.datetime - start.datetime,
            status: start.status,
            count: end.count,
          });
        }

        const plotTraces = timeline.map((t) => ({
          type: "bar",
          orientation: "h",
          x: [t.duration],
          y: ["SMT_LINE_A"],
          base: [t.start],
          marker: { color: STATUS_COLOR[t.status] },
          text: [`Count: ${t.count}`],
          textposition: "inside",
          hovertemplate:
            "Start: %{base}<br>" +
            "End: %{x}<br>" +
            "Status: " +
            t.status +
            "<br>" +
            "Count: " +
            t.count +
            "<extra></extra>",
          showlegend: false,
        }));

        setTraces(plotTraces);
      },
    });
  };

  return (
    <div className="timeline-wrapper">
      <div className="timeline-csv-upload">
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {traces.length > 0 && (
        <div className="timeline-plot"> 
          <Plot
            data={traces}
            layout={{
              title: "SMT_LINE_A 稼働タイムライン",
              xaxis: {
                type: "date",
                tickformat: "%H:%M:%S",
                title: "Time",
              },
              yaxis: {
                title: "",
              },
              height: 300,
            }}
            style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
          />
        </div>
          
        )}
      </div>
    </div>
  );
};

export default TimelineCsvUpload;