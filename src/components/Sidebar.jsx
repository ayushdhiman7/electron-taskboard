import React, { useState } from 'react';

// Sidebar shows your projects and tags, and lets you create new ones.
// Clicking an item filters the task list (active filter is highlighted).

export default function Sidebar({
  projects,
  tags,
  activeProjectId,
  activeTagId,
  onSelectProject,
  onSelectTag,
  onAddProject,
  onDeleteProject,
  onAddTag,
  onDeleteTag,
}) {
  const [projectName, setProjectName] = useState('');
  const [tagName, setTagName] = useState('');

  const submitProject = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    onAddProject({ name: projectName.trim() });
    setProjectName('');
  };

  const submitTag = (e) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    onAddTag({ name: tagName.trim() });
    setTagName('');
  };

  return (
    <div className="sidebar">
      <h2>Projects</h2>
      <div
        className={`sidebar-item ${activeProjectId === 'all' ? 'active' : ''}`}
        onClick={() => onSelectProject('all')}
      >
        <span>All projects</span>
      </div>
      {projects.map((project) => (
        <div
          key={project.id}
          className={`sidebar-item ${activeProjectId === project.id ? 'active' : ''}`}
          onClick={() => onSelectProject(project.id)}
        >
          <span>
            <span className="color-dot" style={{ background: project.color }} />
            {project.name}
          </span>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteProject(project.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
      <form onSubmit={submitProject}>
        <input
          id="project-name-input"
          type="text"
          placeholder="New project"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <button type="submit">+</button>
      </form>

      <h2>Tags</h2>
      <div
        className={`sidebar-item ${activeTagId === 'all' ? 'active' : ''}`}
        onClick={() => onSelectTag('all')}
      >
        <span>All tags</span>
      </div>
      {tags.map((tag) => (
        <div
          key={tag.id}
          className={`sidebar-item ${activeTagId === tag.id ? 'active' : ''}`}
          onClick={() => onSelectTag(tag.id)}
        >
          <span>#{tag.name}</span>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTag(tag.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
      <form onSubmit={submitTag}>
        <input
          id="tag-name-input"
          type="text"
          placeholder="New tag"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <button type="submit">+</button>
      </form>
    </div>
  );
}