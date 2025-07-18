import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Deutsche Übersetzungen
const de = {
  translation: {
    // Navigation
    nav: {
      customers: 'Kunden',
      invoices: 'Rechnungen erstellen',
      invoiceHistory: 'Rechnungshistorie',
      settings: 'Einstellungen'
    },
    
    // App Header
    app: {
      title: 'QuartaBill',
      subtitle: 'Pauschale Quartalsabrechnungen automatisieren'
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
        savePathLinux: 'PDF-Pfad (Linux)',
        emlPathWindows: 'EML-Pfad (Windows)',
        emlPathMac: 'EML-Pfad (Mac)',
        emlPathLinux: 'EML-Pfad (Linux)',
        noLineItems: 'Keine Leistungspositionen definiert',
        position: 'Position',
        positions: 'Positionen',
        placeholders: {
          address: 'Straße\\nPLZ Ort',
          activity: 'Dienstleistung [Quartal] (z.B. Arbeitsmedizinische Betreuung)',
          emailSubject: 'Verfügbare Variablen: [Rechnungsnummer], [Kunde], [Quartal], [Jahr]',
          emailTemplate: 'Verfügbare Variablen: [Quartal], [Jahr], [Rechnungsnummer], [Kunde]',
          savePathWindows: 'C:\\Pfad\\zu\\Kundenordner',
          savePathMac: '/Pfad/zu/Kundenordner',
          savePathLinux: '/pfad/zu/kundenordner',
          emlPathWindows: 'C:\\Pfad\\zu\\Email-Ordner',
          emlPathMac: '/Pfad/zu/Email-Ordner',
          emlPathLinux: '/pfad/zu/email-ordner'
        },
                  paths: 'Pfade',
          storagePaths: 'Speicherpfade',
          pdfPaths: 'PDF-Speicherpfade',
          emlPaths: 'EML-Speicherpfade',
          platformPaths: 'Plattform-Pfade',
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
        close: 'Schließen',
        emlHint: '💡 **Tipp zum E-Mail-Versand:** Ziehen Sie die generierten .eml-Dateien per Drag & Drop in die "Entwürfe" Ihres E-Mail-Programms (z.B. Thunderbird), um sie von dort direkt zu versenden.'
      },
      
      // Warnungen
      warnings: {
        noCustomers: 'Keine Kunden vorhanden. Bitte legen Sie zuerst Kunden an.',
        selectCustomers: 'Bitte wählen Sie mindestens einen Kunden aus.',
        existingInvoices: 'Für folgende Kunden existieren bereits Rechnungen für {{quarter}} {{year}}: {{customers}}\\n\\nMöchten Sie trotzdem fortfahren?'
      },
      
      // Pfad-Validierung
      pathValidation: {
        title: 'Fehlende Pfade konfigurieren',
        description: 'Bevor Rechnungen generiert werden können, müssen folgende Pfade konfiguriert werden:',
        warningsTitle: 'Hinweise zur E-Mail-Generierung:',
        location: 'Konfiguration unter',
        instructions: 'Bitte konfigurieren Sie die fehlenden Pfade in den entsprechenden Einstellungen und versuchen Sie anschließend erneut.',
        warningsInfo: 'Diese Kunden werden übersprungen - die PDF-Generierung kann trotzdem fortgesetzt werden.',
        close: 'Verstanden',
        cancel: 'Abbrechen',
        continueAnyway: 'Trotzdem fortfahren'
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
          help: 'Verfügbare Variablen: [Q]/[QQ] (Quartal), [YY]/[YYYY] (Jahr), [K]/[KK]/[KKK] (Kunde), [N]/[NN]/[NNN] (Nummer)',
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
        logoLinux: 'Linux Logo-Pfad',
        logoInfo: 'Das Logo wird in der oberen linken Ecke der Rechnung angezeigt. Empfohlene Größe: 200x120 Pixel.',
        platformInfo: 'Nur die Pfade für Ihr aktuelles Betriebssystem sind relevant. Die anderen Pfade werden für die plattformübergreifende Kompatibilität gespeichert.',
        
        dataTitle: 'Daten-Synchronisation',
        dataPath: 'Pfad zur Daten-Datei',
        dataInfo: 'Diese Datei wird beim Programmstart geladen und kann über z.B. Nextcloud, iCloud, Dropbox, OneDrive etc. zwischen verschiedenen Geräten synchronisiert werden.'
      },
      
      // Über
      about: {
        title: 'QuartaBill',
        subtitle: 'Pauschale Quartalsabrechnungen automatisieren',
        developer: 'Entwickelt von Dr. Thomas Entner',
        description: 'Diese Anwendung wurde für Dienstleister mit quartalsweisen Pauschalabrechungen entwickelt, um wiederkehrende Rechnungen zu automatisieren. Ideal für Arbeitsmediziner, Berater, Wartungsdienstleister und andere Branchen mit regelmäßigen Quartalsleistungen.',
        features: {
          title: 'Features von QuartaBill:',
          customerManagement: 'Kundendaten verwalten',
          autoInvoices: 'Automatische Quartalsrechnungen',
          pdfGeneration: 'PDF-Rechnungen generieren',
          emailTemplates: 'E-Mail-Vorlagen erstellen',
          dataSync: 'Sichere Datensynchronisation',
          taxCalculation: 'Deutsche Steuerberechnung'
        },
        version: 'Version {{version}} - Für eine effiziente und professionelle Praxisverwaltung'
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

    // Config Setup Dialog
    configSetup: {
      title: 'Einstellungsdatei-Setup',
      description: 'QuartaBill benötigt eine Einstellungsdatei für Ihre Daten. Diese kann an einem beliebigen Ort gespeichert werden (z.B. in einem Cloud-Ordner für Synchronisation zwischen Geräten).',
      chooseLocation: 'Speicherort wählen',
      choiceDescription: 'Sie können entweder eine neue Einstellungsdatei erstellen oder eine bereits vorhandene QuartaBill-Datei auswählen.',
      newFile: {
        title: '📁 Neue Datei erstellen:',
        description: '• Für ersten QuartaBill-Start\n• Beginnt mit leeren Kundendaten\n• Ideal für Cloud-Ordner (Dropbox, OneDrive, etc.)'
      },
      existingFile: {
        title: '📂 Bestehende Datei öffnen:',
        description: '• Wenn Sie bereits QuartaBill-Daten haben\n• Lädt vorhandene Kunden und Einstellungen\n• Für Wechsel zwischen verschiedenen Datenständen'
      },
      recommendation: 'Empfehlung: Speichern Sie Ihre Einstellungsdatei in einem Cloud-Ordner für automatische Synchronisation zwischen Geräten.',
      important: 'Wichtig: Merken Sie sich den gewählten Speicherort. Sie können diesen später in den Einstellungen ändern, falls nötig.',
      analyzing: 'Datei wird analysiert...',
      existingFound: {
        title: 'Bestehende QuartaBill-Datei gefunden!',
        description: 'Die ausgewählte Datei enthält bereits QuartaBill-Daten:',
        foundData: 'Gefundene Daten:',
        customers: '{{count}} Kunden',
        settingsAvailable: 'Einstellungen vorhanden: {{available}}',
        question: 'Möchten Sie diese bestehende Datei verwenden oder eine neue erstellen?'
      },
      invalidFile: {
        title: 'Ungültiges Dateiformat',
        description: 'Die ausgewählte Datei existiert bereits, enthält aber keine gültigen QuartaBill-Daten:',
        error: 'Fehler: {{error}}',
        options: 'Sie können die Datei überschreiben oder eine andere Datei auswählen.'
      },
      completed: {
        title: 'Setup erfolgreich abgeschlossen!',
        description: 'Ihre Einstellungsdatei wurde eingerichtet:',
        info: 'QuartaBill wird nun gestartet und die Datei automatisch überwachen.'
      },
      buttons: {
        chooseLocation: 'Speicherort wählen',
        useExisting: 'Bestehende Datei verwenden',
        createNew: 'Neue Datei erstellen',
        overwrite: 'Datei überschreiben',
        chooseDifferent: 'Andere Datei wählen',
        startApp: 'QuartaBill starten'
      }
    },
    
    // Settings for Config File
    configFile: {
      title: 'Einstellungsdatei',
      pathLabel: 'Pfad zur Einstellungsdatei',
      noFileSelected: 'Keine Einstellungsdatei ausgewählt',
      description: 'Diese Datei enthält alle Ihre Kundendaten und Einstellungen. Sie wird automatisch auf Änderungen überwacht. Bei Änderungen von außen werden Sie benachrichtigt.',
      activeFile: 'Aktive Einstellungsdatei:',
      changeWarning: 'Möchten Sie wirklich zu einer anderen Einstellungsdatei wechseln?\n\nDie Anwendung wird automatisch die Daten aus der neuen Datei laden. Nicht gespeicherte Änderungen gehen verloren.'
    },

    // File Changed Notification
    fileChanged: {
      message: 'Die Einstellungsdatei wurde extern geändert:\n{{filePath}}\n\nMöchten Sie die Änderungen laden? Nicht gespeicherte Änderungen gehen verloren.'
    },
    
    // Rechnungshistorie
    invoiceHistory: {
      title: 'Rechnungshistorie',
      noInvoices: 'Keine Rechnungen vorhanden',
      noFilterResults: 'Keine Rechnungen gefunden, die den Filterkriterien entsprechen.',
      generateFirst: 'Erstellen Sie zuerst einige Rechnungen über den Tab "Rechnungen erstellen".',
      
      // Statistiken
      stats: {
        totalInvoices: 'Rechnungen gesamt',
        selectYear: 'Jahr wählen',
        yearInvoices: 'Rechnungen {{year}}',
        yearAmount: 'Umsatz {{year}}',
        yearVAT: 'USt. {{year}}'
      },
      
      // Filter
      filters: {
        title: 'Filter & Suche',
        search: 'Suchen...',
        customer: 'Kunde',
        quarter: 'Quartal',
        year: 'Jahr',
        status: 'Status',
        all: 'Alle',
        clear: 'Zurücksetzen'
      },
      
      // Tabelle
      table: {
        invoiceNumber: 'Rechnungsnummer',
        customer: 'Kunde',
        period: 'Zeitraum',
        amount: 'Betrag',
        vat: 'USt.',
        created: 'Erstellt',
        status: 'Status',
        actions: 'Aktionen'
      },
      
      // Status
      status: {
        generated: 'Erstellt',
        readyToSend: 'Versandbereit',
        sent: 'Versendet',
        paid: 'Bezahlt'
      },
      
      // Aktionen
      actions: {
        viewDetails: 'Details anzeigen',
        openPdf: 'PDF öffnen',
        openEmail: 'E-Mail öffnen',
        delete: 'Löschen'
      },
      
      // Details Dialog
      details: {
        title: 'Rechnungsdetails',
        customer: 'Kunde',
        period: 'Zeitraum',
        amount: 'Betrag',
        subtotal: 'Zwischensumme',
        vat: 'Umsatzsteuer',
        created: 'Erstellt am',
        pdfPath: 'PDF-Pfad',
        emailPath: 'E-Mail-Pfad'
      },
      
      // Export
      export: {
        csvTooltip: 'Als CSV-Datei exportieren',
        excelTooltip: 'Als Excel-Datei exportieren'
      },

      // Pagination
      pagination: {
        itemsPerPage: 'Pro Seite',
        pageInfo: 'Seite {{page}} von {{total}} • {{count}} Rechnungen gesamt',
        showing: 'Zeige {{from}}-{{to}} von {{total}} Rechnungen',
        all: 'Alle',
        totalInvoices: '{{count}} Rechnungen gesamt'
      },

      // Löschen Dialog
      delete: {
        title: 'Rechnung löschen',
        message: 'Möchten Sie die Rechnung {{invoiceNumber}} für {{customer}} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
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
      appearance: 'Darstellung',
      yes: 'Ja',
      no: 'Nein',
      delete: 'Löschen',
      cancel: 'Abbrechen',
      close: 'Schließen',
      currentPlatform: 'Aktuelle Plattform',
      otherPlatforms: 'Weitere Plattformen'
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
      invoiceHistory: 'Invoice History',
      settings: 'Settings'
    },
    
    // App Header
    app: {
      title: 'QuartaBill',
      subtitle: 'Automate Quarterly Fixed-Price Billing'
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
        savePathLinux: 'PDF Path (Linux)',
        emlPathWindows: 'EML Path (Windows)',
        emlPathMac: 'EML Path (Mac)',
        emlPathLinux: 'EML Path (Linux)',
        noLineItems: 'No service positions defined',
        position: 'position',
        positions: 'positions',
        placeholders: {
          address: 'Street\\nZIP City',
          activity: 'Service [Quarter] (e.g. Occupational Health Support)',
          emailSubject: 'Available variables: [Rechnungsnummer], [Kunde], [Quartal], [Jahr]',
          emailTemplate: 'Available variables: [Quartal], [Jahr], [Rechnungsnummer], [Kunde]',
          savePathWindows: 'C:\\Path\\to\\Customer-Folder',
          savePathMac: '/Path/to/Customer-Folder',
          savePathLinux: '/path/to/customer-folder',
          emlPathWindows: 'C:\\Path\\to\\Email-Folder',
          emlPathMac: '/Path/to/Email-Folder',
          emlPathLinux: '/path/to/email-folder'
        },
                  paths: 'Paths',
          storagePaths: 'Storage Paths',
          pdfPaths: 'PDF Storage Paths',
          emlPaths: 'EML Storage Paths',
          platformPaths: 'Platform Paths',
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
        close: 'Close',
        emlHint: '💡 **Tip for sending emails:** Drag and drop the generated .eml files into the "Drafts" folder of your email client (e.g., Thunderbird) to send them directly from there.'
      },
      
      // Warnings
      warnings: {
        noCustomers: 'No customers available. Please create customers first.',
        selectCustomers: 'Please select at least one customer.',
        existingInvoices: 'Invoices already exist for the following customers for {{quarter}} {{year}}: {{customers}}\\n\\nDo you want to continue anyway?'
      },
      
      // Path Validation
      pathValidation: {
        title: 'Configure Missing Paths',
        description: 'Before invoices can be generated, the following paths must be configured:',
        warningsTitle: 'Email generation notices:',
        location: 'Configure under',
        instructions: 'Please configure the missing paths in the corresponding settings and then try again.',
        warningsInfo: 'These customers will be skipped - PDF generation can still continue.',
        close: 'Understood',
        cancel: 'Cancel',
        continueAnyway: 'Continue anyway'
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
          help: 'Available variables: [Q]/[QQ] (Quarter), [YY]/[YYYY] (Year), [K]/[KK]/[KKK] (Customer), [N]/[NN]/[NNN] (Number)',
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
        logoLinux: 'Linux Logo Path',
        logoInfo: 'The logo is displayed in the upper left corner of the invoice. Recommended size: 200x120 pixels.',
        platformInfo: 'Only the paths for your current operating system are relevant. The other paths are stored for cross-platform compatibility.',
        
        dataTitle: 'Data Synchronization',
        dataPath: 'Data File Path',
        dataInfo: 'This file is loaded at program startup and can be synchronized between different devices via e.g. Nextcloud, iCloud, Dropbox, OneDrive etc.'
      },
      
      // About
      about: {
        title: 'QuartaBill',
        subtitle: 'Automate Quarterly Fixed-Price Billing',
        developer: 'Developed by Dr. Thomas Entner',
        description: 'This application was developed for service providers with quarterly fixed-price billing to automate recurring invoices. Ideal for occupational health physicians, consultants, maintenance service providers and other industries with regular quarterly services.',
        features: {
          title: 'QuartaBill Features:',
          customerManagement: 'Manage customer data',
          autoInvoices: 'Automatic quarterly invoices',
          pdfGeneration: 'Generate PDF invoices',
          emailTemplates: 'Create email templates',
          dataSync: 'Secure data synchronization',
          taxCalculation: 'German tax calculation'
        },
        version: 'Version {{version}} - For efficient and professional practice management'
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
    
    // Config Setup Dialog
    configSetup: {
      title: 'Settings File Setup',
      description: 'QuartaBill requires a settings file for your data. This can be stored anywhere (e.g. in a cloud folder for synchronization between devices).',
      chooseLocation: 'Choose Location',
      choiceDescription: 'You can either create a new settings file or select an existing QuartaBill file.',
      newFile: {
        title: '📁 Create New File:',
        description: '• For first QuartaBill start\n• Begins with empty customer data\n• Ideal for cloud folders (Dropbox, OneDrive, etc.)'
      },
      existingFile: {
        title: '📂 Open Existing File:',
        description: '• When you already have QuartaBill data\n• Loads existing customers and settings\n• For switching between different data sets'
      },
      recommendation: 'Recommendation: Save your settings file in a cloud folder for automatic synchronization between devices.',
      important: 'Important: Remember the chosen location. You can change this later in the settings if necessary.',
      analyzing: 'Analyzing file...',
      existingFound: {
        title: 'Existing QuartaBill file found!',
        description: 'The selected file already contains QuartaBill data:',
        foundData: 'Found data:',
        customers: '{{count}} customers',
        settingsAvailable: 'Settings available: {{available}}',
        question: 'Do you want to use this existing file or create a new one?'
      },
      invalidFile: {
        title: 'Invalid file format',
        description: 'The selected file exists but does not contain valid QuartaBill data:',
        error: 'Error: {{error}}',
        options: 'You can overwrite the file or select a different file.'
      },
      completed: {
        title: 'Setup completed successfully!',
        description: 'Your settings file has been configured:',
        info: 'QuartaBill will now start and automatically monitor the file.'
      },
      buttons: {
        chooseLocation: 'Choose Location',
        useExisting: 'Use Existing File',
        createNew: 'Create New File',
        overwrite: 'Overwrite File',
        chooseDifferent: 'Choose Different File',
        startApp: 'Start QuartaBill'
      }
    },
    
    // Settings for Config File
    configFile: {
      title: 'Settings File',
      pathLabel: 'Path to settings file',
      noFileSelected: 'No settings file selected',
      description: 'This file contains all your customer data and settings. It is automatically monitored for changes. You will be notified of external changes.',
      activeFile: 'Active settings file:',
      changeWarning: 'Do you really want to switch to another settings file?\n\nThe application will automatically load the data from the new file. Unsaved changes will be lost.'
    },

    // File Changed Notification
    fileChanged: {
      message: 'The settings file was changed externally:\n{{filePath}}\n\nWould you like to load the changes? Unsaved changes will be lost.'
    },

    // Invoice History
    invoiceHistory: {
      title: 'Invoice History',
      noInvoices: 'No invoices available',
      noFilterResults: 'No invoices found matching the filter criteria.',
      generateFirst: 'Create some invoices first via the "Generate Invoices" tab.',
      
      // Statistics
      stats: {
        totalInvoices: 'Total Invoices',
        selectYear: 'Select Year',
        yearInvoices: 'Invoices {{year}}',
        yearAmount: 'Revenue {{year}}',
        yearVAT: 'VAT {{year}}'
      },
      
      // Filters
      filters: {
        title: 'Filter & Search',
        search: 'Search...',
        customer: 'Customer',
        quarter: 'Quarter',
        year: 'Year',
        status: 'Status',
        all: 'All',
        clear: 'Clear'
      },
      
      // Table
      table: {
        invoiceNumber: 'Invoice Number',
        customer: 'Customer',
        period: 'Period',
        amount: 'Amount',
        vat: 'VAT',
        created: 'Created',
        status: 'Status',
        actions: 'Actions'
      },
      
      // Status
      status: {
        generated: 'Generated',
        readyToSend: 'Ready to Send',
        sent: 'Sent',
        paid: 'Paid'
      },
      
      // Actions
      actions: {
        viewDetails: 'View Details',
        openPdf: 'Open PDF',
        openEmail: 'Open Email',
        delete: 'Delete'
      },
      
      // Details Dialog
      details: {
        title: 'Invoice Details',
        customer: 'Customer',
        period: 'Period',
        amount: 'Amount',
        subtotal: 'Subtotal',
        vat: 'VAT',
        created: 'Created at',
        pdfPath: 'PDF Path',
        emailPath: 'Email Path'
      },
      
      // Export
      export: {
        csvTooltip: 'Export as CSV file',
        excelTooltip: 'Export as Excel file'
      },

      // Pagination
      pagination: {
        itemsPerPage: 'Per page',
        pageInfo: 'Page {{page}} of {{total}} • {{count}} invoices total',
        showing: 'Showing {{from}}-{{to}} of {{total}} invoices',
        all: 'All',
        totalInvoices: '{{count}} invoices total'
      },

      // Delete Dialog
      delete: {
        title: 'Delete Invoice',
        message: 'Do you really want to delete invoice {{invoiceNumber}} for {{customer}}? This action cannot be undone.'
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
      appearance: 'Appearance',
      yes: 'Yes',
      no: 'No',
      delete: 'Delete',
      cancel: 'Cancel',
      close: 'Close',
      currentPlatform: 'Current Platform',
      otherPlatforms: 'Other Platforms'
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