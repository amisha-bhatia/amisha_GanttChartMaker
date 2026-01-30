// src/components/StatusFilter.jsx
import React from "react";

const StatusFilter = ({
  selectedDate,
  setSelectedDate,
  allStatuses,
  statusFilter,
  toggleStatus,
}) => {
  return (
    <div className="status-filter">
      {/* Date Picker */}
      <div className="date-picker">
        <label>生産日: </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Status Checkboxes */}
      {allStatuses.map((status) => (
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
  );
};

export default StatusFilter;
