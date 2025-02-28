import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EngagementForm from '../components/Engagement/EngagementForm';
import ResponseDisplay from '../components/Engagement/ResponseDisplay';

const API_BASE_URL = 'http://localhost:8080';

const EngagementPage = () => {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch recent interactions on component mount
  useEffect(() => {
    fetchRecentInteractions();
  }, []);

  const fetchRecentInteractions = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/engagement/recent`);
      if (response.data.success) {
        setRecentInteractions(response.data.interactions || []);
      }
    } catch (error) {
      console.error('Error fetching recent interactions:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResponse('');
    
    try {
      const apiData = {
        type: formData.interactionType,
        user_type: formData.userType,
        message: formData.message,
        platform: formData.platform || 'x',
        user_id: `user_${Math.floor(Math.random() * 1000)}`
      };
      
      console.log('Sending data to API:', apiData);
      
      const response = await axios.post(`${API_BASE_URL}/api/engagement/interact`, apiData);
      
      if (response.data.success) {
        setResponse(response.data.response);
        // Refresh the recent interactions list
        fetchRecentInteractions();
      } else {
        setError(response.data.message || 'Failed to process interaction');
      }
    } catch (error) {
      console.error('Error processing interaction:', error);
      setError(error.response?.data?.message || 'Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleString();
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Engagement System</h1>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <EngagementForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        
        <div className="col-md-6">
          <ResponseDisplay response={response} error={error} />
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Recent Interactions</h5>
        </div>
        <div className="card-body">
          {isLoadingHistory ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : recentInteractions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Type</th>
                    <th>User Type</th>
                    <th>Message</th>
                    <th>Response</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInteractions.map((interaction) => (
                    <tr key={interaction.id}>
                      <td>
                        <span className="badge bg-secondary">{interaction.platform}</span>
                      </td>
                      <td>{interaction.interaction_type}</td>
                      <td>{interaction.user_type}</td>
                      <td>
                        <div className="message-preview">{interaction.message.slice(0, 50)}...</div>
                      </td>
                      <td>
                        <div className="message-preview">{interaction.response.slice(0, 50)}...</div>
                      </td>
                      <td>{formatDate(interaction.processed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No recent interactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EngagementPage; 