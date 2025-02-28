import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const EngagementPage = () => {
  const [interactionType, setInteractionType] = useState('comment');
  const [userType, setUserType] = useState('subscriber');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/engagement/interact`, {
        type: interactionType,
        user_type: userType,
        message: message
      });
      
      if (response.data.success) {
        setResponse(response.data.response);
      } else {
        setError(response.data.message || 'Failed to process interaction');
      }
    } catch (error) {
      console.error('Error processing interaction:', error);
      setError('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Engagement System</h1>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Process Interaction</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="interactionType" className="form-label">Interaction Type</label>
                  <select 
                    id="interactionType" 
                    className="form-select"
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value)}
                  >
                    <option value="comment">Comment</option>
                    <option value="message">Direct Message</option>
                    <option value="mention">Mention</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="userType" className="form-label">User Type</label>
                  <select 
                    id="userType" 
                    className="form-select"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                  >
                    <option value="visitor">Visitor</option>
                    <option value="follower">Follower</option>
                    <option value="subscriber">Subscriber</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message Content</label>
                  <textarea 
                    id="message" 
                    className="form-control" 
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter the message from the user..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Process Interaction'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Response</h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              {response ? (
                <div className="border p-3 bg-light" style={{ minHeight: '200px' }}>
                  {response}
                </div>
              ) : (
                <p className="text-muted">
                  Response will appear here...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Recent Interactions</h5>
        </div>
        <div className="card-body">
          <p className="text-muted">No recent interactions yet.</p>
        </div>
      </div>
    </div>
  );
};

export default EngagementPage; 