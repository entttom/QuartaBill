import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, FormControl, InputLabel,
  Select, MenuItem, Grid, Checkbox, FormControlLabel, List, ListItem,
  ListItemIcon, ListItemText, Divider, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Receipt, Email, CheckCircle, Error } from '@mui/icons-material';
import { format, startOfYear, addMonths } from 'date-fns';
import { de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import PDFService from '../services/PDFService';
import EmailService from '../services/EmailService';
import DataService from '../services/DataService';

function InvoiceGenerator({ customers, settings }) {
  const { t } = useTranslation();
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [generateEmail, setGenerateEmail] = useState(true);
  const [autoExport, setAutoExport] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

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
    const format = settings?.invoiceNumberFormat || '{QQ}{YY}{KK}';
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

  const handleGenerateInvoices = async () => {
    if (selectedCustomers.length === 0) {
      alert(t('invoices.warnings.selectCustomers'));
      return;
    }

    setIsGenerating(true);
    const generationResults = [];

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
                autoExport
              });
              console.log('EML-Generierung erfolgreich:', emailResult);
            } catch (emailError) {
              console.error('EML-Generierung fehlgeschlagen:', emailError);
              // EML-Fehler nicht die gesamte PDF-Generierung beenden lassen
            }
          }

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
        tax = subtotal * 0.9 * 0.2; // 90%@20% + 10%@0%
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
                    <strong>{t('invoices.period.invoiceDate')}:</strong> {format(getQuarterDates(selectedQuarter, selectedYear).invoiceDate, 'dd.MM.yyyy', { locale: de })}
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
                            return 'Keine Leistungspositionen definiert';
                          }
                          
                          const total = customer.lineItems.reduce((sum, item) => {
                            const subtotal = item.quantity * item.unitPrice;
                            let tax = 0;
                            if (item.taxType === 'mixed') {
                              tax = subtotal * 0.9 * 0.2; // 90%@20% + 10%@0%
                            } else {
                              const taxRate = parseFloat(item.taxType) / 100;
                              tax = subtotal * taxRate;
                            }
                            return sum + subtotal + tax;
                          }, 0);
                          
                          return `${customer.lineItems.length} Position${customer.lineItems.length !== 1 ? 'en' : ''} = ${total.toFixed(2)}€`;
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

      {/* Ergebnis Dialog */}
      <Dialog open={resultDialogOpen} onClose={() => setResultDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('invoices.results.title')}</DialogTitle>
        <DialogContent>
          <List>
            {results.map((result, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {result.success ? 
                    <CheckCircle color="success" /> : 
                    <Error color="error" />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={`${result.customer} - ${result.invoiceNumber}`}
                  secondary={
                    result.success 
                      ? (() => {
                          let message = `PDF: ${result.pdfPath}`;
                          if (result.emailPath) message += ` | Email: ${result.emailPath}`;
                          if (result.browserDownload) message += ' (Browser-Download)';
                          if (result.message) message += ` | ${result.message}`;
                          return message;
                        })()
                      : `${t('invoices.results.error')}: ${result.error}`
                  }
                />
              </ListItem>
            ))}
          </List>
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