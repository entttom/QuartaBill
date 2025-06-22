import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Snackbar,
  Typography,
  Chip
} from '@mui/material';
import { 
  CloudDownload, 
  SystemUpdate, 
  CheckCircle, 
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const UpdateNotification = () => {
  const { t } = useTranslation();
  const [updateState, setUpdateState] = useState({
    checking: false,
    available: false,
    downloading: false,
    downloaded: false,
    error: null,
    progress: 0,
    version: null
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    // Aktuelle App-Version abrufen
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then(version => {
        setAppVersion(version);
      });

      // Update-Event-Listener registrieren
      const handleUpdaterMessage = (event, type, data) => {
        console.log('Update-Message:', type, data);
        
        switch (type) {
          case 'checking-for-update':
            setUpdateState(prev => ({ ...prev, checking: true, error: null }));
            setSnackbarMessage(t('update.checking'));
            setSnackbarSeverity('info');
            setShowSnackbar(true);
            break;

          case 'update-available':
            setUpdateState(prev => ({
              ...prev,
              checking: false,
              available: true,
              version: data.version
            }));
            setShowDialog(true);
            break;

          case 'update-not-available':
            setUpdateState(prev => ({ ...prev, checking: false }));
            setSnackbarMessage(t('update.notAvailable'));
            setSnackbarSeverity('success');
            setShowSnackbar(true);
            break;

          case 'download-progress':
            setUpdateState(prev => ({
              ...prev,
              downloading: true,
              progress: data.percent || 0
            }));
            break;

          case 'update-downloaded':
            setUpdateState(prev => ({
              ...prev,
              downloading: false,
              downloaded: true,
              version: data.version
            }));
            setSnackbarMessage(t('update.downloaded', { version: data.version }));
            setSnackbarSeverity('success');
            setShowSnackbar(true);
            break;

          case 'error':
            setUpdateState(prev => ({
              ...prev,
              checking: false,
              downloading: false,
              error: data
            }));
            setSnackbarMessage(t('update.error', { message: data }));
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            break;

          default:
            console.log('Unbekannter Update-Event:', type);
        }
      };

      // Event-Listener über IPC hinzufügen
      window.electronAPI.onUpdaterMessage(handleUpdaterMessage);

      return () => {
        // Cleanup wenn nötig
        if (window.electronAPI.removeUpdaterListener) {
          window.electronAPI.removeUpdaterListener(handleUpdaterMessage);
        }
      };
    }
  }, []);

  const handleCheckForUpdates = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.checkForUpdates();
      } catch (error) {
        console.error('Fehler beim Prüfen auf Updates:', error);
        setSnackbarMessage(t('update.checkError'));
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      }
    }
  };

  const handleDownloadUpdate = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.downloadUpdate();
        setShowDialog(false);
      } catch (error) {
        console.error('Fehler beim Herunterladen des Updates:', error);
        setSnackbarMessage(t('update.downloadError'));
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      }
    }
  };

  const handleInstallUpdate = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.installUpdate();
      } catch (error) {
        console.error('Fehler beim Installieren des Updates:', error);
        setSnackbarMessage(t('update.installError'));
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      }
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Status-Chip für die Toolbar
  const getStatusChip = () => {
    if (updateState.checking) {
      return (
        <Chip
          icon={<InfoIcon />}
          label={t('update.checking')}
          color="info"
          size="small"
          variant="outlined"
        />
      );
    }

    if (updateState.downloading) {
      return (
        <Chip
          icon={<CloudDownload />}
          label={t('update.downloading', { percent: Math.round(updateState.progress) })}
          color="primary"
          size="small"
          variant="outlined"
        />
      );
    }

    if (updateState.downloaded) {
      return (
        <Chip
          icon={<CheckCircle />}
          label={t('update.ready')}
          color="success"
          size="small"
          variant="outlined"
          onClick={handleInstallUpdate}
          clickable
        />
      );
    }

    if (updateState.error) {
      return (
        <Chip
          icon={<ErrorIcon />}
          label={t('common.error')}
          color="error"
          size="small"
          variant="outlined"
        />
      );
    }

    return null;
  };

  return (
    <>
      {/* Status-Chip */}
      {getStatusChip()}

      {/* Update verfügbar Dialog */}
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SystemUpdate />
            {t('update.dialog.title')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('update.dialog.message')}
          </DialogContentText>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              {t('update.dialog.currentVersion', { version: appVersion })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('update.dialog.newVersion', { version: updateState.version })}
            </Typography>
          </Box>
          {updateState.downloading && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                {t('update.dialog.downloading', { percent: Math.round(updateState.progress) })}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={updateState.progress} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('update.dialog.later')}</Button>
          <Button 
            onClick={handleDownloadUpdate} 
            variant="contained"
            disabled={updateState.downloading}
            startIcon={<CloudDownload />}
          >
            {updateState.downloading ? t('update.dialog.installing') : t('update.dialog.downloadNow')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar für Status-Nachrichten */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateNotification; 