/**
 * UpdateChecker.js
 * 
 * Auto-Update Checker Komponente für Version 1.3.0
 * Überprüft automatisch auf neue Versionen und zeigt Benachrichtigungen
 * 
 * @author Dr. Thomas Entner
 */

import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  SystemUpdate as UpdateIcon,
  NewReleases as NewReleasesIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  BugReport as BugReportIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const UpdateChecker = () => {
  const { t } = useTranslation();
  
  // State
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  // Aktuelle Version aus package.json
  const currentVersion = '1.3.1';
  const repositoryUrl = 'https://api.github.com/repos/entttom/QuartaBill/releases/latest';

  // Beim Component Mount prüfen
  useEffect(() => {
    // Auto-Check nur einmal pro Tag
    const lastCheck = localStorage.getItem('lastUpdateCheck');
    const today = new Date().toDateString();
    
    if (!lastCheck || lastCheck !== today) {
      setTimeout(() => {
        checkForUpdates(false); // Silent check
      }, 3000); // 3 Sekunden verzögert
    }
  }, []);

  /**
   * Prüft auf verfügbare Updates
   */
  const checkForUpdates = async (showResult = true) => {
    if (checking) return;
    
    setChecking(true);
    
    try {
      const response = await fetch(repositoryUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const releaseData = await response.json();
      const latestVersion = releaseData.tag_name.replace('v', '');
      
      // Speichere letzten Check
      localStorage.setItem('lastUpdateCheck', new Date().toDateString());
      setLastChecked(new Date());
      
      // Versions-Vergleich
      if (isNewerVersion(latestVersion, currentVersion)) {
        const updateDetails = {
          version: latestVersion,
          name: releaseData.name,
          body: releaseData.body,
          publishedAt: new Date(releaseData.published_at),
          downloadUrl: releaseData.html_url,
          assets: releaseData.assets?.map(asset => ({
            name: asset.name,
            downloadUrl: asset.browser_download_url,
            size: asset.size
          })) || []
        };
        
        setUpdateInfo(updateDetails);
        setUpdateAvailable(true);
        
        if (showResult) {
          setShowUpdateDialog(true);
        } else {
          setShowSnackbar(true);
        }
      } else if (showResult) {
        // Zeige "Aktuell"-Meldung nur bei manueller Prüfung
        setShowSnackbar(true);
        setUpdateAvailable(false);
      }
      
    } catch (error) {
      console.error('Update check failed:', error);
      
      if (showResult) {
        setShowSnackbar(true);
        setUpdateAvailable(false);
        setUpdateInfo({ error: error.message });
      }
    } finally {
      setChecking(false);
    }
  };

  /**
   * Vergleicht Versionsnummern (Semantic Versioning)
   */
  const isNewerVersion = (latest, current) => {
    const parseVersion = (version) => {
      return version.split('.').map(num => parseInt(num, 10));
    };
    
    const latestParts = parseVersion(latest);
    const currentParts = parseVersion(current);
    
    for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
      const latestPart = latestParts[i] || 0;
      const currentPart = currentParts[i] || 0;
      
      if (latestPart > currentPart) return true;
      if (latestPart < currentPart) return false;
    }
    
    return false;
  };

  /**
   * Formatiert das Release-Datum
   */
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  /**
   * Parsed die Release Notes und extrahiert Features/Fixes
   */
  const parseReleaseNotes = (body) => {
    if (!body) return { features: [], fixes: [], improvements: [] };
    
    const features = [];
    const fixes = [];
    const improvements = [];
    
    const lines = body.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('✨') || trimmed.includes('Neu hinzugefügt')) {
        features.push(trimmed.replace(/^[-*]\s*/, '').replace(/✨\s*/, ''));
      } else if (trimmed.includes('🐛') || trimmed.includes('Behoben')) {
        fixes.push(trimmed.replace(/^[-*]\s*/, '').replace(/🐛\s*/, ''));
      } else if (trimmed.includes('🔧') || trimmed.includes('Verbessert')) {
        improvements.push(trimmed.replace(/^[-*]\s*/, '').replace(/🔧\s*/, ''));
      }
    });
    
    return { features, fixes, improvements };
  };

  /**
   * Öffnet die Download-Seite
   */
  const openDownloadPage = () => {
    if (updateInfo?.downloadUrl) {
      window.require('electron').shell.openExternal(updateInfo.downloadUrl);
    }
  };

  /**
   * Schließt Update-Dialog und merkt sich die Entscheidung
   */
  const dismissUpdate = () => {
    setShowUpdateDialog(false);
    // Merke Dir, dass dieser Update abgelehnt wurde
    if (updateInfo?.version) {
      localStorage.setItem(`dismissedUpdate_${updateInfo.version}`, 'true');
    }
  };

  const releaseNotes = updateInfo?.body ? parseReleaseNotes(updateInfo.body) : null;

  return (
    <>
      {/* Update-Benachrichtigung Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={updateAvailable ? 'info' : updateInfo?.error ? 'error' : 'success'}
          variant="filled"
          action={
            updateAvailable ? (
              <Button color="inherit" size="small" onClick={() => setShowUpdateDialog(true)}>
                Details
              </Button>
            ) : null
          }
        >
          {updateAvailable 
            ? `Update verfügbar: v${updateInfo?.version}`
            : updateInfo?.error 
              ? 'Update-Prüfung fehlgeschlagen'
              : 'QuartaBill ist aktuell'
          }
        </Alert>
      </Snackbar>

      {/* Update-Details Dialog */}
      <Dialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NewReleasesIcon color="primary" />
          <Box>
            <Typography variant="h6">
              Update verfügbar: v{updateInfo?.version}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Veröffentlicht: {updateInfo?.publishedAt ? formatDate(updateInfo.publishedAt) : 'Unbekannt'}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Chip
              icon={<StarIcon />}
              label={`Aktuelle Version: v${currentVersion}`}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip
              icon={<UpdateIcon />}
              label={`Neue Version: v${updateInfo?.version}`}
              color="primary"
            />
          </Box>

          {releaseNotes && (
            <Box sx={{ mt: 2 }}>
              {releaseNotes.features.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    ✨ Neue Features
                  </Typography>
                  <List dense>
                    {releaseNotes.features.slice(0, 5).map((feature, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {releaseNotes.improvements.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    🔧 Verbesserungen
                  </Typography>
                  <List dense>
                    {releaseNotes.improvements.slice(0, 3).map((improvement, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <StarIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={improvement} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {releaseNotes.fixes.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    🐛 Fehlerbehebungen
                  </Typography>
                  <List dense>
                    {releaseNotes.fixes.slice(0, 3).map((fix, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <BugReportIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={fix} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}

          {updateInfo?.name && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Release: {updateInfo.name}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={dismissUpdate} startIcon={<CloseIcon />}>
            Später
          </Button>
          <Button
            onClick={openDownloadPage}
            variant="contained"
            startIcon={<DownloadIcon />}
            color="primary"
          >
            Jetzt herunterladen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading-Indikator beim Prüfen */}
      {checking && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
          <LinearProgress />
        </Box>
      )}
    </>
  );
};

// Hook für manuelle Update-Prüfung
export const useUpdateChecker = () => {
  const [updateChecker, setUpdateChecker] = useState(null);

  const checkForUpdates = () => {
    if (updateChecker) {
      updateChecker.checkForUpdates(true);
    }
  };

  return { checkForUpdates, setUpdateChecker };
};

export default UpdateChecker; 