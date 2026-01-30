// src/components/TimelinePlot.jsx
import React from "react";
import Plot from "react-plotly.js";

const TimelinePlot = ({ traces, linesArray }) => {
  return (
    <div className="timeline-plot">
      <Plot
        data={traces}
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
        config={{ responsive: true }}
      />
    </div>
  );
};

export default TimelinePlot;
