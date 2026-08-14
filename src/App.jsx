import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import FilterBar from './components/FilterBar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Onboarding from './components/Onboarding';
import Welcome from './components/Welcome';

// App is the single source of truth for UI state.
// It loads data from the database (via window.api), keeps it in state,
// and hands down data + callbacks to the child components.

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [tourRunning, setTourRunning] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [filters, setFilters] = useState({
    projectId: 'all',
    tagId: 'all',
    priority: 'all',
    status: 'all',
    sortBy: 'createdAt',
  });

  const loadData = async () => {
    const [t, p, g] = await Promise.all([
      window.api.listTasks(),
      window.api.listProjects(),
      window.api.listTags(),
    ]);
    setTasks(t);
    setProjects(p);
    setTags(g);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Show the welcome button on the very first launch.
  // The tour only starts after the user clicks it.
  useEffect(() => {
    if (!localStorage.getItem('tourSeen')) {
      setShowWelcome(true);
    }
  }, []);

  const handleStartTour = () => {
    setShowWelcome(false);
    setTourRunning(true);
    localStorage.setItem('tourSeen', '1');
  };

  // ---- Task handlers ------------------------------------------------

  const handleAddTask = async (data) => {
    await window.api.addTask(data);
    await loadData();
  };

  const handleUpdateTask = async (id, patch) => {
    await window.api.updateTask(id, patch);
    setEditingTask(null);
    await loadData();
  };

  const handleDeleteTask = async (id) => {
    await window.api.deleteTask(id);
    await loadData();
  };

  // ---- Project handlers ----------------------------------------------

  const handleAddProject = async (data) => {
    await window.api.addProject(data);
    await loadData();
  };

  const handleDeleteProject = async (id) => {
    await window.api.deleteProject(id);
    setFilters((f) => (f.projectId === id ? { ...f, projectId: 'all' } : f));
    await loadData();
  };

  // ---- Tag handlers ---------------------------------------------------

  const handleAddTag = async (data) => {
    await window.api.addTag(data);
    await loadData();
  };

  const handleDeleteTag = async (id) => {
    await window.api.deleteTag(id);
    setFilters((f) => (f.tagId === id ? { ...f, tagId: 'all' } : f));
    await loadData();
  };

  return (
    <div className="app">
      <Sidebar
        projects={projects}
        tags={tags}
        activeProjectId={filters.projectId}
        activeTagId={filters.tagId}
        onSelectProject={(projectId) => setFilters({ ...filters, projectId })}
        onSelectTag={(tagId) => setFilters({ ...filters, tagId })}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />
      <div className="main">
        <h1>Task Manager</h1>
        <TaskForm
          editingTask={editingTask}
          projects={projects}
          tags={tags}
          onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleAddTask}
          onCancel={() => setEditingTask(null)}
        />
        <FilterBar filters={filters} setFilters={setFilters} />
        <TaskList
          tasks={tasks}
          projects={projects}
          tags={tags}
          filters={filters}
          onToggleComplete={(id, completed) => handleUpdateTask(id, { completed })}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
        />
      </div>
      <Onboarding run={tourRunning} onFinish={() => setTourRunning(false)} />
      {showWelcome && <Welcome onStart={handleStartTour} />}
    </div>
  );
}