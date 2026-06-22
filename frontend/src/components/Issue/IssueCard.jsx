import React from 'react';
import './IssueCard.css';

export const PRIORITY_CONFIG = {
  HIGHEST: { label: 'Highest', color: '#FF5630', icon: '↑↑' },
  HIGH:    { label: 'High',    color: '#FF5630', icon: '↑' },
  MEDIUM:  { label: 'Medium',  color: '#FF8B00', icon: '—' },
  LOW:     { label: 'Low',     color: '#0052CC', icon: '↓' },
  LOWEST:  { label: 'Lowest',  color: '#0052CC', icon: '↓↓' },
};

export const TYPE_CONFIG = {
  STORY:   { label: 'Story',   color: '#36B37E', bg: '#e3fcef', icon: '⬡' },
  BUG:     { label: 'Bug',     color: '#FF5630', bg: '#ffebe6', icon: '⬟' },
  TASK:    { label: 'Task',    color: '#0052CC', bg: '#deebff', icon: '✓' },
  EPIC:    { label: 'Epic',    color: '#5243AA', bg: '#EAE6FF', icon: '⚡' },
  SUBTASK: { label: 'Subtask', color: '#6b778c', bg: '#f4f5f7', icon: '⊡' },
};

export const STATUS_CONFIG = {
  TODO:        { label: 'To Do',       color: '#6b778c', bg: '#f4f5f7' },
  IN_PROGRESS: { label: 'In Progress', color: '#0052CC', bg: '#deebff' },
  IN_REVIEW:   { label: 'In Review',   color: '#FF8B00', bg: '#fffae6' },
  DONE:        { label: 'Done',        color: '#36B37E', bg: '#e3fcef' },
};

export function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.TASK;
  return (
    <span className="type-badge" style={{ background: cfg.bg, color: cfg.color }} title={cfg.label}>
      {cfg.icon}
    </span>
  );
}

export function PriorityIcon({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;
  return <span className="priority-icon" style={{ color: cfg.color }} title={cfg.label}>{cfg.icon}</span>;
}

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.TODO;
  return (
    <span className="status-badge" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

export function Avatar({ name, size = 24 }) {
  if (!name) return <div className="avatar-empty" style={{ width: size, height: size }}>?</div>;
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#FF5630', '#FF8B00', '#36B37E', '#0052CC', '#5243AA', '#00B8D9'];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }} title={name}>
      {initials}
    </div>
  );
}

export default function IssueCard({ issue, onClick, draggable, onDragStart }) {
  const handleDragStart = (e) => {
    if (onDragStart) onDragStart(e, issue);
  };

  return (
    <div
      className="issue-card"
      onClick={() => onClick && onClick(issue)}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      <div className="issue-card-title">{issue.title}</div>
      <div className="issue-card-meta">
        <div className="issue-card-meta-left">
          <TypeBadge type={issue.type} />
          <PriorityIcon priority={issue.priority} />
          {issue.label && <span className="issue-card-label">{issue.label}</span>}
        </div>
        <div className="issue-card-meta-right">
          {issue.storyPoints && (
            <span className="issue-card-points">{issue.storyPoints}</span>
          )}
          <Avatar name={issue.assignee} size={22} />
        </div>
      </div>
    </div>
  );
}
