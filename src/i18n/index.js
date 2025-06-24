import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Deutsche Übersetzungen
const de = {
  translation: {
    // Navigation
    nav: {
      customers: 'Kunden',
      invoices: 'Rechnungen erstellen',
      settings: 'Einstellungen'
    },
    
    // App Header
    app: {
      title: 'QuartaBill',
      subtitle: 'Professionelle Quartalsabrechnungen für Arbeitsmediziner'
    },
    
    // Kundenverwaltung
    customers: {
      title: 'Kundenverwaltung',
      newCustomer: 'Neuer Kunde',
      editCustomer: 'Kunde bearbeiten',
      deleteCustomer: 'Sind Sie sicher, dass Sie diesen Kunden löschen möchten?',
      noCustomers: 'Keine Kunden vorhanden',
      createFirst: 'Legen Sie Ihren ersten Kunden an.',
      exampleInvoiceNumber: 'Beispiel-Rechnungsnummer',
      unnamedCustomer: 'Unbenannter Kunde',
      noAddress: 'Keine Adresse hinterlegt',
      hours: 'Std.',
      
      // Formulare
      form: {
        name: 'Firmenname',
        address: 'Adresse',
        hourlyRate: 'Stundensatz (€)',
        hours: 'Stunden pro Quartal',
        email: 'Email-Adresse',
        activity: 'Tätigkeitsbeschreibung',
        emailSubject: 'E-Mail-Betreff',
        emailTemplate: 'Email-Vorlage',
        savePathWindows: 'PDF-Pfad (Windows)',
        savePathMac: 'PDF-Pfad (Mac)',
        emlPathWindows: 'EML-Pfad (Windows)',
        emlPathMac: 'EML-Pfad (Mac)',
        placeholders: {
          address: 'Straße\\nPLZ Ort',
          activity: 'Arbeitsmedizinische Leistungen [Quartal]',
          emailSubject: 'Verfügbare Variablen: [Rechnungsnummer], [Kunde], [Quartal], [Jahr]',
          emailTemplate: 'Verfügbare Variablen: [Quartal], [Jahr], [Rechnungsnummer], [Kunde]',
          savePathWindows: 'C:\\Pfad\\zu\\Kundenordner',
          savePathMac: '/Pfad/zu/Kundenordner',
          emlPathWindows: 'C:\\Pfad\\zu\\Email-Ordner',
          emlPathMac: '/Pfad/zu/Email-Ordner'
        },
        paths: 'Pfade',
        storagePaths: 'Speicherpfade',
        pdfPaths: 'PDF-Speicherpfade',
        emlPaths: 'EML-Speicherpfade',
        emailTemplatePlaceholder: 'Text der Email die mit der Rechnung versendet wird...'
      },
      
      buttons: {
        save: 'Speichern',
        cancel: 'Abbrechen',
        selectFolder: 'Ordner auswählen',
        add: 'Hinzufügen'
      }
    },
    
    // Rechnungsgenerierung
    invoices: {
      title: 'Rechnungen erstellen',
      quarter: 'Quartal',
      year: 'Jahr',
      generateEmail: 'Email (.eml) generieren',
      autoExport: 'Direkt in Kundenordner exportieren',
      selectCustomers: 'Kunden auswählen',
      selectAll: 'Alle auswählen',
      deselectAll: 'Alle abwählen',
      summary: 'Zusammenfassung',
      customersSelected: 'von {{total}} Kunden ausgewählt',
      totalAmount: 'Gesamtsumme',
      generate: 'PDFs generieren',
      generating: 'Generiere...',
      
      // Periode
      period: {
        serviceTime: 'Leistungszeitraum',
        invoiceDate: 'Rechnungsdatum'
      },
      
      // Ergebnisse
      results: {
        title: 'Rechnungsgenerierung abgeschlossen',
        success: 'Erfolgreich',
        error: 'Fehler',
        close: 'Schließen'
      },
      
      // Warnungen
      warnings: {
        noCustomers: 'Keine Kunden vorhanden. Bitte legen Sie zuerst Kunden an.',
        selectCustomers: 'Bitte wählen Sie mindestens einen Kunden aus.'
      }
    },
    
    // Einstellungen
    settings: {
      title: 'Einstellungen',
      saved: 'Einstellungen gespeichert!',
      
      tabs: {
        issuer: 'Rechnungsersteller',
        paths: 'Pfade & Dateien',
        about: 'Über QuartaBill'
      },
      
      // Rechnungsersteller
      issuer: {
        title: 'Rechnungsersteller-Informationen',
        name: 'Name',
        profession: 'Titel/Beruf',
        address: 'Adresse',
        phone: 'Telefon',
        website: 'Website',
        email: 'Email',
        iban: 'IBAN',
        uid: 'UID',
        bank: 'Bank',
        paymentTerms: 'Zahlungsfrist (Tage)',
        language: 'Sprache',
        darkMode: 'Dunkles Design',
        
        // Rechnungsnummer
        invoiceNumber: {
          title: 'Rechnungsnummer-Format',
          format: 'Format für Rechnungsnummern',
          help: 'Verfügbare Variablen: {Q}/{QQ} (Quartal), {YY}/{YYYY} (Jahr), {K}/{KK}/{KKK} (Kunde), {N}/{NN}/{NNN} (Nummer)',
          examples: {
            title: 'Beispiele:',
            standard: '(Standard)',
            verbose: 'Vollformat mit Bindestrichen',
            prefix: 'Mit Prefix und Sequenz',
            compact: 'Kompakt'
          }
        }
      },
      
      // Pfade
      paths: {
        logoTitle: 'Logo-Pfade',
        logoWindows: 'Windows Logo-Pfad',
        logoMac: 'Mac Logo-Pfad',
        logoInfo: 'Das Logo wird in der oberen linken Ecke der Rechnung angezeigt. Empfohlene Größe: 200x120 Pixel.',
        
        dataTitle: 'Daten-Synchronisation',
        dataPath: 'Pfad zur Daten-Datei',
        dataInfo: 'Diese Datei wird beim Programmstart geladen und kann über z.B. Nextcloud, iCloud, Dropbox, OneDrive etc. zwischen verschiedenen Geräten synchronisiert werden.'
      },
      
      // Über
      about: {
        title: 'QuartaBill',
        subtitle: 'Professionelle Quartalsabrechnungen für Arbeitsmediziner',
        developer: 'Entwickelt von Dr. Thomas Entner',
        description: 'Diese Anwendung wurde speziell für Arbeitsmediziner entwickelt, um die quartalsweise Abrechnung ihrer Leistungen zu vereinfachen und zu automatisieren.',
        features: {
          title: 'Features von QuartaBill:',
          customerManagement: 'Kundendaten verwalten',
          autoInvoices: 'Automatische Quartalsrechnungen',
          pdfGeneration: 'PDF-Rechnungen generieren',
          emailTemplates: 'E-Mail-Vorlagen erstellen',
          dataSync: 'Sichere Datensynchronisation',
          taxCalculation: 'Deutsche Steuerberechnung'
        },
        version: 'Version 1.0.0 - Für eine effiziente und professionelle Praxisverwaltung'
      },
      
      buttons: {
        save: 'Einstellungen speichern'
      },
      
      noSavePathMessage: 'Kein Speicherpfad hinterlegt',
      noEmlPathMessage: 'Kein EML-Speicherpfad hinterlegt'
    },
    
    // Onboarding
    onboarding: {
      skip: 'Überspringen',
      back: 'Zurück',
      next: 'Weiter',
      finish: 'Fertig',
      
      steps: {
        welcome: {
          title: 'Willkommen bei QuartaBill',
          subtitle: 'Professionelle Quartalsabrechnungen für Arbeitsmediziner',
          developer: 'Entwickelt von Dr. Thomas Entner',
          description1: 'Diese Anwendung wurde speziell für Arbeitsmediziner entwickelt, um die quartalsweise Abrechnung ihrer Leistungen zu vereinfachen und zu automatisieren.',
          description2: 'Sparen Sie Zeit bei der Rechnungserstellung und konzentrieren Sie sich auf das Wesentliche - Ihre Patienten.'
        },
        customers: {
          title: 'Kundenverwaltung',
          subtitle: 'Verwalten Sie Ihre Kunden zentral',
          feature1: 'Kundendaten zentral verwalten - Name, Adresse, Kontaktdaten',
          feature2: 'Stundensätze definieren - Individuelle Preise pro Kunde',
          feature3: 'Standard-Stunden festlegen - Typischerweise 6 Stunden pro Quartal',
          feature4: 'Email-Templates - Personalisierte Anschreiben pro Kunde'
        },
        invoices: {
          title: 'Automatische Rechnungserstellung',
          subtitle: 'Quartalsrechnungen mit einem Klick',
          feature1: 'Batch-Generierung - Alle Kunden eines Quartals auf einmal',
          feature2: 'Personalisierbare Rechnungsnummern - Anpassbares Format (z.B. 0124EC)',
          feature3: 'Deutsche Steuerberechnung - 90% mit 20% USt., 10% mit 0% USt.',
          feature4: 'Quartalsweise Datierung - Automatisch korrekte Rechnungsdaten'
        },
        export: {
          title: 'PDF & Email Export',
          subtitle: 'Professionelle Ausgabe',
          feature1: 'Professionelle PDF-Rechnungen - Mit Ihrem Logo und Design',
          feature2: 'Automatische Email-Generierung - .eml-Dateien mit PDF-Anhang',
          feature3: 'Getrennte Speicherpfade - Windows und Mac kompatibel',
          feature4: 'Standardisierte Dateinamen - Einfache Archivierung'
        },
        finish: {
          title: 'Los geht\'s!',
          subtitle: 'Erste Schritte mit QuartaBill',
          ready: 'Sie sind bereit!',
          description: 'Beginnen Sie jetzt mit der Einrichtung Ihrer Daten:',
          step1: 'Einstellungen → Ihre Rechnungsdaten eingeben',
          step2: 'Kunden → Erste Kunden anlegen',
          step3: 'Rechnungen erstellen → Erste Quartalsrechnung generieren',
          success: 'Viel Erfolg mit QuartaBill!'
        }
      }
    },
    
    // PDF-Texte
    pdf: {
      invoiceDetails: 'RECHNUNGSDETAILS',
      invoiceAddress: 'RECHNUNGSADRESSE',
      invoiceNumber: 'Rechnungsnummer',
      invoiceDate: 'Rechnungsdatum',
      serviceTime: 'Leistungszeitraum',
      serviceDescription: 'LEISTUNGSBESCHREIBUNG',
      hours: 'STD.',
      hourlyRate: '€/STD.',
      amount: 'BETRAG',
      invoiceSum: 'RECHNUNGSSUMME',
      subtotal: 'ZWISCHENSUMME',
      taxRate90: 'STEUERSATZ auf 90% der Summe',
      taxRate10: 'STEUERSATZ auf 10% der Summe',
      vat: 'USt.',
      total: 'Gesamt',
              paymentTerms: 'Zahlungsfrist: {{days}} Tage',
        logoPlaceholder: 'LOGO'
      },
    
    // Email-Templates
    email: {
      subject: 'Rechnung {{invoiceNumber}}',
      defaultSubject: 'Rechnung [Rechnungsnummer] - [Kunde]',
      defaultTemplate: 'Sehr geehrte Damen und Herren,\\n\\nanbei erhalten Sie die Rechnung für das vergangene Quartal.\\n\\nBei Fragen stehen wir Ihnen gerne zur Verfügung.\\n\\nMit freundlichen Grüßen',
      generationFailed: 'Email-Generierung fehlgeschlagen: {{message}}'
    },
    
    // Allgemeine Buttons
    buttons: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      close: 'Schließen',
      select: 'Auswählen'
    },
    
    // Auto-Update
    update: {
      checking: 'Suche nach Updates...',
      available: 'Update verfügbar',
      notAvailable: 'Ihre App ist bereits auf dem neuesten Stand.',
      downloaded: 'Update v{{version}} heruntergeladen. Neustart verfügbar.',
      error: 'Update-Fehler: {{message}}',
      ready: 'Update bereit',
      downloading: 'Lädt... {{percent}}%',
      checkError: 'Fehler beim Prüfen auf Updates.',
      downloadError: 'Fehler beim Herunterladen des Updates.',
      installError: 'Fehler beim Installieren des Updates.',
      
      dialog: {
        title: 'Update verfügbar',
        message: 'Eine neue Version von QuartaBill ist verfügbar.',
        currentVersion: 'Aktuelle Version: v{{version}}',
        newVersion: 'Neue Version: v{{version}}',
        downloading: 'Download läuft... {{percent}}%',
        later: 'Später',
        downloadNow: 'Jetzt herunterladen',
        installing: 'Lädt...'
      },
      
      menu: {
        checkForUpdates: 'Nach Updates suchen',
        searching: 'Suche nach Updates...',
        searchingMessage: 'Die Anwendung prüft automatisch nach verfügbaren Updates. Sie werden benachrichtigt, wenn ein Update verfügbar ist.'
      }
    },
    
    // Allgemeine Begriffe
    common: {
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolgreich',
      warning: 'Warnung',
      info: 'Information',
      language: 'Sprache',
      general: 'Allgemein',
      appearance: 'Darstellung'
    }
  }
};

