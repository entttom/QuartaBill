import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, FormControl, InputLabel,
  Select, MenuItem, Grid, Checkbox, FormControlLabel, List, ListItem,
  ListItemIcon, ListItemText, Divider, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Receipt, Email, CheckCircle, Error } from '@mui/icons-material';
import { format, startOfYear, addMonths } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import PDFService from '../services/PDFService';
import EmailService from '../services/EmailService';
import DataService from '../services/DataService';

function InvoiceGenerator({ customers, settings, data, onUpdateData }) {
  const { t, i18n } = useTranslation();
  
  // Bestimme das aktuelle Quartal basierend auf dem heutigen Datum
  const getCurrentQuarter = () => {
    const currentMonth = new Date().getMonth(); // 0-11
    if (currentMonth <= 2) return 'Q1'; // Jan-Mar
    if (currentMonth <= 5) return 'Q2'; // Apr-Jun
    if (currentMonth <= 8) return 'Q3'; // Jul-Sep
    return 'Q4'; // Oct-Dec
  };
  
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [generateEmail, setGenerateEmail] = useState(true);
  const [autoExport, setAutoExport] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [missingPaths, setMissingPaths] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [pathValidationDialogOpen, setPathValidationDialogOpen] = useState(false);

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  React.useEffect(() => {
    // Alle Kunden standardmäßig auswählen
    setSelectedCustomers(customers.map(c => c.id));
  }, [customers]);

  const getQuarterDates = (quarter, year) => {
    const quarterMap = {
      'Q1': { start: 0, end: 2 }, // Jan-Mar
      'Q2': { start: 3, end: 5 }, // Apr-Jun
      'Q3': { start: 6, end: 8 }, // Jul-Sep
      'Q4': { start: 9, end: 11 }  // Oct-Dec
    };
    
    const { start, end } = quarterMap[quarter];
    const startDate = new Date(year, start, 1);
    const endDate = new Date(year, end + 1, 0); // Letzter Tag des Monats
    
    // Rechnungsdatum ist der erste Tag des nächsten Quartals
    const invoiceDate = new Date(year, end + 1, 1);
    
    return { startDate, endDate, invoiceDate };
  };

  const generateInvoiceNumber = (customer, quarter, year) => {
    const format = settings?.invoiceNumberFormat || '[QQ][YY][KK]';
    return DataService.generateInvoiceNumber(customer, quarter, year, format);
  };

  const handleCustomerToggle = (customerId) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === customers.length 
        ? [] 
        : customers.map(c => c.id)
    );
  };

  const validatePaths = async () => {
    const platform = await DataService.getPlatform();
    const missingPaths = [];
    const warnings = [];

    // Prüfe Einstellungen (Logo)
    let logoPath = null;
    if (platform === 'win32') {
      logoPath = settings.logoPathWindows;
    } else if (platform === 'darwin') {
      logoPath = settings.logoPathMac;
    } else if (platform === 'linux') {
      logoPath = settings.logoPathLinux;
    }

    if (!logoPath || logoPath.trim() === '') {
      missingPaths.push({
        type: 'logo',
        description: `Logo-Pfad für ${platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : 'Linux'}`,
        location: 'Einstellungen → Allgemein'
      });
    }

    // Prüfe jeden ausgewählten Kunden
    for (const customerId of selectedCustomers) {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) continue;

      let pdfPath = null;
      let emlPath = null;

      if (platform === 'win32') {
        pdfPath = customer.savePathWindows;
        emlPath = customer.emlPathWindows;
      } else if (platform === 'darwin') {
        pdfPath = customer.savePathMac;
        emlPath = customer.emlPathMac;
      } else if (platform === 'linux') {
        pdfPath = customer.savePathLinux;
        emlPath = customer.emlPathLinux;
      }

      if (!pdfPath || pdfPath.trim() === '') {
        missingPaths.push({
          type: 'pdf',
          customer: customer.name,
          description: `PDF-Speicherpfad für ${platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : 'Linux'}`,
          location: 'Kunden → Bearbeiten'
        });
      }

      // E-Mail-Validierung
      if (generateEmail) {
        if (!customer.email || customer.email.trim() === '') {
          // Warnung: EML-Generierung aktiviert aber keine E-Mail-Adresse
          warnings.push({
            type: 'no-email',
            customer: customer.name,
            description: 'Keine E-Mail-Adresse hinterlegt - EML wird übersprungen',
            location: 'Kunden → Bearbeiten'
          });
        } else if (!emlPath || emlPath.trim() === '') {
          // Fehler: E-Mail-Adresse vorhanden aber kein EML-Pfad
          missingPaths.push({
            type: 'eml',
            customer: customer.name,
            description: `EML-Speicherpfad für ${platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : 'Linux'}`,
            location: 'Kunden → Bearbeiten'
          });
        }
      }
    }

    return { missingPaths, warnings };
  };

  const handleGenerateInvoices = async () => {
    if (selectedCustomers.length === 0) {
      alert(t('invoices.warnings.selectCustomers'));
      return;
    }

    // Pfad-Validierung vor Generierung
    const { missingPaths, warnings } = await validatePaths();
    if (missingPaths.length > 0 || warnings.length > 0) {
      setMissingPaths(missingPaths);
      setValidationWarnings(warnings);
      setPathValidationDialogOpen(true);
      return;
    }

    // Generierung starten
    startGeneration();
  };

  const continueGenerationWithWarnings = () => {
    // Generierung trotz Warnungen fortsetzen
    startGeneration();
  };

  const startGeneration = async () => {
    // Prüfe auf bereits existierende Rechnungen
    const existingInvoices = selectedCustomers.filter(customerId => 
      DataService.checkInvoiceExists(data, customerId, selectedQuarter, selectedYear)
    );

    if (existingInvoices.length > 0) {
      const customerNames = existingInvoices.map(id => 
        customers.find(c => c.id === id)?.name
      ).join(', ');
      
      const confirmed = window.confirm(
        t('invoices.warnings.existingInvoices', { 
          customers: customerNames, 
          quarter: selectedQuarter, 
          year: selectedYear 
        })
      );
      
      if (!confirmed) {
        return;
      }
    }

    setIsGenerating(true);
    const generationResults = [];
    const allHistoryEntries = [];

    try {
      const { invoiceDate } = getQuarterDates(selectedQuarter, selectedYear);
      
      for (const customerId of selectedCustomers) {
        const customer = customers.find(c => c.id === customerId);
        if (!customer) continue;

        try {
          // Rechnungsnummer generieren
          const invoiceNumber = generateInvoiceNumber(customer, selectedQuarter, selectedYear);
          
          // PDF generieren
          const pdfResult = await PDFService.generateInvoice({
            customer,
            settings,
            quarter: selectedQuarter,
            year: selectedYear,
            invoiceNumber,
            invoiceDate,
            autoExport
          });

          let emailResult = null;
          console.log('Email-Generierung Check:', {
            customer: customer.name,
            generateEmail,
            customerEmail: customer.email,
            willGenerateEmail: generateEmail && customer.email
          });
          
          if (generateEmail && customer.email) {
            try {
              console.log('Starte EML-Generierung für:', customer.name);
              // Email generieren
              emailResult = await EmailService.generateEmail({
                customer,
                invoiceNumber,
                pdfBuffer: pdfResult.buffer,
                autoExport,
                quarter: selectedQuarter,
                year: selectedYear
              });
              console.log('EML-Generierung erfolgreich:', emailResult);
            } catch (emailError) {
              console.error('EML-Generierung fehlgeschlagen:', emailError);
              // EML-Fehler nicht die gesamte PDF-Generierung beenden lassen
            }
          }

          // Historie-Eintrag sammeln (noch nicht speichern)
          const invoiceBreakdown = DataService.calculateInvoiceBreakdown(customer);
          const historyEntry = {
            customerId: customer.id,
            customerName: customer.name,
            invoiceNumber,
            quarter: selectedQuarter,
            year: selectedYear,
            amount: invoiceBreakdown.total,
            vat: invoiceBreakdown.vat,
            subtotal: invoiceBreakdown.subtotal,
            pdfPath: pdfResult.path,
            emailPath: emailResult?.path || null
          };

          allHistoryEntries.push(historyEntry);

          generationResults.push({
            customer: customer.name,
            invoiceNumber,
            pdfPath: pdfResult.path,
            emailPath: emailResult?.path || null,
            success: true,
            error: null,
            message: pdfResult.message || null,
            browserDownload: pdfResult.browserDownload || false
          });
        } catch (error) {
          generationResults.push({
            customer: customer.name,
            invoiceNumber: generateInvoiceNumber(customer, selectedQuarter, selectedYear),
            success: false,
            error: error.message
          });
        }
      }

      // Alle erfolgreichen Rechnungen auf einmal zur Historie hinzufügen
      if (allHistoryEntries.length > 0) {
        let currentData = data;
        for (const historyEntry of allHistoryEntries) {
          const { updatedData } = DataService.addInvoiceToHistory(currentData, historyEntry);
          currentData = updatedData;
        }
        // Nur einmal die Daten aktualisieren
        onUpdateData(currentData);
      }
    } catch (error) {
      console.error('Fehler bei der Rechnungsgenerierung:', error);
    }

    setResults(generationResults);
    setResultDialogOpen(true);
    setIsGenerating(false);
  };

  const totalAmount = selectedCustomers.reduce((total, customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer || !customer.lineItems) return total;
    
    return customer.lineItems.reduce((customerTotal, item) => {
      const subtotal = item.quantity * item.unitPrice;
      let tax = 0;
      
      if (item.taxType === 'mixed') {
        // 90% der Summe mit 20% Steuersatz + 10% der Summe mit 0% Steuersatz
        tax = subtotal * 0.9 * 0.2; // Nur der 20%-Anteil trägt zur Steuer bei
      } else {
        const taxRate = parseFloat(item.taxType) / 100;
        tax = subtotal * taxRate;
      }
      
      return customerTotal + subtotal + tax;
    }, total);
  }, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('invoices.title')}
      </Typography>

      <Grid container spacing={3}>
        {/* Konfiguration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('invoices.quarter')} & {t('invoices.year')}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t('invoices.quarter')}</InputLabel>
                    <Select
                      value={selectedQuarter}
                      onChange={(e) => setSelectedQuarter(e.target.value)}
                      label={t('invoices.quarter')}
                    >
                      {quarters.map(q => (
                        <MenuItem key={q} value={q}>{q}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t('invoices.year')}</InputLabel>
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      label={t('invoices.year')}
                    >
                      {years.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={generateEmail}
                      onChange={(e) => setGenerateEmail(e.target.checked)}
                    />
                  }
                  label={t('invoices.generateEmail')}
                />
                <br />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={autoExport}
                      onChange={(e) => setAutoExport(e.target.checked)}
                    />
                  }
                  label={t('invoices.autoExport')}
                />
              </Box>

              {selectedQuarter && selectedYear && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    <strong>{t('invoices.period.serviceTime')}:</strong> {selectedQuarter}/{selectedYear}<br/>
                    <strong>{t('invoices.period.invoiceDate')}:</strong> {(() => {
                      const currentLang = i18n.language;
                      const dateLocale = currentLang === 'en' ? enUS : de;
                      const dateFormat = currentLang === 'en' ? 'MM/dd/yyyy' : 'dd.MM.yyyy';
                      return format(getQuarterDates(selectedQuarter, selectedYear).invoiceDate, dateFormat, { locale: dateLocale });
                    })()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Kundenauswahl */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {t('invoices.selectCustomers')}
                </Typography>
                <Button onClick={handleSelectAll} size="small">
                  {selectedCustomers.length === customers.length ? t('invoices.deselectAll') : t('invoices.selectAll')}
                </Button>
              </Box>

              {customers.length === 0 ? (
                <Alert severity="info">
                  {t('invoices.warnings.noCustomers')}
                </Alert>
              ) : (
                <List dense>
                  {customers.map((customer) => (
                    <ListItem key={customer.id} dense button onClick={() => handleCustomerToggle(customer.id)}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedCustomers.includes(customer.id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={customer.name}
                        secondary={(() => {
                          if (!customer.lineItems || customer.lineItems.length === 0) {
                            return t('customers.form.noLineItems');
                          }
                          
                          const total = customer.lineItems.reduce((sum, item) => {
                            const subtotal = item.quantity * item.unitPrice;
                            let tax = 0;
                            if (item.taxType === 'mixed') {
                              // 90% der Summe mit 20% Steuersatz + 10% der Summe mit 0% Steuersatz
                              tax = subtotal * 0.9 * 0.2; // Nur der 20%-Anteil trägt zur Steuer bei
                            } else {
                              const taxRate = parseFloat(item.taxType) / 100;
                              tax = subtotal * taxRate;
                            }
                            return sum + subtotal + tax;
                          }, 0);
                          
                          const positionCount = customer.lineItems.length;
                          const positionText = positionCount === 1 ? 
                            t('customers.form.position') : 
                            t('customers.form.positions');
                          
                          return `${positionCount} ${positionText} = ${total.toFixed(2)}€`;
                        })()}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Zusammenfassung */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    {t('invoices.summary')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedCustomers.length} {t('invoices.customersSelected', { total: customers.length })}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    {t('invoices.totalAmount')}: {totalAmount.toFixed(2)}€
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <Receipt />}
                    onClick={handleGenerateInvoices}
                    disabled={isGenerating || selectedCustomers.length === 0}
                    sx={{ minWidth: 200 }}
                  >
                    {isGenerating ? t('invoices.generating') : t('invoices.generate')}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pfad-Validierung Dialog */}
      <Dialog open={pathValidationDialogOpen} onClose={() => setPathValidationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Error color="warning" />
            {t('invoices.pathValidation.title')}
          </Box>
        </DialogTitle>
        <DialogContent>
          {missingPaths.length > 0 && (
            <>
              <Typography variant="body1" gutterBottom>
                {t('invoices.pathValidation.description')}
              </Typography>
              
              <List sx={{ mt: 2 }}>
                {missingPaths.map((missing, index) => (
                  <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: missing.type === 'logo' ? 'orange.main' : missing.type === 'pdf' ? 'error.main' : 'warning.main'
                      }} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {missing.customer ? `${missing.customer}: ` : ''}{missing.description}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                      {t('invoices.pathValidation.location')}: {missing.location}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Alert severity="error" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  {t('invoices.pathValidation.instructions')}
                </Typography>
              </Alert>
            </>
          )}

          {validationWarnings.length > 0 && (
            <>
              {missingPaths.length > 0 && <Divider sx={{ my: 3 }} />}
              
              <Typography variant="body1" gutterBottom>
                {t('invoices.pathValidation.warningsTitle')}
              </Typography>
              
              <List sx={{ mt: 2 }}>
                {validationWarnings.map((warning, index) => (
                  <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: 'info.main'
                      }} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {warning.customer ? `${warning.customer}: ` : ''}{warning.description}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                      {t('invoices.pathValidation.location')}: {warning.location}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  {t('invoices.pathValidation.warningsInfo')}
                </Typography>
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPathValidationDialogOpen(false)}>
            {missingPaths.length > 0 ? t('invoices.pathValidation.close') : t('invoices.pathValidation.cancel')}
          </Button>
          {missingPaths.length === 0 && validationWarnings.length > 0 && (
            <Button 
              variant="contained" 
              onClick={() => {
                setPathValidationDialogOpen(false);
                // Generierung mit Warnungen fortsetzen
                continueGenerationWithWarnings();
              }}
            >
              {t('invoices.pathValidation.continueAnyway')}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Ergebnis Dialog */}
      <Dialog open={resultDialogOpen} onClose={() => setResultDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('invoices.results.title')}</DialogTitle>
        <DialogContent dividers>
          {results.map((result, index) => (
            <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              {result.success ? (
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
              ) : (
                <ListItemIcon>
                  <Error color="error" />
                </ListItemIcon>
              )}
              <ListItemText 
                primary={result.customer}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {t('invoices.results.success')}: {result.invoiceNumber}
                    </Typography>
                    {result.emailSuccess && <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>- Email OK</Typography>}
                  </>
                }
              />
            </Box>
          ))}
          {generateEmail && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" dangerouslySetInnerHTML={{ __html: t('invoices.results.emlHint') }} />
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResultDialogOpen(false)}>
            {t('invoices.results.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InvoiceGenerator; 