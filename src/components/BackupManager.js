/**
 * BackupManager.js
 * 
 * React-Komponente für Backup & Export-Funktionalitäten
 * Version 2.0.0 Feature
 * 
 * @author Dr. Thomas Entner
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  FormControlLabel,
  Switch,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Backup as BackupIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Storage as StorageIcon,
  Assessment as ReportIcon,
  Schedule as ScheduleIcon,
  CloudDownload as CloudDownloadIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import BackupService from '../services/BackupService';

const BackupManager = () => {
  const { t } = useTranslation();
  const [backupService] = useState(() => new BackupService());
  
  // State
  const [backups, setBackups] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: null, data: null });
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false);
  const [autoBackupInterval, setAutoBackupInterval] = useState(7);

  // Backup-Liste laden
  const loadBackups = async () => {
    try {
      const backupList = await backupService.listBackups();
      setBackups(backupList);
      
      const stats = await backupService.getBackupStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load backups:', error);
      setMessage({ type: 'error', text: 'Fehler beim Laden der Backup-Liste' });
    }
  };

  // Einstellungen laden
  const loadSettings = () => {
    try {
      const settings = backupService.getSettingsData();
      setAutoBackupEnabled(settings.autoBackupEnabled || false);
      setAutoBackupInterval(settings.autoBackupIntervalDays || 7);
    } catch (error) {
      console.error('Failed to load backup settings:', error);
    }
  };

  useEffect(() => {
    loadBackups();
    loadSettings();
  }, []);

  // Vollständiges Backup erstellen
  const createBackup = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await backupService.createFullBackup();
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Backup erfolgreich erstellt: ${result.fileName} (${formatFileSize(result.size)})`
        });
        await loadBackups();
      } else {
        setMessage({
          type: 'error',
          text: `Backup fehlgeschlagen: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Unerwarteter Fehler: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // CSV Export
  const exportCSV = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await backupService.exportCustomersToCSV();
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `CSV-Export erfolgreich: ${result.fileName} (${result.recordCount} Kunden)`
        });
      } else {
        setMessage({
          type: 'error',
          text: `CSV-Export fehlgeschlagen: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Unerwarteter Fehler: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Backup wiederherstellen
  const restoreBackup = async (backupPath) => {
    setLoading(true);
    setMessage(null);

    try {
      const result = await backupService.restoreFromBackup(backupPath);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Daten erfolgreich wiederhergestellt (${result.recordsRestored.customers} Kunden, Version ${result.version})`
        });
        
        // App neu laden um Änderungen zu reflektieren
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: `Wiederherstellung fehlgeschlagen: ${result.error}`
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Unerwarteter Fehler: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Backup löschen
  const deleteBackup = async (backupPath) => {
    try {
      const fs = window.require('fs').promises;
      await fs.unlink(backupPath);
      
      setMessage({
        type: 'success',
        text: 'Backup erfolgreich gelöscht'
      });
      
      await loadBackups();
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Fehler beim Löschen: ${error.message}`
      });
    }
  };

  // Alte Backups aufräumen
  const cleanupOldBackups = async () => {
    setLoading(true);
    
    try {
      const result = await backupService.cleanupOldBackups(10);
      
      if (result.error) {
        setMessage({
          type: 'error',
          text: `Aufräumen fehlgeschlagen: ${result.error}`
        });
      } else {
        setMessage({
          type: 'success',
          text: `${result.deleted} alte Backups gelöscht, ${result.kept} behalten`
        });
        await loadBackups();
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Unerwarteter Fehler: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-Backup Einstellungen speichern
  const saveAutoBackupSettings = () => {
    try {
      const settings = backupService.getSettingsData();
      settings.autoBackupEnabled = autoBackupEnabled;
      settings.autoBackupIntervalDays = autoBackupInterval;
      
      localStorage.setItem('settings', JSON.stringify(settings));
      
      setMessage({
        type: 'success',
        text: 'Auto-Backup Einstellungen gespeichert'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Fehler beim Speichern: ${error.message}`
      });
    }
  };

  // Hilfsfunktionen
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleConfirmAction = (action, data = null) => {
    setConfirmDialog({ open: true, action, data });
  };

  const executeConfirmedAction = async () => {
    const { action, data } = confirmDialog;
    setConfirmDialog({ open: false, action: null, data: null });

    switch (action) {
      case 'restore':
        await restoreBackup(data);
        break;
      case 'delete':
        await deleteBackup(data);
        break;
      case 'cleanup':
        await cleanupOldBackups();
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <BackupIcon color="primary" />
        Backup & Export Manager
        <Chip label="v1.3.0" size="small" color="primary" variant="outlined" />
      </Typography>

      {/* Aktionsmeldungen */}
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 2 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}

      {/* Ladebalken */}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <Grid container spacing={3}>
        {/* Backup erstellen */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BackupIcon />
                Backup erstellen
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Erstellt eine vollständige Sicherung aller Kundendaten, Einstellungen und Konfigurationen.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                startIcon={<BackupIcon />}
                onClick={createBackup}
                disabled={loading}
                fullWidth
              >
                Vollständiges Backup erstellen
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* CSV Export */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReportIcon />
                CSV Export
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Exportiert alle Kundendaten in eine Excel-kompatible CSV-Datei.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={exportCSV}
                disabled={loading}
                fullWidth
              >
                Kundendaten als CSV exportieren
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Auto-Backup Einstellungen */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon />
                Automatische Backups
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoBackupEnabled}
                        onChange={(e) => setAutoBackupEnabled(e.target.checked)}
                      />
                    }
                    label="Automatische Backups aktivieren"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Backup-Intervall (Tage)"
                    type="number"
                    value={autoBackupInterval}
                    onChange={(e) => setAutoBackupInterval(Math.max(1, parseInt(e.target.value) || 1))}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">Tage</InputAdornment>
                    }}
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="outlined"
                    onClick={saveAutoBackupSettings}
                    size="small"
                    fullWidth
                  >
                    Speichern
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Backup-Statistiken */}
        {statistics && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StorageIcon />
                  Backup-Statistiken
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Anzahl Backups"
                      secondary={statistics.totalBackups}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Gesamtgröße"
                      secondary={formatFileSize(statistics.totalSize)}
                    />
                  </ListItem>
                  {statistics.newestBackup && (
                    <ListItem>
                      <ListItemText
                        primary="Neuestes Backup"
                        secondary={formatDistanceToNow(statistics.newestBackup.created, { 
                          addSuffix: true, 
                          locale: de 
                        })}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={() => handleConfirmAction('cleanup')}
                  disabled={loading || statistics.totalBackups <= 10}
                >
                  Alte Backups löschen
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}

        {/* Backup-Liste */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CloudDownloadIcon />
                Verfügbare Backups ({backups.length})
              </Typography>
              
              {backups.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Keine Backups vorhanden
                </Typography>
              ) : (
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {backups.map((backup, index) => (
                    <React.Fragment key={backup.fileName}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {backup.fileName.replace('QuartaBill_Backup_', '').replace('.json', '')}
                              <Chip 
                                label={formatFileSize(backup.size)} 
                                size="small" 
                                variant="outlined" 
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              {format(backup.created, 'dd.MM.yyyy HH:mm', { locale: de })}
                              <br />
                              {formatDistanceToNow(backup.created, { addSuffix: true, locale: de })}
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleConfirmAction('restore', backup.filePath)}
                            disabled={loading}
                            color="primary"
                            title="Backup wiederherstellen"
                          >
                            <UploadIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            onClick={() => handleConfirmAction('delete', backup.filePath)}
                            disabled={loading}
                            color="error"
                            title="Backup löschen"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < backups.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bestätigungsdialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, action: null, data: null })}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="warning" />
          Aktion bestätigen
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === 'restore' && 'Möchten Sie dieses Backup wirklich wiederherstellen? Alle aktuellen Daten werden überschrieben!'}
            {confirmDialog.action === 'delete' && 'Möchten Sie dieses Backup wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'}
            {confirmDialog.action === 'cleanup' && 'Möchten Sie alle Backups außer den neuesten 10 löschen?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, action: null, data: null })}>
            Abbrechen
          </Button>
          <Button
            onClick={executeConfirmedAction}
            color={confirmDialog.action === 'delete' || confirmDialog.action === 'cleanup' ? 'error' : 'primary'}
            variant="contained"
          >
            {confirmDialog.action === 'restore' && 'Wiederherstellen'}
            {confirmDialog.action === 'delete' && 'Löschen'}
            {confirmDialog.action === 'cleanup' && 'Aufräumen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BackupManager; 