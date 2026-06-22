import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Sidebar.css';

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button className={`sidebar-nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <span className="sidebar-nav-icon">{icon}</span>
    <span className="sidebar-nav-label">{label}</span>
    {badge && <span className="sidebar-nav-badge">{badge}</span>}
  </button>
);

export default function Sidebar() {
  const { currentPage, setCurrentPage, projects, currentProjectId, setCurrentProjectId, currentProject, currentSprints } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [showProjects, setShowProjects] = useState(true);

  const activeSprint = currentSprints.find(s => s.status === 'ACTIVE');

  const icons = {
    board: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    backlog: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    reports: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    projects: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Project Header */}
      <div className="sidebar-project-header">
        <div className="sidebar-project-avatar" style={{ background: currentProject?.avatarColor || '#0052CC' }}>
          {currentProject?.key?.slice(0, 2)}
        </div>
        {!collapsed && (
          <div className="sidebar-project-info">
            <div className="sidebar-project-name">{currentProject?.name}</div>
            <div className="sidebar-project-type">Software project</div>
          </div>
        )}
        <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expand' : 'Collapse'}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed
              ? <polyline points="9 18 15 12 9 6"/>
              : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>
      </div>

      {/* Planning section */}
      <div className="sidebar-section">
        {!collapsed && <div className="sidebar-section-title">PLANNING</div>}
        <NavItem icon={icons.board} label="Board" active={currentPage === 'board'} onClick={() => setCurrentPage('board')} badge={activeSprint ? 'Active' : null} />
        <NavItem icon={icons.backlog} label="Backlog" active={currentPage === 'backlog'} onClick={() => setCurrentPage('backlog')} />
        <NavItem icon={icons.reports} label="Reports" active={currentPage === 'reports'} onClick={() => setCurrentPage('reports')} />
      </div>

      {/* Projects switcher */}
      <div className="sidebar-section">
        {!collapsed && (
          <div className="sidebar-section-title sidebar-section-toggle" onClick={() => setShowProjects(!showProjects)}>
            PROJECTS
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showProjects ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        )}
        {(showProjects || collapsed) && projects.map(project => (
          <button
            key={project.id}
            className={`sidebar-project-item ${currentProjectId === project.id ? 'active' : ''}`}
            onClick={() => { setCurrentProjectId(project.id); setCurrentPage('board'); }}
            title={project.name}
          >
            <div className="sidebar-project-dot" style={{ background: project.avatarColor }}>{project.key?.slice(0, 2)}</div>
            {!collapsed && <span className="sidebar-project-item-name">{project.name}</span>}
          </button>
        ))}
      </div>

      {/* Bottom nav */}
      <div className="sidebar-bottom">
        <NavItem icon={icons.projects} label="All Projects" active={currentPage === 'projects'} onClick={() => setCurrentPage('projects')} />
      </div>
    </aside>
  );
}
