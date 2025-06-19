import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogActions, Typography, Button, Box, 
  Stepper, Step, StepLabel, Card, CardContent, Grid, IconButton,
  Divider
} from '@mui/material';
import {
  People, Receipt, Settings, Email, PictureAsPdf, Cloud,
  Close, ArrowForward, ArrowBack, CheckCircle
} from '@mui/icons-material';

const steps = [
  {
    title: 'Willkommen bei QuartaBill',
    subtitle: 'Professionelle Quartalsabrechnungen für Arbeitsmediziner',
    content: (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom>
          🏥 QuartaBill
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Entwickelt von Dr. Thomas Entner
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body1" paragraph>
          Diese Anwendung wurde speziell für <strong>Arbeitsmediziner</strong> entwickelt, 
          um die quartalsweise Abrechnung ihrer Leistungen zu vereinfachen und zu automatisieren.
        </Typography>
        <Typography variant="body1" paragraph>
          Sparen Sie Zeit bei der Rechnungserstellung und konzentrieren Sie sich 
          auf das Wesentliche - Ihre Patienten.
        </Typography>
      </Box>
    )
  },
  {
    title: 'Kundenverwaltung',
    subtitle: 'Verwalten Sie Ihre Kunden zentral',
    content: (
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <People sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Typography variant="h5">Kundenverwaltung</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              • <strong>Kundendaten zentral verwalten</strong> - Name, Adresse, Kontaktdaten
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Stundensätze definieren</strong> - Individuelle Preise pro Kunde
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Standard-Stunden festlegen</strong> - Typischerweise 6 Stunden pro Quartal
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Email-Templates</strong> - Personalisierte Anschreiben pro Kunde
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  },
  {
    title: 'Automatische Rechnungserstellung',
    subtitle: 'Quartalsrechnungen mit einem Klick',
    content: (
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Receipt sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
          <Typography variant="h5">Rechnungserstellung</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              • <strong>Batch-Generierung</strong> - Alle Kunden eines Quartals auf einmal
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Personalisierbare Rechnungsnummern</strong> - Anpassbares Format (z.B. 0124EC)
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Deutsche Steuerberechnung</strong> - 90% mit 20% USt., 10% mit 0% USt.
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Quartalsweise Datierung</strong> - Automatisch korrekte Rechnungsdaten
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  },
  {
    title: 'PDF & Email Export',
    subtitle: 'Professionelle Ausgabe',
    content: (
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <PictureAsPdf sx={{ fontSize: 48, color: 'primary.main' }} />
            <Email sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>
          <Typography variant="h5" sx={{ ml: 2 }}>PDF & Email</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1" paragraph>
              • <strong>Professionelle PDF-Rechnungen</strong> - Mit Ihrem Logo und Design
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Automatische Email-Generierung</strong> - .eml-Dateien mit PDF-Anhang
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Getrennte Speicherpfade</strong> - Windows und Mac kompatibel
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Standardisierte Dateinamen</strong> - Einfache Archivierung
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  },
  {
    title: 'Los geht\'s!',
    subtitle: 'Erste Schritte mit QuartaBill',
    content: (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Sie sind bereit!
        </Typography>
        <Typography variant="body1" paragraph>
          Beginnen Sie jetzt mit der Einrichtung Ihrer Daten:
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" paragraph>
            <strong>1. Einstellungen</strong> → Ihre Rechnungsdaten eingeben
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>2. Kunden</strong> → Erste Kunden anlegen
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>3. Rechnungen erstellen</strong> → Erste Quartalsrechnung generieren
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Viel Erfolg mit QuartaBill!
        </Typography>
      </Box>
    )
  }
];

function OnboardingScreen({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSkip = () => {
    onClose();
  };

  const currentStep = steps[activeStep];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={handleSkip}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ pt: 4 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                {currentStep.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" align="center" gutterBottom>
                {currentStep.subtitle}
              </Typography>
              
              {currentStep.content}
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button
            onClick={handleSkip}
            color="inherit"
          >
            Überspringen
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
            >
              Zurück
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
            >
              {activeStep === steps.length - 1 ? 'Fertig' : 'Weiter'}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default OnboardingScreen; 