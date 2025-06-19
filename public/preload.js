const { contextBridge, ipcRenderer } = require('electron');

// Sichere API für die Renderer-Prozess
contextBridge.exposeInMainWorld('electronAPI', {
  // Datei-Operationen
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
  saveFile: (content, defaultPath) => ipcRenderer.invoke('save-file', content, defaultPath),
  
  // System-Info
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  getHomeDir: () => ipcRenderer.invoke('get-home-dir'),
  
  // Daten-Management
  loadData: (filePath) => ipcRenderer.invoke('load-data', filePath),
  saveData: (data, filePath) => ipcRenderer.invoke('save-data', data, filePath),
  
  // Event Listener
  onImportData: (callback) => ipcRenderer.on('import-data', callback),
  onExportData: (callback) => ipcRenderer.on('export-data', callback),
  
  // Event Listener entfernen
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 