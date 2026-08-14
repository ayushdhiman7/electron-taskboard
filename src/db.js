import { Low, JSONFile } from 'lowdb';
import { randomUUID } from 'node:crypto';

// lowdb stores everything as a plain JS object in a JSON file.
// This module is the ONLY place that touches the database.
// It runs in the main process because it needs filesystem access.

const DEFAULT_DATA = {
  projects: [],
  tags: [],
  tasks: [],
};

export class Database {
  constructor(filePath) {
    this.db = new Low(new JSONFile(filePath));
  }

  // Load the JSON file (creating it with defaults on first run).
  async init() {
    await this.db.read();
    const data = this.db.data || {};
    this.db.data = { ...DEFAULT_DATA, ...data };
    await this.db.write();
  }

  // ---- Generic helpers -------------------------------------------------

  save() {
    return this.db.write();
  }

  // Pick a pleasant random color for new projects.
  randomColor() {
    const palette = [
      '#ef4444', '#f97316', '#f59e0b', '#84cc16',
      '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6',
      '#d946ef', '#ec4899',
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  // ---- Projects ---------------------------------------------------------

  async listProjects() {
    return this.db.data.projects;
  }

  async addProject({ name, color }) {
    const project = { id: randomUUID(), name, color: color || this.randomColor() };
    this.db.data.projects.push(project);
    await this.save();
    return project;
  }

  async updateProject(id, patch) {
    const project = this.db.data.projects.find((p) => p.id === id);
    if (project) Object.assign(project, patch);
    await this.save();
    return project;
  }

  async deleteProject(id) {
    this.db.data.projects = this.db.data.projects.filter((p) => p.id !== id);
    // Unlink tasks that belonged to the deleted project.
    for (const task of this.db.data.tasks) {
      if (task.projectId === id) task.projectId = null;
    }
    await this.save();
  }

  // ---- Tags --------------------------------------------------------------

  async listTags() {
    return this.db.data.tags;
  }

  async addTag({ name }) {
    const tag = { id: randomUUID(), name };
    this.db.data.tags.push(tag);
    await this.save();
    return tag;
  }

  async updateTag(id, patch) {
    const tag = this.db.data.tags.find((t) => t.id === id);
    if (tag) Object.assign(tag, patch);
    await this.save();
    return tag;
  }

  async deleteTag(id) {
    this.db.data.tags = this.db.data.tags.filter((t) => t.id !== id);
    // Remove the tag from every task that used it.
    for (const task of this.db.data.tasks) {
      task.tagIds = task.tagIds.filter((tagId) => tagId !== id);
    }
    await this.save();
  }

  // ---- Tasks ---------------------------------------------------------------

  async listTasks() {
    return this.db.data.tasks;
  }

  async addTask({ title, description = '', priority = 'medium', projectId = null, tagIds = [], dueDate = null }) {
    const task = {
      id: randomUUID(),
      title,
      description,
      priority,
      projectId,
      tagIds,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    this.db.data.tasks.push(task);
    await this.save();
    return task;
  }

  async updateTask(id, patch) {
    const task = this.db.data.tasks.find((t) => t.id === id);
    if (task) Object.assign(task, patch);
    await this.save();
    return task;
  }

  async deleteTask(id) {
    this.db.data.tasks = this.db.data.tasks.filter((t) => t.id !== id);
    await this.save();
  }
}