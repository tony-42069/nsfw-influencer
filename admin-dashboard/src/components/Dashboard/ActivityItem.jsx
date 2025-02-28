import React from 'react';

const ActivityItem = ({ type, message, timestamp, icon, color }) => {
  // Format the timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' ' + date.toLocaleDateString();
  };

  return (
    <div className="d-flex align-items-center border-bottom py-3">
      <div className={`bg-${color} rounded-circle p-2 me-3`}>
        <i className={`fas ${icon} text-white`}></i>
      </div>
      <div className="flex-grow-1">
        <div className="small text-gray-500">{formatTime(timestamp)}</div>
        <div className="mb-0">
          <span className={`badge bg-${color} me-2`}>{type}</span>
          {message}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem; 