import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Grid, Button,
  Divider, IconButton, Alert, Tabs, Tab, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Switch, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Folder, Save, Image, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import DataService from '../services/DataService';
import { getVersion } from '../utils/version';

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

function SettingsPanel({ settings, onUpdateSettings, configPath, onConfigPathChange }) {
  const { t, i18n } = useTranslation();
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
    setSaveMessage(t('settings.saved'));
    setTimeout(() => setSaveMessage(''), 3000);
  };
  
  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    handleInputChange(null, 'language', language);
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



  const handleSelectConfigFile = async () => {
    // Warnung anzeigen vor der Dateiauswahl
    const confirmed = window.confirm(
      t('configFile.changeWarning')
    );
    
    if (confirmed) {
      const file = await DataService.selectFile([
        { name: 'JSON Dateien', extensions: ['json'] }
      ]);
      if (file && onConfigPathChange) {
        onConfigPathChange(file);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('settings.title')}
      </Typography>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label={t('settings.tabs.issuer')} />
          <Tab label={t('settings.tabs.paths')} />
          <Tab label={t('common.general')} />
          <Tab label={t('settings.tabs.about')} />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('settings.issuer.title')}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.name')}
                  fullWidth
                  value={formData.issuer?.name || ''}
                  onChange={(e) => handleInputChange('issuer', 'name', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.profession')}
                  fullWidth
                  value={formData.issuer?.title || ''}
                  onChange={(e) => handleInputChange('issuer', 'title', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label={t('settings.issuer.address')}
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.issuer?.address || ''}
                  onChange={(e) => handleInputChange('issuer', 'address', e.target.value)}
                  placeholder={i18n.language === 'de' ? 'Straße\nPLZ Ort' : 'Street\nZIP City'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.phone')}
                  fullWidth
                  value={formData.issuer?.phone || ''}
                  onChange={(e) => handleInputChange('issuer', 'phone', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.website')}
                  fullWidth
                  value={formData.issuer?.website || ''}
                  onChange={(e) => handleInputChange('issuer', 'website', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.email')}
                  fullWidth
                  type="email"
                  value={formData.issuer?.email || ''}
                  onChange={(e) => handleInputChange('issuer', 'email', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.iban')}
                  fullWidth
                  value={formData.issuer?.iban || ''}
                  onChange={(e) => handleInputChange('issuer', 'iban', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.uid')}
                  fullWidth
                  value={formData.issuer?.uid || ''}
                  onChange={(e) => handleInputChange('issuer', 'uid', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.bank')}
                  fullWidth
                  value={formData.issuer?.bank || ''}
                  onChange={(e) => handleInputChange('issuer', 'bank', e.target.value)}
                  placeholder={i18n.language === 'de' ? 'Name Ihrer Bank' : 'Your bank name'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('settings.issuer.paymentTerms')}
                  fullWidth
                  type="number"
                  value={formData.issuer?.paymentTerms || 14}
                  onChange={(e) => handleInputChange('issuer', 'paymentTerms', parseInt(e.target.value) || 14)}
                  placeholder="14"
                  inputProps={{ min: 1, max: 365 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('settings.issuer.language')}</InputLabel>
                  <Select
                    value={formData.language || 'de'}
                    label={t('settings.issuer.language')}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.darkMode || false}
                      onChange={(e) => handleInputChange(null, 'darkMode', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={t('settings.issuer.darkMode')}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Steuerliche Einstellungen
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.issuer?.smallBusiness || false}
                      onChange={(e) => handleInputChange('issuer', 'smallBusiness', e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Kleinunternehmerregelung (§ 6 UStG)"
                />
                <Accordion sx={{ mt: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ℹ️ Was ist die Kleinunternehmerregelung?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="caption" color="text.secondary">
                      • Für Unternehmen mit einem Jahresumsatz unter 22.000€ (Deutschland)<br/>
                      • Keine Umsatzsteuer auf Rechnungen → Vereinfachte Buchhaltung<br/>
                      • Auf Rechnungen wird automatisch der Hinweis "Es wird gemäß § 6 UStG keine Umsatzsteuer berechnet!" hinzugefügt<br/>
                      • <strong>Achtung:</strong> Bei Aktivierung werden alle Steuersätze auf den Rechnungen ignoriert
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Zusätzlicher Footer-Text (optional)"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.issuer?.footerText || ''}
                  onChange={(e) => handleInputChange('issuer', 'footerText', e.target.value)}
                  placeholder="z.B. Geschäftsbedingungen, Lieferbedingungen, persönliche Nachricht..."
                />
                <Accordion sx={{ mt: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      💡 Verwendungszwecke für Footer-Text
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="caption" color="text.secondary">
                      • Geschäftsbedingungen oder AGB-Hinweise<br/>
                      • Lieferbedingungen und Gewährleistung<br/>
                      • Zusätzliche rechtliche Hinweise<br/>
                      • Persönliche Nachricht oder Dankeschön<br/>
                      • Kontaktinformationen für Rückfragen
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t('settings.issuer.invoiceNumber.title')}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label={t('settings.issuer.invoiceNumber.format')}
                  fullWidth
                  value={formData.invoiceNumberFormat || '{QQ}{YY}{KK}'}
                  onChange={(e) => handleInputChange(null, 'invoiceNumberFormat', e.target.value)}
                  placeholder="{QQ}{YY}{KK}"
                  helperText={t('settings.issuer.invoiceNumber.help')}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>{t('settings.issuer.invoiceNumber.examples.title')}</strong><br/>
                    • <code>{'{QQ}{YY}{KK}'}</code> → 0124MA {t('settings.issuer.invoiceNumber.examples.standard')}<br/>
                    • <code>{'{YYYY}-Q{Q}-{KKK}'}</code> → 2024-Q1-MAX {t('settings.issuer.invoiceNumber.examples.verbose')}<br/>
                    • <code>R{'{YY}{QQ}{NNN}'}</code> → R24011234 {t('settings.issuer.invoiceNumber.examples.prefix')}<br/>
                    • <code>{'{K}{YY}{QQ}{NN}'}</code> → M240112 {t('settings.issuer.invoiceNumber.examples.compact')}
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
                  {t('settings.paths.logoTitle')}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        label={t('settings.paths.logoWindows')}
                        fullWidth
                        value={formData.logoPathWindows || ''}
                        onChange={(e) => handleInputChange(null, 'logoPathWindows', e.target.value)}
                        placeholder={i18n.language === 'de' ? 'C:\\Pfad\\zum\\logo.png' : 'C:\\Path\\to\\logo.png'}
                      />
                      <IconButton 
                        onClick={() => handleSelectFile('logoPathWindows', [
                          { name: i18n.language === 'de' ? 'Bilddateien' : 'Image files', extensions: ['png', 'jpg', 'jpeg'] }
                        ])}
                      >
                        <Image />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        label={t('settings.paths.logoMac')}
                        fullWidth
                        value={formData.logoPathMac || ''}
                        onChange={(e) => handleInputChange(null, 'logoPathMac', e.target.value)}
                        placeholder={i18n.language === 'de' ? '/Pfad/zum/logo.png' : '/path/to/logo.png'}
                      />
                      <IconButton 
                        onClick={() => handleSelectFile('logoPathMac', [
                          { name: i18n.language === 'de' ? 'Bilddateien' : 'Image files', extensions: ['png', 'jpg', 'jpeg'] }
                        ])}
                      >
                        <Image />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  {t('settings.paths.logoInfo')}
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Einstellungsdatei-Pfad */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('configFile.title')}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                  <TextField
                    label={t('configFile.pathLabel')}
                    fullWidth
                    value={configPath || ''}
                    InputProps={{
                      readOnly: true,
                    }}
                    placeholder={t('configFile.noFileSelected')}
                  />
                  <IconButton onClick={handleSelectConfigFile}>
                    <Folder />
                  </IconButton>
                </Box>
                
                <Alert severity="info">
                  {t('configFile.description')}
                </Alert>
                
                {configPath && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>{t('configFile.activeFile')}</strong><br />
                      {configPath}
                    </Typography>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>


        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          {/* Sprach- und App-Einstellungen */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('common.language')} & {t('common.appearance')}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>{t('common.language')} / Language</InputLabel>
                      <Select
                        value={formData.language || 'de'}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        label={`${t('common.language')} / Language`}
                      >
                        <MenuItem value="de">🇩🇪 Deutsch</MenuItem>
                        <MenuItem value="en">🇺🇸 English</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.darkMode || false}
                          onChange={(e) => handleInputChange(null, 'darkMode', e.target.checked)}
                          color="primary"
                        />
                      }
                      label={t('settings.issuer.darkMode')}
                    />
                  </Grid>
                </Grid>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    {i18n.language === 'de' 
                      ? 'Die Spracheinstellung wird sofort angewendet und beim nächsten Start der App wiederhergestellt.'
                      : 'The language setting is applied immediately and will be restored the next time you start the app.'
                    }
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              {t('settings.about.title')}
            </Typography>
            
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {t('settings.about.subtitle')}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t('settings.about.developer')}
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mt: 3, maxWidth: 600, mx: 'auto' }}>
              {t('settings.about.description')}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              {t('settings.about.features.title')}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • {t('settings.about.features.customerManagement')}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • {t('settings.about.features.autoInvoices')}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • {t('settings.about.features.pdfGeneration')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • {t('settings.about.features.emailTemplates')}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • {t('settings.about.features.dataSync')}
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  • {t('settings.about.features.taxCalculation')}
                </Typography>
              </Grid>
            </Grid>
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              {t('settings.about.version', { version: getVersion() })}
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
          {t('settings.buttons.save')}
        </Button>
      </Box>
    </Box>
  );
}

export default SettingsPanel; 