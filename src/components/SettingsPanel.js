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
          <Tab label="Über QuartaBill" />
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
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Rechnungsnummer-Format
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Format für Rechnungsnummern"
                  fullWidth
                  value={formData.invoiceNumberFormat || '{QQ}{YY}{KK}'}
                  onChange={(e) => handleInputChange(null, 'invoiceNumberFormat', e.target.value)}
                  placeholder="{QQ}{YY}{KK}"
                  helperText="Verfügbare Variablen: {Q}/{QQ} (Quartal), {YY}/{YYYY} (Jahr), {K}/{KK}/{KKK} (Kunde), {N}/{NN}/{NNN} (Nummer)"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Beispiele:</strong><br/>
                    • <code>{'{QQ}{YY}{KK}'}</code> → 0124MA (Standard)<br/>
                    • <code>{'{YYYY}-Q{Q}-{KKK}'}</code> → 2024-Q1-MAX<br/>
                    • <code>R{'{YY}{QQ}{NNN}'}</code> → R24011234<br/>
                    • <code>{'{K}{YY}{QQ}{NN}'}</code> → M240112
                  </Typography>
                </Alert>
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
                  Diese Datei wird beim Programmstart geladen und kann über z.B. Nextcloud, 
                  iCloud, Dropbox, OneDrive etc. zwischen verschiedenen Geräten synchronisiert werden.
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              QuartaBill
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Professionelle Quartalsabrechnungen für Arbeitsmediziner
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Entwickelt von Dr. Thomas Entner
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
              Diese Anwendung wurde speziell für Arbeitsmediziner entwickelt, um die quartalsweise 
              Abrechnung ihrer Leistungen zu vereinfachen und zu automatisieren.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Features von QuartaBill:
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • Kundendaten verwalten
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • Automatische Quartalsrechnungen
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • PDF-Rechnungen generieren
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • E-Mail-Vorlagen erstellen
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • Sichere Datensynchronisation
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • Deutsche Steuerberechnung
                </Typography>
              </Grid>
            </Grid>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              Version 1.0.0 - Für eine effiziente und professionelle Praxisverwaltung
            </Typography>
          </CardContent>
        </Card>
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