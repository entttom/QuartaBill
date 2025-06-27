import i18n from '../i18n';

class DataService {
  static defaultDataPath = 'rechnung-data.json';
  static configFileName = 'quartabill-config.json'; // Nur der Pfad zur Einstellungsdatei
  static isWatching = false;
  static fileWatcher = null;
  static onDataChangeCallback = null;
  static isInternalSave = false; // Flag um eigene Speichervorgänge zu ignorieren
  static lastSaveTimestamp = 0;
  static fileChangeDebounceTimer = null;
  
  static defaultData = {
    customers: [],
    invoiceHistory: [],
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
      logoPathLinux: '',
      dataFilePath: this.defaultDataPath,
      hasSeenOnboarding: false,
      invoiceNumberFormat: '{QQ}{YY}{KK}',
      language: 'de',
      darkMode: false
    }
  };

  // Lädt den Pfad zur Einstellungsdatei aus der lokalen Config
  static async getConfigPath() {
    try {
      if (window.electronAPI) {
        return await window.electronAPI.getConfigPath();
      } else {
        return localStorage.getItem('quartabill-config-path');
      }
    } catch (error) {
      console.error('Fehler beim Laden des Config-Pfads:', error);
      return null;
    }
  }

  // Speichert den Pfad zur Einstellungsdatei in der lokalen Config
  static async setConfigPath(configPath) {
    try {
      if (window.electronAPI) {
        return await window.electronAPI.setConfigPath(configPath);
      } else {
        localStorage.setItem('quartabill-config-path', configPath);
        return true;
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Config-Pfads:', error);
      return false;
    }
  }

  // Lädt Daten von einem spezifischen Pfad (für die externe Einstellungsdatei)
  static async loadData(filePath = null) {
    try {
      if (window.electronAPI) {
        // Electron Umgebung
        const configPath = filePath || await this.getConfigPath();
        if (!configPath) {
          return this.defaultData;
        }
        return await window.electronAPI.loadData(configPath);
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

  // Speichert Daten in die externe Einstellungsdatei
  static async saveData(data, filePath = null) {
    try {
      if (window.electronAPI) {
        // Electron Umgebung
        const configPath = filePath || await this.getConfigPath();
        if (!configPath) {
          throw new Error('Kein Config-Pfad definiert');
        }
        
        // Markiere als internen Speichervorgang um File-Watching zu pausieren
        this.isInternalSave = true;
        this.lastSaveTimestamp = Date.now();
        
        const result = await window.electronAPI.saveData(data, configPath);
        
        // Nach kurzer Zeit Flag zurücksetzen
        setTimeout(() => {
          this.isInternalSave = false;
        }, 1000);
        
        return result;
      } else {
        // Browser Umgebung - verwende localStorage
        localStorage.setItem('rechnung-data', JSON.stringify(data));
        return true;
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
      this.isInternalSave = false;
      return false;
    }
  }

  // Startet die Überwachung der Einstellungsdatei
  static async startFileWatching(onChange) {
    if (this.isWatching || !window.electronAPI) {
      return;
    }

    try {
      const configPath = await this.getConfigPath();
      if (!configPath) {
        console.warn('Kein Config-Pfad für File-Watching verfügbar');
        return;
      }

      this.onDataChangeCallback = onChange;
      this.isWatching = true;
      
      await window.electronAPI.startFileWatching(configPath);
      
      // Event-Listener für Dateiänderungen mit Debouncing und Filter
      window.electronAPI.onFileChanged((event, filePath, hasChanged) => {
        if (!hasChanged || !this.onDataChangeCallback) {
          return;
        }
        
        // Ignoriere Änderungen die von eigenen Speichervorgängen stammen
        if (this.isInternalSave) {
          console.log('Ignoriere eigene Dateiänderung:', filePath);
          return;
        }
        
        // Ignoriere Änderungen die kurz nach einem eigenen Speichervorgang auftreten
        const timeSinceLastSave = Date.now() - this.lastSaveTimestamp;
        if (timeSinceLastSave < 2000) { // 2 Sekunden Puffer
          console.log('Ignoriere Dateiänderung kurz nach eigenem Speichern:', timeSinceLastSave + 'ms');
          return;
        }
        
        // Debouncing: Sammle mehrere schnelle Änderungen
        if (this.fileChangeDebounceTimer) {
          clearTimeout(this.fileChangeDebounceTimer);
        }
        
        this.fileChangeDebounceTimer = setTimeout(() => {
          console.log('Externe Dateiänderung erkannt:', filePath);
          this.onDataChangeCallback(filePath);
          this.fileChangeDebounceTimer = null;
        }, 500); // 500ms Debounce
      });

      console.log('File-Watching gestartet für:', configPath);
    } catch (error) {
      console.error('Fehler beim Starten des File-Watchings:', error);
      this.isWatching = false;
    }
  }

  // Stoppt die Überwachung der Einstellungsdatei
  static async stopFileWatching() {
    if (!this.isWatching || !window.electronAPI) {
      return;
    }

    try {
      await window.electronAPI.stopFileWatching();
      this.isWatching = false;
      this.onDataChangeCallback = null;
      this.isInternalSave = false;
      this.lastSaveTimestamp = 0;
      
      // Cleanup Debounce Timer
      if (this.fileChangeDebounceTimer) {
        clearTimeout(this.fileChangeDebounceTimer);
        this.fileChangeDebounceTimer = null;
      }
      
      console.log('File-Watching gestoppt');
    } catch (error) {
      console.error('Fehler beim Stoppen des File-Watchings:', error);
    }
  }

  // Prüft ob Setup erforderlich ist (keine Config-Datei vorhanden oder Datei existiert nicht mehr)
  static async isSetupRequired() {
    try {
      const existingPath = await this.getConfigPath();
      if (existingPath && window.electronAPI) {
        // Prüfe ob Datei noch existiert
        const exists = await window.electronAPI.fileExists(existingPath);
        return !exists;
      }
      return true; // Kein Pfad vorhanden = Setup erforderlich
    } catch (error) {
      console.error('Fehler beim Prüfen des Setup-Status:', error);
      return true;
    }
  }

  // Führt den Setup-Schritt durch (wählt Datei aus und erstellt sie)
  static async performConfigSetup() {
    try {
      if (window.electronAPI) {
        const newPath = await window.electronAPI.selectConfigPath();
        if (newPath) {
          await this.setConfigPath(newPath);
          
          // Prüfe ob Datei bereits existiert
          const exists = await window.electronAPI.fileExists(newPath);
          if (!exists) {
            // Neue Datei: Erstelle Standard-Daten
            await this.saveData(this.defaultData, newPath);
            return { path: newPath, isNewFile: true };
          } else {
            // Bestehende Datei: Lade und validiere Inhalt
            try {
              const existingData = await window.electronAPI.loadData(newPath);
              if (existingData && existingData.customers !== undefined) {
                // Gültige QuartaBill-Datei gefunden
                return { path: newPath, isNewFile: false, hasValidData: true, data: existingData };
              } else {
                // Datei existiert, aber kein gültiges QuartaBill-Format
                return { path: newPath, isNewFile: false, hasValidData: false };
              }
            } catch (error) {
              // Fehler beim Lesen der Datei (z.B. ungültiges JSON)
              return { path: newPath, isNewFile: false, hasValidData: false, error: error.message };
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Fehler beim Config-Setup:', error);
      return null;
    }
  }

  // Überschreibt eine bestehende Datei mit Standard-Daten
  static async createNewConfigFile(filePath) {
    try {
      // Markiere als internen Vorgang
      this.isInternalSave = true;
      this.lastSaveTimestamp = Date.now();
      
      const result = await this.saveData(this.defaultData, filePath);
      
      // Flag wird bereits in saveData zurückgesetzt
      return result;
    } catch (error) {
      console.error('Fehler beim Erstellen der neuen Config-Datei:', error);
      this.isInternalSave = false;
      return false;
    }
  }

  // Lädt bestehende Config (falls Setup bereits durchgeführt wurde)
  static async loadExistingConfig() {
    try {
      const existingPath = await this.getConfigPath();
      if (existingPath && window.electronAPI) {
        const exists = await window.electronAPI.fileExists(existingPath);
        if (exists) {
          return existingPath;
        }
      }
      return null;
    } catch (error) {
      console.error('Fehler beim Laden der bestehenden Config:', error);
      return null;
    }
  }

  static mergeWithDefaults(data) {
    return {
      customers: data.customers || [],
      invoiceHistory: data.invoiceHistory || [],
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
      email: '',
      emailSubject: i18n.t('email.defaultSubject'),
      emailTemplate: i18n.t('email.defaultTemplate').replace(/\\n/g, '\n'),
      savePathWindows: '',
      savePathMac: '',
      savePathLinux: '',
      emlPathWindows: '',
      emlPathMac: '',
      emlPathLinux: '',
      lineItems: [
        {
          id: Date.now().toString() + '_1',
          description: i18n.t('customers.form.placeholders.activity').replace(/\\n/g, '\n'),
          quantity: 6,
          unit: 'Stunden',
          unitPrice: 0,
          taxType: '20' // Standard 20% oder 'mixed' für (90%@20% + 10%@0%)
        }
      ]
    };
  }

  static async selectFolder() {
    if (window.electronAPI) {
      return await window.electronAPI.selectFolder();
    }
    return null;
  }

  static async selectFile(filters = []) {
    if (window.electronAPI) {
      return await window.electronAPI.selectFile(filters);
    }
    return null;
  }

  static async saveFile(content, defaultPath) {
    if (window.electronAPI) {
      return await window.electronAPI.saveFile(content, defaultPath);
    }
    return null;
  }

  static async saveFileDirect(content, filePath) {
    if (window.electronAPI) {
      return await window.electronAPI.saveFileDirect(content, filePath);
    }
    return null;
  }

  static async getPlatform() {
    if (window.electronAPI) {
      return await window.electronAPI.getPlatform();
    }
    return 'unknown';
  }

  static generateInvoiceNumber(customer, quarter, year, format = '{QQ}{YY}{KK}') {
    // Verfügbare Variablen für Rechnungsnummer
    const quarterNum = quarter.replace('Q', '0'); // Q1 -> 01
    const yearShort = year.toString().slice(-2); // 2024 -> 24
    const yearFull = year.toString(); // 2024
    const customerPrefix = customer.name.substring(0, 2).toUpperCase(); // "Max" -> "MA"
    const customerPrefix3 = customer.name.substring(0, 3).toUpperCase(); // "Max" -> "MAX"
    
    // Aktuelle Rechnungsnummer (fortlaufend) - könnte später erweitert werden
    const currentDate = new Date();
    const invoiceCount = currentDate.getMonth() * 100 + currentDate.getDate(); // Einfache Sequenz
    
    // Variable-Ersetzung
    let invoiceNumber = format
      .replace(/{QQ}/g, quarterNum)           // Quartal zweistellig (01, 02, 03, 04)
      .replace(/{Q}/g, quarter.replace('Q', ''))  // Quartal einstellig (1, 2, 3, 4)
      .replace(/{YYYY}/g, yearFull)           // Jahr vierstellig (2024)
      .replace(/{YY}/g, yearShort)            // Jahr zweistellig (24)
      .replace(/{KKK}/g, customerPrefix3)     // Kunde dreistellig (MAX)
      .replace(/{KK}/g, customerPrefix)       // Kunde zweistellig (MA)
      .replace(/{K}/g, customer.name.substring(0, 1).toUpperCase()) // Kunde einstellig (M)
      .replace(/{NNN}/g, invoiceCount.toString().padStart(3, '0')) // Fortlaufende Nummer dreistellig
      .replace(/{NN}/g, invoiceCount.toString().padStart(2, '0'))  // Fortlaufende Nummer zweistellig
      .replace(/{N}/g, invoiceCount.toString()); // Fortlaufende Nummer
    
    return invoiceNumber;
  }

  // Rechnungshistorie-Funktionen
  static addInvoiceToHistory(data, invoiceData) {
    const newInvoice = {
      id: `invoice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId: invoiceData.customerId,
      customerName: invoiceData.customerName,
      invoiceNumber: invoiceData.invoiceNumber,
      quarter: invoiceData.quarter,
      year: invoiceData.year,
      amount: invoiceData.amount,
      vat: invoiceData.vat || 0,
      subtotal: invoiceData.subtotal || (invoiceData.amount - (invoiceData.vat || 0)),
      createdAt: new Date().toISOString(),
      pdfPath: invoiceData.pdfPath,
      emailPath: invoiceData.emailPath,
      status: invoiceData.emailPath ? 'ready_to_send' : 'generated'
    };

    const updatedData = {
      ...data,
      invoiceHistory: [...(data.invoiceHistory || []), newInvoice]
    };

    return { updatedData, newInvoice };
  }

  static updateInvoiceStatus(data, invoiceId, status) {
    const updatedHistory = (data.invoiceHistory || []).map(invoice =>
      invoice.id === invoiceId ? { ...invoice, status } : invoice
    );

    return {
      ...data,
      invoiceHistory: updatedHistory
    };
  }

  static getInvoiceHistory(data, filters = {}) {
    let history = data.invoiceHistory || [];
    
    if (filters.customerId) {
      history = history.filter(invoice => invoice.customerId === filters.customerId);
    }
    
    if (filters.quarter) {
      history = history.filter(invoice => invoice.quarter === filters.quarter);
    }
    
    if (filters.year) {
      history = history.filter(invoice => invoice.year === filters.year);
    }
    
    if (filters.status) {
      history = history.filter(invoice => invoice.status === filters.status);
    }

    // Sortiere nach Erstellungsdatum (neueste zuerst)
    return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static checkInvoiceExists(data, customerId, quarter, year) {
    return (data.invoiceHistory || []).some(invoice => 
      invoice.customerId === customerId && 
      invoice.quarter === quarter && 
      invoice.year === year
    );
  }

  static calculateInvoiceAmount(customer) {
    if (!customer || !customer.lineItems) return 0;
    
    return customer.lineItems.reduce((total, item) => {
      const subtotal = item.quantity * item.unitPrice;
      let tax = 0;
      
      if (item.taxType === 'mixed') {
        tax = subtotal * 0.9 * 0.2; // 90%@20% + 10%@0%
      } else {
        const taxRate = parseFloat(item.taxType) / 100;
        tax = subtotal * taxRate;
      }
      
      return total + subtotal + tax;
    }, 0);
  }

  static calculateInvoiceVAT(customer) {
    if (!customer || !customer.lineItems) return 0;
    
    return customer.lineItems.reduce((totalVAT, item) => {
      const subtotal = item.quantity * item.unitPrice;
      let vat = 0;
      
      if (item.taxType === 'mixed') {
        vat = subtotal * 0.9 * 0.2; // 90%@20% + 10%@0%
      } else {
        const taxRate = parseFloat(item.taxType) / 100;
        vat = subtotal * taxRate;
      }
      
      return totalVAT + vat;
    }, 0);
  }

  static calculateInvoiceBreakdown(customer) {
    if (!customer || !customer.lineItems) {
      return {
        subtotal: 0,
        vat: 0,
        total: 0,
        vatBreakdown: []
      };
    }
    
    let subtotal = 0;
    let totalVAT = 0;
    const vatBreakdown = [];

    customer.lineItems.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      subtotal += itemSubtotal;
      
      let itemVAT = 0;
      let vatDescription = '';
      
      if (item.taxType === 'mixed') {
        itemVAT = itemSubtotal * 0.9 * 0.2; // 90%@20% + 10%@0%
        vatDescription = '90%@20% + 10%@0%';
      } else {
        const taxRate = parseFloat(item.taxType) / 100;
        itemVAT = itemSubtotal * taxRate;
        vatDescription = `${item.taxType}%`;
      }
      
      totalVAT += itemVAT;
      
      // Gruppiere nach Steuersatz
      const existing = vatBreakdown.find(v => v.type === item.taxType);
      if (existing) {
        existing.base += itemSubtotal;
        existing.vat += itemVAT;
      } else {
        vatBreakdown.push({
          type: item.taxType,
          description: vatDescription,
          base: itemSubtotal,
          vat: itemVAT
        });
      }
    });

    return {
      subtotal,
      vat: totalVAT,
      total: subtotal + totalVAT,
      vatBreakdown
    };
  }

  static deleteInvoiceFromHistory(data, invoiceId) {
    const updatedHistory = (data.invoiceHistory || []).filter(invoice => invoice.id !== invoiceId);
    
    return {
      ...data,
      invoiceHistory: updatedHistory
    };
  }
}

export default DataService; 