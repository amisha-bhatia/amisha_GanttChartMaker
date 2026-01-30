import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import "./TimelineDbData.css";

const STATUS_COLOR = {
  自動運転: "#2ecc71",
  停止: "#e74c3c",
};

const ALL_STATUSES = Object.keys(STATUS_COLOR);

const TimelineDbData = () => {
  const [traces, setTraces] = useState([]);
  const [linesArray, setLinesArray] = useState([]);
  const [statusFilter, setStatusFilter] = useState([...ALL_STATUSES]);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // 🏭 Production day = 08:15 → next day 08:14
  const getProductionRange = (dateStr) => {
    const start = new Date(dateStr);
    start.setHours(8, 15, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    end.setHours(8, 14, 0, 0);

    return { start, end };
  };

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/api/ocr_records")
        .then((res) => res.json())
        .then((data) => {
          const { start: rangeStart, end: rangeEnd } =
            getProductionRange(selectedDate);

          const rows = data
            .map((r) => ({
              datetime: new Date(r.datetime),
              status: r.value01 || "その他",
              count: r.count,
              line: r.line,
              product_name: r.product_name,
            }))
            .filter(
              (r) => r.datetime >= rangeStart && r.datetime <= rangeEnd
            )
            .sort((a, b) => a.datetime - b.datetime);

          const lines = Array.from(new Set(rows.map((r) => r.line)));
          setLinesArray(lines);

          const bars = [];

          lines.forEach((line) => {
            const lineRows = rows.filter((r) => r.line === line);

            for (let i = 0; i < lineRows.length; i++) {
              const start = lineRows[i].datetime;
              let end;

              if (i < lineRows.length - 1) {
                end = lineRows[i + 1].datetime;
                if (end > rangeEnd) end = rangeEnd;
              } else {
                end = rangeEnd;
              }

              if (end <= start) continue;

              const durationMs = end - start;
              const seg = lineRows[i];

              bars.push({
                type: "bar",
                orientation: "h",
                y: [line],
                x: [durationMs],
                base: start,
                width: 0.35,
                marker: { color: STATUS_COLOR[seg.status] || "#789cb5" },
                hovertemplate:
                  `開始: ${start.toLocaleString()}<br>` +
                  `終了: ${end.toLocaleString()}<br>` +
                  `期間: ${Math.floor(durationMs / 3600000)}h ${Math.floor(
                    (durationMs % 3600000) / 60000
                  )}m<br>` +
                  `状態: ${seg.status}<br>` +
                  `数量: ${seg.count}<br>` +
                  `製品名: ${seg.product_name}<extra></extra>`,
                showlegend: false,
                status: seg.status,
              });
            }
          });

          setTraces(bars);
        })
        .catch((err) => console.error("Failed to fetch timeline data:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const toggleStatus = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredTraces = traces.filter((t) =>
    statusFilter.includes(t.status)
  );

  return (
    <div className="timeline-container">
      {/* Date Picker */}
      <div className="toolbar">
        <div className="date-picker">
          <label>生産日:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="status-filter">
          <label>フィルター:</label>
          {ALL_STATUSES.map((status) => (
            <label key={status} className="status-option">
              <input
                type="checkbox"
                checked={statusFilter.includes(status)}
                onChange={() => toggleStatus(status)}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      {/* Chart or Empty State */}
      {filteredTraces.length === 0 ? (
        <div className="no-data">選択した生産日のデータがありません</div>
      ) : (
        <div className="chart-wrapper">
          <Plot
            data={filteredTraces}
            layout={{
              title: "稼働タイムライン",
              barmode: "overlay",
              xaxis: { type: "date", tickformat: "%m/%d %H:%M" },
              yaxis: {
                title: "Line",
                categoryorder: "array",
                categoryarray: linesArray,
                automargin: true,
              },
              margin: { t: 80, b: 80, l: 100, r: 40 },
              height: 250 + linesArray.length * 60,
            }}
            config={{ responsive: true }}
          />
        </div>
      )}
    </div>
  );
};

export default TimelineDbData;  