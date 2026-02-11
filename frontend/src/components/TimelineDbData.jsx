import React, { useEffect, useState } from "react";
import TimelinePlot from "./TimelinePlot";
import StatusFilter from "./StatusFilter";
import EffectiveCountSummary from "./EffectiveCountSummary";
import { getProductionRange, formatDuration } from "./utils";
import { fetchOcrRecords } from "../api/ocrRecords";


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchOcrRecords();
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
          .filter((r) => r.datetime >= rangeStart && r.datetime <= rangeEnd)
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
            const seg = lineRows[i];
            bars.push({
              type: "bar",
              orientation: "h",
              y: [line],
              x: [end - start],
              base: start,
              width: 0.35,
              marker: { color: STATUS_COLOR[seg.status] || "#789cb5" },
              hovertemplate:
                `開始: ${start.toLocaleTimeString()}<br>` +
                `終了: ${end.toLocaleTimeString()}<br>` +
                `期間: ${formatDuration(end - start)}<br>` +
                `状態: ${seg.status}<br>` +
                `数量: ${seg.count}<br>` +
                `製品名: ${seg.product_name}<extra></extra>`,
              showlegend: false,
              status: seg.status,
            });
          }
        });

        setTraces(bars);
      } catch (err) {
        console.error("Failed to fetch timeline data:", err);
      }
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

  const filteredTraces = traces.filter((t) => statusFilter.includes(t.status));

  return (
    <div className="timeline-wrapper">
      <div className="timeline-upload">
        <StatusFilter
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          allStatuses={ALL_STATUSES}
          statusFilter={statusFilter}
          toggleStatus={toggleStatus}
        />

        {/*  Count Summary */}
        <div className="summary-section">
          {linesArray.map((line) => (
            <EffectiveCountSummary
              key={line}
              lineName={line}
              selectedDate={selectedDate}
            />
          ))}
        </div>

        {/* Timeline Chart */}
        {filteredTraces.length > 0 ? (
          <TimelinePlot traces={filteredTraces} linesArray={linesArray} />
        ) : (
          <div className="no-data">選択した生産日のデータがありません</div>
        )}
      </div>
    </div>
  );
};

export default TimelineDbData;
