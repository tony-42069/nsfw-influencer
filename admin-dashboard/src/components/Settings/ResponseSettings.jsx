import React from 'react';

const ResponseSettings = ({ settings, onChange }) => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">Response Settings</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="postGenerationLimit" className="form-label">Daily Post Generation Limit</label>
              <input 
                type="number" 
                className="form-control" 
                id="postGenerationLimit" 
                name="postGenerationLimit"
                value={settings.postGenerationLimit} 
                onChange={onChange}
                min="1"
                max="100"
              />
              <div className="form-text">
                Maximum number of posts to generate per day
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="responseTime.comments" className="form-label">Comment Response Time (minutes)</label>
              <input 
                type="number" 
                className="form-control" 
                id="responseTime.comments" 
                name="responseTime.comments"
                value={settings.responseTime.comments} 
                onChange={onChange}
                min="1"
                max="60"
              />
              <div className="form-text">
                How quickly to respond to comments
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="responseTime.directMessages" className="form-label">Direct Message Response Time (minutes)</label>
              <input 
                type="number" 
                className="form-control" 
                id="responseTime.directMessages" 
                name="responseTime.directMessages"
                value={settings.responseTime.directMessages} 
                onChange={onChange}
                min="1"
                max="60"
              />
              <div className="form-text">
                How quickly to respond to direct messages
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseSettings; 