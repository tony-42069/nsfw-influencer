import React, { useState } from 'react';

const ContentForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    topic: '',
    contentType: 'post',
    tone: 'flirty',
    wordCount: 100
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Generate Content</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="topic" className="form-label">Topic or Prompt</label>
            <input 
              type="text" 
              className="form-control" 
              id="topic" 
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Enter a topic or specific prompt"
              required
            />
          </div>
          
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="contentType" className="form-label">Content Type</label>
                <select 
                  className="form-select" 
                  id="contentType" 
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                >
                  <option value="post">Social Media Post</option>
                  <option value="story">Story</option>
                  <option value="comment">Comment Reply</option>
                  <option value="message">Direct Message</option>
                  <option value="bio">Profile Bio</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="tone" className="form-label">Tone</label>
                <select 
                  className="form-select" 
                  id="tone" 
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                >
                  <option value="flirty">Flirty</option>
                  <option value="playful">Playful</option>
                  <option value="seductive">Seductive</option>
                  <option value="casual">Casual</option>
                  <option value="mysterious">Mysterious</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="wordCount" className="form-label">
                  Word Count: {formData.wordCount}
                </label>
                <input 
                  type="range" 
                  className="form-range" 
                  id="wordCount" 
                  name="wordCount"
                  min="50"
                  max="500"
                  step="10"
                  value={formData.wordCount}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !formData.topic.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : 'Generate Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentForm; 