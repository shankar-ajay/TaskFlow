import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import BoardPage from './pages/BoardPage';
import BacklogPage from './pages/BacklogPage';
import ProjectsPage from './pages/ProjectsPage';
import IssueModal from './components/Modal/IssueModal';
import CreateProjectModal from './components/Modal/CreateProjectModal';
import './styles/App.css';

function AppContent() {
  const {
    currentPage, selectedIssue, setSelectedIssue, showCreateProject, setShowCreateProject,
    loading, error, projects,
  } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'board': return <BoardPage />;
      case 'backlog': return <BacklogPage />;
      case 'projects': return <ProjectsPage />;
      default: return <BoardPage />;
    }
  };

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="app-loading-spinner" />
        <p>Loading TaskFlow…</p>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="app-loading-screen">
        <div className="app-error-icon">⚠</div>
        <p className="app-error-title">Couldn't reach the backend</p>
        <p className="app-error-detail">{error}</p>
        <p className="app-error-hint">
          Make sure the Spring Boot API is running at{' '}
          <code>{process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />
      {error && (
        <div className="app-error-banner">
          {error} <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
      {selectedIssue && (
        <IssueModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}
      {showCreateProject && (
        <CreateProjectModal onClose={() => setShowCreateProject(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
