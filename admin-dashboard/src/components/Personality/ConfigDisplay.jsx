import React from 'react';

const ConfigDisplay = ({ config, isLoading, error }) => {
  if (error) {
    return (
      <div className="alert alert-danger">
        <h5 className="alert-heading">Error Loading Configuration</h5>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Personality Configuration</h5>
        </div>
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="card">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">Personality Configuration</h5>
        </div>
        <div className="card-body">
          <p className="text-muted">No configuration loaded. Please refresh to load the configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-info text-white">
        <h5 className="mb-0">Personality Configuration</h5>
      </div>
      <div className="card-body">
        <div className="border p-3 bg-light" style={{ maxHeight: '500px', overflow: 'auto' }}>
          <pre className="mb-0">{JSON.stringify(config, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default ConfigDisplay; 