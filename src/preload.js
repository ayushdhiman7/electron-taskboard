// preload.js runs with special privileges and is the ONLY bridge
// between the renderer (React) and the main process (database).
// We expose a safe `window.api` object. The renderer never touches
// Node.js directly — security best practice.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Projects
  listProjects: () => ipcRenderer.invoke('projects:list'),
  addProject: (data) => ipcRenderer.invoke('projects:add', data),
  updateProject: (id, patch) => ipcRenderer.invoke('projects:update', id, patch),
  deleteProject: (id) => ipcRenderer.invoke('projects:delete', id),

  // Tags
  listTags: () => ipcRenderer.invoke('tags:list'),
  addTag: (data) => ipcRenderer.invoke('tags:add', data),
  updateTag: (id, patch) => ipcRenderer.invoke('tags:update', id, patch),
  deleteTag: (id) => ipcRenderer.invoke('tags:delete', id),

  // Tasks
  listTasks: () => ipcRenderer.invoke('tasks:list'),
  addTask: (data) => ipcRenderer.invoke('tasks:add', data),
  updateTask: (id, patch) => ipcRenderer.invoke('tasks:update', id, patch),
  deleteTask: (id) => ipcRenderer.invoke('tasks:delete', id),
});