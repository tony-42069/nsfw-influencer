import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaFileAlt, 
  FaComments, 
  FaUserAlt, 
  FaCog 
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="position-sticky pt-3">
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <FaHome className="me-2" />
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/content" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <FaFileAlt className="me-2" />
            Content Generator
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/engagement" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <FaComments className="me-2" />
            Engagement System
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/personality" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <FaUserAlt className="me-2" />
            Personality Settings
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <FaCog className="me-2" />
            System Settings
          </NavLink>
        </li>
      </ul>
      
      {/* System Status */}
      <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>System Status</span>
      </h6>
      <ul className="nav flex-column mb-2">
        <li className="nav-item px-3 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <span>MongoDB:</span>
            <span id="mongodb-status" className="badge bg-success">Connected</span>
          </div>
        </li>
        <li className="nav-item px-3 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <span>OpenAI:</span>
            <span id="openai-status" className="badge bg-success">Connected</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar; 