import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Grid, Button,
  Divider, IconButton, Alert, Tabs, Tab
} from '@mui/material';
import { Folder, Save, Image } from '@mui/icons-material';
import DataService from '../services/DataService';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function SettingsPanel({ settings, onUpdateSettings }) {
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    onUpdateSettings(formData);
    setSaveMessage('Einstellungen gespeichert!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSelectFolder = async (field) => {
    const folder = await DataService.selectFolder();
    if (folder) {
      handleInputChange(null, field, folder);
    }
  };

  const handleSelectFile = async (field, filters = []) => {
    const file = await DataService.selectFile(filters);
    if (file) {
      handleInputChange(null, field, file);
    }
  };

  const handleSelectDataFile = async () => {
    const file = await DataService.selectFile([
      { name: 'JSON Dateien', extensions: ['json'] }
    ]);
    if (file) {
      handleInputChange(null, 'dataFilePath', file);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Einstellungen
      </Typography>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Rechnungsersteller" />
          <Tab label="Pfade & Dateien" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rechnungsersteller-Informationen
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  fullWidth
                  value={formData.issuer?.name || ''}
                  onChange={(e) => handleInputChange('issuer', 'name', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Titel/Beruf"
                  fullWidth
                  value={formData.issuer?.title || ''}
                  onChange={(e) => handleInputChange('issuer', 'title', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Adresse"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.issuer?.address || ''}
                  onChange={(e) => handleInputChange('issuer', 'address', e.target.value)}
                  placeholder="Straße&#10;PLZ Ort"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Telefon"
                  fullWidth
                  value={formData.issuer?.phone || ''}
                  onChange={(e) => handleInputChange('issuer', 'phone', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Website"
                  fullWidth
                  value={formData.issuer?.website || ''}
                  onChange={(e) => handleInputChange('issuer', 'website', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  value={formData.issuer?.email || ''}
                  onChange={(e) => handleInputChange('issuer', 'email', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="IBAN"
                  fullWidth
                  value={formData.issuer?.iban || ''}
                  onChange={(e) => handleInputChange('issuer', 'iban', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="UID"
                  fullWidth
                  value={formData.issuer?.uid || ''}
                  onChange={(e) => handleInputChange('issuer', 'uid', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bank"
                  fullWidth
                  value={formData.issuer?.bank || ''}
                  onChange={(e) => handleInputChange('issuer', 'bank', e.target.value)}
                  placeholder="Name Ihrer Bank"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Zahlungsfrist (Tage)"
                  fullWidth
                  type="number"
                  value={formData.issuer?.paymentTerms || 14}
                  onChange={(e) => handleInputChange('issuer', 'paymentTerms', parseInt(e.target.value) || 14)}
                  placeholder="14"
                  inputProps={{ min: 1, max: 365 }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          {/* Logo-Pfade */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Logo-Pfade
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        label="Windows Logo-Pfad"
                        fullWidth
                        value={formData.logoPathWindows || ''}
                        onChange={(e) => handleInputChange(null, 'logoPathWindows', e.target.value)}
                        placeholder="C:\Pfad\zum\logo.png"
                      />
                      <IconButton 
                        onClick={() => handleSelectFile('logoPathWindows', [
                          { name: 'Bilddateien', extensions: ['png', 'jpg', 'jpeg'] }
                        ])}
                      >
                        <Image />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        label="Mac Logo-Pfad"
                        fullWidth
                        value={formData.logoPathMac || ''}
                        onChange={(e) => handleInputChange(null, 'logoPathMac', e.target.value)}
                        placeholder="/Pfad/zum/logo.png"
                      />
                      <IconButton 
                        onClick={() => handleSelectFile('logoPathMac', [
                          { name: 'Bilddateien', extensions: ['png', 'jpg', 'jpeg'] }
                        ])}
                      >
                        <Image />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  Das Logo wird in der oberen linken Ecke der Rechnung angezeigt. 
                  Empfohlene Größe: 200x120 Pixel.
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Datei-Pfade */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Daten-Synchronisation
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="Pfad zur Daten-Datei"
                    fullWidth
                    value={formData.dataFilePath || ''}
                    onChange={(e) => handleInputChange(null, 'dataFilePath', e.target.value)}
                    placeholder="Pfad zur JSON-Datei für Nextcloud-Sync"
                  />
                  <IconButton onClick={handleSelectDataFile}>
                    <Folder />
                  </IconButton>
                </Box>
                
                <Alert severity="info">
                  Diese Datei wird beim Programmstart geladen und kann über Nextcloud 
                  zwischen verschiedenen Geräten synchronisiert werden.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Speichern Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          sx={{ minWidth: 200 }}
        >
          Einstellungen speichern
        </Button>
      </Box>
    </Box>
  );
}

export default SettingsPanel; 