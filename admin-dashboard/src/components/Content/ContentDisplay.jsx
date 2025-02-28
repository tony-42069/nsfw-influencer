import React from 'react';

const ContentDisplay = ({ content, error }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('Content copied to clipboard!');
  };

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5 className="alert-heading">Error</h5>
        <p>{error}</p>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Generated Content</h5>
        <div>
          <button 
            className="btn btn-sm btn-light me-2" 
            onClick={copyToClipboard}
          >
            <i className="fas fa-copy me-1"></i> Copy
          </button>
          <button className="btn btn-sm btn-light">
            <i className="fas fa-save me-1"></i> Save
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="response-box">
          {content.split('\n').map((line, index) => (
            <p key={index} className={line.trim() === '' ? 'mb-3' : 'mb-1'}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentDisplay; 