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
      <div className="status-filters-right">
        {allStatuses.map((status) => (
          <label key={status}>
            <input
              type="checkbox"
              checked={statusFilter.includes(status)}
              onChange={() => toggleStatus(status)}
            />
            <span className="toggle"></span>
            {status}
          </label>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
