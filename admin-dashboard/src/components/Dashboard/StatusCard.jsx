import React from 'react';

const StatusCard = ({ title, status, description }) => {
  // Determine the status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'connected':
      case 'active':
        return 'success';
      case 'offline':
      case 'disconnected':
      case 'inactive':
        return 'danger';
      case 'warning':
      case 'limited':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const statusColor = getStatusColor(status);

  return (
    <div className="col-md-6 mb-4">
      <div className="card h-100">
        <div className={`card-header bg-${statusColor} bg-opacity-25`}>
          <h5 className="mb-0">
            <span className={`status-indicator ${status.toLowerCase()}`}></span>
            {title}
          </h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">Status:</span>
            <span className={`badge bg-${statusColor}`}>{status}</span>
          </div>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard; 