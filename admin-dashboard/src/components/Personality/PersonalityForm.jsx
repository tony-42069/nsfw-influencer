import React, { useState } from 'react';

const PersonalityForm = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(prompt);
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Test Personality Response</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="prompt" className="form-label">Custom Prompt</label>
            <textarea 
              className="form-control" 
              id="prompt" 
              rows="4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt to test the AI personality..."
              required
            ></textarea>
            <div className="form-text">
              Try asking questions or giving scenarios to see how the personality responds.
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : 'Generate Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalityForm; 