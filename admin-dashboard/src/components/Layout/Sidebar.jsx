import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaFileAlt, 
  FaComments, 
  FaUserAlt, 
  FaCog,
  FaServer,
  FaBrain,
  FaDatabase
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="position-sticky pt-3">
      <div className="text-center mb-4">
        <div className="d-inline-block p-3 rounded-circle mb-2" 
             style={{ background: 'linear-gradient(135deg, #ff4d4d 0%, #ff758c 100%)' }}>
          <FaBrain className="text-white" style={{ fontSize: '2rem' }} />
        </div>
        <h5 className="text-white mb-0">Content Engine</h5>
        <div className="badge bg-warning">v1.0 Beta</div>
      </div>
      
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active spicy-element" : "nav-link spicy-element"}>
            <FaHome className="me-2" />
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/content" className={({isActive}) => isActive ? "nav-link active spicy-element" : "nav-link spicy-element"}>
            <FaFileAlt className="me-2" />
            Content Generator
            <span className="ms-auto badge bg-danger">Hot</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/engagement" className={({isActive}) => isActive ? "nav-link active spicy-element" : "nav-link spicy-element"}>
            <FaComments className="me-2" />
            Engagement System
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/personality" className={({isActive}) => isActive ? "nav-link active spicy-element" : "nav-link spicy-element"}>
            <FaUserAlt className="me-2" />
            Personality Settings
            <span className="ms-auto badge bg-warning">Spicy</span>
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active spicy-element" : "nav-link spicy-element"}>
            <FaCog className="me-2" />
            System Settings
          </NavLink>
        </li>
      </ul>
      
      {/* System Status */}
      <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1">
        <span>System Status</span>
        <FaServer className="text-warning" />
      </h6>
      <ul className="nav flex-column mb-2">
        <li className="nav-item px-3 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <FaDatabase className="me-2 text-info" />
              <span>MongoDB:</span>
            </div>
            <span id="mongodb-status" className="badge bg-success">Connected</span>
          </div>
        </li>
        <li className="nav-item px-3 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <FaBrain className="me-2 text-info" />
              <span>OpenAI:</span>
            </div>
            <span id="openai-status" className="badge bg-success">Connected</span>
          </div>
        </li>
      </ul>
      
      <div className="mt-5 px-3 text-center">
        <div className="p-3 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <small className="text-light d-block mb-2">Need more content?</small>
          <button className="btn btn-primary btn-sm w-100">Upgrade Plan</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 