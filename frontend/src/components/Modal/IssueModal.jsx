import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TypeBadge} from '../Issue/IssueCard';
import './Modal.css';

const TYPES = ['STORY', 'BUG', 'TASK', 'EPIC', 'SUBTASK'];
const PRIORITIES = ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST'];
const STATUSES = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export default function IssueModal({ issue, onClose }) {
  const { updateIssue, deleteIssue, members, currentSprints } = useApp();
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description || '');
  const [confirmDelete, setConfirmDelete] = useState(false);

 // useEffect(() => {
 //   setTitle(issue.title);
 //   setDescription(issue.description || '');
 // }, [issue.id]);
 useEffect(() => {
  setTitle(issue.title);
  setDescription(issue.description || '');
}, [issue.id, issue.title, issue.description]);

  const handleTitleBlur = () => {
    if (title.trim() && title !== issue.title) updateIssue(issue.id, { title: title.trim() });
  };

  const handleDescBlur = () => {
    if (description !== issue.description) updateIssue(issue.id, { description });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleDelete = () => {
    deleteIssue(issue.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal-large">
        <div className="modal-topbar">
          <div className="modal-topbar-left">
            <TypeBadge type={issue.type} />
            <span className="modal-issue-key">{issue.projectKey || 'PROJ'}-{issue.id}</span>
          </div>
          <div className="modal-topbar-actions">
            {confirmDelete ? (
              <div className="confirm-delete-bar">
                <span>Delete issue?</span>
                <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            ) : (
              <button className="icon-btn" title="Delete issue" onClick={() => setConfirmDelete(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            )}
            <button className="icon-btn" onClick={onClose} title="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="modal-body modal-body-split">
          <div className="modal-main-col">
            <textarea
              className="modal-title-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              rows={1}
            />

            <div className="modal-field-group">
              <label className="modal-label">Description</label>
              <textarea
                className="modal-description-input"
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleDescBlur}
                placeholder="Add a description..."
                rows={6}
              />
            </div>
          </div>

          <div className="modal-side-col">
            <div className="modal-field">
              <label className="modal-label">Status</label>
              <select
                className="modal-select status-select"
                value={issue.status}
                onChange={e => updateIssue(issue.id, { status: e.target.value })}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Assignee</label>
              <select
                className="modal-select"
                value={issue.assignee || ''}
                onChange={e => updateIssue(issue.id, { assignee: e.target.value || null })}
              >
                <option value="">Unassigned</option>
                {members.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Reporter</label>
              <select
                className="modal-select"
                value={issue.reporter || ''}
                onChange={e => updateIssue(issue.id, { reporter: e.target.value || null })}
              >
                {members.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Type</label>
              <select
                className="modal-select"
                value={issue.type}
                onChange={e => updateIssue(issue.id, { type: e.target.value })}
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Priority</label>
              <select
                className="modal-select"
                value={issue.priority}
                onChange={e => updateIssue(issue.id, { priority: e.target.value })}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Sprint</label>
              <select
                className="modal-select"
                value={issue.sprintId || ''}
                onChange={e => updateIssue(issue.id, { sprintId: e.target.value ? Number(e.target.value) : null })}
              >
                <option value="">Backlog</option>
                {currentSprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Story Points</label>
              <input
                type="number"
                className="modal-select"
                value={issue.storyPoints || ''}
                min="0"
                onChange={e => updateIssue(issue.id, { storyPoints: e.target.value ? Number(e.target.value) : null })}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Label</label>
              <input
                type="text"
                className="modal-select"
                value={issue.label || ''}
                placeholder="e.g. frontend"
                onChange={e => updateIssue(issue.id, { label: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
