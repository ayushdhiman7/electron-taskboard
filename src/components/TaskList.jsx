import React from 'react';
import TaskItem from './TaskItem';

// TaskList takes the raw tasks + filters, computes what to show,
// and renders one TaskItem per task.

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function TaskList({ tasks, projects, tags, filters, onToggleComplete, onEdit, onDelete }) {
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));
  const tagById = Object.fromEntries(tags.map((t) => [t.id, t]));

  const visible = tasks
    .filter((task) => {
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.status === 'active' && task.completed) return false;
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.projectId !== 'all' && task.projectId !== filters.projectId) return false;
      if (filters.tagId !== 'all' && !task.tagIds.includes(filters.tagId)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'priority':
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case 'dueDate':
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });

  if (visible.length === 0) {
    return <div className="empty-state">No tasks match. Add one above!</div>;
  }

  return (
    <div className="task-list">
      {visible.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          project={task.projectId ? projectById[task.projectId] : null}
          tags={task.tagIds.map((id) => tagById[id]).filter(Boolean)}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}