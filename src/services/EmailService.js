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
      
      if (autoExport) {
        // Automatischer Export in EML-Ordner
        const platform = await DataService.getPlatform();
        const emlPath = platform === 'win32' ? customer.emlPathWindows : customer.emlPathMac;
        
        if (emlPath) {
          const fullPath = `${emlPath}/${fileName}`;
          await DataService.saveFile(emlContent, fullPath);
          return { path: fullPath, exported: true };
        } else {
          // Fallback: Normale Speicherung wenn kein EML-Pfad hinterlegt
          return { path: fileName, exported: false, message: i18n.t('settings.noEmlPathMessage') };
        }
      } else {
        // Normale Speicherung mit Dialog
        const platform = await DataService.getPlatform();
        const savePath = platform === 'win32' ? customer.savePathWindows : customer.savePathMac;
        
        if (savePath) {
          const fullPath = `${savePath}/${fileName}`;
          await DataService.saveFile(emlContent, fullPath);
          return { path: fullPath, exported: false };
        }
        
        return { path: fileName, exported: false };
      }
    } catch (error) {
      throw new Error(i18n.t('email.generationFailed', { message: error.message }));
    }
  }

  static createEMLContent({ to, subject, body, attachmentName, attachmentBuffer }) {
    const boundary = `----=_Part_${Date.now()}`;
    const attachmentBoundary = `----=_Part_Attachment_${Date.now()}`;
    
    // Base64-kodierung des PDF-Anhangs
    const base64Attachment = Buffer.from(attachmentBuffer).toString('base64');
    
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