import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, IconButton, List, ListItem,
  ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Fab, Divider, Chip
} from '@mui/material';
import { Add, Edit, Delete, Email, Folder } from '@mui/icons-material';
import DataService from '../services/DataService';

function CustomerManager({ customers, onUpdateCustomers }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState(DataService.createCustomer());

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({ ...customer });
    } else {
      setEditingCustomer(null);
      setFormData(DataService.createCustomer());
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCustomer(null);
    setFormData(DataService.createCustomer());
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
    if (window.confirm('Sind Sie sicher, dass Sie diesen Kunden löschen möchten?')) {
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      onUpdateCustomers(updatedCustomers);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectFolder = async (type) => {
    const folder = await DataService.selectFolder();
    if (folder) {
      const fieldMap = {
        'pdfWindows': 'savePathWindows',
        'pdfMac': 'savePathMac',
        'emlWindows': 'emlPathWindows',
        'emlMac': 'emlPathMac'
      };
      const field = fieldMap[type];
      if (field) {
        handleInputChange(field, folder);
      }
    }
  };

  const generateInvoiceNumber = (customerName, quarter = 'Q1', year = '24') => {
    const prefix = customerName.substring(0, 2).toUpperCase();
    return `${quarter.replace('Q', '0')}${year}${prefix}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Kundenverwaltung
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Neuer Kunde
        </Button>
      </Box>

      {customers.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Noch keine Kunden angelegt
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Klicken Sie auf "Neuer Kunde" um Ihren ersten Kunden hinzuzufügen.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Ersten Kunden anlegen
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
                      {customer.name || 'Unbenannter Kunde'}
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
                    {customer.address || 'Keine Adresse hinterlegt'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip label={`${customer.hourlyRate}€/h`} size="small" />
                    <Chip label={`${customer.hours || 6} Std.`} size="small" />
                    {customer.email && <Chip icon={<Email />} label="Email" size="small" />}
                  </Box>
                  
                  <Typography variant="caption" color="textSecondary">
                    Beispiel-Rechnungsnummer: {generateInvoiceNumber(customer.name)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Kunde bearbeiten/hinzufügen Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCustomer ? 'Kunde bearbeiten' : 'Neuer Kunde'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Firmenname"
                fullWidth
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Adresse"
                fullWidth
                multiline
                rows={3}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stundensatz (€)"
                fullWidth
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stunden pro Quartal"
                fullWidth
                type="number"
                value={formData.hours}
                onChange={(e) => handleInputChange('hours', parseInt(e.target.value) || 6)}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Tätigkeit"
                fullWidth
                value={formData.activity}
                onChange={(e) => handleInputChange('activity', e.target.value)}
                placeholder="z.B. Arbeitsmedizinische Leistungen [Quartal]"
                helperText="Verfügbare Variablen: [Quartal], [Jahr], [Rechnungsnummer], [Kunde]"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Speicherpfade</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                PDF-Speicherpfade
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Windows PDF-Pfad"
                  fullWidth
                  size="small"
                  value={formData.savePathWindows}
                  onChange={(e) => handleInputChange('savePathWindows', e.target.value)}
                />
                <IconButton onClick={() => handleSelectFolder('pdfWindows')} size="small">
                  <Folder />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="Mac PDF-Pfad"
                  fullWidth
                  size="small"
                  value={formData.savePathMac}
                  onChange={(e) => handleInputChange('savePathMac', e.target.value)}
                />
                <IconButton onClick={() => handleSelectFolder('pdfMac')} size="small">
                  <Folder />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                EML-Speicherpfade
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <TextField
                  label="Windows EML-Pfad"
                  fullWidth
                  size="small"
                  value={formData.emlPathWindows}
                  onChange={(e) => handleInputChange('emlPathWindows', e.target.value)}
                />
                <IconButton onClick={() => handleSelectFolder('emlWindows')} size="small">
                  <Folder />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  label="Mac EML-Pfad"
                  fullWidth
                  size="small"
                  value={formData.emlPathMac}
                  onChange={(e) => handleInputChange('emlPathMac', e.target.value)}
                />
                <IconButton onClick={() => handleSelectFolder('emlMac')} size="small">
                  <Folder />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Email-Template"
                fullWidth
                multiline
                rows={4}
                value={formData.emailTemplate}
                onChange={(e) => handleInputChange('emailTemplate', e.target.value)}
                placeholder="Text der Email die mit der Rechnung versendet wird..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSaveCustomer} 
            variant="contained"
            disabled={!formData.name || !formData.address || !formData.hourlyRate}
          >
            {editingCustomer ? 'Speichern' : 'Hinzufügen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomerManager; 