# QuartaBill - Externe Einstellungsdatei & File-Watching

## Übersicht der neuen Funktionalität

QuartaBill wurde erweitert um eine flexiblere Konfigurationsverwaltung mit externer Einstellungsdatei und automatischer Überwachung auf Änderungen.

## Funktionalitäten

### 1. **Externe Einstellungsdatei**
- Die Haupteinstellungsdatei (mit Kundendaten, etc.) kann an einem beliebigen Ort gespeichert werden
- Im Userverzeichnis wird nur der Pfad zur Einstellungsdatei gespeichert (`~/quartabill-config.json`)
- Ideal für Cloud-Synchronisation (Dropbox, OneDrive, Google Drive, etc.)

### 2. **Initialer Setup beim Programmstart**
- Beim ersten Start wird nach dem Speicherort der Einstellungsdatei gefragt
- Benutzerfreundlicher Setup-Dialog mit Erklärungen
- Automatische Erstellung der Standarddaten falls Datei nicht existiert

### 3. **File-Watching & Automatische Updates**
- Die Einstellungsdatei wird kontinuierlich auf Änderungen überwacht
- Bei externen Änderungen erscheint eine Warnung mit Nachfrage zum Neuladen
- Verhindert Datenverlust durch gleichzeitige Bearbeitung

### 4. **Konfigurierbare Einstellungen**
- Der Pfad zur Einstellungsdatei kann in den Einstellungen geändert werden
- Sofortige Aktualisierung beim Wechsel zu einer anderen Datei
- Bestätigungsdialoge für sicherheitskritische Aktionen

## Technische Implementierung

### Backend (Electron Main Process)
- **Config-Pfad Management**: Speichert nur den Pfad zur externen Datei
- **File-Watching**: Verwendet `chokidar` für plattformübergreifende Dateiüberwachung
- **IPC-Handler**: Neue APIs für Config-Verwaltung

### Frontend (React)
- **ConfigSetupDialog**: Benutzerfreundlicher Setup-Dialog
- **Erweiterte SettingsPanel**: Konfiguration der Einstellungsdatei
- **Automatisches File-Watching**: Integration in App-Lifecycle

### DataService
- **Flexible Datenpfade**: Unterstützt sowohl lokale als auch externe Konfiguration
- **Setup-Management**: Automatischer initialer Setup-Prozess
- **Event-Handling**: Callback-System für Dateiänderungen

## Dateistruktur

```
~/quartabill-config.json          # Enthält nur den Pfad zur Einstellungsdatei
<beliebiger-pfad>/einstellungen.json   # Die eigentliche Einstellungsdatei mit allen Daten
```

### Config-Datei Beispiel (`~/quartabill-config.json`):
```json
{
  "dataFilePath": "/pfad/zur/einstellungsdatei.json"
}
```

### Einstellungsdatei Beispiel:
```json
{
  "customers": [...],
  "settings": {
    "issuer": {...},
    "logoPathWindows": "",
    "logoPathMac": "",
    "dataFilePath": "",
    "hasSeenOnboarding": true,
    "invoiceNumberFormat": "{QQ}{YY}{KK}",
    "language": "de",
    "darkMode": false
  }
}
```

## Benutzerhandbuch

### Erster Start
1. QuartaBill starten
2. Setup-Dialog erscheint automatisch
3. "Speicherort wählen" klicken
4. Gewünschten Pfad für die Einstellungsdatei auswählen
5. Datei wird automatisch erstellt und Überwachung gestartet

### Einstellungsdatei ändern
1. In QuartaBill zu "Einstellungen" wechseln
2. Im Bereich "Einstellungsdatei" auf das Ordner-Icon klicken
3. Neue Einstellungsdatei auswählen
4. Bestätigung mit Warnung
5. Daten werden automatisch aus neuer Datei geladen

### Bei externen Änderungen
1. Warndialog erscheint automatisch
2. "OK" klicken um Änderungen zu laden
3. "Abbrechen" um bei aktuellen Daten zu bleiben

## Vorteile

✅ **Cloud-Synchronisation**: Einstellungen zwischen Geräten synchronisieren  
✅ **Flexibilität**: Beliebiger Speicherort für Einstellungsdatei  
✅ **Datensicherheit**: Automatische Warnungen bei Konflikten  
✅ **Benutzerfreundlichkeit**: Einfacher Setup-Prozess  
✅ **Kompatibilität**: Alte Installation bleiben funktionsfähig (Legacy-Modus)  

## Migration von alten Versionen

Alte QuartaBill-Installationen werden automatisch kompatibel gehalten. Beim ersten Start nach dem Update:

1. Setup-Dialog erscheint
2. Einstellungsdatei-Pfad auswählen
3. Bestehende Daten werden migriert
4. File-Watching wird aktiviert

Die alte `dataFilePath`-Einstellung bleibt zur Kompatibilität erhalten, wird aber als "Legacy" markiert.

## Fehlerbehebung

### Setup-Dialog erscheint immer wieder
- Überprüfen Sie, ob die Datei `~/quartabill-config.json` korrekt angelegt wurde
- Prüfen Sie Schreibrechte im Home-Verzeichnis

### File-Watching funktioniert nicht
- Stellen Sie sicher, dass die Einstellungsdatei existiert
- Überprüfen Sie Leserechte für die Einstellungsdatei
- Bei Netzlaufwerken kann das Watching verzögert reagieren

### Daten werden nicht gespeichert
- Überprüfen Sie Schreibrechte für die Einstellungsdatei
- Stellen Sie sicher, dass der Pfad zur Einstellungsdatei korrekt ist
- Bei Cloud-Ordnern: Warten Sie auf Synchronisation

## Technische Details

### Neue Dependencies
- `chokidar ^3.5.3`: Cross-platform file watching

### Neue IPC-Endpoints
- `get-config-path`: Lädt Pfad zur Einstellungsdatei
- `set-config-path`: Speichert Pfad zur Einstellungsdatei
- `select-config-path`: Öffnet Dialog zur Pfad-Auswahl
- `file-exists`: Prüft Existenz einer Datei
- `start-file-watching`: Startet Dateiüberwachung
- `stop-file-watching`: Stoppt Dateiüberwachung

### Events
- `file-changed`: Wird ausgelöst bei Dateiänderungen 