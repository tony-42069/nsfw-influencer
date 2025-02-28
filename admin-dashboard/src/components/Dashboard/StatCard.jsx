import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="col-xl-3 col-md-6 mb-4">
      <div className={`card border-left-${color} shadow h-100 py-2 stat-card`}>
        <div className="card-body">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className={`text-xs font-weight-bold text-${color} text-uppercase mb-1 stat-label`}>
                {title}
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800 stat-value">
                {value}
              </div>
            </div>
            <div className="col-auto">
              <i className={`fas ${icon} fa-2x text-gray-300 stat-icon`}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 