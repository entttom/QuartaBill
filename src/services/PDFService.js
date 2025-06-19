import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
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
    this.addServiceTable(doc, customer, quarter, invoiceNumber, year);
    
    // Berechnung (Zwischensumme, Steuer, Gesamt)
    this.addCalculation(doc, customer);
    
    // Fußbereich (Bankdaten)
    this.addFooter(doc, settings.issuer);
    
    // PDF speichern
    const fileName = `${invoiceNumber}_${customer.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    const pdfBuffer = doc.output('arraybuffer');
    
    if (autoExport) {
      // Automatischer Export in Kundenordner
      const platform = await DataService.getPlatform();
      const savePath = platform === 'win32' ? customer.savePathWindows : customer.savePathMac;
      
      if (savePath) {
        const fullPath = `${savePath}/${fileName}`;
        await DataService.saveFile(Buffer.from(pdfBuffer), fullPath);
        return { path: fullPath, buffer: pdfBuffer, exported: true };
      } else {
        // Fallback: Normale Speicherung wenn kein Pfad hinterlegt
        return { path: fileName, buffer: pdfBuffer, exported: false, message: 'Kein Speicherpfad hinterlegt' };
      }
    } else {
      // Normale Speicherung mit Dialog
      const platform = await DataService.getPlatform();
      const savePath = platform === 'win32' ? customer.savePathWindows : customer.savePathMac;
      
      if (savePath) {
        const fullPath = `${savePath}/${fileName}`;
        await DataService.saveFile(Buffer.from(pdfBuffer), fullPath);
        return { path: fullPath, buffer: pdfBuffer, exported: false };
      }
      
      return { path: fileName, buffer: pdfBuffer, exported: false };
    }
  }

  static async addLogo(doc, settings) {
    try {
      const platform = await DataService.getPlatform();
      const logoPath = platform === 'win32' ? settings.logoPathWindows : settings.logoPathMac;
      
      if (logoPath && window.require) {
        const fs = window.require('fs');
        
        if (fs.existsSync(logoPath)) {
          // Lese die Datei als Base64
          const logoData = fs.readFileSync(logoPath);
          const base64Logo = `data:image/png;base64,${logoData.toString('base64')}`;
          
          // Bestimme Dateityp
          const ext = logoPath.toLowerCase().split('.').pop();
          const format = ext === 'jpg' || ext === 'jpeg' ? 'JPEG' : 'PNG';
          
          // Füge Logo hinzu (position: x, y, width, height)
          doc.addImage(base64Logo, format, 20, 20, 50, 30);
          return true;
        }
      }
    } catch (error) {
      console.warn('Logo konnte nicht geladen werden:', error);
    }
    
    // Fallback: Logo-Platzhalter
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 20, 50, 30, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('LOGO', 43, 37);
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
    // Elegante Rechnungsdetails-Box - angepasst für bessere Symmetrie
    const boxY = 65;
    
    // Hintergrund mit dezenter Schattierung
    doc.setFillColor(248, 248, 248);
    doc.rect(110, boxY, 90, 40, 'F');
    
    // Kein Rahmen mehr
    
    // Rechnungsdetails Header
    doc.setFillColor(45, 45, 45);
    doc.rect(110, boxY, 90, 12, 'F');
    
    doc.setTextColor(255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('RECHNUNGSDETAILS', 113, boxY + 8);
    
    // Rechnungsnummer
    doc.setTextColor(0);
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text('Rechnungsnummer:', 113, boxY + 20);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(invoiceNumber, 113, boxY + 27);
    
    // Rechnungsdatum
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text('Rechnungsdatum:', 155, boxY + 20);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(format(invoiceDate, 'dd.MM.yyyy'), 155, boxY + 27);
    
    // Leistungszeitraum - zentral platziert
    doc.setFontSize(7);
    doc.setFont(undefined, 'normal');
    doc.text('Leistungszeitraum:', 113, boxY + 34);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(60, 90, 120);
    doc.text(quarter, 155, boxY + 34);
    
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
    doc.text('RECHNUNGSADRESSE', 23, boxY + 8);
    
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

  static addServiceTable(doc, customer, quarter, invoiceNumber, year) {
    const startY = 110;
    
    // Moderne Tabelle mit dezentem Schatten-Effekt (kompakt)
    // Sehr dezenter Schatten
    doc.setFillColor(252, 252, 252);
    doc.rect(21, startY + 1, 180, 27, 'F');
    
    // Haupttabelle
    doc.setFillColor(255, 255, 255);
    doc.rect(20, startY, 180, 27, 'F');
    
    // Kein Rahmen mehr
    
    // Eleganter Header mit Gradient-Effekt
    doc.setFillColor(45, 45, 45);
    doc.rect(20, startY, 180, 12, 'F');
    
    // Header-Text
    doc.setTextColor(255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('LEISTUNGSBESCHREIBUNG', 22, startY + 8);
    doc.text('STD.', 140, startY + 8);
    doc.text('€/STD.', 160, startY + 8);
    doc.text('BETRAG', 185, startY + 8);
    
    // Variable-Ersetzung für Tätigkeit
    const hours = customer.hours || 6;
    const rate = customer.hourlyRate || 0;
    const total = hours * rate;
    
    const variables = {
      'Quartal': quarter,
      'Jahr': year,
      'Rechnungsnummer': invoiceNumber,
      'Kunde': customer.name
    };
    
    const activityText = this.replaceVariables(
      customer.activity || 'Arbeitsmedizinische Leistungen [Quartal]', 
      variables
    );
    
    // Leistungszeile mit alternierender Farbe
    doc.setFillColor(250, 250, 250);
    doc.rect(20, startY + 12, 180, 15, 'F');
    
    // Keine Spaltentrennlinien mehr
    
    // Inhalt der Leistungszeile
    doc.setTextColor(0);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(activityText, 22, startY + 21);
    
    // Zahlen rechtsbündig - korrekte Positionierung
    doc.setFont(undefined, 'bold');
    doc.text(hours.toString(), 148, startY + 21);
    doc.text(rate.toFixed(2), 162, startY + 21);  // Besser zentriert
    doc.text(total.toFixed(2), 185, startY + 21);
    
    // Reset styles
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(0);
    
    return startY + 27; // Nur Header + eine Zeile
  }

  static addCalculation(doc, customer) {
    const hours = customer.hours || 6;
    const rate = customer.hourlyRate || 0;
    const subtotal = hours * rate;
    
    // 90% mit 20% USt, 10% mit 0% USt
    const amount90 = subtotal * 0.9;
    const amount10 = subtotal * 0.1;
    const tax90 = amount90 * 0.2;
    const tax10 = 0;
    const totalTax = tax90 + tax10;
    const total = subtotal + totalTax;
    
    let yPos = 150;
    
    // Elegante Berechnungsbox mit dezentem Schatten - erweitert für alle Berechnungen
    // Sehr dezenter Schatten
    doc.setFillColor(250, 250, 250);
    doc.rect(116, yPos + 1, 85, 85, 'F');
    
    // Hauptbox
    doc.setFillColor(248, 252, 255);
    doc.rect(115, yPos, 85, 85, 'F');
    
    // Kein Rahmen mehr
    
    // Header
    doc.setFillColor(60, 90, 120);
    doc.rect(115, yPos, 85, 12, 'F');
    
    doc.setTextColor(255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('RECHNUNGSSUMME', 118, yPos + 8);
    
    // Berechnungszeilen
    doc.setTextColor(0);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    
    // Zwischensumme
    doc.text('ZWISCHENSUMME', 118, yPos + 20);
    doc.setFont(undefined, 'bold');
    doc.text(`${subtotal.toFixed(2)} €`, 175, yPos + 20);
    
    // Steuersätze mit korrekten Beträgen
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    doc.text('STEUERSATZ auf 90% der Summe', 118, yPos + 30);
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.text('20 %', 182, yPos + 30);
    
    doc.setFont(undefined, 'normal');
    doc.setTextColor(60);
    doc.text('STEUERSATZ auf 10% der Summe', 118, yPos + 40);
    doc.setTextColor(0);
    doc.setFont(undefined, 'bold');
    doc.text('0 %', 182, yPos + 40);
    
    // USt. mit korrektem Betrag
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.text('USt.:', 118, yPos + 50);
    doc.setFont(undefined, 'bold');
    doc.text(`${tax90.toFixed(2)} €`, 175, yPos + 50);
    
    // Keine Trennlinie mehr
    
    // Gesamt (hervorgehoben) - größerer Bereich mit sichtbarem Rahmen
    doc.setFillColor(240, 245, 250);
    doc.rect(115, yPos + 58, 85, 15, 'F');
    
    // Kein Rahmen um Gesamtbetrag-Box
    
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Gesamt', 118, yPos + 68);
    doc.setFontSize(14);
    doc.setTextColor(60, 90, 120);
    doc.text(`${total.toFixed(2)} €`, 165, yPos + 68);
    
    // Reset styles
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
  }

  static addFooter(doc, issuer) {
    // Fußzeile ganz am Ende der Seite - arbeite rückwärts von unten
    const pageHeight = doc.internal.pageSize.height;
    const footerEndY = pageHeight - 10; // 10pt Abstand vom Seitenrand
    
    const centerX = doc.internal.pageSize.width / 2;
    
    // UID - ganz unten (letzte Zeile der Seite)
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
    doc.text(`Zahlungsfrist: ${paymentTerms} Tage`, centerX, footerEndY - 26, { align: 'center' });
    
    // Reset styles
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0);
    doc.setDrawColor(0);
  }
}

export default PDFService; 