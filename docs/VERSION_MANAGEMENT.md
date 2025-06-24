# QuartaBill Versionsverwaltung

## Übersicht

QuartaBill verwendet eine zentrale Versionsverwaltung, die automatisch die Version aus der `package.json` liest und in der gesamten Anwendung verwendet.

## Zentrale Versionsverwaltung

### Dateien
- **`package.json`**: Zentrale Versionsdefinition
- **`src/utils/version.js`**: Version-Utilities für React-Components
- **`src/i18n/index.js`**: Übersetzungen mit Versionsvariablen

### Automatische Version-Updates

Die Version wird automatisch an folgenden Stellen angezeigt:
- **Über QuartaBill** Dialog in den Einstellungen
- Beide Sprachen (Deutsch/Englisch) werden unterstützt
- Format: `Version X.Y.Z - Beschreibung`

## Version aktualisieren

### Manuell (Entwicklung)

```bash
# Version in package.json aktualisieren
npm version 1.3.4 --no-git-tag-version

# Änderungen committen
git add package.json package-lock.json
git commit -m "🔖 Update version to 1.3.4"
git push origin main

# Tag erstellen
git tag v1.3.4
git push origin v1.3.4
```

### Automatisch (GitHub Actions)

1. **Gehe zu GitHub Repository → Actions**
2. **Wähle "Update Version" Workflow**
3. **Klicke "Run workflow"**
4. **Gib neue Versionsnummer ein** (z.B., `1.3.4`)
5. **Klicke "Run workflow"**

Der Workflow führt automatisch aus:
- ✅ Aktualisiert `package.json`
- ✅ Erstellt Commit mit Versionsnummer
- ✅ Erstellt Git-Tag
- ✅ Erstellt GitHub Release

## Versionsnummern-Schema

QuartaBill verwendet [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Große Änderungen, Breaking Changes
- **MINOR**: Neue Features, rückwärtskompatibel
- **PATCH**: Bugfixes, kleinere Verbesserungen

### Beispiele
- `1.3.2` → `1.3.3`: Bugfix
- `1.3.2` → `1.4.0`: Neues Feature
- `1.3.2` → `2.0.0`: Breaking Change

## Release-Prozess

### 1. Version aktualisieren
```bash
# Verwende GitHub Actions oder manuell:
npm version 1.4.0 --no-git-tag-version
```

### 2. Build erstellen
```bash
npm run build
npm run dist
```

### 3. Release erstellen
- Automatisch über GitHub Actions
- Oder manuell auf GitHub Releases Seite

### 4. Distribution
- Windows: `.exe` Installer und Portable
- macOS: `.dmg` Universal Binary
- Linux: `.AppImage`, `.deb`, `.rpm`

## Entwickler-Hinweise

### Version in Code verwenden

```javascript
// Version importieren
import { getVersion, getFullVersionString } from '../utils/version';

// Einfache Version
const version = getVersion(); // "1.3.2"

// Vollständiger Text mit Beschreibung
const fullVersion = getFullVersionString('de'); // "Version 1.3.2 - Für eine effiziente..."
```

### Neue Versionsanzeige hinzufügen

```javascript
// In React Component
import { useTranslation } from 'react-i18next';
import { getVersion } from '../utils/version';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <Typography>
      {t('myKey', { version: getVersion() })}
    </Typography>
  );
}
```

### i18n-Übersetzung mit Version

```javascript
// In src/i18n/index.js
{
  "myKey": "Aktuelle Version: {{version}}"
}
```

## Troubleshooting

### Version wird nicht aktualisiert
1. **Cache leeren**: `npm start` oder Browser-Cache löschen
2. **Build neu erstellen**: `npm run build`
3. **Dependencies updaten**: `npm install`

### GitHub Actions schlägt fehl
1. **Berechtigungen prüfen**: Repository Settings → Actions → General
2. **Token prüfen**: `GITHUB_TOKEN` muss verfügbar sein
3. **Versionsnummer-Format**: Muss `X.Y.Z` Format haben

### Version stimmt nicht überein
1. **package.json prüfen**: Korrekte Version eingetragen?
2. **Browser neu laden**: Hard-Refresh (Ctrl+F5)
3. **Build neu erstellen**: `npm run build`

## Automatisierung

### GitHub Actions Workflows

1. **`.github/workflows/version-update.yml`**:
   - Manueller Trigger über GitHub Interface
   - Aktualisiert Version und erstellt Release

2. **`.github/workflows/release.yml`**:
   - Vollständiger Release-Prozess
   - Baut alle Plattformen
   - Erstellt Distribution-Files

### Weitere Automatisierung

- **Auto-Updates**: Electron Auto-Updater für automatische App-Updates
- **Homebrew**: Automatische Updates für macOS Package Manager
- **Chocolatey**: Automatische Updates für Windows Package Manager
- **Snap/Flatpak**: Linux Distribution-Updates

## Best Practices

1. **Regelmäßige Updates**: Mindestens bei jedem Release
2. **Semantic Versioning**: Konsistente Versionsnummer-Vergabe
3. **Changelog**: Dokumentation aller Änderungen
4. **Testing**: Version in allen UI-Bereichen prüfen
5. **Backups**: Vor großen Versionssprüngen

---

**Letzte Aktualisierung**: Nach Implementierung der zentralen Versionsverwaltung 