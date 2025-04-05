import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Helper function to format dates without date-fns
const formatDate = (date, formatStr) => {
  const d = new Date(date);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Format: yyyy-MM-dd
  if (formatStr === 'yyyy-MM-dd') {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Format: MMM dd, yyyy h:mm a
  if (formatStr === 'MMM dd, yyyy h:mm a') {
    const year = d.getFullYear();
    const month = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  }
  
  // Default: return ISO string
  return d.toISOString();
};

const ContentPage = () => {
  const [topic, setTopic] = useState('country lifestyle');
  const [contentType, setContentType] = useState('post');
  const [tone, setTone] = useState('casual');
  const [wordCount, setWordCount] = useState(150);
  const [hashtags, setHashtags] = useState(true);
  const [generatedContent, setGeneratedContent] = useState('');
  const [scheduledContent, setScheduledContent] = useState([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Set default schedule date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduleDate(formatDate(tomorrow, 'yyyy-MM-dd'));
    setScheduleTime('12:00');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFeedback('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/api/content/create`, {
        topic,
        content_type: contentType,
        tone,
        word_count: parseInt(wordCount),
        include_hashtags: hashtags
      });
      
      if (response.data.success) {
        setGeneratedContent(response.data.content);
        setShowPreview(true);
      } else {
        setError(response.data.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Error connecting to the server: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setFeedback('Content copied to clipboard!');
    setTimeout(() => setFeedback(''), 3000);
  };
  
  const handleSchedule = async () => {
    if (!generatedContent) return;
    
    setIsSaving(true);
    setError(null);
    setFeedback('');
    
    try {
      // Combine date and time for publishing
      const scheduleDateTime = `${scheduleDate}T${scheduleTime}:00`;
      
      const response = await axios.post(`${API_BASE_URL}/api/content/schedule`, {
        content: {
          text: generatedContent,
          type: contentType,
          topic: topic,
          tone: tone
        },
        publish_time: scheduleDateTime
      });
      
      if (response.data.success) {
        setScheduledContent([...scheduledContent, response.data.scheduled_content]);
        setFeedback('Content scheduled successfully!');
        setTimeout(() => {
          setShowPreview(false);
          setGeneratedContent('');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to schedule content');
      }
    } catch (error) {
      console.error('Error scheduling content:', error);
      setError('Error connecting to the server: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    } // End of finally
  } // End of handleSchedule

  const saveContent = async () => { // Start of saveContent
    if (!generatedContent) return;

    setIsSaving(true); // Use isSaving state
    setError(null);
    setFeedback('');

    const contentToSave = {
      text: generatedContent,
      type: contentType,
      topic: topic,
      tone: tone,
      // Let backend handle ID and timestamp
    };

    try {
      // Assume endpoint is /api/content/save
      const response = await axios.post(`${API_BASE_URL}/api/content/save`, contentToSave);

      if (response.data.success) {
        setFeedback('Content saved to library successfully!');
        // Optionally clear preview or give other feedback
      } else {
        setError(response.data.message || 'Failed to save content to library');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Error connecting to the server: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return formatDate(date, 'MMM dd, yyyy h:mm a');
    } catch (e) {
      return isoString;
    }
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
                    <option value="family values">Family Values</option>
                    <option value="traditional cooking">Traditional Cooking</option>
                    <option value="outdoor activities">Outdoor Activities</option>
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
                    <option value="caption">Photo Caption</option>
                    <option value="bio">Profile Bio</option>
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
                    <option value="motherly">Motherly</option>
                    <option value="nostalgic">Nostalgic</option>
                    <option value="proud">Proud</option>
                    <option value="inspirational">Inspirational</option>
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
                
                <div className="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="includeHashtags" 
                    checked={hashtags}
                    onChange={(e) => setHashtags(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="includeHashtags">Include Hashtags</label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Generating...
                    </>
                  ) : 'Generate Content'}
                </button>
              </form>
            </div>
          </div>
          
          {generatedContent && showPreview && (
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">Schedule Post</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="scheduleDate" className="form-label">Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        id="scheduleDate"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        min={formatDate(new Date(), 'yyyy-MM-dd')}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="scheduleTime" className="form-label">Time</label>
                      <input 
                        type="time" 
                        className="form-control" 
                        id="scheduleTime"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <button 
                  className="btn btn-info w-100"
                  onClick={handleSchedule}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Scheduling...
                    </>
                  ) : 'Schedule Content'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Content Preview</h5>
              {generatedContent && (
                <div className="btn-group btn-group-sm" role="group">
                  <button 
                    className="btn btn-light btn-sm"
                    onClick={() => setShowPreview(false)}
                  >
                    <i className="fas fa-times me-1"></i> 
                    Close
                  </button>
                </div>
              )}
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              {feedback && (
                <div className="alert alert-success">
                  {feedback}
                </div>
              )}
              
              {generatedContent ? (
                <>
                  <div className="content-preview border p-3 bg-light mb-3" style={{ minHeight: '200px', whiteSpace: 'pre-line' }}>
                    {generatedContent}
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-secondary" onClick={copyToClipboard}>
                      <i className="fas fa-copy me-1"></i> Copy
                    </button>
                    {/* Update Save button to use isSaving state */}
                    <button
                      className="btn btn-primary"
                      onClick={saveContent}
                      disabled={isSaving} // Disable button while saving
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-1"></i> Save to Library
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={() => setShowPreview(true)}
                      disabled={showPreview}
                    >
                      <i className="fas fa-calendar me-1"></i> Schedule
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-muted">
                  Generated content will appear here...
                </p>
              )}
            </div>
          </div>
          
          {scheduledContent.length > 0 && (
            <div className="card">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">Scheduled Content</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Topic</th>
                        <th>Scheduled For</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledContent.map((content, index) => (
                        <tr key={index}>
                          <td>{content.type}</td>
                          <td>{content.topic || '-'}</td>
                          <td>{formatDateTime(content.scheduled_for)}</td>
                          <td>
                            <span className="badge bg-info">{content.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
