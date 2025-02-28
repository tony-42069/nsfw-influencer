import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const PersonalityPage = () => {
  const [personalityConfig, setPersonalityConfig] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [error, setError] = useState(null);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    loadPersonalityConfig();
  }, []);

  const loadPersonalityConfig = async () => {
    setIsLoadingConfig(true);
    setConfigError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/personality/config`);
      
      if (response.data.success) {
        setPersonalityConfig(response.data.config);
      } else {
        setConfigError(response.data.message || 'Failed to load configuration');
      }
    } catch (error) {
      console.error('Error loading personality config:', error);
      setConfigError('Error connecting to the server');
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/personality/generate`, {
        prompt: prompt
      });
      
      if (response.data.success) {
        setResponse(response.data.response);
      } else {
        setError(response.data.message || 'Failed to generate response');
      }
    } catch (error) {
      console.error('Error generating response:', error);
      setError('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Personality Settings</h1>
        <button 
          className="btn btn-sm btn-secondary"
          onClick={loadPersonalityConfig}
          disabled={isLoadingConfig}
        >
          {isLoadingConfig ? 'Loading...' : 'Refresh Configuration'}
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Generate Custom Response</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="prompt" className="form-label">Custom Prompt</label>
                  <textarea 
                    id="prompt" 
                    className="form-control" 
                    rows="3"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a custom prompt..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? 'Generating...' : 'Generate Response'}
                </button>
              </form>
              
              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                </div>
              )}
              
              {response && (
                <div className="mt-4">
                  <h6>Response:</h6>
                  <div className="border p-3 bg-light">
                    {response}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">Personality Configuration</h5>
            </div>
            <div className="card-body">
              {configError && (
                <div className="alert alert-danger">
                  {configError}
                </div>
              )}
              
              {isLoadingConfig ? (
                <p className="text-muted">Loading configuration...</p>
              ) : personalityConfig ? (
                <div className="border p-3 bg-light" style={{ maxHeight: '500px', overflow: 'auto' }}>
                  <pre className="mb-0">{JSON.stringify(personalityConfig, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-muted">
                  No configuration loaded yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityPage; 