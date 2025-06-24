import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Settings as SettingsIcon, 
  Storage as StorageIcon, 
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

function ConfigSetupDialog({ open, onSetup }) {
  const { t } = useTranslation();
  const [step, setStep] = useState('initial'); // 'initial', 'loading', 'existing-file-found', 'invalid-file-found', 'completed'
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleFileSelection = async () => {
    setLoading(true);
    setStep('loading');
    
    try {
      const result = await onSetup();
      if (result) {
        setFileInfo(result);
        
        if (result.isNewFile) {
          setStep('completed');
        } else if (result.hasValidData) {
          setStep('existing-file-found');
        } else {
          setStep('invalid-file-found');
        }
      } else {
        // Benutzer hat abgebrochen
        setStep('initial');
      }
    } catch (error) {
      console.error('Fehler beim Setup:', error);
      setStep('initial');
    } finally {
      setLoading(false);
    }
  };

  const handleUseExistingFile = () => {
    setStep('completed');
    // Datei ist bereits gesetzt, nichts weiter zu tun
    // Benachrichtige die App dass das Setup abgeschlossen ist
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleCreateNewFile = async () => {
    try {
      setLoading(true);
      const success = await window.electronAPI?.createNewConfigFile?.(fileInfo.path);
      
      if (success) {
        setStep('completed');
        // Nach erfolgreicher Erstellung App neu laden
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setStep('initial');
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der neuen Datei:', error);
      setStep('initial');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDifferentFile = () => {
    setStep('initial');
    setFileInfo(null);
    // Benutzer wird neuen Pfad auswählen
  };

  const getDialogContent = () => {
    switch (step) {
      case 'loading':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 4 }}>
            <CircularProgress size={48} />
            <Typography variant="body1">
              {t('configSetup.analyzing')}
            </Typography>
          </Box>
        );

      case 'existing-file-found':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon />
              <Typography variant="body2">
                <strong>{t('configSetup.existingFound.title')}</strong>
              </Typography>
            </Alert>
            
            <Typography variant="body2">
              {t('configSetup.existingFound.description')}
            </Typography>
            
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {fileInfo?.path}
              </Typography>
            </Box>
            
            {fileInfo?.data && (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>{t('configSetup.existingFound.foundData')}</strong><br />
                  • {t('configSetup.existingFound.customers', { count: fileInfo.data.customers?.length || 0 })}<br />
                  • {t('configSetup.existingFound.settingsAvailable', { available: fileInfo.data.settings ? t('common.yes') : t('common.no') })}
                </Typography>
              </Alert>
            )}
            
            <Typography variant="body2" color="text.secondary">
              {t('configSetup.existingFound.question')}
            </Typography>
          </Box>
        );

      case 'invalid-file-found':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="warning" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon />
              <Typography variant="body2">
                <strong>{t('configSetup.invalidFile.title')}</strong>
              </Typography>
            </Alert>
            
            <Typography variant="body2">
              {t('configSetup.invalidFile.description')}
            </Typography>
            
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {fileInfo?.path}
              </Typography>
            </Box>
            
            {fileInfo?.error && (
              <Alert severity="error">
                <Typography variant="body2">
                  {t('configSetup.invalidFile.error', { error: fileInfo.error })}
                </Typography>
              </Alert>
            )}
            
            <Typography variant="body2" color="text.secondary">
              {t('configSetup.invalidFile.options')}
            </Typography>
          </Box>
        );

      case 'completed':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon />
              <Typography variant="body2">
                <strong>{t('configSetup.completed.title')}</strong>
              </Typography>
            </Alert>
            
            <Typography variant="body2">
              {t('configSetup.completed.description')}
            </Typography>
            
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {fileInfo?.path}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {t('configSetup.completed.info')}
            </Typography>
          </Box>
        );

      default: // 'initial'
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {t('configSetup.description')}
              </Typography>
            </Alert>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <StorageIcon color="primary" />
              <Typography variant="h6">
                {t('configSetup.chooseLocation')}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {t('configSetup.choiceDescription')}
            </Typography>
            
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, my: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('configSetup.newFile.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {t('configSetup.newFile.description')}
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, my: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('configSetup.existingFile.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {t('configSetup.existingFile.description')}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {t('configSetup.recommendation')}
            </Typography>
            
            <Alert severity="warning">
              <Typography variant="body2">
                {t('configSetup.important')}
              </Typography>
            </Alert>
          </Box>
        );
    }
  };

  const getDialogActions = () => {
    switch (step) {
      case 'loading':
        return null;

      case 'existing-file-found':
        return (
          <>
            <Button onClick={handleSelectDifferentFile} disabled={loading}>
              {t('configSetup.buttons.chooseDifferent')}
            </Button>
            <Button onClick={handleCreateNewFile} disabled={loading} color="warning">
              {t('configSetup.buttons.createNew')}
            </Button>
            <Button 
              onClick={handleUseExistingFile} 
              disabled={loading}
              variant="contained"
              startIcon={<CheckCircleIcon />}
            >
              {t('configSetup.buttons.useExisting')}
            </Button>
          </>
        );

      case 'invalid-file-found':
        return (
          <>
            <Button onClick={handleSelectDifferentFile} disabled={loading}>
              {t('configSetup.buttons.chooseDifferent')}
            </Button>
            <Button 
              onClick={handleCreateNewFile} 
              disabled={loading}
              variant="contained"
              color="warning"
              startIcon={<StorageIcon />}
            >
              {t('configSetup.buttons.overwrite')}
            </Button>
          </>
        );

      case 'completed':
        return (
          <Button 
            onClick={() => window.location.reload()} 
            variant="contained"
            size="large"
            startIcon={<CheckCircleIcon />}
          >
            {t('configSetup.buttons.startApp')}
          </Button>
        );

      default: // 'initial'
        return (
          <Button 
            variant="contained" 
            onClick={handleFileSelection}
            size="large"
            startIcon={<StorageIcon />}
            disabled={loading}
          >
            {t('configSetup.buttons.chooseLocation')}
          </Button>
        );
    }
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
      onClose={(event, reason) => {
        // Verhindere das Schließen mit ESC oder Backdrop-Click außer wenn abgeschlossen
        if ((reason === 'backdropClick' || reason === 'escapeKeyDown') && step !== 'completed') {
          return;
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon color="primary" />
        {t('configSetup.title')}
      </DialogTitle>
      
      <DialogContent>
        {getDialogContent()}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        {getDialogActions()}
      </DialogActions>
    </Dialog>
  );
}

export default ConfigSetupDialog; 