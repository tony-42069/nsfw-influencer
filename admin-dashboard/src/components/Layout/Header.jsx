import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <Link to="/" className="navbar-brand col-md-3 col-lg-2 me-0 px-3">
        <span className="ms-2">AI Influencer Engine 🤠</span>
      </Link>
      <button
        className="navbar-toggler d-md-none collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="w-100"></div>
      <div className="navbar-nav">
        <div className="nav-item text-nowrap d-flex align-items-center">
          <span className="badge bg-success me-2 d-none d-md-block">API Running</span>
          <span id="api-status" className="badge bg-secondary me-3 d-none d-md-block">Checking...</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 