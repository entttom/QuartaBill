// Import der package.json für Versionsinformationen
import packageJson from '../../package.json';

/**
 * Zentrale Versionsverwaltung für QuartaBill
 * Liest die Version automatisch aus der package.json
 */
export const APP_VERSION = packageJson.version;
export const APP_NAME = packageJson.name;
export const APP_DESCRIPTION = packageJson.description;
export const APP_AUTHOR = packageJson.author;

/**
 * Hilfsfunktionen für Versionsinformationen
 */
export const getVersion = () => APP_VERSION;
export const getFullVersionString = (language = 'de') => {
  const versionText = language === 'de' 
    ? `Version ${APP_VERSION} - Für eine effiziente und professionelle Praxisverwaltung`
    : `Version ${APP_VERSION} - For efficient and professional practice management`;
  return versionText;
};

export const getAppInfo = () => ({
  name: APP_NAME,
  version: APP_VERSION,
  description: APP_DESCRIPTION,
  author: APP_AUTHOR
});

export default {
  APP_VERSION,
  APP_NAME,
  APP_DESCRIPTION,
  APP_AUTHOR,
  getVersion,
  getFullVersionString,
  getAppInfo
}; 