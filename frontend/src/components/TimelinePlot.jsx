// src/components/TimelinePlot.jsx
import React from "react";
import Plot from "react-plotly.js";

const TimelinePlot = ({ traces, linesArray }) => {
  return (
    <div className="timeline-plot">
      <Plot
        data={traces}
        layout={{
          title: {
            text: "稼働タイムライン",
            font: { color: "#ffffff", size: 20 }
          },

          font: { color: "#ffffff" },

          paper_bgcolor: "#000000",
          plot_bgcolor: "#000000",

          barmode: "overlay",

          xaxis: {
            type: "date",
            tickformat: "%H:%M:%S",
            title: {font: { color: "#ffffff" } },
            gridcolor: "#222222",
            linecolor: "#ffffff",
            tickcolor: "#ffffff",
            tickfont: { color: "#ffffff" },
            zerolinecolor: "#333333",
          },

          yaxis: {
            title: { font: { color: "#ffffff" } },
            categoryorder: "array",
            categoryarray: linesArray,
            automargin: true,
            gridcolor: "#222222",
            linecolor: "#ffffff",
            tickcolor: "#ffffff",
            tickfont: { color: "#ffffff" },
            zerolinecolor: "#333333",
          },

          margin: { t: 70, b: 70, l: 100, r: 40 },
          height: 220 + linesArray.length * 60,
        }}
        style={{
          width: "100%",
          maxWidth: "3000px",
          margin: "0 auto",
          background: "#000000"
        }}
        config={{
          responsive: true,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["lasso2d", "select2d"]
        }}
      />
    </div>
  );
};

export default TimelinePlot;
