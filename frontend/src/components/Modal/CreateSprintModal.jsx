import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Modal.css';

export default function CreateSprintModal({ onClose }) {
  const { createSprint, currentSprints } = useApp();
  const [name, setName] = useState(`Sprint ${currentSprints.length + 1}`);
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Sprint name is required');
      return;
    }
    createSprint({ name: name.trim(), goal, startDate: startDate || null, endDate: endDate || null });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal-medium">
        <div className="modal-header">
          <h2>Create Sprint</h2>
          <button className="icon-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-field">
            <label>Sprint Name <span className="required">*</span></label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={e => { setName(e.target.value); if (error) setError(''); }}
            />
            {error && <span className="form-error">{error}</span>}
          </div>

          <div className="form-field">
            <label>Sprint Goal</label>
            <textarea
              rows={2}
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="What's the focus of this sprint?"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="form-field">
              <label>End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="form-footer">
            <div />
            <div className="form-footer-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Sprint</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
