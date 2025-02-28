import React from 'react';

const ApiSettings = ({ settings, onChange, onTestConnection }) => {
  return (
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
                  onChange={onChange}
                  placeholder="Enter your OpenAI API Key"
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => onTestConnection('openai')}
                >
                  Test
                </button>
              </div>
              <div className="form-text">
                Your API key is stored securely and never shared.
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
                  onChange={onChange}
                  placeholder="Enter your MongoDB URI"
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => onTestConnection('mongodb')}
                >
                  Test
                </button>
              </div>
              <div className="form-text">
                Format: mongodb://username:password@host:port/database
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings; 