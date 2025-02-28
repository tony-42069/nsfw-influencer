import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const DashboardPage = () => {
  const [apiHealth, setApiHealth] = useState('checking');
  
  useEffect(() => {
    // Check API health on component mount
    checkApiHealth();
  }, []);
  
  const checkApiHealth = async () => {
    try {
      setApiHealth('checking');
      const response = await axios.get(`${API_BASE_URL}/health`);
      if (response.data.status === 'healthy') {
        setApiHealth('healthy');
        document.getElementById('api-status').className = 'badge bg-success me-3 d-none d-md-block';
        document.getElementById('api-status').textContent = 'Healthy';
      } else {
        setApiHealth('unhealthy');
        document.getElementById('api-status').className = 'badge bg-danger me-3 d-none d-md-block';
        document.getElementById('api-status').textContent = 'Unhealthy';
      }
    } catch (error) {
      console.error('Error checking API health:', error);
      setApiHealth('error');
      document.getElementById('api-status').className = 'badge bg-danger me-3 d-none d-md-block';
      document.getElementById('api-status').textContent = 'Error';
    }
  };
  
  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <button 
            type="button" 
            className="btn btn-sm btn-primary me-2"
            onClick={checkApiHealth}
          >
            Check API Health
          </button>
          <button type="button" className="btn btn-sm btn-outline-primary">
            Generate Quick Post
          </button>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title">0</h3>
              <p className="card-text">Posts Generated</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title">0</h3>
              <p className="card-text">Comments Processed</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h3 className="card-title">0</h3>
              <p className="card-text">Messages Sent</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">System Status</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="d-flex justify-content-between">
                <span>API Status:</span>
                <span className={`badge ${apiHealth === 'healthy' ? 'bg-success' : apiHealth === 'checking' ? 'bg-secondary' : 'bg-danger'}`}>
                  {apiHealth === 'healthy' ? 'Healthy' : apiHealth === 'checking' ? 'Checking...' : 'Error'}
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-between">
                <span>MongoDB Connection:</span>
                <span className="badge bg-success">Connected</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-between">
                <span>OpenAI API:</span>
                <span className="badge bg-success">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Recent Activity</h5>
        </div>
        <div className="card-body">
          <p className="text-muted">No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 