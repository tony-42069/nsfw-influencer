import React from 'react';

const SystemPreferences = ({ settings, onChange }) => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">System Preferences</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="backupFrequency" className="form-label">Backup Frequency</label>
              <select 
                className="form-select" 
                id="backupFrequency" 
                name="backupFrequency"
                value={settings.backupFrequency} 
                onChange={onChange}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <div className="form-text">
                How often to backup your data
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3 form-check mt-4">
              <input 
                type="checkbox" 
                className="form-check-input" 
                id="enableNotifications" 
                name="enableNotifications"
                checked={settings.enableNotifications} 
                onChange={onChange}
              />
              <label className="form-check-label" htmlFor="enableNotifications">
                Enable System Notifications
              </label>
              <div className="form-text">
                Receive notifications about system events and errors
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPreferences; 