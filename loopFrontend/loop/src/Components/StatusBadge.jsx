import React from "react";
import "./StatusBadge.module.css"; // Import CSS module

const StatusBadge = ({ status }) => {
  const labels = {
    LIVE: "🚀 Live",
    COMPLETED: "✅ Completed",
    DROPPED: "⏸️ Dropped",
    LOOKING_FOR_TEAM: "👥 Looking for Team",
  };

  return (
    <span className={`badge ${status?.toLowerCase().replace('_', '')}`}>
      {labels[status] || "Unknown"}
    </span>
  );
};

export default StatusBadge;
