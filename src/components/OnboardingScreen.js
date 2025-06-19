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
import { useTranslation } from 'react-i18next';

function OnboardingScreen({ open, onClose }) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      title: t('onboarding.steps.welcome.title'),
      subtitle: t('onboarding.steps.welcome.subtitle'),
      content: (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            🏥 QuartaBill
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('onboarding.steps.welcome.developer')}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body1" paragraph>
            {t('onboarding.steps.welcome.description1')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('onboarding.steps.welcome.description2')}
          </Typography>
        </Box>
      )
    },
    {
      title: t('onboarding.steps.customers.title'),
      subtitle: t('onboarding.steps.customers.subtitle'),
      content: (
        <Box sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <People sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5">{t('onboarding.steps.customers.title')}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.customers.feature1')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.customers.feature2')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.customers.feature3')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.customers.feature4')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      title: t('onboarding.steps.invoices.title'),
      subtitle: t('onboarding.steps.invoices.subtitle'),
      content: (
        <Box sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Receipt sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5">{t('onboarding.steps.invoices.title')}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.invoices.feature1')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.invoices.feature2')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.invoices.feature3')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.invoices.feature4')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      title: t('onboarding.steps.export.title'),
      subtitle: t('onboarding.steps.export.subtitle'),
      content: (
        <Box sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <PictureAsPdf sx={{ fontSize: 48, color: 'primary.main' }} />
              <Email sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" sx={{ ml: 2 }}>{t('onboarding.steps.export.title')}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.export.feature1')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.export.feature2')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.export.feature3')}
              </Typography>
              <Typography variant="body1" paragraph>
                • {t('onboarding.steps.export.feature4')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )
    },
    {
      title: t('onboarding.steps.finish.title'),
      subtitle: t('onboarding.steps.finish.subtitle'),
      content: (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {t('onboarding.steps.finish.ready')}
          </Typography>
          <Typography variant="body1" paragraph>
            {t('onboarding.steps.finish.description')}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" paragraph>
              <strong>1.</strong> {t('onboarding.steps.finish.step1')}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>2.</strong> {t('onboarding.steps.finish.step2')}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>3.</strong> {t('onboarding.steps.finish.step3')}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            {t('onboarding.steps.finish.success')}
          </Typography>
        </Box>
      )
    }
  ];

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
            {t('onboarding.skip')}
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
            >
              {t('onboarding.back')}
            </Button>
            <Button
              onClick={handleNext}
              variant="contained"
              endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
            >
              {activeStep === steps.length - 1 ? t('onboarding.finish') : t('onboarding.next')}
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default OnboardingScreen; 