import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Modal.css';

export default function CreateProjectModal({ onClose }) {
  const { createProject, setCurrentProjectId, setCurrentPage, members } = useApp();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [lead, setLead] = useState(members[0]);
  const [errors, setErrors] = useState({});

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!key || key === generateKey(name)) {
      setKey(generateKey(val));
    }
  };

  const generateKey = (str) => {
    return str
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Project name is required';
    if (!key.trim()) newErrors.key = 'Project key is required';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    try {
      const project = await createProject({ name: name.trim(), key: key.trim().toUpperCase(), description, lead });
      setCurrentProjectId(project.id);
      setCurrentPage('board');
      onClose();
    } catch (err) {
      setErrors({ name: 'Failed to create project. Is the backend running?' });
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal-medium">
        <div className="modal-header">
          <h2>Create Project</h2>
          <button className="icon-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-field">
            <label>Project Name <span className="required">*</span></label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={e => { handleNameChange(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: '' })); }}
              placeholder="e.g. Mobile App Redesign"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-field">
            <label>Project Key <span className="required">*</span></label>
            <input
              type="text"
              value={key}
              maxLength={5}
              onChange={e => { setKey(e.target.value.toUpperCase()); if (errors.key) setErrors(p => ({ ...p, key: '' })); }}
              placeholder="e.g. MAR"
              style={{ width: '120px', textTransform: 'uppercase' }}
            />
            {errors.key && <span className="form-error">{errors.key}</span>}
            <span className="form-hint">Used as a prefix for issue IDs, e.g. {key || 'KEY'}-123</span>
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's this project about?"
            />
          </div>

          <div className="form-field">
            <label>Project Lead</label>
            <select value={lead} onChange={e => setLead(e.target.value)}>
              {members.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-footer">
            <div />
            <div className="form-footer-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Project</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
