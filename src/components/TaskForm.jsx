import React, { useEffect, useState } from 'react';

// TaskForm is used for BOTH adding a new task and editing an existing one.
// - No `editingTask`  -> empty form, "Add task" button
// - With `editingTask` -> pre-filled form, "Save" button

const EMPTY = {
  title: '',
  description: '',
  priority: 'medium',
  projectId: '',
  tagIds: [],
  dueDate: '',
};

export default function TaskForm({ editingTask, projects, tags, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    editingTask
      ? {
          title: editingTask.title,
          description: editingTask.description || '',
          priority: editingTask.priority,
          projectId: editingTask.projectId || '',
          tagIds: editingTask.tagIds || [],
          dueDate: editingTask.dueDate || '',
        }
      : EMPTY
  );

  // When the user clicks Edit, `editingTask` changes after mount.
  // useState only reads its initial value once, so we sync the form
  // with the newly selected task here.
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || '',
        priority: editingTask.priority,
        projectId: editingTask.projectId || '',
        tagIds: editingTask.tagIds || [],
        dueDate: editingTask.dueDate || '',
      });
    } else {
      setForm(EMPTY);
    }
  }, [editingTask]);

  const set = (key, value) => setForm({ ...form, [key]: value });

  const toggleTag = (tagId) => {
    set(
      'tagIds',
      form.tagIds.includes(tagId)
        ? form.tagIds.filter((id) => id !== tagId)
        : [...form.tagIds, tagId]
    );
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      projectId: form.projectId || null,
      tagIds: form.tagIds,
      dueDate: form.dueDate || null,
    });
    if (!editingTask) setForm(EMPTY);
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input
        id="task-title-input"
        type="text"
        placeholder="Task title"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
      />
      <textarea
        placeholder="Description (optional)"
        rows="2"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
      />
      <div className="row" id="task-options">
        <select value={form.priority} onChange={(e) => set('priority', e.target.value)}>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>

        <select
          value={form.projectId}
          onChange={(e) => set('projectId', e.target.value)}
        >
          <option value="">No project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => set('dueDate', e.target.value)}
        />
      </div>
      {tags.length > 0 && (
        <div className="row">
          {tags.map((tag) => (
            <label key={tag.id} className="badge tag" style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.tagIds.includes(tag.id)}
                onChange={() => toggleTag(tag.id)}
                style={{ marginRight: '0.3rem' }}
              />
              #{tag.name}
            </label>
          ))}
        </div>
      )}
      <div className="actions">
        <button id="add-task-btn" type="submit">{editingTask ? 'Save changes' : 'Add task'}</button>
        {editingTask && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}