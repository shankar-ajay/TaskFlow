import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Modal.css';

const TYPES = ['STORY', 'BUG', 'TASK', 'EPIC', 'SUBTASK'];
const PRIORITIES = ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST'];

export default function CreateIssueModal({ sprintId, onClose }) {
  const { createIssue, members, currentSprints } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('TASK');
  const [priority, setPriority] = useState('MEDIUM');
  const [assignee, setAssignee] = useState('');
  const [reporter, setReporter] = useState(members[0]);
  const [storyPoints, setStoryPoints] = useState('');
  const [label, setLabel] = useState('');
  const [selectedSprintId, setSelectedSprintId] = useState(sprintId || '');
  const [createAnother, setCreateAnother] = useState(false);
  const [error, setError] = useState('');

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLabel('');
    setStoryPoints('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    createIssue({
      title: title.trim(),
      description,
      type,
      priority,
      assignee: assignee || null,
      reporter,
      storyPoints: storyPoints ? Number(storyPoints) : null,
      label,
      sprintId: selectedSprintId ? Number(selectedSprintId) : null,
      status: 'TODO',
    });

    if (createAnother) {
      resetForm();
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal-medium">
        <div className="modal-header">
          <h2>Create Issue</h2>
          <button className="icon-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-row">
            <div className="form-field">
              <label>Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Title <span className="required">*</span></label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => { setTitle(e.target.value); if (error) setError(''); }}
              placeholder="What needs to be done?"
            />
            {error && <span className="form-error">{error}</span>}
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a description..."
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Assignee</label>
              <select value={assignee} onChange={e => setAssignee(e.target.value)}>
                <option value="">Unassigned</option>
                {members.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Reporter</label>
              <select value={reporter} onChange={e => setReporter(e.target.value)}>
                {members.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Sprint</label>
              <select value={selectedSprintId} onChange={e => setSelectedSprintId(e.target.value)}>
                <option value="">Backlog</option>
                {currentSprints.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Story Points</label>
              <input
                type="number"
                min="0"
                value={storyPoints}
                onChange={e => setStoryPoints(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Label</label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g. frontend, bug-fix"
            />
          </div>

          <div className="form-footer">
            <label className="checkbox-label">
              <input type="checkbox" checked={createAnother} onChange={e => setCreateAnother(e.target.checked)} />
              Create another
            </label>
            <div className="form-footer-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Issue</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
