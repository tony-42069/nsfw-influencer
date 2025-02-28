import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    mongoDbUri: '',
    postGenerationLimit: 10,
    responseTime: {
      comments: 5,
      directMessages: 10
    },
    backupFrequency: 'daily',
    enableNotifications: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/settings`);
      
      if (response.data.success) {
        setSettings(response.data.settings);
      } else {
        setError(response.data.message || 'Failed to load settings');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
                type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/settings`, settings);
      
      if (response.data.success) {
        setMessage('Settings saved successfully');
      } else {
        setError(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Error connecting to the server');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async (service) => {
    setMessage(null);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/test-connection`, { service });
      
      if (response.data.success) {
        setMessage(`Connection to ${service} successful`);
      } else {
        setError(response.data.message || `Failed to connect to ${service}`);
      }
    } catch (error) {
      console.error(`Error testing ${service} connection:`, error);
      setError(`Error connecting to ${service}`);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">System Settings</h1>
        <button 
          className="btn btn-sm btn-secondary"
          onClick={loadSettings}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh Settings'}
        </button>
      </div>
      
      {message && (
        <div className="alert alert-success alert-dismissible fade show">
          {message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMessage(null)}
          ></button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">API Connections</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="openaiApiKey" className="form-label">OpenAI API Key</label>
                  <div className="input-group">
                    <input 
                      type="password" 
                      className="form-control" 
                      id="openaiApiKey" 
                      name="openaiApiKey"
                      value={settings.openaiApiKey} 
                      onChange={handleChange}
                      placeholder="Enter your OpenAI API Key"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => handleTestConnection('openai')}
                    >
                      Test
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="mongoDbUri" className="form-label">MongoDB URI</label>
                  <div className="input-group">
                    <input 
                      type="password" 
                      className="form-control" 
                      id="mongoDbUri" 
                      name="mongoDbUri"
                      value={settings.mongoDbUri} 
                      onChange={handleChange}
                      placeholder="Enter your MongoDB URI"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => handleTestConnection('mongodb')}
                    >
                      Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card mb-4">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Response Settings</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="postGenerationLimit" className="form-label">Daily Post Generation Limit</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="postGenerationLimit" 
                    name="postGenerationLimit"
                    value={settings.postGenerationLimit} 
                    onChange={handleChange}
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="responseTime.comments" className="form-label">Comment Response Time (minutes)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="responseTime.comments" 
                    name="responseTime.comments"
                    value={settings.responseTime.comments} 
                    onChange={handleChange}
                    min="1"
                    max="60"
                  />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="responseTime.directMessages" className="form-label">Direct Message Response Time (minutes)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="responseTime.directMessages" 
                    name="responseTime.directMessages"
                    value={settings.responseTime.directMessages} 
                    onChange={handleChange}
                    min="1"
                    max="60"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
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
                    onChange={handleChange}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
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
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="enableNotifications">
                    Enable System Notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage; 