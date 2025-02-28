import React, { useState } from 'react';

const EngagementForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    interactionType: 'comment',
    userType: 'follower',
    message: '',
    platform: 'x'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Simulate User Interaction</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="platform" className="form-label">Platform</label>
                <select 
                  className="form-select" 
                  id="platform" 
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                >
                  <option value="x">X (Twitter)</option>
                  <option value="fansly">Fansly</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="interactionType" className="form-label">Interaction Type</label>
                <select 
                  className="form-select" 
                  id="interactionType" 
                  name="interactionType"
                  value={formData.interactionType}
                  onChange={handleChange}
                >
                  <option value="comment">Comment</option>
                  <option value="directMessage">Direct Message</option>
                  <option value="mention">Mention</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="userType" className="form-label">User Type</label>
            <select 
              className="form-select" 
              id="userType" 
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="visitor">Visitor (New User)</option>
              <option value="follower">Follower</option>
              <option value="subscriber">Subscriber</option>
              <option value="vip">VIP</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="message" className="form-label">User Message</label>
            <textarea 
              className="form-control" 
              id="message" 
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter the user's message here..."
              required
            ></textarea>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !formData.message.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : 'Generate Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EngagementForm; 