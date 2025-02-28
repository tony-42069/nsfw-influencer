import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const ContentPage = () => {
  const [topic, setTopic] = useState('country lifestyle');
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('casual');
  const [wordCount, setWordCount] = useState(150);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/content/create`, {
        topic,
        content_type: contentType,
        tone,
        word_count: parseInt(wordCount)
      });
      
      if (response.data.success) {
        setGeneratedContent(response.data.content);
      } else {
        setError(response.data.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  return (
    <div>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Content Generator</h1>
      </div>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Generate Content</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="topic" className="form-label">Topic</label>
                  <select 
                    id="topic" 
                    className="form-select"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    <option value="country lifestyle">Country Lifestyle</option>
                    <option value="gun rights">Gun Rights</option>
                    <option value="freedom of speech">Freedom of Speech</option>
                    <option value="small business">Small Business</option>
                    <option value="patriotism">Patriotism</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="contentType" className="form-label">Content Type</label>
                  <select 
                    id="contentType" 
                    className="form-select"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                  >
                    <option value="post">Social Media Post</option>
                    <option value="story">Story</option>
                    <option value="reply">Reply</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="tone" className="form-label">Tone</label>
                  <select 
                    id="tone" 
                    className="form-select"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="casual">Casual</option>
                    <option value="fired up">Fired Up</option>
                    <option value="educational">Educational</option>
                    <option value="passionate">Passionate</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="wordCount" className="form-label">Word Count: {wordCount}</label>
                  <input 
                    type="range" 
                    className="form-range" 
                    id="wordCount" 
                    min="50" 
                    max="300" 
                    step="50" 
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Content'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Generated Content</h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              {generatedContent ? (
                <>
                  <div className="border p-3 bg-light mb-3" style={{ minHeight: '200px' }}>
                    {generatedContent}
                  </div>
                  <button className="btn btn-secondary me-2" onClick={copyToClipboard}>
                    Copy to Clipboard
                  </button>
                  <button className="btn btn-success">
                    Save Content
                  </button>
                </>
              ) : (
                <p className="text-muted">
                  Generated content will appear here...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPage; 