import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import IssueCard from '../components/Issue/IssueCard';
import { StatusBadge } from '../components/Issue/IssueCard';
import CreateIssueModal from '../components/Modal/CreateIssueModal';
import CreateSprintModal from '../components/Modal/CreateSprintModal';
import './BacklogPage.css';

function SprintSection({ sprint, issues, onIssueClick, expanded, onToggle, onStart, onComplete, onAddIssue }) {
  const doneCount = issues.filter(i => i.status === 'DONE').length;
  const totalPoints = issues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);

  return (
    <div className="backlog-sprint-section">
      <div className="backlog-sprint-header" onClick={onToggle}>
        <svg className={`backlog-chevron ${expanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <span className="backlog-sprint-name">{sprint.name}</span>
        {sprint.startDate && sprint.endDate && (
          <span className="backlog-sprint-dates">{sprint.startDate} – {sprint.endDate}</span>
        )}
        <span className="backlog-sprint-count">{issues.length} issues</span>
        {totalPoints > 0 && <span className="backlog-sprint-points">{totalPoints} pts</span>}
        <div className="backlog-sprint-actions" onClick={e => e.stopPropagation()}>
          {sprint.status === 'PLANNED' && (
            <button className="btn btn-primary btn-sm" onClick={() => onStart(sprint.id)}>Start Sprint</button>
          )}
          {sprint.status === 'ACTIVE' && (
            <button className="btn btn-danger btn-sm" onClick={() => onComplete(sprint.id)}>Complete Sprint</button>
          )}
          <StatusBadge status={sprint.status === 'ACTIVE' ? 'IN_PROGRESS' : sprint.status === 'COMPLETED' ? 'DONE' : 'TODO'} />
        </div>
      </div>

      {expanded && (
        <div className="backlog-sprint-body">
          {issues.map(issue => (
            <div key={issue.id} className="backlog-issue-row" onClick={() => onIssueClick(issue)}>
              <IssueCard issue={issue} onClick={onIssueClick} />
            </div>
          ))}
          {issues.length === 0 && (
            <div className="backlog-empty-row">No issues in this sprint yet. Drag issues here from the backlog.</div>
          )}
          <button className="backlog-add-issue-btn" onClick={() => onAddIssue(sprint.id)}>+ Create issue</button>
        </div>
      )}
    </div>
  );
}

export default function BacklogPage() {
  const {
    currentSprints, getSprintIssues, getBacklogIssues,
    setSelectedIssue, startSprint, completeSprint, currentProject,
    assignIssueToSprint,
  } = useApp();

  const [expandedSprints, setExpandedSprints] = useState(() => {
    const initial = {};
    currentSprints.forEach(s => { initial[s.id] = s.status !== 'COMPLETED'; });
    return initial;
  });
  const [backlogExpanded, setBacklogExpanded] = useState(true);
  const [showCreateIssue, setShowCreateIssue] = useState(false);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [targetSprintId, setTargetSprintId] = useState(null);
  const [draggedIssue, setDraggedIssue] = useState(null);

  const backlogIssues = getBacklogIssues();

  const toggleSprint = (id) => setExpandedSprints(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAddIssue = (sprintId) => {
    setTargetSprintId(sprintId);
    setShowCreateIssue(true);
  };

  const handleDragStart = (e, issue) => {
    setDraggedIssue(issue);
  };

  const handleDropOnSprint = (e, sprintId) => {
    e.preventDefault();
    if (draggedIssue) assignIssueToSprint(draggedIssue.id, sprintId);
    setDraggedIssue(null);
  };

  const handleDropOnBacklog = (e) => {
    e.preventDefault();
    if (draggedIssue) assignIssueToSprint(draggedIssue.id, null);
    setDraggedIssue(null);
  };

  return (
    <div className="backlog-page">
      <div className="backlog-header">
        <div className="board-breadcrumb">
          <span className="board-breadcrumb-project">{currentProject?.name}</span>
          <span className="board-breadcrumb-sep">›</span>
          <span>Backlog</span>
        </div>
        <div className="backlog-header-row">
          <h1 className="board-title">Backlog</h1>
          <button className="btn btn-secondary" onClick={() => setShowCreateSprint(true)}>+ Create Sprint</button>
        </div>
      </div>

      <div className="backlog-content">
        {currentSprints.filter(s => s.status !== 'COMPLETED').map(sprint => (
          <div key={sprint.id} onDragOver={e => e.preventDefault()} onDrop={e => handleDropOnSprint(e, sprint.id)}>
            <SprintSection
              sprint={sprint}
              issues={getSprintIssues(sprint.id)}
              onIssueClick={setSelectedIssue}
              expanded={expandedSprints[sprint.id]}
              onToggle={() => toggleSprint(sprint.id)}
              onStart={startSprint}
              onComplete={completeSprint}
              onAddIssue={handleAddIssue}
            />
          </div>
        ))}

        {/* Backlog section */}
        <div className="backlog-sprint-section" onDragOver={e => e.preventDefault()} onDrop={handleDropOnBacklog}>
          <div className="backlog-sprint-header" onClick={() => setBacklogExpanded(!backlogExpanded)}>
            <svg className={`backlog-chevron ${backlogExpanded ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span className="backlog-sprint-name">Backlog</span>
            <span className="backlog-sprint-count">{backlogIssues.length} issues</span>
          </div>
          {backlogExpanded && (
            <div className="backlog-sprint-body">
              {backlogIssues.map(issue => (
                <div key={issue.id} className="backlog-issue-row">
                  <IssueCard issue={issue} onClick={setSelectedIssue} draggable onDragStart={handleDragStart} />
                </div>
              ))}
              {backlogIssues.length === 0 && (
                <div className="backlog-empty-row">Backlog is empty.</div>
              )}
              <button className="backlog-add-issue-btn" onClick={() => handleAddIssue(null)}>+ Create issue</button>
            </div>
          )}
        </div>

        {currentSprints.filter(s => s.status === 'COMPLETED').length > 0 && (
          <>
            <div className="backlog-divider">Completed Sprints</div>
            {currentSprints.filter(s => s.status === 'COMPLETED').map(sprint => (
              <SprintSection
                key={sprint.id}
                sprint={sprint}
                issues={getSprintIssues(sprint.id)}
                onIssueClick={setSelectedIssue}
                expanded={expandedSprints[sprint.id]}
                onToggle={() => toggleSprint(sprint.id)}
                onStart={startSprint}
                onComplete={completeSprint}
                onAddIssue={handleAddIssue}
              />
            ))}
          </>
        )}
      </div>

      {showCreateIssue && (
        <CreateIssueModal
          sprintId={targetSprintId}
          onClose={() => { setShowCreateIssue(false); setTargetSprintId(null); }}
        />
      )}
      {showCreateSprint && (
        <CreateSprintModal onClose={() => setShowCreateSprint(false)} />
      )}
    </div>
  );
}
