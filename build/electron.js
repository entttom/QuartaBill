const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let mainWindow;

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
      label: 'Hilfe',
      submenu: [
        {
          label: 'Über QuartaBill',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Über QuartaBill',
              message: 'QuartaBill v1.0.0',
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

ipcMain.handle('get-platform', () => {
  return process.platform;
});

ipcMain.handle('get-home-dir', () => {
  return os.homedir();
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