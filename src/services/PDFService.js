import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import i18n from '../i18n';
import DataService from './DataService';

class PDFService {
  static async generateInvoice({ customer, settings, quarter, year, invoiceNumber, invoiceDate, autoExport = false }) {
    const doc = new jsPDF();
    
    // Logo laden wenn vorhanden
    await this.addLogo(doc, settings);
    
    // Kopfbereich - Rechnungsersteller
    this.addIssuerInfo(doc, settings.issuer);
    
    // Rechnungsdetails (rechts oben)
    this.addInvoiceDetails(doc, invoiceNumber, invoiceDate, quarter);
    
    // Kunde (links)
    this.addCustomerInfo(doc, customer);
    
    // Leistungstabelle
    const tableEndY = this.addServiceTable(doc, customer, quarter, invoiceNumber, year, settings.issuer);
    
    // Berechnung (Zwischensumme, Steuer, Gesamt) - dynamische Position nach Tabelle
    const calculationCreatedNewPage = this.addCalculation(doc, customer, tableEndY, settings.issuer);
    
    // Fußbereich (Bankdaten) - auf allen Seiten
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      if (i > 1) doc.setPage(i); // Wechsele zur Seite (außer erste Seite)
      this.addFooter(doc, settings.issuer);
    }
    
    // Zurück zur letzten Seite
    if (totalPages > 1) {
      doc.setPage(totalPages);
    }
    
    // PDF speichern - verwende kundenspezifisches Format
    const fileName = this.generatePDFFileName(customer, invoiceNumber, quarter, year, invoiceDate);
    const pdfBuffer = doc.output('arraybuffer');
    
