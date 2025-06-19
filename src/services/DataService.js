class DataService {
  static defaultDataPath = 'rechnung-data.json';
  
  static defaultData = {
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
      dataFilePath: this.defaultDataPath
    }
  };

  static async loadData(filePath = null) {
    try {
      // Lade aus localStorage für Browser oder über Electron IPC
      if (window.require) {
        // Electron Umgebung
        const { ipcRenderer } = window.require('electron');
        return await ipcRenderer.invoke('load-data', filePath);
      } else {
        // Browser Umgebung - verwende localStorage
        const data = localStorage.getItem('rechnung-data');
        return data ? this.mergeWithDefaults(JSON.parse(data)) : this.defaultData;
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
      return this.defaultData;
    }
  }

  static async saveData(data, filePath = null) {
    try {
      if (window.require) {
        // Electron Umgebung
        const { ipcRenderer } = window.require('electron');
        return await ipcRenderer.invoke('save-data', data, filePath);
      } else {
        // Browser Umgebung - verwende localStorage
        localStorage.setItem('rechnung-data', JSON.stringify(data));
        return true;
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
      return false;
    }
  }

  static mergeWithDefaults(data) {
    return {
      customers: data.customers || [],
      settings: {
        ...this.defaultData.settings,
        ...data.settings,
        issuer: {
          ...this.defaultData.settings.issuer,
          ...data.settings?.issuer
        }
      }
    };
  }

  static createCustomer() {
    return {
      id: Date.now().toString(),
      name: '',
      address: '',
      hourlyRate: 0,
      email: '',
      emailTemplate: 'Sehr geehrte Damen und Herren,\n\nanbei erhalten Sie die Rechnung für das vergangene Quartal.\n\nMit freundlichen Grüßen',
      savePathWindows: '',
      savePathMac: '',
      emlPathWindows: '',
      emlPathMac: '',
      activity: 'Arbeitsmedizinische Leistungen [Quartal]',
      hours: 6
    };
  }

  static async selectFolder() {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      return await ipcRenderer.invoke('select-folder');
    }
    return null;
  }

  static async selectFile(filters = []) {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      return await ipcRenderer.invoke('select-file', filters);
    }
    return null;
  }

  static async saveFile(content, defaultPath) {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      return await ipcRenderer.invoke('save-file', content, defaultPath);
    }
    return null;
  }

  static async getPlatform() {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      return await ipcRenderer.invoke('get-platform');
    }
    return 'unknown';
  }
}

export default DataService; 