// Englische Übersetzungen
const en = {
  translation: {
    // Navigation
    nav: {
      customers: 'Customers',
      invoices: 'Generate Invoices',
      settings: 'Settings'
    },
    
    // App Header
    app: {
      title: 'QuartaBill',
      subtitle: 'Professional Quarterly Billing for Occupational Health Physicians'
    },
    
    // Customer Management
    customers: {
      title: 'Customer Management',
      newCustomer: 'New Customer',
      editCustomer: 'Edit Customer',
      deleteCustomer: 'Are you sure you want to delete this customer?',
      noCustomers: 'No customers available',
      createFirst: 'Create your first customer.',
      exampleInvoiceNumber: 'Example Invoice Number',
      unnamedCustomer: 'Unnamed Customer',
      noAddress: 'No address provided',
      hours: 'hrs.',
      
      // Forms
      form: {
        name: 'Company Name',
        address: 'Address',
        hourlyRate: 'Hourly Rate (€)',
        hours: 'Hours per Quarter',
        email: 'Email Address',
        activity: 'Service Description',
        emailSubject: 'Email Subject',
        emailTemplate: 'Email Template',
        savePathWindows: 'PDF Path (Windows)',
        savePathMac: 'PDF Path (Mac)',
        emlPathWindows: 'EML Path (Windows)',
        emlPathMac: 'EML Path (Mac)',
        placeholders: {
          address: 'Street\\nZIP City',
          activity: 'Occupational Health Services [Quarter]',
          emailSubject: 'Available variables: [Rechnungsnummer], [Kunde], [Quartal], [Jahr]',
          emailTemplate: 'Available variables: [Quartal], [Jahr], [Rechnungsnummer], [Kunde]',
          savePathWindows: 'C:\\Path\\to\\Customer-Folder',
          savePathMac: '/Path/to/Customer-Folder',
          emlPathWindows: 'C:\\Path\\to\\Email-Folder',
          emlPathMac: '/Path/to/Email-Folder'
        },
        paths: 'Paths',
        storagePaths: 'Storage Paths',
        pdfPaths: 'PDF Storage Paths',
        emlPaths: 'EML Storage Paths',
        emailTemplatePlaceholder: 'Email text that will be sent with the invoice...'
      },
      
      buttons: {
        save: 'Save',
        cancel: 'Cancel',
        selectFolder: 'Select Folder',
        add: 'Add'
      }
    },
    
    // Invoice Generation
    invoices: {
      title: 'Generate Invoices',
      quarter: 'Quarter',
      year: 'Year',
      generateEmail: 'Generate Email (.eml)',
      autoExport: 'Export directly to customer folders',
      selectCustomers: 'Select Customers',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      summary: 'Summary',
      customersSelected: 'of {{total}} customers selected',
      totalAmount: 'Total Amount',
      generate: 'Generate PDFs',
      generating: 'Generating...',
      
      // Period
      period: {
        serviceTime: 'Service Period',
        invoiceDate: 'Invoice Date'
      },
      
      // Results
      results: {
        title: 'Invoice Generation Completed',
        success: 'Success',
        error: 'Error',
        close: 'Close'
      },
      
      // Warnings
      warnings: {
        noCustomers: 'No customers available. Please create customers first.',
        selectCustomers: 'Please select at least one customer.'
      }
    },
    
    // Settings
    settings: {
      title: 'Settings',
      saved: 'Settings saved!',
      
      tabs: {
        issuer: 'Invoice Issuer',
        paths: 'Paths & Files',
        about: 'About QuartaBill'
      },
      
      // Invoice Issuer
      issuer: {
        title: 'Invoice Issuer Information',
        name: 'Name',
        profession: 'Title/Profession',
        address: 'Address',
        phone: 'Phone',
        website: 'Website',
        email: 'Email',
        iban: 'IBAN',
        uid: 'Tax ID',
        bank: 'Bank',
        paymentTerms: 'Payment Terms (Days)',
        language: 'Language',
        darkMode: 'Dark Mode',
        
        // Invoice Number
        invoiceNumber: {
          title: 'Invoice Number Format',
          format: 'Format for Invoice Numbers',
          help: 'Available variables: {Q}/{QQ} (Quarter), {YY}/{YYYY} (Year), {K}/{KK}/{KKK} (Customer), {N}/{NN}/{NNN} (Number)',
          examples: {
            title: 'Examples:',
            standard: '(Default)',
            verbose: 'Full format with hyphens',
            prefix: 'With prefix and sequence',
            compact: 'Compact'
          }
        }
      },
      
      // Paths
      paths: {
        logoTitle: 'Logo Paths',
        logoWindows: 'Windows Logo Path',
        logoMac: 'Mac Logo Path',
        logoInfo: 'The logo is displayed in the upper left corner of the invoice. Recommended size: 200x120 pixels.',
        
        dataTitle: 'Data Synchronization',
        dataPath: 'Data File Path',
        dataInfo: 'This file is loaded at program startup and can be synchronized between different devices via e.g. Nextcloud, iCloud, Dropbox, OneDrive etc.'
      },
      
      // About
      about: {
        title: 'QuartaBill',
        subtitle: 'Professional Quarterly Billing for Occupational Health Physicians',
        developer: 'Developed by Dr. Thomas Entner',
        description: 'This application was specifically developed for occupational health physicians to simplify and automate the quarterly billing of their services.',
        features: {
          title: 'QuartaBill Features:',
          customerManagement: 'Manage customer data',
          autoInvoices: 'Automatic quarterly invoices',
          pdfGeneration: 'Generate PDF invoices',
          emailTemplates: 'Create email templates',
          dataSync: 'Secure data synchronization',
          taxCalculation: 'German tax calculation'
        },
        version: 'Version 1.0.0 - For efficient and professional practice management'
      },
      
      buttons: {
        save: 'Save Settings'
      },
      
      noSavePathMessage: 'No save path specified',
      noEmlPathMessage: 'No EML save path specified'
    },
    
    // Onboarding
    onboarding: {
      skip: 'Skip',
      back: 'Back',
      next: 'Next',
      finish: 'Finish',
      
      steps: {
        welcome: {
          title: 'Welcome to QuartaBill',
          subtitle: 'Professional Quarterly Billing for Occupational Health Physicians',
          developer: 'Developed by Dr. Thomas Entner',
          description1: 'This application was specifically developed for occupational health physicians to simplify and automate the quarterly billing of their services.',
          description2: 'Save time on invoice creation and focus on what matters most - your patients.'
        },
        customers: {
          title: 'Customer Management',
          subtitle: 'Manage your customers centrally',
          feature1: 'Centrally manage customer data - Name, address, contact details',
          feature2: 'Define hourly rates - Individual prices per customer',
          feature3: 'Set standard hours - Typically 6 hours per quarter',
          feature4: 'Email templates - Personalized messages per customer'
        },
        invoices: {
          title: 'Automatic Invoice Generation',
          subtitle: 'Quarterly invoices with one click',
          feature1: 'Batch generation - All customers of a quarter at once',
          feature2: 'Customizable invoice numbers - Adaptable format (e.g. 0124EC)',
          feature3: 'German tax calculation - 90% with 20% VAT, 10% with 0% VAT',
          feature4: 'Quarterly dating - Automatically correct invoice dates'
        },
        export: {
          title: 'PDF & Email Export',
          subtitle: 'Professional output',
          feature1: 'Professional PDF invoices - With your logo and design',
          feature2: 'Automatic email generation - .eml files with PDF attachment',
          feature3: 'Separate storage paths - Windows and Mac compatible',
          feature4: 'Standardized file names - Easy archiving'
        },
        finish: {
          title: 'Let\'s go!',
          subtitle: 'First steps with QuartaBill',
          ready: 'You are ready!',
          description: 'Start setting up your data now:',
          step1: 'Settings → Enter your invoice data',
          step2: 'Customers → Create first customers',
          step3: 'Generate Invoices → Create first quarterly invoice',
          success: 'Good luck with QuartaBill!'
        }
      }
    },
    
    // PDF Texts
    pdf: {
      invoiceDetails: 'INVOICE DETAILS',
      invoiceAddress: 'BILLING ADDRESS',
      invoiceNumber: 'Invoice Number',
      invoiceDate: 'Invoice Date',
      serviceTime: 'Service Period',
      serviceDescription: 'SERVICE DESCRIPTION',
      hours: 'HRS.',
      hourlyRate: '€/HR.',
      amount: 'AMOUNT',
      invoiceSum: 'INVOICE TOTAL',
      subtotal: 'SUBTOTAL',
      taxRate90: 'TAX RATE on 90% of sum',
      taxRate10: 'TAX RATE on 10% of sum',
      vat: 'VAT',
      total: 'Total',
      paymentTerms: 'Payment terms: {{days}} days',
      logoPlaceholder: 'LOGO'
    },
    
    // Email Templates
    email: {
      subject: 'Invoice {{invoiceNumber}}',
      defaultSubject: 'Invoice [Rechnungsnummer] - [Kunde]',
      defaultTemplate: 'Dear Sir or Madam,\\n\\nPlease find attached the invoice for the past quarter.\\n\\nIf you have any questions, please feel free to contact us.\\n\\nBest regards',
      generationFailed: 'Email generation failed: {{message}}'
    },
    
    // General Buttons
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      select: 'Select'
    },
    
    // Auto-Update
    update: {
      checking: 'Checking for updates...',
      available: 'Update available',
      notAvailable: 'Your app is already up to date.',
      downloaded: 'Update v{{version}} downloaded. Restart available.',
      error: 'Update error: {{message}}',
      ready: 'Update ready',
      downloading: 'Loading... {{percent}}%',
      checkError: 'Error checking for updates.',
      downloadError: 'Error downloading update.',
      installError: 'Error installing update.',
      
      dialog: {
        title: 'Update available',
        message: 'A new version of QuartaBill is available.',
        currentVersion: 'Current version: v{{version}}',
        newVersion: 'New version: v{{version}}',
        downloading: 'Download in progress... {{percent}}%',
        later: 'Later',
        downloadNow: 'Download now',
        installing: 'Loading...'
      },
      
      menu: {
        checkForUpdates: 'Check for updates',
        searching: 'Checking for updates...',
        searchingMessage: 'The application automatically checks for available updates. You will be notified when an update is available.'
      }
    },
    
    // General Terms
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      language: 'Language',
      general: 'General',
      appearance: 'Appearance'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de,
      en
    },
    lng: 'de', // Standard-Sprache
    fallbackLng: 'de',
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 