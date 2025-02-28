import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaFire, FaBolt, FaFlag } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="navbar navbar-dark sticky-top animated-bg flex-md-nowrap p-0 shadow">
      <Link to="/" className="navbar-brand col-md-3 col-lg-2 me-0 px-3 d-flex align-items-center spicy-element">
        <FaFire className="me-2" style={{ color: '#f1c40f' }} />
        <span>MAGA Influencer</span>
        <span className="nsfw-badge">NSFW</span>
      </Link>
      <button
        className="navbar-toggler d-md-none collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="w-100 d-none d-md-flex justify-content-center">
        <div className="header-banner px-3 py-1 rounded-pill d-flex align-items-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <FaBolt style={{ color: '#f1c40f' }} className="me-2" />
          <span style={{ color: '#ffffff', fontWeight: 'bold', letterSpacing: '1px' }}>
            MAKING CONTENT GREAT AGAIN
          </span>
          <FaFlag style={{ color: '#ff4d4d', marginLeft: '10px' }} />
        </div>
      </div>
      <div className="navbar-nav">
        <div className="nav-item text-nowrap d-flex align-items-center">
          <span className="badge bg-success me-2 d-none d-md-block">API Running</span>
          <span id="api-status" className="badge bg-secondary me-3 d-none d-md-block">Checking...</span>
          <Link to="/settings" className="btn btn-sm me-3" style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: 'white' }}>
            <FaLock className="me-1" /> Admin
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 