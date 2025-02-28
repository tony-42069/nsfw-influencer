import React from 'react';
import { FaHeart, FaFlag, FaStar } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="p-3 mt-4 text-center">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-md-start">
            <div className="d-flex align-items-center">
              <FaFlag className="text-danger me-2" />
              <span className="fw-bold">MAGA Influencer Engine</span>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              Made with <FaHeart className="text-danger mx-1" /> in the USA
              <div className="mt-1">
                <FaStar className="text-warning" />
                <FaStar className="text-warning" />
                <FaStar className="text-warning" />
                <FaStar className="text-warning" />
                <FaStar className="text-warning" />
              </div>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <small>&copy; 2025 - NSFW Edition</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 