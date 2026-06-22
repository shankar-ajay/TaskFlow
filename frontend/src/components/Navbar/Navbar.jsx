import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { searchQuery, setSearchQuery, setShowCreateProject} = useApp();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#0052CC"/>
            <path d="M12 4L4 12l4 4 4-4 4 4 4-4-8-8z" fill="white" opacity="0.9"/>
            <path d="M8 16l4 4 4-4" fill="white" opacity="0.6"/>
          </svg>
          <span className="navbar-brand">TaskFlow</span>
        </div>
        <div className="navbar-links">
          <span className="navbar-link">Your work</span>
          <span className="navbar-link">Projects</span>
          <span className="navbar-link">Teams</span>
          <span className="navbar-link">Plans</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className={`navbar-search ${showSearch ? 'expanded' : ''}`}>
          <button className="search-icon-btn" onClick={() => setShowSearch(!showSearch)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          {showSearch && (
            <input
              autoFocus
              className="navbar-search-input"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={() => { if (!searchQuery) setShowSearch(false); }}
            />
          )}
        </div>

        <button className="navbar-create-btn" onClick={() => setShowCreateProject(true)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create
        </button>

        <button className="navbar-icon-btn" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        <button className="navbar-icon-btn" title="Help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>

        <div className="navbar-avatar" title="Alice Johnson">AJ</div>
      </div>
    </nav>
  );
}
