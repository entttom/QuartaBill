/**
 * BackupService.js
 * 
 * Service für Backup, Export und Import-Funktionalitäten
 * Version 1.3.0 Feature
 * 
 * @author Dr. Thomas Entner
 */

import { format } from 'date-fns';
import { de } from 'date-fns/locale';

class BackupService {
  constructor() {
    this.backupDirectory = this.getDefaultBackupDirectory();
  }

  /**
   * Ermittelt das Standard-Backup-Verzeichnis basierend auf dem Betriebssystem
   */
  getDefaultBackupDirectory() {
    const { platform } = window.require('os');
    const path = window.require('path');
    const { app } = window.require('@electron/remote') || window.require('electron').remote;
    
    const userDataPath = app.getPath('userData');
    
    switch (platform()) {
      case 'win32':
        return path.join(userDataPath, 'Backups');
      case 'darwin':
        return path.join(userDataPath, 'Backups');
      default: // Linux
        return path.join(userDataPath, 'backups');
    }
  }

  /**
   * Erstellt ein vollständiges Backup aller Anwendungsdaten
   */
  async createFullBackup() {
    try {
      const fs = window.require('fs').promises;
      const path = window.require('path');
      
      // Backup-Verzeichnis erstellen falls nicht vorhanden
      await this.ensureBackupDirectory();
      
      // Timestamp für eindeutige Dateinamen
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss', { locale: de });
      const backupFileName = `QuartaBill_Backup_${timestamp}.json`;
      const backupPath = path.join(this.backupDirectory, backupFileName);
      
      // Alle Daten sammeln
      const backupData = {
        version: '1.3.0',
        timestamp: new Date().toISOString(),
        data: {
          customers: this.getCustomersData(),
          settings: this.getSettingsData(),
          invoiceSettings: this.getInvoiceSettingsData(),
          metadata: {
            appVersion: '1.3.0',
            platform: window.require('os').platform(),
            nodeVersion: process.version
          }
        }
      };
      
      // Backup speichern
      await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
      
      return {
        success: true,
        filePath: backupPath,
        fileName: backupFileName,
        size: (await fs.stat(backupPath)).size
      };
      
    } catch (error) {
      console.error('Backup creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Automatisches Backup beim App-Start (wenn aktiviert)
   */
  async createAutoBackup() {
    const settings = this.getSettingsData();
    
    if (!settings.autoBackup || !settings.autoBackupEnabled) {
      return { skipped: true, reason: 'Auto-backup disabled' };
    }
    
    // Prüfen ob letztes Backup älter als X Tage ist
    const daysSinceLastBackup = settings.autoBackupIntervalDays || 7;
    const lastBackup = settings.lastAutoBackup;
    
    if (lastBackup) {
      const daysDiff = (new Date() - new Date(lastBackup)) / (1000 * 60 * 60 * 24);
      if (daysDiff < daysSinceLastBackup) {
        return { skipped: true, reason: 'Backup interval not reached' };
      }
    }
    
    const result = await this.createFullBackup();
    
    if (result.success) {
      // Timestamp des letzten Auto-Backups speichern
      this.updateLastAutoBackupTimestamp();
    }
    
    return result;
  }

  /**
   * Exportiert Kundendaten als CSV
   */
  async exportCustomersToCSV() {
    try {
      const customers = this.getCustomersData();
      
      if (!customers || customers.length === 0) {
        return { success: false, error: 'Keine Kundendaten zum Exportieren gefunden' };
      }
      
      // CSV Header
      const headers = [
        'ID', 'Name', 'Straße', 'PLZ', 'Stadt', 'E-Mail', 'Telefon',
        'Leistungen', 'PDF-Pfad', 'EML-Pfad', 'Erstellt', 'Letzte Änderung'
      ];
      
      // CSV Zeilen erstellen
      const csvRows = customers.map(customer => {
        const services = customer.services?.map(s => `${s.description}: ${s.hourlyRate}€/h`).join('; ') || '';
        
        return [
          customer.id || '',
          customer.name || '',
          customer.address?.street || '',
          customer.address?.zipCode || '',
          customer.address?.city || '',
          customer.email || '',
          customer.phone || '',
          `"${services}"`,
          customer.pdfPath || '',
          customer.emlPath || '',
          customer.createdAt ? format(new Date(customer.createdAt), 'dd.MM.yyyy HH:mm') : '',
          customer.updatedAt ? format(new Date(customer.updatedAt), 'dd.MM.yyyy HH:mm') : ''
        ];
      });
      
      // CSV zusammenbauen
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.join(','))
      ].join('\n');
      
      // Datei speichern
      const fs = window.require('fs').promises;
      const path = window.require('path');
      
      await this.ensureBackupDirectory();
      
      const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
      const fileName = `QuartaBill_Kunden_Export_${timestamp}.csv`;
      const filePath = path.join(this.backupDirectory, fileName);
      
      await fs.writeFile(filePath, '\ufeff' + csvContent, 'utf8'); // BOM für Excel
      
      return {
        success: true,
        filePath,
        fileName,
        recordCount: customers.length
      };
      
    } catch (error) {
      console.error('CSV Export failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Stellt Daten aus einem Backup wieder her
   */
  async restoreFromBackup(backupFilePath) {
    try {
      const fs = window.require('fs').promises;
      
      // Backup-Datei lesen
      const backupContent = await fs.readFile(backupFilePath, 'utf8');
      const backupData = JSON.parse(backupContent);
      
      // Backup-Format validieren
      if (!this.validateBackupFormat(backupData)) {
        return {
          success: false,
          error: 'Ungültiges Backup-Format oder beschädigte Datei'
        };
      }
      
      // Verwende DataService für korrekte Wiederherstellung in die externe Datei
      const DataService = await import('./DataService.js');
      
      // Vollständige Backup-Daten vorbereiten
      const restoreData = {
        customers: backupData.data.customers || [],
        invoiceHistory: backupData.data.invoiceHistory || [],
        settings: backupData.data.settings || {}
      };
      
      // Daten über DataService speichern (verwendet die externe Einstellungsdatei)
      const success = await DataService.default.saveData(restoreData);
      
      if (success) {
        return {
          success: true,
          version: backupData.version,
          timestamp: backupData.timestamp,
          recordsRestored: {
            customers: backupData.data.customers?.length || 0,
            settings: Object.keys(backupData.data.settings || {}).length,
            invoiceSettings: Object.keys(backupData.data.invoiceSettings || {}).length
          }
        };
      } else {
        return {
          success: false,
          error: 'Fehler beim Speichern der wiederhergestellten Daten'
        };
      }
      
    } catch (error) {
      console.error('Backup restore failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Listet verfügbare Backup-Dateien auf
   */
  async listBackups() {
    try {
      const fs = window.require('fs').promises;
      const path = window.require('path');
      
      if (!await this.directoryExists(this.backupDirectory)) {
        return [];
      }
      
      const files = await fs.readdir(this.backupDirectory);
      const backupFiles = files.filter(file => 
        file.startsWith('QuartaBill_Backup_') && file.endsWith('.json')
      );
      
      const backups = await Promise.all(
        backupFiles.map(async (file) => {
          const filePath = path.join(this.backupDirectory, file);
          const stats = await fs.stat(filePath);
          
          return {
            fileName: file,
            filePath,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
      );
      
      // Nach Erstellungsdatum sortieren (neueste zuerst)
      return backups.sort((a, b) => b.created - a.created);
      
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Löscht alte Backups (behält nur die neuesten X Dateien)
   */
  async cleanupOldBackups(keepCount = 10) {
    try {
      const backups = await this.listBackups();
      
      if (backups.length <= keepCount) {
        return { deleted: 0, kept: backups.length };
      }
      
      const fs = window.require('fs').promises;
      const toDelete = backups.slice(keepCount);
      
      for (const backup of toDelete) {
        await fs.unlink(backup.filePath);
      }
      
      return {
        deleted: toDelete.length,
        kept: keepCount
      };
      
    } catch (error) {
      console.error('Backup cleanup failed:', error);
      return { error: error.message };
    }
  }

  // === Hilfsmethoden ===

  async ensureBackupDirectory() {
    const fs = window.require('fs').promises;
    
    if (!await this.directoryExists(this.backupDirectory)) {
      await fs.mkdir(this.backupDirectory, { recursive: true });
    }
  }

  async directoryExists(dirPath) {
    try {
      const fs = window.require('fs').promises;
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  validateBackupFormat(backupData) {
    return (
      backupData &&
      typeof backupData === 'object' &&
      backupData.version &&
      backupData.timestamp &&
      backupData.data &&
      typeof backupData.data === 'object'
    );
  }

  getCustomersData() {
    try {
      return JSON.parse(localStorage.getItem('customers') || '[]');
    } catch {
      return [];
    }
  }

  getSettingsData() {
    try {
      return JSON.parse(localStorage.getItem('settings') || '{}');
    } catch {
      return {};
    }
  }

  getInvoiceSettingsData() {
    try {
      return JSON.parse(localStorage.getItem('invoiceSettings') || '{}');
    } catch {
      return {};
    }
  }

  updateLastAutoBackupTimestamp() {
    try {
      const settings = this.getSettingsData();
      settings.lastAutoBackup = new Date().toISOString();
      localStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to update auto backup timestamp:', error);
    }
  }

  /**
   * Berechnet Backup-Statistiken
   */
  async getBackupStatistics() {
    try {
      const backups = await this.listBackups();
      
      if (backups.length === 0) {
        return {
          totalBackups: 0,
          totalSize: 0,
          oldestBackup: null,
          newestBackup: null,
          averageSize: 0
        };
      }
      
      const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
      const sortedByDate = [...backups].sort((a, b) => a.created - b.created);
      
      return {
        totalBackups: backups.length,
        totalSize,
        oldestBackup: sortedByDate[0],
        newestBackup: sortedByDate[sortedByDate.length - 1],
        averageSize: Math.round(totalSize / backups.length)
      };
      
    } catch (error) {
      console.error('Failed to calculate backup statistics:', error);
      return null;
    }
  }
}

export default BackupService; 