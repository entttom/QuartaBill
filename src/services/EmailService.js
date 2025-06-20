import i18n from '../i18n';
import DataService from './DataService';

class EmailService {
  static async generateEmail({ customer, invoiceNumber, pdfBuffer, autoExport = false }) {
    try {
      const emlContent = this.createEMLContent({
        to: customer.email,
        subject: i18n.t('email.subject', { invoiceNumber }),
        body: customer.emailTemplate || this.getDefaultEmailTemplate(),
        attachmentName: `${invoiceNumber}_${customer.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        attachmentBuffer: pdfBuffer
      });

      const fileName = `${invoiceNumber}_${customer.name.replace(/[^a-zA-Z0-9]/g, '_')}.eml`;
      
      console.log('EML-Generierung Debug:', {
        customer: customer.name,
        autoExport,
        hasElectronAPI: !!window.electronAPI,
        emlPathMac: customer.emlPathMac,
        emlPathWindows: customer.emlPathWindows
      });
      
      if (autoExport) {
        // Automatischer Export in EML-Ordner
        const platform = await DataService.getPlatform();
        let emlPath;
        
        if (platform === 'win32') {
          emlPath = customer.emlPathWindows;
        } else if (platform === 'darwin') {
          emlPath = customer.emlPathMac;
        } else {
          // Browser oder unbekanntes System - verwende Fallback
          emlPath = null;
        }
        
        if (emlPath && emlPath.trim() !== '') {
          try {
            const fullPath = `${emlPath}/${fileName}`;
            console.log('Versuche EML-Export nach:', fullPath);
            console.log('EML-Content Länge:', emlContent.length, 'Type:', typeof emlContent);
            await DataService.saveFileDirect(emlContent, fullPath);
            console.log('EML-Export erfolgreich:', fullPath);
            return { path: fullPath, exported: true };
          } catch (error) {
            console.error('EML Export fehlgeschlagen:', error);
            // Fallback: Browser-Download
            return this.fallbackBrowserDownload(fileName, emlContent, 'EML Export fehlgeschlagen');
          }
        } else {
          // Fallback: Browser-Download wenn kein EML-Pfad hinterlegt
          return this.fallbackBrowserDownload(fileName, emlContent, i18n.t('settings.noEmlPathMessage'));
        }
      } else {
        // Normale Speicherung mit Dialog
        const platform = await DataService.getPlatform();
        let emlPath;
        
        if (platform === 'win32') {
          emlPath = customer.emlPathWindows;
        } else if (platform === 'darwin') {
          emlPath = customer.emlPathMac;
        } else {
          // Browser oder unbekanntes System - verwende Fallback
          emlPath = null;
        }
        
        if (emlPath && emlPath.trim() !== '') {
          try {
            const fullPath = `${emlPath}/${fileName}`;
            await DataService.saveFileDirect(emlContent, fullPath);
            return { path: fullPath, exported: false };
          } catch (error) {
            console.warn('EML Speicherung fehlgeschlagen:', error);
            // Fallback: Browser-Download
            return this.fallbackBrowserDownload(fileName, emlContent, 'EML Speicherung fehlgeschlagen');
          }
        } else {
          // Fallback: Browser-Download wenn kein Pfad konfiguriert
          return this.fallbackBrowserDownload(fileName, emlContent, 'Kein EML-Speicherpfad konfiguriert');
        }
      }
    } catch (error) {
      throw new Error(i18n.t('email.generationFailed', { message: error.message }));
    }
  }

  static fallbackBrowserDownload(fileName, content, message) {
    try {
      // Browser-Download als Fallback für EML-Dateien
      const blob = new Blob([content], { type: 'message/rfc822' });
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
        exported: false,
        browserDownload: true,
        message: message || 'EML als Browser-Download gespeichert'
      };
    } catch (error) {
      console.error('EML Browser-Download fehlgeschlagen:', error);
      throw new Error(`Email-Generierung fehlgeschlagen: ${error.message}`);
    }
  }

  static createEMLContent({ to, subject, body, attachmentName, attachmentBuffer }) {
    const boundary = `----=_Part_${Date.now()}`;
    const attachmentBoundary = `----=_Part_Attachment_${Date.now()}`;
    
    // Base64-kodierung des PDF-Anhangs
    let base64Attachment;
    try {
      if (window.electronAPI) {
        // Electron: Verwende Buffer für Base64-Kodierung
        const buffer = window.electronAPI.bufferFrom(attachmentBuffer);
        base64Attachment = window.electronAPI.bufferToString(buffer, 'base64');
        console.log('Base64-Kodierung (Electron) erfolgreich, Länge:', base64Attachment.length);
      } else {
        // Browser: Verwende btoa
        base64Attachment = btoa(String.fromCharCode(...new Uint8Array(attachmentBuffer)));
        console.log('Base64-Kodierung (Browser) erfolgreich, Länge:', base64Attachment.length);
      }
    } catch (error) {
      console.error('Fehler bei Base64-Kodierung:', error);
      // Fallback auf Browser-Methode
      try {
        base64Attachment = btoa(String.fromCharCode(...new Uint8Array(attachmentBuffer)));
        console.log('Base64-Kodierung Fallback erfolgreich, Länge:', base64Attachment.length);
      } catch (fallbackError) {
        console.error('Auch Fallback Base64-Kodierung fehlgeschlagen:', fallbackError);
        throw new Error('PDF konnte nicht für Email-Anhang kodiert werden');
      }
    }
    
    // EML-Header
    const headers = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Date: ${new Date().toUTCString()}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`
    ].join('\r\n');

    // Email-Body (Text)
    const textPart = [
      `--${boundary}`,
      `Content-Type: text/plain; charset=utf-8`,
      `Content-Transfer-Encoding: 8bit`,
      ``,
      body.replace(/\n/g, '\r\n')
    ].join('\r\n');

    // PDF-Anhang
    const attachmentPart = [
      `--${boundary}`,
      `Content-Type: application/pdf; name="${attachmentName}"`,
      `Content-Transfer-Encoding: base64`,
      `Content-Disposition: attachment; filename="${attachmentName}"`,
      ``,
      this.chunkBase64(base64Attachment)
    ].join('\r\n');

    // Ende-Boundary
    const endBoundary = `--${boundary}--`;

    return [headers, '', textPart, '', attachmentPart, '', endBoundary].join('\r\n');
  }

  static chunkBase64(base64String, chunkSize = 76) {
    const chunks = [];
    for (let i = 0; i < base64String.length; i += chunkSize) {
      chunks.push(base64String.slice(i, i + chunkSize));
    }
    return chunks.join('\r\n');
  }

  static getDefaultEmailTemplate() {
    return i18n.t('email.defaultTemplate').replace(/\\n/g, '\n');
  }
}

export default EmailService; 