import React from 'react';

const ResponseDisplay = ({ response, error }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    alert('Response copied to clipboard!');
  };

  if (error) {
    return (
      <div className="alert alert-danger">
        <h5 className="alert-heading">Error</h5>
        <p>{error}</p>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">AI Response</h5>
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
          {response.split('\n').map((line, index) => (
            <p key={index} className={line.trim() === '' ? 'mb-3' : 'mb-1'}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResponseDisplay; 