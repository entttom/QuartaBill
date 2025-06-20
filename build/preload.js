const { contextBridge, ipcRenderer } = require('electron');

// Sichere API für die Renderer-Prozess
contextBridge.exposeInMainWorld('electronAPI', {
  // Datei-Operationen
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFile: (filters) => ipcRenderer.invoke('select-file', filters),
  saveFile: (content, defaultPath) => ipcRenderer.invoke('save-file', content, defaultPath),
  saveFileDirect: (content, filePath) => ipcRenderer.invoke('save-file-direct', content, filePath),
  
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
      if (Buffer.isBuffer(buffer)) {
        const result = buffer.toString(encoding || 'utf8');
        console.log('bufferToString erfolgreich, Länge:', result.length);
        return result;
      } else {
        console.warn('bufferToString: Input ist kein Buffer:', typeof buffer, buffer?.constructor?.name);
        // Fallback: versuche direkte Konvertierung 
        if (buffer && typeof buffer.toString === 'function') {
          return buffer.toString(encoding || 'utf8');
        }
        return String(buffer);
      }
    } catch (error) {
      console.error('bufferToString Fehler:', error);
      return null;
    }
  }
}); 