const BASE = '/api';

// ─── Dashboard ──────────────────────────────────────────────
export const getDashboard = () => fetch(`${BASE}/dashboard`).then(r => r.json());
export const getConfig = () => fetch(`${BASE}/dashboard/config`).then(r => r.json());

// ─── Todos ──────────────────────────────────────────────────
export const getTodos = () => fetch(`${BASE}/todos`).then(r => r.json());

export const addTodo = (text) =>
  fetch(`${BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  }).then(r => r.json());

export const updateTodo = (id, fields) =>
  fetch(`${BASE}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields)
  }).then(r => r.json());

export const deleteTodo = (id) =>
  fetch(`${BASE}/todos/${id}`, { method: 'DELETE' }).then(r => r.json());

export const reorderTodos = (items) =>
  fetch(`${BASE}/todos/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  }).then(r => r.json());
