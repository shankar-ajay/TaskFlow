import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ProjectAPI, SprintAPI, IssueAPI } from '../utils/api';

const AppContext = createContext(null);

const COLORS = ['#5243AA', '#0052CC', '#00875A', '#FF5630', '#FF8B00', '#36B37E', '#00B8D9'];
const MEMBERS = ['Alice Johnson', 'Bob Smith', 'Carol White', 'Dave Brown', 'Eve Davis', 'Frank Green'];

export function AppProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [issues, setIssues] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentPage, setCurrentPage] = useState('board');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---- Initial load: fetch all projects, then default to the first one ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const allProjects = await ProjectAPI.getAll();
        if (cancelled) return;
        setProjects(allProjects);
        if (allProjects.length > 0) {
          setCurrentProjectId(allProjects[0].id);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ---- Whenever the active project changes, load its sprints + issues ----
  const refreshProjectData = useCallback(async (projectId) => {
    if (!projectId) return;
    try {
      setError(null);
      const [projectSprints, projectIssues] = await Promise.all([
        SprintAPI.getByProject(projectId),
        IssueAPI.getAll({ projectId }),
      ]);
      setSprints(prev => [...prev.filter(s => s.projectId !== projectId), ...projectSprints]);
      setIssues(prev => [...prev.filter(i => i.projectId !== projectId), ...projectIssues]);
    } catch (err) {
      setError(err.message || 'Failed to load project data');
    }
  }, []);

  useEffect(() => {
    if (currentProjectId) refreshProjectData(currentProjectId);
  }, [currentProjectId, refreshProjectData]);

  const currentProject = projects.find(p => p.id === currentProjectId);
  const currentSprints = sprints.filter(s => s.projectId === currentProjectId);
  const activeSprint = currentSprints.find(s => s.status === 'ACTIVE');

  const getSprintIssues = useCallback((sprintId) => {
    let filtered = issues.filter(i => i.sprintId === sprintId);
    if (filterAssignee) filtered = filtered.filter(i => i.assignee === filterAssignee);
    if (filterType) filtered = filtered.filter(i => i.type === filterType);
    if (searchQuery) filtered = filtered.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [issues, filterAssignee, filterType, searchQuery]);

  const getBacklogIssues = useCallback(() => {
    return issues.filter(i => i.projectId === currentProjectId && !i.sprintId);
  }, [issues, currentProjectId]);

  // ---- Issues ----
  const createIssue = useCallback(async (issueData) => {
    const payload = {
      ...issueData,
      projectId: currentProjectId,
      status: issueData.status || 'TODO',
    };
    try {
      const created = await IssueAPI.create(payload);
      setIssues(prev => [...prev, created]);
      return created;
    } catch (err) {
      setError(err.message || 'Failed to create issue');
      throw err;
    }
  }, [currentProjectId]);

  const updateIssue = useCallback(async (id, updates) => {
    const existing = issues.find(i => i.id === id);
    if (!existing) return;
    const payload = { ...existing, ...updates };

    // Optimistic update so the UI feels instant
    setIssues(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    if (selectedIssue?.id === id) {
      setSelectedIssue(prev => ({ ...prev, ...updates }));
    }

    try {
      const saved = await IssueAPI.update(id, payload);
      setIssues(prev => prev.map(i => i.id === id ? saved : i));
      if (selectedIssue?.id === id) setSelectedIssue(saved);
    } catch (err) {
      setError(err.message || 'Failed to update issue');
      // Roll back by re-syncing from the server
      if (currentProjectId) refreshProjectData(currentProjectId);
    }
  }, [issues, selectedIssue, currentProjectId, refreshProjectData]);

  const deleteIssue = useCallback(async (id) => {
    const previous = issues;
    setIssues(prev => prev.filter(i => i.id !== id));
    if (selectedIssue?.id === id) setSelectedIssue(null);
    try {
      await IssueAPI.delete(id);
    } catch (err) {
      setError(err.message || 'Failed to delete issue');
      setIssues(previous);
    }
  }, [issues, selectedIssue]);

  const moveIssue = useCallback(async (issueId, newStatus) => {
    // Optimistic move for snappy drag-and-drop
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: newStatus } : i));
    try {
      const saved = await IssueAPI.updateStatus(issueId, newStatus);
      setIssues(prev => prev.map(i => i.id === issueId ? saved : i));
    } catch (err) {
      setError(err.message || 'Failed to move issue');
      if (currentProjectId) refreshProjectData(currentProjectId);
    }
  }, [currentProjectId, refreshProjectData]);

  const assignIssueToSprint = useCallback(async (issueId, sprintId) => {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, sprintId } : i));
    const existing = issues.find(i => i.id === issueId);
    if (!existing) return;
    try {
      const saved = await IssueAPI.update(issueId, { ...existing, sprintId });
      setIssues(prev => prev.map(i => i.id === issueId ? saved : i));
    } catch (err) {
      setError(err.message || 'Failed to move issue to sprint');
      if (currentProjectId) refreshProjectData(currentProjectId);
    }
  }, [issues, currentProjectId, refreshProjectData]);

  // ---- Sprints ----
  const createSprint = useCallback(async (sprintData) => {
    const payload = { ...sprintData, projectId: currentProjectId, status: 'PLANNED' };
    try {
      const created = await SprintAPI.create(payload);
      setSprints(prev => [...prev, created]);
      return created;
    } catch (err) {
      setError(err.message || 'Failed to create sprint');
      throw err;
    }
  }, [currentProjectId]);

  const updateSprint = useCallback(async (id, updates) => {
    const existing = sprints.find(s => s.id === id);
    if (!existing) return;
    const payload = { ...existing, ...updates };
    setSprints(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    try {
      const saved = await SprintAPI.update(id, payload);
      setSprints(prev => prev.map(s => s.id === id ? saved : s));
    } catch (err) {
      setError(err.message || 'Failed to update sprint');
      if (currentProjectId) refreshProjectData(currentProjectId);
    }
  }, [sprints, currentProjectId, refreshProjectData]);

  const startSprint = useCallback(async (id) => {
    setSprints(prev => prev.map(s => s.id === id ? { ...s, status: 'ACTIVE' } : s));
    try {
      const saved = await SprintAPI.start(id);
      setSprints(prev => prev.map(s => s.id === id ? saved : s));
    } catch (err) {
      setError(err.message || 'Failed to start sprint');
      if (currentProjectId) refreshProjectData(currentProjectId);
    }
  }, [currentProjectId, refreshProjectData]);

  const completeSprint = useCallback(async (id) => {
    setSprints(prev => prev.map(s => s.id === id ? { ...s, status: 'COMPLETED' } : s));
    try {
      const saved = await SprintAPI.complete(id);
      setSprints(prev => prev.map(s => s.id === id ? saved : s));
      // Backend returns unfinished issues to the backlog; resync issues to reflect that
      if (currentProjectId) refreshProjectData(currentProjectId);
    } catch (err) {
      setError(err.message || 'Failed to complete sprint');
      if (currentProjectId) refreshProjectData(currentProjectId);
    }
  }, [currentProjectId, refreshProjectData]);

  // ---- Projects ----
  const createProject = useCallback(async (projectData) => {
    const payload = {
      ...projectData,
      avatarColor: projectData.avatarColor || COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    try {
      const created = await ProjectAPI.create(payload);
      setProjects(prev => [...prev, created]);
      return created;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      throw err;
    }
  }, []);

  return (
    <AppContext.Provider value={{
      projects, sprints, issues, currentProject, currentProjectId,
      currentSprints, activeSprint, currentPage, selectedIssue,
      showCreateProject, filterAssignee, filterType, searchQuery,
      members: MEMBERS, loading, error,
      setCurrentProjectId, setCurrentPage, setSelectedIssue,
      setShowCreateProject, setFilterAssignee, setFilterType, setSearchQuery,
      getSprintIssues, getBacklogIssues,
      createIssue, updateIssue, deleteIssue, moveIssue,
      createSprint, updateSprint, startSprint, completeSprint,
      createProject, assignIssueToSprint,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
