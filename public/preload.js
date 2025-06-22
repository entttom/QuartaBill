const { contextBridge, ipcRenderer } = require('electron');

// Sichere API für die Renderer-Prozess
contextBridge.exposeInMainWorld('electronAPI', {
  // Datei-Operationen
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
  saveFile: (content, defaultPath) => ipcRenderer.invoke('save-file', content, defaultPath),
  saveFileDirect: (content, filePath) => ipcRenderer.invoke('save-file-direct', content, filePath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  
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
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Auto-Updater Funktionen
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Auto-Updater Event Listener
  onUpdaterMessage: (callback) => ipcRenderer.on('updater-message', callback),
  removeUpdaterListener: (callback) => ipcRenderer.removeListener('updater-message', callback),
  
  // Buffer-Funktionalität
  bufferFrom: (data, encoding) => {
    try {
      const buffer = Buffer.from(data, encoding);
      console.log('bufferFrom erstellt:', buffer.constructor.name, 'Länge:', buffer.length);
      return buffer;
    } catch (error) {
      console.error('bufferFrom Fehler:', error);
      return null;
    }
  },
  
  bufferToString: (buffer, encoding) => {
    try {
      console.log('bufferToString Input:', buffer?.constructor?.name, 'isBuffer:', Buffer.isBuffer(buffer));
      
      // Wenn es ein Buffer ist, direkt verwenden
      if (Buffer.isBuffer(buffer)) {
        const result = buffer.toString(encoding || 'utf8');
        console.log('bufferToString erfolgreich (Buffer), Länge:', result.length);
        return result;
      }
      
      // Wenn es ein Uint8Array ist, in Buffer konvertieren
      if (buffer instanceof Uint8Array) {
        const bufferObj = Buffer.from(buffer);
        const result = bufferObj.toString(encoding || 'utf8');
        console.log('bufferToString erfolgreich (Uint8Array->Buffer), Länge:', result.length);
        return result;
      }
      
      // Fallback für andere Array-ähnliche Objekte
      if (buffer && typeof buffer.length === 'number' && buffer.length > 0) {
        const bufferObj = Buffer.from(buffer);
        const result = bufferObj.toString(encoding || 'utf8');
        console.log('bufferToString erfolgreich (Array->Buffer), Länge:', result.length);
        return result;
      }
      
      console.warn('bufferToString: Unbekannter Input-Typ:', typeof buffer, buffer?.constructor?.name);
      return String(buffer);
    } catch (error) {
      console.error('bufferToString Fehler:', error);
      return null;
    }
  }
}); 