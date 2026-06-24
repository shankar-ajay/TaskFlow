// API service layer for connecting to the Spring Boot backend.
// NOTE: The app currently runs on in-memory mock data via AppContext.jsx
// so it works instantly with zero setup. To connect to the real backend:
//   1. Start the Spring Boot backend (see backend/README or root README)
//   2. Replace the state logic in src/context/AppContext.jsx with calls
//      to the functions exported below (fetch wrappers are ready to go).

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
//const BASE_URL = process.env.REACT_APP_API_URL || 'https://taskflow-4od9.onrender.com/api';


async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// ---- Projects ----
export const ProjectAPI = {
  getAll: () => request('/projects'),
  getById: (id) => request(`/projects/${id}`),
  create: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
};

// ---- Sprints ----
export const SprintAPI = {
  getByProject: (projectId) => request(`/sprints?projectId=${projectId}`),
  getById: (id) => request(`/sprints/${id}`),
  create: (data) => request('/sprints', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/sprints/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  start: (id) => request(`/sprints/${id}/start`, { method: 'POST' }),
  complete: (id) => request(`/sprints/${id}/complete`, { method: 'POST' }),
  delete: (id) => request(`/sprints/${id}`, { method: 'DELETE' }),
};

// ---- Issues ----
export const IssueAPI = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/issues${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/issues/${id}`),
  getBacklog: (projectId) => request(`/issues/backlog?projectId=${projectId}`),
  create: (data) => request('/issues', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/issues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, status) => request(`/issues/${id}/status?status=${status}`, { method: 'PATCH' }),
  delete: (id) => request(`/issues/${id}`, { method: 'DELETE' }),
};
