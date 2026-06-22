import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import IssueCard, { Avatar } from '../components/Issue/IssueCard';
import CreateIssueModal from '../components/Modal/CreateIssueModal';
import './BoardPage.css';

const COLUMNS = [
  { id: 'TODO',        label: 'To Do',       color: '#6b778c' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: '#0052CC' },
  { id: 'IN_REVIEW',   label: 'In Review',   color: '#FF8B00' },
  { id: 'DONE',        label: 'Done',        color: '#36B37E' },
];

function BoardColumn({ column, issues, onDrop, onDragOver, onDragStart, onIssueClick }) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`board-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); onDragOver(e); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={e => { setIsDragOver(false); onDrop(e, column.id); }}
    >
      <div className="board-column-header">
        <div className="board-column-title">
          <span className="board-column-dot" style={{ background: column.color }} />
          <span>{column.label}</span>
        </div>
        <span className="board-column-count">{issues.length}</span>
      </div>

      <div className="board-column-cards">
        {issues.map(issue => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onClick={onIssueClick}
            draggable
            onDragStart={onDragStart}
          />
        ))}
        {issues.length === 0 && (
          <div className="board-column-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dfe1e6" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <p>Drop issues here</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardPage() {
  const {
    activeSprint, currentSprints, currentProject,
    getSprintIssues, moveIssue, setSelectedIssue,
    filterAssignee, setFilterAssignee, filterType, setFilterType,
    members, startSprint, completeSprint,
  } = useApp();

  const [draggedIssue, setDraggedIssue] = useState(null);
  const [showCreateIssue, setShowCreateIssue] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState(null);

  const displaySprint = activeSprint || currentSprints.find(s => s.status === 'PLANNED') || currentSprints[0];
  const sprintId = selectedSprintId || displaySprint?.id;
  const sprint = currentSprints.find(s => s.id === sprintId) || displaySprint;

  const issues = sprintId ? getSprintIssues(sprintId) : [];
  const todoCount = issues.filter(i => i.status !== 'DONE').length;
  const doneCount = issues.filter(i => i.status === 'DONE').length;
  const progress = issues.length ? Math.round((doneCount / issues.length) * 100) : 0;

  const handleDragStart = (e, issue) => {
    setDraggedIssue(issue);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedIssue && draggedIssue.status !== status) {
      moveIssue(draggedIssue.id, status);
    }
    setDraggedIssue(null);
  };

  const issuesByStatus = (status) => issues.filter(i => i.status === status);

  return (
    <div className="board-page">
      {/* Sprint Header */}
      <div className="board-header">
        <div className="board-header-top">
          <div>
            <div className="board-breadcrumb">
              <span className="board-breadcrumb-project">{currentProject?.name}</span>
              <span className="board-breadcrumb-sep">›</span>
              <span>Board</span>
            </div>
            <h1 className="board-title">{sprint?.name || 'No Sprint'}</h1>
            {sprint?.goal && <p className="board-goal">{sprint.goal}</p>}
          </div>

          <div className="board-header-actions">
            {sprint && sprint.status === 'PLANNED' && (
              <button className="btn btn-primary" onClick={() => startSprint(sprint.id)}>
                Start Sprint
              </button>
            )}
            {sprint && sprint.status === 'ACTIVE' && (
              <button className="btn btn-danger" onClick={() => completeSprint(sprint.id)}>
                Complete Sprint
              </button>
            )}
            <button className="btn btn-secondary" onClick={() => setShowCreateIssue(true)}>
              + Create Issue
            </button>
          </div>
        </div>

        {/* Sprint selector tabs */}
        {currentSprints.length > 1 && (
          <div className="sprint-tabs">
            {currentSprints.map(s => (
              <button
                key={s.id}
                className={`sprint-tab ${(sprintId === s.id || (!sprintId && s.id === displaySprint?.id)) ? 'active' : ''}`}
                onClick={() => setSelectedSprintId(s.id)}
              >
                {s.name}
                <span className={`sprint-tab-status ${s.status.toLowerCase()}`}>{s.status}</span>
              </button>
            ))}
          </div>
        )}

        {/* Filters + Progress */}
        <div className="board-filters-row">
          <div className="board-filters">
            <input
              className="filter-search"
              placeholder="Filter issues..."
              onChange={e => {/* handled in context */}}
            />

            <div className="filter-avatars">
              {members.slice(0, 5).map(m => (
                <div
                  key={m}
                  className={`filter-avatar ${filterAssignee === m ? 'selected' : ''}`}
                  onClick={() => setFilterAssignee(filterAssignee === m ? '' : m)}
                  title={m}
                >
                  <Avatar name={m} size={28} />
                </div>
              ))}
              {filterAssignee && (
                <button className="filter-clear" onClick={() => setFilterAssignee('')}>
                  Clear
                </button>
              )}
            </div>

            <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              <option value="STORY">Story</option>
              <option value="BUG">Bug</option>
              <option value="TASK">Task</option>
              <option value="EPIC">Epic</option>
            </select>
          </div>

          {sprint && (
            <div className="board-progress">
              <span className="board-progress-label">{doneCount}/{issues.length} done</span>
              <div className="board-progress-bar">
                <div className="board-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="board-progress-pct">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="board-columns">
        {COLUMNS.map(col => (
          <BoardColumn
            key={col.id}
            column={col}
            issues={issuesByStatus(col.id)}
            onDragStart={handleDragStart}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onIssueClick={setSelectedIssue}
          />
        ))}
      </div>

      {showCreateIssue && (
        <CreateIssueModal
          sprintId={sprintId}
          onClose={() => setShowCreateIssue(false)}
        />
      )}
    </div>
  );
}
