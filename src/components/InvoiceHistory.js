import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  FormControl, InputLabel, Select, MenuItem, Grid, TextField,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Alert, AlertTitle, Stack, Pagination, PaginationItem
} from '@mui/material';
import {
  Visibility, Delete, Email, Receipt, FilterList, Clear,
  GetApp, History, TrendingUp, Assignment, Gavel, FileDownload,
  TableChart
} from '@mui/icons-material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import DataService from '../services/DataService';

function InvoiceHistory({ data, onUpdateData, customers }) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    customerId: '',
    quarter: '',
    year: '',
    status: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [selectedStatsYear, setSelectedStatsYear] = useState(new Date().getFullYear());
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(data.settings?.invoiceHistoryPageSize || 30);

  // Update itemsPerPage when settings change
  React.useEffect(() => {
    if (data.settings?.invoiceHistoryPageSize !== undefined && data.settings.invoiceHistoryPageSize !== itemsPerPage) {
      setItemsPerPage(data.settings.invoiceHistoryPageSize);
      setPage(1); // Reset to first page when changing page size
    }
  }, [data.settings?.invoiceHistoryPageSize, itemsPerPage]);

  // Filtere und sortiere Rechnungen
  const filteredInvoices = useMemo(() => {
    let invoices = DataService.getInvoiceHistory(data, filters);
    
    if (searchTerm) {
      invoices = invoices.filter(invoice =>
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return invoices;
  }, [data, filters, searchTerm]);

  // Paginierte Rechnungen
  const paginatedInvoices = useMemo(() => {
    // Wenn "Alle" ausgewählt ist, zeige alle Rechnungen
    if (itemsPerPage === 'all') {
      return filteredInvoices;
    }
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInvoices.slice(startIndex, endIndex);
  }, [filteredInvoices, page, itemsPerPage]);

  // Gesamtanzahl Seiten
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredInvoices.length / itemsPerPage);

  // Statistiken berechnen
  const statistics = useMemo(() => {
    const allInvoices = data.invoiceHistory || [];
    const currentYear = new Date().getFullYear();
    const currentYearInvoices = allInvoices.filter(inv => inv.year === currentYear);
    const selectedYearInvoices = allInvoices.filter(inv => inv.year === selectedStatsYear);
    
    return {
      total: allInvoices.length,
      currentYear: currentYearInvoices.length,
      selectedYearCount: selectedYearInvoices.length,
      selectedYearAmount: selectedYearInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
      selectedYearVAT: selectedYearInvoices.reduce((sum, inv) => sum + (inv.vat || 0), 0)
    };
  }, [data.invoiceHistory, selectedStatsYear]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      customerId: '',
      quarter: '',
      year: '',
      status: ''
    });
    setSearchTerm('');
    setPage(1); // Reset to first page when clearing filters
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = event.target.value;
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Reset to first page when changing page size
    
    // Save to settings
    const updatedSettings = {
      ...data.settings,
      invoiceHistoryPageSize: newItemsPerPage
    };
    
    const updatedData = {
      ...data,
      settings: updatedSettings
    };
    
    onUpdateData(updatedData);
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (invoiceToDelete) {
      const updatedData = DataService.deleteInvoiceFromHistory(data, invoiceToDelete.id);
      onUpdateData(updatedData);
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handleUpdateStatus = (invoiceId, newStatus) => {
    const updatedData = DataService.updateInvoiceStatus(data, invoiceId, newStatus);
    onUpdateData(updatedData);
  };

  const handleExportCSV = () => {
    const exportData = filteredInvoices.map(invoice => ({
      [t('invoiceHistory.table.invoiceNumber')]: invoice.invoiceNumber,
      [t('invoiceHistory.table.customer')]: invoice.customerName,
      [t('invoiceHistory.table.period')]: getQuarterDateRange(invoice.quarter, invoice.year),
      [t('invoiceHistory.table.amount')]: invoice.amount,
      [t('invoiceHistory.table.vat')]: invoice.vat || 0,
      [t('invoiceHistory.table.created')]: formatDate(invoice.createdAt),
      [t('invoiceHistory.table.status')]: getStatusLabel(invoice.status)
    }));

    const csv = Papa.unparse(exportData, {
      delimiter: ';',
      header: true
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rechnungshistorie_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const exportData = filteredInvoices.map(invoice => ({
      [t('invoiceHistory.table.invoiceNumber')]: invoice.invoiceNumber,
      [t('invoiceHistory.table.customer')]: invoice.customerName,
      [t('invoiceHistory.table.period')]: getQuarterDateRange(invoice.quarter, invoice.year),
      [t('invoiceHistory.table.amount')]: invoice.amount,
      [t('invoiceHistory.table.vat')]: invoice.vat || 0,
      [t('invoiceHistory.table.created')]: formatDate(invoice.createdAt),
      [t('invoiceHistory.table.status')]: getStatusLabel(invoice.status)
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t('invoiceHistory.title'));
    
    // Spaltenbreiten anpassen
    const wscols = [
      { wch: 15 }, // Rechnungsnummer
      { wch: 25 }, // Kunde
      { wch: 15 }, // Zeitraum
      { wch: 12 }, // Betrag
      { wch: 12 }, // MwSt
      { wch: 20 }, // Erstellt
      { wch: 15 }  // Status
    ];
    ws['!cols'] = wscols;

    XLSX.writeFile(wb, `rechnungshistorie_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'generated': return 'info';
      case 'ready_to_send': return 'warning';
      case 'sent': return 'success';
      case 'paid': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'generated': return t('invoiceHistory.status.generated');
      case 'ready_to_send': return t('invoiceHistory.status.readyToSend');
      case 'sent': return t('invoiceHistory.status.sent');
      case 'paid': return t('invoiceHistory.status.paid');
      default: return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de });
  };

  const getQuarterDateRange = (quarter, year) => {
    return `${quarter} ${year}`;
  };

  const years = [...new Set((data.invoiceHistory || []).map(inv => inv.year))].sort((a, b) => b - a);
  const statsYears = years.length > 0 ? years : [new Date().getFullYear()];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const statusOptions = ['generated', 'ready_to_send', 'sent', 'paid'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <History sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t('invoiceHistory.title')}
        </Typography>
        
        {filteredInvoices.length > 0 && (
          <Stack direction="row" spacing={1}>
            <Tooltip title={t('invoiceHistory.export.csvTooltip')}>
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={handleExportCSV}
                size="small"
              >
                CSV
              </Button>
            </Tooltip>
            <Tooltip title={t('invoiceHistory.export.excelTooltip')}>
              <Button
                variant="outlined"
                startIcon={<TableChart />}
                onClick={handleExportExcel}
                size="small"
              >
                Excel
              </Button>
            </Tooltip>
          </Stack>
        )}
      </Box>

            {/* Statistiken */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" color="primary">
                {statistics.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('invoiceHistory.stats.totalInvoices')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 120, mb: 2 }}>
                <InputLabel>{t('invoiceHistory.stats.selectYear')}</InputLabel>
                <Select
                  value={selectedStatsYear}
                  onChange={(e) => setSelectedStatsYear(e.target.value)}
                  label={t('invoiceHistory.stats.selectYear')}
                >
                  {statsYears.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="h4" component="div" color="success.main">
                {statistics.selectedYearCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('invoiceHistory.stats.yearInvoices', { year: selectedStatsYear })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" component="div" color="success.main">
                {formatCurrency(statistics.selectedYearAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('invoiceHistory.stats.yearAmount', { year: selectedStatsYear })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Gavel sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h6" component="div" color="error.main">
                {formatCurrency(statistics.selectedYearVAT)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('invoiceHistory.stats.yearVAT', { year: selectedStatsYear })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <FilterList sx={{ mr: 1, verticalAlign: 'middle' }} />
            {t('invoiceHistory.filters.title')}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                label={t('invoiceHistory.filters.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('invoiceHistory.filters.customer')}</InputLabel>
                <Select
                  value={filters.customerId}
                  onChange={(e) => handleFilterChange('customerId', e.target.value)}
                  label={t('invoiceHistory.filters.customer')}
                >
                  <MenuItem value="">{t('invoiceHistory.filters.all')}</MenuItem>
                  {customers.map(customer => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('invoiceHistory.filters.quarter')}</InputLabel>
                <Select
                  value={filters.quarter}
                  onChange={(e) => handleFilterChange('quarter', e.target.value)}
                  label={t('invoiceHistory.filters.quarter')}
                >
                  <MenuItem value="">{t('invoiceHistory.filters.all')}</MenuItem>
                  {quarters.map(quarter => (
                    <MenuItem key={quarter} value={quarter}>{quarter}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('invoiceHistory.filters.year')}</InputLabel>
                <Select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  label={t('invoiceHistory.filters.year')}
                >
                  <MenuItem value="">{t('invoiceHistory.filters.all')}</MenuItem>
                  {years.map(year => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>{t('invoiceHistory.filters.status')}</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label={t('invoiceHistory.filters.status')}
                >
                  <MenuItem value="">{t('invoiceHistory.filters.all')}</MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearFilters}
                size="small"
              >
                {t('invoiceHistory.filters.clear')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                {itemsPerPage === 'all' 
                  ? t('invoiceHistory.pagination.totalInvoices', { count: filteredInvoices.length })
                  : t('invoiceHistory.pagination.pageInfo', { 
                      page: page, 
                      total: totalPages, 
                      count: filteredInvoices.length 
                    })
                }
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>{t('invoiceHistory.pagination.itemsPerPage')}</InputLabel>
                  <Select
                    value={itemsPerPage}
                    label={t('invoiceHistory.pagination.itemsPerPage')}
                    onChange={handleItemsPerPageChange}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value="all">{t('invoiceHistory.pagination.all')}</MenuItem>
                  </Select>
                </FormControl>
                {itemsPerPage !== 'all' && (
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="small"
                    showFirstButton
                    showLastButton
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Rechnungstabelle */}
      {filteredInvoices.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {t('invoiceHistory.noInvoices')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {searchTerm || Object.values(filters).some(f => f) 
                ? t('invoiceHistory.noFilterResults')
                : t('invoiceHistory.generateFirst')
              }
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('invoiceHistory.table.invoiceNumber')}</TableCell>
                  <TableCell>{t('invoiceHistory.table.customer')}</TableCell>
                  <TableCell>{t('invoiceHistory.table.period')}</TableCell>
                  <TableCell>{t('invoiceHistory.table.amount')}</TableCell>
                  <TableCell>{t('invoiceHistory.table.vat')}</TableCell>
                  <TableCell>{t('invoiceHistory.table.created')}</TableCell>
                  <TableCell>{t('invoiceHistory.table.status')}</TableCell>
                  <TableCell>{t('invoiceHistory.table.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInvoices.map((invoice) => (
                                 <TableRow key={invoice.id} hover>
                   <TableCell>
                     <Typography variant="body2" fontWeight="medium">
                       {invoice.invoiceNumber}
                     </Typography>
                   </TableCell>
                   <TableCell>{invoice.customerName}</TableCell>
                   <TableCell>{getQuarterDateRange(invoice.quarter, invoice.year)}</TableCell>
                   <TableCell>
                     <Typography variant="body2" fontWeight="medium">
                       {formatCurrency(invoice.amount)}
                     </Typography>
                   </TableCell>
                   <TableCell>
                     <Typography variant="body2" fontWeight="medium" color="error.main">
                       {formatCurrency(invoice.vat || 0)}
                     </Typography>
                   </TableCell>
                   <TableCell>
                     <Typography variant="body2" color="text.secondary">
                       {formatDate(invoice.createdAt)}
                     </Typography>
                   </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(invoice.status)}
                      color={getStatusColor(invoice.status)}
                      size="small"
                      onClick={() => {
                        const nextStatus = {
                          'generated': 'sent',
                          'ready_to_send': 'sent',
                          'sent': 'paid',
                          'paid': 'generated'
                        };
                        handleUpdateStatus(invoice.id, nextStatus[invoice.status] || 'sent');
                      }}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={t('invoiceHistory.actions.viewDetails')}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewDetails(invoice)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {invoice.pdfPath && (
                        <Tooltip title={t('invoiceHistory.actions.openPdf')}>
                          <IconButton 
                            size="small"
                            onClick={() => window.electronAPI?.openFile(invoice.pdfPath)}
                          >
                            <GetApp />
                          </IconButton>
                        </Tooltip>
                      )}
                      {invoice.emailPath && (
                        <Tooltip title={t('invoiceHistory.actions.openEmail')}>
                          <IconButton 
                            size="small"
                            onClick={() => window.electronAPI?.openFile(invoice.emailPath)}
                          >
                            <Email />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('invoiceHistory.actions.delete')}>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(invoice)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Bottom Pagination */}
            {totalPages > 1 && itemsPerPage !== 'all' && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </Paper>
        )}

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {t('invoiceHistory.details.title')} - {selectedInvoice?.invoiceNumber}
        </DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('invoiceHistory.details.customer')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedInvoice.customerName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('invoiceHistory.details.period')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {getQuarterDateRange(selectedInvoice.quarter, selectedInvoice.year)}
                </Typography>
              </Grid>
                             <Grid item xs={12} sm={6}>
                 <Typography variant="subtitle2" gutterBottom>
                   {t('invoiceHistory.details.amount')}
                 </Typography>
                 <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                   {formatCurrency(selectedInvoice.amount)}
                 </Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                 <Typography variant="subtitle2" gutterBottom>
                   {t('invoiceHistory.details.subtotal')}
                 </Typography>
                 <Typography variant="body1" sx={{ mb: 2 }}>
                   {formatCurrency(selectedInvoice.subtotal || 0)}
                 </Typography>
               </Grid>
               <Grid item xs={12} sm={6}>
                 <Typography variant="subtitle2" gutterBottom>
                   {t('invoiceHistory.details.vat')}
                 </Typography>
                 <Typography variant="h6" color="error.main" sx={{ mb: 2 }}>
                   {formatCurrency(selectedInvoice.vat || 0)}
                 </Typography>
               </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('invoiceHistory.details.created')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(selectedInvoice.createdAt)}
                </Typography>
              </Grid>
              {selectedInvoice.pdfPath && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('invoiceHistory.details.pdfPath')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {selectedInvoice.pdfPath}
                  </Typography>
                </Grid>
              )}
              {selectedInvoice.emailPath && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('invoiceHistory.details.emailPath')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedInvoice.emailPath}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('invoiceHistory.delete.title')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('invoiceHistory.delete.message', { 
              invoiceNumber: invoiceToDelete?.invoiceNumber,
              customer: invoiceToDelete?.customerName
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default InvoiceHistory; 