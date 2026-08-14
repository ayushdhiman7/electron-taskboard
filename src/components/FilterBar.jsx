import React from 'react';

// FilterBar narrows down which tasks are shown.
// All filters live in `filters` state owned by App.jsx.

export default function FilterBar({ filters, setFilters }) {
  const update = (key, value) => setFilters({ ...filters, [key]: value });

  return (
    <div className="filter-bar" id="filter-bar">
      <select value={filters.priority} onChange={(e) => update('priority', e.target.value)}>
        <option value="all">Any priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select value={filters.status} onChange={(e) => update('status', e.target.value)}>
        <option value="all">All status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>

      <select value={filters.sortBy} onChange={(e) => update('sortBy', e.target.value)}>
        <option value="createdAt">Newest first</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due date</option>
        <option value="title">Title</option>
      </select>

      <button
        className={filters.status === 'all' && filters.priority === 'all' ? 'active' : ''}
        onClick={() => setFilters({ ...filters, status: 'all', priority: 'all', sortBy: 'createdAt' })}
      >
        Reset
      </button>
    </div>
  );
}