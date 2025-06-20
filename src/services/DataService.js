import i18n from '../i18n';

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
      dataFilePath: this.defaultDataPath,
      hasSeenOnboarding: false,
      invoiceNumberFormat: '{QQ}{YY}{KK}',
      language: 'de',
      darkMode: false
    }
  };

  static async loadData(filePath = null) {
    try {
      // Lade aus localStorage für Browser oder über Electron IPC
      if (window.electronAPI) {
        // Electron Umgebung
        return await window.electronAPI.loadData(filePath);
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
      if (window.electronAPI) {
        // Electron Umgebung
        return await window.electronAPI.saveData(data, filePath);
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
      email: '',
      emailTemplate: i18n.t('email.defaultTemplate').replace(/\\n/g, '\n'),
      savePathWindows: '',
      savePathMac: '',
      emlPathWindows: '',
      emlPathMac: '',
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
}

export default DataService; 