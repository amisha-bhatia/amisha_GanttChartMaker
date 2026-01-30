

// Format duration in ms to "xh ym zs"
export const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
};

// Get production range for a given date (8:15 today → 8:14 tomorrow)
export const getProductionRange = (dateStr) => {
  const start = new Date(dateStr);
  start.setHours(8, 15, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  end.setHours(8, 14, 0, 0);
  return { start, end };
};