    if (autoExport) {
      // Automatischer Export in Kundenordner
      const platform = await DataService.getPlatform();
      let savePath;
      
      if (platform === 'win32') {
        savePath = customer.savePathWindows;
      } else if (platform === 'darwin') {
        savePath = customer.savePathMac;
      } else if (platform === 'linux') {
        savePath = customer.savePathLinux;
      } else {
        // Browser oder unbekanntes System
        savePath = null;
      }
      
      if (savePath && savePath.trim() !== '') {
        try {
          const fullPath = `${savePath}/${fileName}`;
          await DataService.saveFile(window.electronAPI ? window.electronAPI.bufferFrom(pdfBuffer) : new Uint8Array(pdfBuffer), fullPath);
          return { path: fullPath, buffer: pdfBuffer, exported: true };
        } catch (error) {
          console.warn('Automatischer Export fehlgeschlagen:', error);
          // Fallback: Browser-Download
          return this.fallbackBrowserDownload(fileName, pdfBuffer, 'Export in Kundenordner fehlgeschlagen');
        }
      } else {
        // Zeige spezifische Fehlermeldung basierend auf Plattform
        let platformMessage;
        if (platform === 'darwin') {
          platformMessage = 'Kein macOS-Speicherpfad für Kunde konfiguriert. Bitte in den Kunden-Einstellungen den "PDF-Pfad (macOS)" setzen.';
        } else if (platform === 'win32') {
          platformMessage = 'Kein Windows-Speicherpfad für Kunde konfiguriert. Bitte in den Kunden-Einstellungen den "PDF-Pfad (Windows)" setzen.';
        } else if (platform === 'linux') {
          platformMessage = 'Kein Linux-Speicherpfad für Kunde konfiguriert. Bitte in den Kunden-Einstellungen den "PDF-Pfad (Linux)" setzen.';
        } else {
          platformMessage = 'Kein Speicherpfad für aktuelle Plattform konfiguriert.';
        }
        return this.fallbackBrowserDownload(fileName, pdfBuffer, platformMessage);
      }
    } else {
      // Normale Speicherung mit Dialog
      const platform = await DataService.getPlatform();
      let savePath;
      
      if (platform === 'win32') {
        savePath = customer.savePathWindows;
      } else if (platform === 'darwin') {
        savePath = customer.savePathMac;
      } else if (platform === 'linux') {
        savePath = customer.savePathLinux;
      } else {
        // Browser oder unbekanntes System
        savePath = null;
      }
      
      if (savePath && savePath.trim() !== '') {
        try {
          const fullPath = `${savePath}/${fileName}`;
          await DataService.saveFile(window.electronAPI ? window.electronAPI.bufferFrom(pdfBuffer) : new Uint8Array(pdfBuffer), fullPath);
          return { path: fullPath, buffer: pdfBuffer, exported: false };
        } catch (error) {
          console.warn('Speicherung im Kundenordner fehlgeschlagen:', error);
          // Fallback: Browser-Download
          return this.fallbackBrowserDownload(fileName, pdfBuffer, 'Speicherung im Kundenordner fehlgeschlagen');
        }
      } else {
        // Zeige spezifische Fehlermeldung basierend auf Plattform
        let platformMessage;
        if (platform === 'darwin') {
          platformMessage = 'Kein macOS-Speicherpfad für Kunde konfiguriert. Bitte in den Kunden-Einstellungen den "PDF-Pfad (macOS)" setzen.';
        } else if (platform === 'win32') {
          platformMessage = 'Kein Windows-Speicherpfad für Kunde konfiguriert. Bitte in den Kunden-Einstellungen den "PDF-Pfad (Windows)" setzen.';
        } else if (platform === 'linux') {
          platformMessage = 'Kein Linux-Speicherpfad für Kunde konfiguriert. Bitte in den Kunden-Einstellungen den "PDF-Pfad (Linux)" setzen.';
        } else {
          platformMessage = 'Kein Speicherpfad für aktuelle Plattform konfiguriert.';
        }
        return this.fallbackBrowserDownload(fileName, pdfBuffer, platformMessage);
      }
    }
  }

  static fallbackBrowserDownload(fileName, pdfBuffer, message) {
    try {
      // Browser-Download als Fallback
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Download-Link erstellen und automatisch klicken
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // URL freigeben
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      return { 
        path: fileName, 
        buffer: pdfBuffer, 
        exported: false,
        browserDownload: true,
        message: message || 'PDF als Browser-Download gespeichert'
      };
    } catch (error) {
      console.error('Browser-Download fehlgeschlagen:', error);
      throw new Error(`PDF-Generierung fehlgeschlagen: ${error.message}`);
    }
  }

  static generatePDFFileName(customer, invoiceNumber, quarter, year, invoiceDate) {
    // Verwende kundenspezifisches Format oder Standard-Format
    const format = customer.pdfFileNameFormat || '[invoiceNumber]_[customerName]';
    
    // Verfügbare Variablen
    const variables = {
      invoiceNumber: invoiceNumber,
      customerName: customer.name.replace(/[^a-zA-Z0-9]/g, '_'),
      quarter: quarter,
      year: year.toString(),
      date: invoiceDate.toISOString().split('T')[0] // YYYY-MM-DD
    };

    // Ersetze alle Variablen im Format (verwende eckige Klammern)
    let fileName = format;
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      fileName = fileName.replace(regex, variables[key]);
    });

    // Stelle sicher, dass der Dateiname gültig ist
    fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Füge .pdf Extension hinzu falls nicht vorhanden
    if (!fileName.toLowerCase().endsWith('.pdf')) {
      fileName += '.pdf';
    }

    return fileName;
  }

  static async addLogo(doc, settings) {
    try {
      const platform = await DataService.getPlatform();
      let logoPath = null;
      
      console.log('PDF Logo Debug - Platform:', platform);
      console.log('PDF Logo Debug - Settings:', settings);
      console.log('PDF Logo Debug - window.electronAPI available:', !!window.electronAPI);
      
      if (platform === 'win32') {
        logoPath = settings.logoPathWindows;
      } else if (platform === 'darwin') {
        logoPath = settings.logoPathMac;
      } else if (platform === 'linux') {
        logoPath = settings.logoPathLinux;
      } else {
        // Browser oder unbekanntes System - kein Logo verfügbar
        logoPath = null;
      }
      
      console.log('PDF Logo Debug - Selected logoPath:', logoPath);
      
      if (logoPath && logoPath.trim() !== '' && window.electronAPI) {
        try {
          const normalizedPath = logoPath.trim();
          console.log('PDF Logo Debug - Reading file via electronAPI:', normalizedPath);
          
          // Lese die Datei über die Electron-API
          const logoData = await window.electronAPI.readFile(normalizedPath);
          
          if (logoData) {
            console.log('PDF Logo Debug - File read successfully, size:', logoData.length, 'bytes');
            console.log('PDF Logo Debug - Data type:', logoData.constructor.name);
            
            // Bestimme Dateityp
            const ext = normalizedPath.toLowerCase().split('.').pop();
            console.log('PDF Logo Debug - File extension:', ext);
            
            let format = 'PNG'; // Default
            let mimeType = 'image/png';
            
            if (ext === 'jpg' || ext === 'jpeg') {
              format = 'JPEG';
              mimeType = 'image/jpeg';
            } else if (ext === 'png') {
              format = 'PNG';
              mimeType = 'image/png';
            }
            
            // Konvertiere zu Base64 - verbesserte Verarbeitung
            let base64String;
            try {
              // Stelle sicher, dass wir richtig mit verschiedenen Datentypen umgehen
              if (logoData instanceof Uint8Array) {
                // Direkte Konvertierung von Uint8Array zu Base64
                const binaryString = Array.from(logoData).map(byte => String.fromCharCode(byte)).join('');
                base64String = btoa(binaryString);
                console.log('PDF Logo Debug - Base64 conversion (Uint8Array->btoa)');
              } else if (window.electronAPI.bufferToString) {
                // Verwende die Electron Buffer-Funktionalität
                base64String = window.electronAPI.bufferToString(logoData, 'base64');
                console.log('PDF Logo Debug - Base64 conversion (electronAPI)');
              } else {
                throw new Error('Keine geeignete Base64-Konvertierungsmethode verfügbar');
              }
              
              if (!base64String || base64String.length === 0) {
                throw new Error('Base64-Konvertierung ergab leeren String');
              }
              
              const base64Logo = `data:${mimeType};base64,${base64String}`;
              console.log('PDF Logo Debug - Base64 created, length:', base64Logo.length);
              
              // Füge Logo hinzu (position: x, y, width, height)
              doc.addImage(base64Logo, format, 20, 20, 50, 30);
              console.log('PDF Logo Debug - Logo successfully added to PDF');
              return true;
              
            } catch (base64Error) {
              console.error('PDF Logo Debug - Base64 conversion failed:', base64Error);
              throw base64Error;
            }
            
          } else {
            console.warn('PDF Logo Debug - File could not be read:', normalizedPath);
          }
        } catch (readError) {
          console.error('PDF Logo Debug - Error reading file via electronAPI:', readError);
        }
      } else {
        if (!logoPath || logoPath.trim() === '') {
          console.warn('PDF Logo Debug - No logo path configured');
        }
        if (!window.electronAPI) {
          console.warn('PDF Logo Debug - window.electronAPI not available (not in Electron)');
        }
      }
    } catch (error) {
      console.error('PDF Logo Debug - General error:', error);
    }
    
    // Fallback: Logo-Platzhalter
    console.log('PDF Logo Debug - Using logo placeholder');
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 20, 50, 30, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(i18n.t('pdf.logoPlaceholder'), 43, 37);
    return false;
  }

  static addIssuerInfo(doc, issuer) {
    // Logo wird in addLogo() hinzugefügt
    
    // Rechnungsersteller Daten (rechts oben) - professioneller
    doc.setTextColor(0);
    
    // Name hervorgehoben
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(issuer.name, 120, 22);
    
    // Titel
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(80);
    doc.text(issuer.title, 120, 28);
    
    // Adresse
    doc.setTextColor(0);
    doc.setFontSize(8);
    const addressLines = issuer.address.split('\n');
    let yPos = 35;
    addressLines.forEach(line => {
      doc.text(line, 120, yPos);
      yPos += 4;
    });
    
    // Kontaktdaten mit Icons-ähnlicher Formatierung
    yPos += 3;
    doc.setTextColor(60);
    doc.text(issuer.phone, 120, yPos);
    doc.text(issuer.website, 120, yPos + 4);
    doc.text(issuer.email, 120, yPos + 8);
    
    // Reset
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
  }

  static addInvoiceDetails(doc, invoiceNumber, invoiceDate, quarter) {
    // Rechnungsdetails-Box - rechts neben Kundendaten
    const boxY = 65;
    const boxX = 110; // Rechts neben Kundendaten (85pt + 5pt Abstand = 110)
    const boxWidth = 80;  // Rechtsbündig bis zur Tabelle (190 - 110 = 80)
    
    // Hintergrund mit dezenter Schattierung
    doc.setFillColor(248, 248, 248);
    doc.rect(boxX, boxY, boxWidth, 40, 'F');
    
    // Kein Rahmen mehr
    
    // Rechnungsdetails Header
    doc.setFillColor(45, 45, 45);
    doc.rect(boxX, boxY, boxWidth, 12, 'F');
    
    doc.setTextColor(255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text(i18n.t('pdf.invoiceDetails'), boxX + 3, boxY + 8);
    
    // Rechnungsnummer (linksbündig)
    doc.setTextColor(0);
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text(i18n.t('pdf.invoiceNumber') + ':', boxX + 3, boxY + 20);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(invoiceNumber, boxX + 3, boxY + 27);
    
    // Rechnungsdatum (zentriert)
    const centerX = boxX + boxWidth / 2;
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text(i18n.t('pdf.invoiceDate') + ':', centerX, boxY + 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(format(invoiceDate, 'dd.MM.yyyy'), centerX, boxY + 27, { align: 'center' });
    
    // Leistungszeitraum (rechtsbündig)
    const rightX = boxX + boxWidth - 3;
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text(i18n.t('pdf.serviceTime') + ':', rightX, boxY + 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(60, 90, 120);
    doc.text(quarter, rightX, boxY + 27, { align: 'right' });
    
    // Reset styles
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(0);
  }

  static addCustomerInfo(doc, customer) {
    // Elegante Rechnungsadresse-Box
    const boxY = 65;
    
    // Hintergrund
    doc.setFillColor(252, 252, 252);
    doc.rect(20, boxY, 85, 35, 'F');
    
    // Kein Rahmen mehr
    
    // Header - gleiche Höhe wie RECHNUNGSDETAILS
    doc.setFillColor(45, 45, 45);
    doc.rect(20, boxY, 85, 12, 'F');
    
    doc.setTextColor(255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text(i18n.t('pdf.invoiceAddress'), 23, boxY + 8);
    
    // Kundenname hervorgehoben
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(customer.name, 23, boxY + 20);
    
    // Adresse
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    const addressLines = customer.address.split('\n');
    let yPos = boxY + 27;
    addressLines.forEach(line => {
      doc.text(line, 23, yPos);
      yPos += 4;
    });
    
    // Reset styles
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(0);
  }

  static replaceVariables(text, variables) {
    let result = text;
    
    // Ersetze alle Variablen im Format [VariableName]
    Object.keys(variables).forEach(key => {
      const placeholder = `[${key}]`;
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), variables[key]);
    });
    
    return result;
  }

  static addServiceTable(doc, customer, quarter, invoiceNumber, year, issuer = {}) {
    const startY = 105; // 5pt höher
    const lineItems = customer.lineItems || [];
    
    if (lineItems.length === 0) {
      // Fallback falls keine Positionen vorhanden
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text('Keine Leistungspositionen definiert', 20, startY + 15);
      return startY + 25;
    }
    
    // Kompakte Tabellenhöhe - 40% weniger Platz pro Zeile
    const headerHeight = 10; // von 12 auf 10
    const rowHeight = 12;     // von 20 auf 12 (-40%)
    const tableHeight = headerHeight + (lineItems.length * rowHeight);
    
    // Korrekt dimensionierte Tabelle
    const tableWidth = 170;
    doc.setLineWidth(0.5);
    doc.setDrawColor(220, 220, 220);
    doc.rect(20, startY, tableWidth, tableHeight, 'S');
    
    // Kompakter Header
    doc.setFillColor(248, 249, 250);
    doc.rect(20, startY, tableWidth, headerHeight, 'F');
    
    // Header-Linie
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, startY + headerHeight, 20 + tableWidth, startY + headerHeight);
    
    // Kompakte Header-Texte - zentriert ausgerichtet
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.text('Beschreibung', 22, startY + 7);
    doc.text('Menge', 120, startY + 7, { align: 'center' });    
    doc.text('Einheit', 135, startY + 7, { align: 'center' });   
    doc.text('Preis', 150, startY + 7, { align: 'center' });     
    doc.text('USt', 165, startY + 7, { align: 'center' });       
    doc.text('Gesamt', 180, startY + 7, { align: 'center' });
    
    // Variable-Ersetzung für Aktivitäten
    const variables = {
      'Quartal': quarter,
      'Jahr': year,
      'Rechnungsnummer': invoiceNumber,
      'Kunde': customer.name
    };
    
    // Kompakte Leistungszeilen
    lineItems.forEach((item, index) => {
      const yPos = startY + headerHeight + (index * rowHeight);
      
              // Sehr dezente alternierende Farbe
        if (index % 2 === 0) {
          doc.setFillColor(252, 252, 252);
          doc.rect(20, yPos, tableWidth, rowHeight, 'F');
        }
        
        // Feine Trennlinie nach jeder Zeile
        if (index > 0) {
          doc.setLineWidth(0.1);
          doc.setDrawColor(235, 235, 235);
          doc.line(20, yPos, 20 + tableWidth, yPos);
        }
      
      // Beschreibung mit Variable-Ersetzung
      const description = this.replaceVariables(item.description || '', variables);
      
              // Steuer berechnen
        const subtotal = item.quantity * item.unitPrice;
        let tax = 0;
        let taxLabel = '';
        
        // Bei Kleinunternehmern wird keine Steuer berechnet
        if (issuer.smallBusiness) {
          tax = 0;
          taxLabel = '0%';
        } else {
          if (item.taxType === 'mixed') {
            tax = subtotal * 0.9 * 0.2;
            taxLabel = 'Mix';
          } else {
            const taxRate = parseFloat(item.taxType) / 100;
            tax = subtotal * taxRate;
            taxLabel = `${item.taxType}%`;
          }
        }
      
      const total = subtotal + tax;
      
      // Kompakter Zeileninhalt
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(7.5); // Etwas kleiner
      doc.setFont(undefined, 'normal');
      
      // Einzeilige Beschreibung (truncate if too long)
      const maxWidth = 95;
      const lines = doc.splitTextToSize(description, maxWidth);
      const displayText = lines.length > 1 ? lines[0] + '...' : description;
      const textY = yPos + 8; // Zentriert in 12pt Zeile
      
      doc.text(displayText, 22, textY);
      
        // Zahlen zentriert ausgerichtet - entsprechend Header-Positionen
        doc.setFont(undefined, 'normal');
        doc.setFontSize(7);
        doc.text(item.quantity.toString(), 120, textY, { align: 'center' });
        doc.text(item.unit || 'Std', 135, textY, { align: 'center' });
        doc.text(item.unitPrice.toFixed(2) + '€', 150, textY, { align: 'center' });
        doc.text(taxLabel, 165, textY, { align: 'center' });
        doc.setFont(undefined, 'bold');
        doc.text(total.toFixed(2) + '€', 180, textY, { align: 'center' });
    });
    
    // Reset styles
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(0);
    
    return startY + tableHeight;
  }

  static addCalculation(doc, customer, tableEndY = 150, issuer = {}) {
    const lineItems = customer.lineItems || [];
    
    if (lineItems.length === 0) {
      return; // Keine Berechnung ohne Positionen
    }
    
    // Berechnung nach Steuersätzen gruppiert
    const taxGroups = {};
    let totalSubtotal = 0;
    let totalTax = 0;
    
    lineItems.forEach(item => {
      const itemSubtotal = item.quantity * item.unitPrice;
      totalSubtotal += itemSubtotal;
      
      let tax = 0;
      let taxKey = '';
      
      // Bei Kleinunternehmern wird keine Steuer berechnet
      if (issuer.smallBusiness) {
        tax = 0;
        taxKey = '0%';
      } else {
        if (item.taxType === 'mixed') {
          tax = itemSubtotal * 0.9 * 0.2; // 90%@20% + 10%@0%
          taxKey = 'mixed';
        } else {
          const taxRate = parseFloat(item.taxType) / 100;
          tax = itemSubtotal * taxRate;
          taxKey = `${item.taxType}%`;
        }
      }
      
      totalTax += tax;
      
      if (!taxGroups[taxKey]) {
        taxGroups[taxKey] = { subtotal: 0, tax: 0 };
      }
      taxGroups[taxKey].subtotal += itemSubtotal;
      taxGroups[taxKey].tax += tax;
    });
    const grandTotal = totalSubtotal + totalTax;
    
    // Kompakte Position: nur 8pt Abstand zur Tabelle
    let yPos = Math.max(130, tableEndY + 8);
    
    // Dynamische Box-Höhe basierend auf vorhandenen Steuersätzen
    const taxGroupCount = Object.keys(taxGroups).length;
    let boxHeight = 30; // Basis: Zwischensumme + Gesamt
    boxHeight += taxGroupCount * 6; // 6pt pro Steuersatz
    if (totalTax > 0) boxHeight += 6; // USt. gesamt Zeile
    
    // Großzügigere Seitenüberprüfung - viel mehr Platz nutzen
    const pageHeight = doc.internal.pageSize.height;
    const footerStartY = pageHeight - 45; // Nur 45pt für Fußzeile (statt 57)
    const calculationEndY = yPos + boxHeight;
    
    // Neue Seite nur wenn wirklich nötig
    let createdNewPage = false;
    if (calculationEndY > footerStartY) {
      doc.addPage();
      yPos = 25; // Noch höher auf neuer Seite
      createdNewPage = true;
      console.log('PDF: Neue Seite für Rechnungssumme hinzugefügt');
    }
    
    // Minimalistische Rechnungsbox - rechtsbündig mit Tabelle
    const tableWidth = 170;
    const boxWidth = 65; 
    const boxX = 20 + tableWidth - boxWidth; // Rechtsbündig mit Tabelle (125)
    
    // Nur dezenter Rahmen, kein Schatten
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.rect(boxX, yPos, boxWidth, boxHeight, 'S');
    
    // Kompakter Header
    doc.setFillColor(245, 247, 250);
    doc.rect(boxX, yPos, boxWidth, 8, 'F'); // Niedriger: 8 statt 12
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(7); // Kleiner
    doc.setFont(undefined, 'bold');
    doc.text('RECHNUNGSSUMME', boxX + 2, yPos + 6);
    
    // Kompakte Berechnungszeilen
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(7); // Durchgängig kleiner
    doc.setFont(undefined, 'normal');
    
    let currentY = yPos + 14; // Weniger Abstand
    
    // Kompakte Zwischensumme
    doc.text('Zwischensumme:', boxX + 2, currentY);
    doc.setFont(undefined, 'bold');
    doc.text(`${totalSubtotal.toFixed(2)} €`, boxX + boxWidth - 2, currentY, { align: 'right' });
    currentY += 6; // Weniger Abstand: 6 statt 8
    
    // Dynamische Steuersätze
    Object.entries(taxGroups).forEach(([taxKey, group]) => {
      if (group.tax > 0) {
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80, 80, 80);
        
        let label = '';
        if (taxKey === 'mixed') {
          label = 'USt. (90%@20% / 10%@0%):';
        } else {
          label = `${taxKey} USt.:`;
        }
        
        doc.text(label, boxX + 2, currentY);
        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, 'bold');
        doc.text(`${group.tax.toFixed(2)} €`, boxX + boxWidth - 2, currentY, { align: 'right' });
        currentY += 6;
      }
    });
    
    if (totalTax > 0) {
      doc.setFont(undefined, 'normal');
      doc.setTextColor(40, 40, 40);
      doc.text('USt. gesamt:', boxX + 2, currentY);
      doc.setFont(undefined, 'bold');
      doc.text(`${totalTax.toFixed(2)} €`, boxX + boxWidth - 2, currentY, { align: 'right' });
      currentY += 6;
    }
    
    // Kompakte Gesamtsumme - kein extra Hintergrund
    doc.setLineWidth(0.5);
    doc.setDrawColor(180, 180, 180);
    doc.line(boxX + 2, currentY - 1, boxX + boxWidth - 2, currentY - 1);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8); // Nur leicht größer
    doc.setFont(undefined, 'bold');
    doc.text('Gesamt:', boxX + 2, currentY + 4);
    doc.setFontSize(9);
    doc.text(`${grandTotal.toFixed(2)} €`, boxX + boxWidth - 2, currentY + 4, { align: 'right' });
    
    // Reset styles
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    
    return createdNewPage;
  }

  static addFooter(doc, issuer) {
    // Fußzeile ganz am Ende der Seite - arbeite rückwärts von unten
    const pageHeight = doc.internal.pageSize.height;
    let footerEndY = pageHeight - 10; // 10pt Abstand vom Seitenrand
    
    const centerX = doc.internal.pageSize.width / 2;
    
    // Zusätzlicher Footer-Text - ganz unten (wenn vorhanden)
    if (issuer.footerText && issuer.footerText.trim() !== '') {
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(60, 60, 60);
      
      // Mehrzeiligen Text aufteilen und zentriert anzeigen
      const footerLines = doc.splitTextToSize(issuer.footerText.trim(), 150);
      for (let i = footerLines.length - 1; i >= 0; i--) {
        doc.text(footerLines[i], centerX, footerEndY, { align: 'center' });
        footerEndY -= 5; // Zeilenabstand
      }
      footerEndY -= 3; // Extra Abstand nach dem Freitext
    }
    
    // Kleinunternehmer-Hinweis - darüber (wenn aktiviert)
    if (issuer.smallBusiness) {
      doc.setFontSize(9);
      doc.setFont(undefined, 'italic');
      doc.setTextColor(80, 80, 80);
      doc.text('Es wird gemäß § 6 UStG keine Umsatzsteuer berechnet!', centerX, footerEndY, { align: 'center' });
      footerEndY -= 8; // Platz für die nächste Zeile
    }
    
    // UID - darüber
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    doc.text(`UID: ${issuer.uid || 'DE123456789'}`, centerX, footerEndY, { align: 'center' });
    
    // IBAN - eine Zeile darüber
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    const iban = issuer.iban || 'DE89370400440532013000';
    const formattedIban = `IBAN: ${iban}`;
    doc.text(formattedIban, centerX, footerEndY - 6, { align: 'center' });
    
    // Bankdaten - eine Zeile darüber
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    doc.text(issuer.bank || 'Musterbank', centerX, footerEndY - 12, { align: 'center' });
    
    // Name hervorgehoben - eine Zeile darüber
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text(issuer.name, centerX, footerEndY - 18, { align: 'center' });
    
    // Zahlungsfrist - oberste Zeile der Fußzeile
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    const paymentTerms = issuer.paymentTerms || 14;
    doc.text(i18n.t('pdf.paymentTerms', { days: paymentTerms }), centerX, footerEndY - 26, { align: 'center' });
    
    // Reset styles
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(0);
  }
}

export default PDFService; 