import React from 'react';

// TaskItem renders a single task: checkbox, title, description,
// and small badges for priority / project / tags / due date.

export default function TaskItem({ task, project, tags, onToggleComplete, onEdit, onDelete }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onToggleComplete(task.id, e.target.checked)}
      />
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">
          <span className={`badge priority-${task.priority}`}>{task.priority}</span>
          {project && (
            <span className="badge project">
              <span
                className="color-dot"
                style={{ background: project.color, width: 8, height: 8, marginRight: 4 }}
              />
              {project.name}
            </span>
          )}
          {tags.map((tag) => (
            <span key={tag.id} className="badge tag">
              #{tag.name}
            </span>
          ))}
          {task.dueDate && <span className="badge tag">due {task.dueDate}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button className="action-btn edit-btn" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}