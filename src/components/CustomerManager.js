import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, IconButton, List, ListItem,
  ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Fab, Divider, Chip, Tabs, Tab,
  FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { Add, Edit, Delete, Email, Folder, DragHandle, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import DataService from '../services/DataService';
import PlatformPathFields from './PlatformPathFields';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function CustomerManager({ customers, onUpdateCustomers }) {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState(DataService.createCustomer());
  const [tabValue, setTabValue] = useState(0);

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ ...customer });
    } else {
      setEditingCustomer(null);
      setFormData(DataService.createCustomer());
    }
    setDialogOpen(true);
    setTabValue(0); // Reset to first tab
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
    setFormData(DataService.createCustomer());
    setTabValue(0);
  };

  const handleSaveCustomer = () => {
    let updatedCustomers;
    
    if (editingCustomer) {
      // Bearbeitung
      updatedCustomers = customers.map(c => 
        c.id === editingCustomer.id ? formData : c
      );
    } else {
      // Neuer Kunde
      updatedCustomers = [...customers, formData];
    }
    
    onUpdateCustomers(updatedCustomers);
    handleCloseDialog();
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm(t('customers.deleteCustomer'))) {
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      onUpdateCustomers(updatedCustomers);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectFolder = async (platform, fieldName) => {
    const folder = await DataService.selectFolder();
    if (folder) {
      handleInputChange(fieldName, folder);
    }
  };

  // Leistungspositionen Verwaltung
  const handleAddLineItem = () => {
    const newLineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit: 'Stunden',
      unitPrice: 0,
      taxType: '20'
    };
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newLineItem]
    }));
  };

  const handleDeleteLineItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== itemId)
    }));
  };

  const handleLineItemChange = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleMoveLineItem = (dragIndex, hoverIndex) => {
    const draggedItem = formData.lineItems[dragIndex];
    const newItems = [...formData.lineItems];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    setFormData(prev => ({ ...prev, lineItems: newItems }));
  };

  const calculateCustomerTotal = (customer) => {
    if (!customer.lineItems || customer.lineItems.length === 0) return 0;
    
    return customer.lineItems.reduce((total, item) => {
      const subtotal = item.quantity * item.unitPrice;
      let tax = 0;
      
      if (item.taxType === 'mixed') {
        tax = subtotal * 0.9 * 0.2; // 90%@20% + 10%@0%
      } else {
        const taxRate = parseFloat(item.taxType) / 100;
        tax = subtotal * taxRate;
      }
      
      return total + subtotal + tax;
    }, 0);
  };

  const getTaxTypeLabel = (taxType) => {
    switch (taxType) {
      case 'none': return '0%';
      case 'standard': return '20%';
      case 'mixed': return '90%@20% + 10%@0%';
      default: return 'Unbekannt';
    }
  };

  const generateInvoiceNumber = (customerName, quarter = 'Q1', year = 2024) => {
    const mockCustomer = { name: customerName };
    const format = '{QQ}{YY}{KK}'; // Standard-Format für Beispiel
    return DataService.generateInvoiceNumber(mockCustomer, quarter, year, format);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {t('customers.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          {t('customers.newCustomer')}
        </Button>
      </Box>

      {customers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {t('customers.noCustomers')}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {t('customers.createFirst')}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              {t('customers.newCustomer')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {customers.map((customer) => (
            <Grid item xs={12} md={6} lg={4} key={customer.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {customer.name || t('customers.unnamedCustomer')}
                    </Typography>
                    <Box>
                      <IconButton onClick={() => handleOpenDialog(customer)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCustomer(customer.id)} size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {customer.address || t('customers.noAddress')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                      label={`${(customer.lineItems || []).length} Position${(customer.lineItems || []).length !== 1 ? 'en' : ''}`} 
                      size="small" 
                    />
                    <Chip 
                      label={`${calculateCustomerTotal(customer).toFixed(2)}€ gesamt`} 
                      size="small" 
                      color="primary"
                    />
                    {customer.email && <Chip icon={<Email />} label="Email" size="small" />}
                  </Box>
                  
                  <Typography variant="caption" color="textSecondary">
                    {t('customers.exampleInvoiceNumber')}: {generateInvoiceNumber(customer.name)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Kunde bearbeiten/hinzufügen Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingCustomer ? t('customers.editCustomer') : t('customers.newCustomer')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Grunddaten" />
              <Tab label="Leistungspositionen" />
              <Tab label="Pfade & Email" />
            </Tabs>
          </Box>

          {/* Tab 1: Grunddaten */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('customers.form.name')}
                  fullWidth
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={t('customers.form.email')}
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label={t('customers.form.address')}
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t('customers.form.placeholders.address')}
                  required
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Leistungspositionen */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddLineItem}
              >
                Position hinzufügen
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={40}></TableCell>
                    <TableCell>Beschreibung</TableCell>
                    <TableCell width={100}>Menge</TableCell>
                    <TableCell width={120}>Einheit</TableCell>
                    <TableCell width={120}>Einzelpreis</TableCell>
                    <TableCell width={180}>Steuersatz</TableCell>
                    <TableCell width={120}>Gesamt</TableCell>
                    <TableCell width={60}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.lineItems?.map((item, index) => {
                    const subtotal = item.quantity * item.unitPrice;
                    let tax = 0;
                    if (item.taxType === 'mixed') {
                      tax = subtotal * 0.9 * 0.2; // 90%@20% + 10%@0%
                    } else {
                      const taxRate = parseFloat(item.taxType) / 100;
                      tax = subtotal * taxRate;
                    }
                    const total = subtotal + tax;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <IconButton size="small">
                            <DragHandle />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={item.description}
                            onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                            placeholder="Beschreibung der Leistung..."
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.1 }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth>
                            <Select
                              value={item.unit}
                              onChange={(e) => handleLineItemChange(item.id, 'unit', e.target.value)}
                            >
                              <MenuItem value="Stunden">Stunden</MenuItem>
                              <MenuItem value="Tage">Tage</MenuItem>
                              <MenuItem value="Pauschal">Pauschal</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleLineItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            inputProps={{ min: 0, step: 0.01 }}
                            InputProps={{ endAdornment: '€' }}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl fullWidth>
                            <Select
                              value={item.taxType}
                              onChange={(e) => handleLineItemChange(item.id, 'taxType', e.target.value)}
                            >
                              {/* Alle Steuersätze von 0% bis 30% */}
                              {Array.from({ length: 31 }, (_, i) => (
                                <MenuItem key={i} value={i.toString()}>{i}%</MenuItem>
                              ))}
                              <MenuItem value="mixed">90%@20% + 10%@0%</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {total.toFixed(2)}€
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteLineItem(item.id)}
                            disabled={formData.lineItems?.length <= 1}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Typography variant="h6">
                Gesamtsumme: {calculateCustomerTotal(formData).toFixed(2)}€
              </Typography>
            </Box>

            {/* Hilfe / Legende für Variablen */}
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  💡 Verfügbare Variablen in Beschreibungen
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  <Box sx={{ minWidth: '200px' }}>
                    <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      📅 Zeit & Quartal:
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                      [Quartal] → Q1, Q2, Q3, Q4<br/>
                      [Jahr] → 2024
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: '200px' }}>
                    <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      👤 Kunde & Rechnung:
                    </Typography>
                    <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                      [Kunde] → {formData.name || 'Kundenname'}<br/>
                      [Rechnungsnummer] → 0124MA
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
                  Beispiel: "Beratung für [Kunde] im [Quartal]/[Jahr]" wird zu "Beratung für {formData.name || 'Max Muster'} im Q1/2024"
                </Typography>
              </AccordionDetails>
            </Accordion>
          </TabPanel>

          {/* Tab 3: Pfade & Email */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Email-Einstellungen
                </Typography>
                <TextField
                  label={t('customers.form.emailSubject')}
                  fullWidth
                  value={formData.emailSubject}
                  onChange={(e) => handleInputChange('emailSubject', e.target.value)}
                  placeholder={t('customers.form.placeholders.emailSubject')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label={t('customers.form.emailTemplate')}
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.emailTemplate}
                  onChange={(e) => handleInputChange('emailTemplate', e.target.value)}
                  placeholder={t('customers.form.placeholders.emailTemplate')}
                />

                {/* Hilfe für E-Mail-Variablen */}
                <Accordion sx={{ mt: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      💡 Verfügbare Variablen in E-Mails
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                      <Box sx={{ minWidth: '200px' }}>
                        <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          📧 E-Mail-Betreff & Text:
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                          [Quartal] → Q1, Q2, Q3, Q4<br/>
                          [Jahr] → 2024<br/>
                          [Kunde] → {formData.name || 'Kundenname'}<br/>
                          [Rechnungsnummer] → 0124MA
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: '300px' }}>
                        <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          💌 Beispiel E-Mail-Betreff:
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: 'text.secondary', mb: 1 }}>
                          "Rechnung [Rechnungsnummer] - [Kunde]"<br/>
                          wird zu: "Rechnung 0124MA - {formData.name || 'Max Muster'}"
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          💬 Beispiel E-Mail-Text:
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                          "Rechnung für [Kunde] im [Quartal]/[Jahr]"<br/>
                          wird zu: "Rechnung für {formData.name || 'Max Muster'} im Q1/2024"
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
                      ✅ Alle Variablen verwenden jetzt einheitlich eckige Klammern [Variable]
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  PDF-Dateinamen
                </Typography>
                <TextField
                  label="PDF-Dateinamen-Format"
                  fullWidth
                  value={formData.pdfFileNameFormat || '[invoiceNumber]_[customerName]'}
                  onChange={(e) => handleInputChange('pdfFileNameFormat', e.target.value)}
                  placeholder="[invoiceNumber]_[customerName]"
                  sx={{ mb: 2 }}
                />

                {/* Hilfe für PDF-Dateinamen */}
                <Accordion sx={{ mt: 1, mb: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      💡 Verfügbare Variablen für PDF-Dateinamen
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
                      <Box sx={{ minWidth: '250px' }}>
                        <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          📄 Verfügbare Variablen:
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                          [invoiceNumber] → 0124MA<br/>
                          [customerName] → {(formData.name || 'Kundenname').replace(/[^a-zA-Z0-9]/g, '_')}<br/>
                          [quarter] → Q1<br/>
                          [year] → 2024<br/>
                          [date] → 2024-04-01
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: '300px' }}>
                        <Typography variant="caption" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          📋 Beispiel-Formate:
                        </Typography>
                        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                          <strong>Standard:</strong> [invoiceNumber]_[customerName]<br/>
                          → 0124MA_{(formData.name || 'Kundenname').replace(/[^a-zA-Z0-9]/g, '_')}.pdf<br/><br/>
                          <strong>Mit Datum:</strong> [date]_[invoiceNumber]<br/>
                          → 2024-04-01_0124MA.pdf<br/><br/>
                          <strong>Kurz:</strong> [invoiceNumber]<br/>
                          → 0124MA.pdf<br/><br/>
                          <strong>Mit Quartal:</strong> [year]_[quarter]_[customerName]<br/>
                          → 2024_Q1_{(formData.name || 'Kundenname').replace(/[^a-zA-Z0-9]/g, '_')}.pdf
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary', fontStyle: 'italic' }}>
                      ⚠️ Sonderzeichen im Kundennamen werden automatisch durch Unterstriche ersetzt für gültige Dateinamen
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {t('customers.form.paths')}
                </Typography>
              </Grid>

              {/* PDF Speicherpfade - Intelligent Platform Display */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {t('customers.form.storagePaths')} - PDF
                </Typography>
                <PlatformPathFields
                  values={formData}
                  onChange={handleInputChange}
                  onSelectFolder={handleSelectFolder}
                  fieldType="save"
                  label={t('customers.form.pdfPaths')}
                />
              </Grid>

              {/* EML Speicherpfade - Intelligent Platform Display */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {t('customers.form.storagePaths')} - EML
                </Typography>
                <PlatformPathFields
                  values={formData}
                  onChange={handleInputChange}
                  onSelectFolder={handleSelectFolder}
                  fieldType="eml"
                  label={t('customers.form.emlPaths')}
                />
              </Grid>

              {/* Hilfe für Pfade-Einstellungen */}
              <Grid item xs={12}>
                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      ℹ️ Wann sollten Sie kundenspezifische Pfade setzen?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                        <strong>📁 PDF-Pfade:</strong> Wenn Rechnungen für diesen Kunden in einen besonderen Ordner sollen
                      </Typography>
                      <Typography variant="caption" component="div" sx={{ ml: 2, mb: 2, opacity: 0.9 }}>
                        • Für wichtige Kunden mit eigenem Projekt-Ordner<br/>
                        • Bei automatisierter Buchhaltung mit kundenspezifischen Ordnern<br/>
                        • Wenn Kunde direkten Zugang zu einem freigegebenen Ordner hat
                      </Typography>
                      
                      <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                        <strong>📧 EML-Pfade:</strong> Für automatischen Import in Email-Programme
                      </Typography>
                      <Typography variant="caption" component="div" sx={{ ml: 2, mb: 2, opacity: 0.9 }}>
                        • EML-Dateien können direkt in Outlook/Thunderbird importiert werden<br/>
                        • Ideal für Backup oder CRM-Integration<br/>
                        • Synchronisation mit Cloud-Email-Diensten
                      </Typography>
                      
                      <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.9 }}>
                        💡 <strong>Tipp:</strong> Leer lassen = Standard-Pfade aus den Haupteinstellungen verwenden
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('customers.buttons.cancel')}</Button>
          <Button onClick={handleSaveCustomer} variant="contained" disabled={!formData.name}>
            {t('customers.buttons.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomerManager; 