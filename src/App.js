import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Tabs, Tab, Container, AppBar, Toolbar, Typography } from '@mui/material';
import { Receipt, People, Settings } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CustomerManager from './components/CustomerManager';
import InvoiceGenerator from './components/InvoiceGenerator';
import SettingsPanel from './components/SettingsPanel';
import OnboardingScreen from './components/OnboardingScreen';
import UpdateNotification from './components/UpdateNotification';
import DataService from './services/DataService';
import './i18n';

// Theme erstellen basierend auf Dark Mode
const createAppTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: darkMode ? '#90caf9' : '#1976d2',
    },
    secondary: {
      main: darkMode ? '#f48fb1' : '#dc004e',
    },
    background: {
      default: darkMode ? '#121212' : '#fafafa',
      paper: darkMode ? '#1e1e1e' : '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkMode ? '#1e1e1e' : '#1976d2',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
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

function App() {
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState({
    customers: [],
    settings: {
      issuer: {
        name: '',
        title: '',
        address: '',
        phone: '',
        website: '',
        email: '',
        iban: '',
        uid: ''
      },
      logoPathWindows: '',
      logoPathMac: '',
      dataFilePath: '',
      hasSeenOnboarding: false,
      invoiceNumberFormat: '{QQ}{YY}{KK}',
      language: 'de',
      darkMode: false
    }
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Lade Daten beim Start
  useEffect(() => {
    loadData();
  }, []);

  // Automatisches Speichern bei Datenänderungen (nur nach dem ersten Laden)
  useEffect(() => {
    if (isLoaded) {
      saveData();
    }
  }, [data, isLoaded]);

  const loadData = async () => {
    try {
      const loadedData = await DataService.loadData();
      if (loadedData) {
        setData(loadedData);
        
        // Sprache setzen
        if (loadedData.settings?.language) {
          i18n.changeLanguage(loadedData.settings.language);
        }
        
        // Zeige Onboarding nur beim ersten Start
        if (!loadedData.settings?.hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      } else {
        // Neue Installation - zeige Onboarding
        setShowOnboarding(true);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
      setIsLoaded(true);
      // Bei Fehler trotzdem Onboarding zeigen
      setShowOnboarding(true);
    }
  };

  const saveData = async () => {
    try {
      await DataService.saveData(data);
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const updateCustomers = (customers) => {
    setData(prev => ({ ...prev, customers }));
    // saveData() wird automatisch durch useEffect aufgerufen
  };

  const updateSettings = (settings) => {
    setData(prev => ({ ...prev, settings }));
    // saveData() wird automatisch durch useEffect aufgerufen
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    // Markiere Onboarding als gesehen
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        hasSeenOnboarding: true
      }
    }));
  };

  return (
    <ThemeProvider theme={createAppTheme(data.settings.darkMode)}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Receipt sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {t('app.title')}
            </Typography>
            <UpdateNotification />
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Navigation">
              <Tab 
                icon={<People />} 
                label={t('nav.customers')} 
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab 
                icon={<Receipt />} 
                label={t('nav.invoices')} 
                id="tab-1"
                aria-controls="tabpanel-1"
              />
              <Tab 
                icon={<Settings />} 
                label={t('nav.settings')} 
                id="tab-2"
                aria-controls="tabpanel-2"
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CustomerManager 
              customers={data.customers}
              onUpdateCustomers={updateCustomers}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <InvoiceGenerator 
              customers={data.customers}
              settings={data.settings}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <SettingsPanel 
              settings={data.settings}
              onUpdateSettings={updateSettings}
            />
          </TabPanel>
        </Container>
      </Box>
      
      {/* Onboarding Screen */}
      <OnboardingScreen 
        open={showOnboarding} 
        onClose={handleCloseOnboarding} 
      />
    </ThemeProvider>
  );
}

export default App; 