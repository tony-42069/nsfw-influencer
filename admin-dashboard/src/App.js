import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Import pages
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import EngagementPage from './pages/EngagementPage';
import PersonalityPage from './pages/PersonalityPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <div className="container-fluid flex-grow-1">
          <div className="row">
            <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
              <Sidebar />
            </div>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/content" element={<ContentPage />} />
                <Route path="/engagement" element={<EngagementPage />} />
                <Route path="/personality" element={<PersonalityPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
