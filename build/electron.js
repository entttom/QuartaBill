const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;

// Auto-Updater Konfiguration
autoUpdater.checkForUpdatesAndNotify();

// Auto-Updater Event Handler
autoUpdater.on('checking-for-update', () => {
  console.log('Suche nach Updates...');
  if (mainWindow) {
    mainWindow.webContents.send('updater-message', 'checking-for-update');
  }
});

autoUpdater.on('update-available', (info) => {
  console.log('Update verfügbar:', info.version);
  if (mainWindow) {
    mainWindow.webContents.send('updater-message', 'update-available', info);
  }
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Keine Updates verfügbar');
  if (mainWindow) {
    mainWindow.webContents.send('updater-message', 'update-not-available');
  }  
});

autoUpdater.on('error', (err) => {
  console.error('Update-Fehler:', err);
  if (mainWindow) {
    mainWindow.webContents.send('updater-message', 'error', err.message);
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download-Geschwindigkeit: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Heruntergeladen ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
  
  if (mainWindow) {
    mainWindow.webContents.send('updater-message', 'download-progress', progressObj);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update heruntergeladen:', info.version);
  if (mainWindow) {
    mainWindow.webContents.send('updater-message', 'update-downloaded', info);
  }
  
  // Zeige Update-Dialog
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update bereit',
    message: `QuartaBill v${info.version} wurde heruntergeladen.`,
    detail: 'Das Update wird beim nächsten Neustart der Anwendung installiert.',
    buttons: ['Jetzt neustarten', 'Später']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    title: 'QuartaBill'
  });

  const isDev = process.env.ELECTRON_IS_DEV === 'true';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, '../build/index.html');
    console.log('Loading file:', indexPath);
    mainWindow.loadFile(indexPath);
    // DevTools nur in Development
  }

  // Menü erstellen
  const template = [
    {
      label: 'Datei',
      submenu: [
        {
          label: 'Daten importieren...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'JSON Dateien', extensions: ['json'] }
              ]
            }).then(result => {
              if (!result.canceled) {
                mainWindow.webContents.send('import-data', result.filePaths[0]);
              }
            });
          }
        },
        {
          label: 'Daten exportieren...',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            dialog.showSaveDialog(mainWindow, {
              filters: [
                { name: 'JSON Dateien', extensions: ['json'] }
              ]
            }).then(result => {
              if (!result.canceled) {
                mainWindow.webContents.send('export-data', result.filePath);
              }
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Beenden',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Bearbeiten',
      submenu: [
        { role: 'undo', label: 'Rückgängig' },
        { role: 'redo', label: 'Wiederholen' },
        { type: 'separator' },
        { role: 'cut', label: 'Ausschneiden' },
        { role: 'copy', label: 'Kopieren' },
        { role: 'paste', label: 'Einfügen' }
      ]
    },
    {
      label: 'Entwicklung',
      submenu: [
        {
          label: 'Developer Tools öffnen',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.openDevTools();
          }
        },
        {
          label: 'Neu laden',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.reload();
          }
        }
      ]
    },
    {
      label: 'Hilfe',
      submenu: [
        {
          label: 'Nach Updates suchen',
          click: () => {
            autoUpdater.checkForUpdatesAndNotify();
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Update-Suche',
              message: 'Suche nach Updates...',
              detail: 'Die Anwendung prüft automatisch nach verfügbaren Updates. Sie werden benachrichtigt, wenn ein Update verfügbar ist.'
            });
          }
        },
        { type: 'separator' },
        {
          label: 'Über QuartaBill',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Über QuartaBill',
              message: `QuartaBill v${app.getVersion()}`,
              detail: `QuartaBill - Professionelle Quartalsabrechnungen für Arbeitsmediziner

Entwickelt von Dr. Thomas Entner

Diese Anwendung wurde speziell für Arbeitsmediziner entwickelt, um die quartalsweise Abrechnung ihrer Leistungen zu vereinfachen und zu automatisieren. 

Mit QuartaBill können Sie:
• Kundendaten verwalten
• Automatisch Rechnungen für ganze Quartale erstellen
• PDF-Rechnungen generieren
• E-Mail-Vorlagen erstellen
• Daten sicher synchronisieren

Für eine effiziente und professionelle Praxisverwaltung.`
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers für Datei-Operationen
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('select-file', async (event, filters = []) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: filters
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('save-file', async (event, content, defaultPath) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultPath,
    filters: [
      { name: 'PDF Dateien', extensions: ['pdf'] },
      { name: 'EML Dateien', extensions: ['eml'] }
    ]
  });
  
  if (!result.canceled) {
    fs.writeFileSync(result.filePath, content);
    return result.filePath;
  }
  return null;
});

// Direkte Datei-Speicherung ohne Dialog (für Auto-Export)
ipcMain.handle('save-file-direct', async (event, content, filePath) => {
  try {
    console.log('Electron: Speichere Datei direkt:', filePath);
    console.log('Content type:', typeof content, 'Länge:', content?.length);
    
    // Stelle sicher, dass der Ordner existiert
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content);
    console.log('Electron: Datei erfolgreich gespeichert:', filePath);
    return filePath;
  } catch (error) {
    console.error('Electron: Fehler beim direkten Speichern:', error);
    throw error;
  }
});

// Datei lesen (für Logo-Loading)
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    console.log('Electron: Lese Datei:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.warn('Electron: Datei existiert nicht:', filePath);
      return null;
    }
    
    const fileData = fs.readFileSync(filePath);
    console.log('Electron: Datei erfolgreich gelesen, Größe:', fileData.length, 'bytes');
    return fileData;
  } catch (error) {
    console.error('Electron: Fehler beim Lesen der Datei:', error);
    throw error;
  }
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});

ipcMain.handle('get-home-dir', () => {
  return os.homedir();
});

// Auto-Updater IPC Handlers
ipcMain.handle('check-for-updates', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.handle('download-update', () => {
  autoUpdater.downloadUpdate();
});

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall();
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('load-data', async (event, filePath) => {
  try {
    const dataPath = filePath || path.join(os.homedir(), 'rechnung-data.json');
    
    if (!fs.existsSync(dataPath)) {
      // Erstelle Standard-Datei
      const defaultData = {
        customers: [],
        settings: {
          issuer: {
            name: 'Max Mustermann',
            title: 'Freiberuflicher Berater',
            address: 'Musterstraße 123\n12345 Musterstadt',
            phone: 'Tel.: +49 123 456789',
            website: 'www.beispiel-firma.de',
            email: 'info@beispiel-firma.de',
            iban: 'DE89370400440532013000',
            uid: 'DE123456789',
            bank: 'Musterbank',
            paymentTerms: 14
          },
          logoPathWindows: '',
          logoPathMac: '',
          dataFilePath: dataPath
        }
      };
      fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Fehler beim Laden der Daten:', error);
    return null;
  }
});

ipcMain.handle('save-data', async (event, data, filePath) => {
  try {
    const dataPath = filePath || data.settings?.dataFilePath || path.join(os.homedir(), 'rechnung-data.json');
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataPath, jsonData, 'utf8');
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern der Daten:', error);
    return false;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 