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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Dashboard</h1>
        <div>
          <button 
            className="btn btn-american me-2"
            onClick={() => console.log("Check API Health")}
          >
            Check API Health
          </button>
          <button 
            className="btn btn-american"
            onClick={() => console.log("Generate Quick Post")}
          >
            Generate Quick Post
          </button>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h2 className="stat-value">0</h2>
                  <p className="stat-label">Posts Generated</p>
                </div>
                <div className="stat-icon">📝</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h2 className="stat-value">0</h2>
                  <p className="stat-label">Comments Processed</p>
                </div>
                <div className="stat-icon">💬</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h2 className="stat-value">0</h2>
                  <p className="stat-label">Messages Sent</p>
                </div>
                <div className="stat-icon">📨</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flag-divider"></div>
      
      <div className="card mt-4">
        <div className="card-header">
          SYSTEM STATUS
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                <span>API Status:</span>
                <span className="badge bg-success">Healthy</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                <span>MongoDB Connection:</span>
                <span className="badge bg-success">Connected</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                <span>OpenAI API:</span>
                <span className="badge bg-success">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flag-divider"></div>
      
      <div className="card mt-4">
        <div className="card-header">
          RECENT ACTIVITY
        </div>
        <div className="card-body">
          <p className="text-center">No recent activity yet.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 