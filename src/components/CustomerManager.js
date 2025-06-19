import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, IconButton, List, ListItem,
  ListItemText, ListItemSecondaryAction, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Fab, Divider, Chip
} from '@mui/material';
import { Add, Edit, Delete, Email, Folder } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import DataService from '../services/DataService';

function CustomerManager({ customers, onUpdateCustomers }) {
  const { t } = useTranslation();
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
    if (window.confirm(t('customers.deleteCustomer'))) {
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
                    <Chip label={`${customer.hourlyRate}€/h`} size="small" />
                    <Chip label={`${customer.hours || 6} ${t('customers.hours')}`} size="small" />
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCustomer ? t('customers.editCustomer') : t('customers.newCustomer')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('customers.form.hourlyRate')}
                fullWidth
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('customers.form.hours')}
                fullWidth
                type="number"
                value={formData.hours}
                onChange={(e) => handleInputChange('hours', parseInt(e.target.value) || 6)}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label={t('customers.form.activity')}
                fullWidth
                value={formData.activity}
                onChange={(e) => handleInputChange('activity', e.target.value)}
                placeholder={t('customers.form.placeholders.activity')}
                helperText={t('customers.form.placeholders.emailTemplate')}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>{t('customers.form.storagePaths')}</Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('customers.form.pdfPaths')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <TextField
                  label={t('customers.form.savePathWindows')}
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
                  label={t('customers.form.savePathMac')}
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
                {t('customers.form.emlPaths')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                <TextField
                  label={t('customers.form.emlPathWindows')}
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
                  label={t('customers.form.emlPathMac')}
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
                label={t('customers.form.emailTemplate')}
                fullWidth
                multiline
                rows={4}
                value={formData.emailTemplate}
                onChange={(e) => handleInputChange('emailTemplate', e.target.value)}
                placeholder={t('customers.form.emailTemplatePlaceholder')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {t('customers.buttons.cancel')}
          </Button>
          <Button 
            onClick={handleSaveCustomer} 
            variant="contained"
            disabled={!formData.name || !formData.address || !formData.hourlyRate}
          >
            {editingCustomer ? t('customers.buttons.save') : t('customers.buttons.add')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomerManager; 