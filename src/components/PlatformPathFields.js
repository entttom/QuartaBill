import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Alert,
  Chip
} from '@mui/material';
import {
  Folder,
  ExpandMore,
  Computer,
  Apple,
  Memory
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import DataService from '../services/DataService';

/**
 * Intelligente Komponente für plattformspezifische Pfad-Felder
 * Zeigt automatisch die aktuelle Plattform prominent an und versteckt andere unter Akkordions
 */
function PlatformPathFields({
  values,
  onChange,
  onSelectFolder,
  fieldType, // 'pdf', 'eml', 'logo'
  label,
  placeholder
}) {
  const { t } = useTranslation();
  const [currentPlatform, setCurrentPlatform] = useState('unknown');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const detectPlatform = async () => {
      try {
        const platform = await DataService.getPlatform();
        setCurrentPlatform(platform);
      } catch (error) {
        console.warn('Platform detection failed:', error);
        setCurrentPlatform('unknown');
      }
    };
    detectPlatform();
  }, []);

  const getPlatformInfo = (platform) => {
    const platforms = {
      win32: {
        name: 'Windows',
        icon: <Computer />,
        color: 'primary',
        fieldSuffix: 'Windows'
      },
      darwin: {
        name: 'macOS',
        icon: <Apple />,
        color: 'secondary',
        fieldSuffix: 'Mac'
      },
      linux: {
        name: 'Linux',
        icon: <Memory />,
        color: 'success',
        fieldSuffix: 'Linux'
      }
    };
    return platforms[platform] || {
      name: 'Unknown',
      icon: <Computer />,
      color: 'default',
      fieldSuffix: 'Windows'
    };
  };

  const getCurrentPlatformField = () => {
    const platformInfo = getPlatformInfo(currentPlatform);
    return `${fieldType}Path${platformInfo.fieldSuffix}`;
  };

  const getOtherPlatforms = () => {
    const allPlatforms = ['win32', 'darwin', 'linux'];
    return allPlatforms.filter(p => p !== currentPlatform);
  };

  const renderPathField = (platform, isMain = false) => {
    const platformInfo = getPlatformInfo(platform);
    const fieldName = `${fieldType}Path${platformInfo.fieldSuffix}`;
    const value = values[fieldName] || '';
    
    const labelKey = fieldType === 'logo' 
      ? `settings.paths.logo${platformInfo.fieldSuffix}`
      : `customers.form.${fieldType}Path${platformInfo.fieldSuffix}`;
    
         let placeholderText;
     if (fieldType === 'logo') {
       if (platform === 'win32') {
         placeholderText = 'C:\\Pfad\\zum\\logo.png';
       } else if (platform === 'linux') {
         placeholderText = '/pfad/zum/logo.png';
       } else {
         placeholderText = '/Pfad/zum/logo.png';
       }
     } else {
       placeholderText = t(`customers.form.placeholders.${fieldType}Path${platformInfo.fieldSuffix}`);
     }

    return (
      <Box 
        key={platform}
        sx={{ 
          display: 'flex', 
          gap: 1.5, 
          alignItems: 'center',
          mb: isMain ? 0 : 1.5,
          p: isMain ? 0 : 0.5
        }}
      >
        {!isMain && (
          <Chip
            icon={platformInfo.icon}
            label={platformInfo.name}
            size="small"
            color={platformInfo.color}
            variant="outlined"
            sx={{ 
              minWidth: '100px',
              px: 1.5,
              py: 0.5
            }}
          />
        )}
        <TextField
          label={isMain ? label || t(labelKey) : ''}
          fullWidth
          value={value}
          onChange={(e) => onChange(fieldName, e.target.value)}
          placeholder={placeholderText}
          size={isMain ? 'medium' : 'small'}
          variant={isMain ? 'outlined' : 'standard'}
        />
        <IconButton 
          onClick={() => onSelectFolder && onSelectFolder(platform, fieldName)}
          size={isMain ? 'medium' : 'small'}
        >
          <Folder />
        </IconButton>
      </Box>
    );
  };

  const currentPlatformInfo = getPlatformInfo(currentPlatform);
  const otherPlatforms = getOtherPlatforms();

  return (
    <Box>
             {/* Aktuelles Betriebssystem - prominent angezeigt */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, p: 1 }}>
          <Chip
            icon={currentPlatformInfo.icon}
            label={`${currentPlatformInfo.name} (${t('common.currentPlatform').toLowerCase()})`}
            color={currentPlatformInfo.color}
            sx={{ 
              fontWeight: 'bold',
              px: 2,
              py: 1
            }}
          />
        </Box>
        {renderPathField(currentPlatform, true)}
      </Box>

      {/* Andere Plattformen - aufklappbar */}
      {otherPlatforms.length > 0 && (
        <Accordion 
          expanded={expanded} 
          onChange={() => setExpanded(!expanded)}
          sx={{ 
            boxShadow: 'none',
            '&:before': { display: 'none' },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMore />}
            sx={{ 
              minHeight: 40,
              '& .MuiAccordionSummary-content': { 
                margin: '8px 0' 
              }
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t('common.otherPlatforms')} ({otherPlatforms.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 1, px: 2 }}>
            <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
              <Typography variant="caption">
                {t('settings.paths.platformInfo')}
              </Typography>
            </Alert>
            {otherPlatforms.map(platform => renderPathField(platform, false))}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}

export default PlatformPathFields; 