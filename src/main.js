import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { Database } from './db';

const db = new Database(path.join(app.getPath('userData'), 'db.json'));

// IPC handlers: the renderer calls these through preload's `window.api`.
// Each one reads/writes the database and returns the result.
function registerIpcHandlers() {
  // Projects
  ipcMain.handle('projects:list', () => db.listProjects());
  ipcMain.handle('projects:add', (_e, data) => db.addProject(data));
  ipcMain.handle('projects:update', (_e, id, patch) => db.updateProject(id, patch));
  ipcMain.handle('projects:delete', (_e, id) => db.deleteProject(id));

  // Tags
  ipcMain.handle('tags:list', () => db.listTags());
  ipcMain.handle('tags:add', (_e, data) => db.addTag(data));
  ipcMain.handle('tags:update', (_e, id, patch) => db.updateTag(id, patch));
  ipcMain.handle('tags:delete', (_e, id) => db.deleteTag(id));

  // Tasks
  ipcMain.handle('tasks:list', () => db.listTasks());
  ipcMain.handle('tasks:add', (_e, data) => db.addTask(data));
  ipcMain.handle('tasks:update', (_e, id, patch) => db.updateTask(id, patch));
  ipcMain.handle('tasks:delete', (_e, id) => db.deleteTask(id));
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(async () => {
  await db.init();
  registerIpcHandlers();
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});