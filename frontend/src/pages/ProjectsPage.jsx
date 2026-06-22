import React from 'react';
import { useApp } from '../context/AppContext';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const { projects, sprints, issues, setCurrentProjectId, setCurrentPage, setShowCreateProject } = useApp();

  const openProject = (id) => {
    setCurrentProjectId(id);
    setCurrentPage('board');
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1 className="board-title">Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowCreateProject(true)}>+ Create Project</button>
      </div>

      <div className="projects-table">
        <div className="projects-table-head">
          <span>Name</span>
          <span>Key</span>
          <span>Lead</span>
          <span>Issues</span>
          <span>Sprints</span>
        </div>
        {projects.map(p => {
          const projectIssues = issues.filter(i => i.projectId === p.id);
          const projectSprints = sprints.filter(s => s.projectId === p.id);
          return (
            <div key={p.id} className="projects-table-row" onClick={() => openProject(p.id)}>
              <span className="projects-table-name">
                <span className="projects-table-avatar" style={{ background: p.avatarColor }}>{p.key?.slice(0,2)}</span>
                {p.name}
              </span>
              <span className="projects-table-key">{p.key}</span>
              <span>{p.lead}</span>
              <span>{projectIssues.length}</span>
              <span>{projectSprints.length}</span>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="projects-empty">No projects yet. Create one to get started.</div>
        )}
      </div>
    </div>
  );
}
