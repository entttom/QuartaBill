# QuartaBill

**Professionelle Quartalsabrechnungen für Arbeitsmediziner**

*Entwickelt von Dr. Thomas Entner*

Eine speziell für Arbeitsmediziner entwickelte Desktop-Anwendung zur automatischen Erstellung von Quartalsrechnungen mit PDF-Export und Email-Generierung.

## Features

- ✅ **Kundenverwaltung**: Mehrere Kunden anlegen und verwalten
- ✅ **Automatische Rechnungserstellung**: Batch-Generierung für alle Kunden eines Quartals
- ✅ **PDF-Export**: Professionelle Rechnungen im originalgetreuen Design
- ✅ **Email-Integration**: Automatische .eml-Datei-Generierung mit PDF-Anhang
- ✅ **Plattform-übergreifend**: Windows und Mac Support
- ✅ **Nextcloud-Sync**: Datensynchronisation zwischen Geräten
- ✅ **Steuerberechnung**: Automatischer 90%/10%-Split (20%/0% USt.)

## Installation

### Entwicklungsumgebung

1. **Dependencies installieren**:
   ```bash
   npm install
   ```

2. **Development starten**:
   ```bash
   # Terminal 1: React Development Server
   npm start
   
   # Terminal 2: Electron App
   npm run electron-dev
   ```

### Produktionsversion erstellen

```bash
# Für Windows
npm run dist:win

# Für Mac
npm run dist:mac

# Für beide Plattformen
npm run dist
```

## Verwendung

### 1. Erste Einrichtung

1. **Einstellungen** → **Rechnungsersteller**: Ihre Daten eingeben
2. **Einstellungen** → **Pfade & Dateien**: Logo- und Datenpfade konfigurieren
3. **Kunden**: Erste Kunden anlegen

### 2. Kunden anlegen

- **Name**: Firmenname des Kunden
- **Adresse**: Rechnungsadresse
- **Stundensatz**: Preis pro Stunde in Euro
- **Stunden pro Quartal**: Standardmäßig 6 Stunden
- **Email**: Für automatische Email-Generierung
- **Speicherpfade**: Getrennt für Windows und Mac
- **Email-Template**: Individueller Text für jede Rechnung

### 3. Rechnungen erstellen

1. **Rechnungen erstellen** Tab öffnen
2. **Quartal und Jahr** auswählen
3. **Kunden auswählen** (standardmäßig alle)
4. **Email-Generierung** aktivieren/deaktivieren
5. **PDFs generieren** klicken

### 4. Ergebnis

- **PDF-Dateien**: Werden im konfigurierten Kundenpfad gespeichert
- **EML-Dateien**: Email-Dateien mit PDF-Anhang (falls aktiviert)
- **Dateinamen**: Format `0124EC_Firmenname.pdf` (Quartal+Jahr+Kunde)

## Rechnungsformat

### Rechnungsnummer
Format: `QQYYKK`
- `QQ`: Quartal (01, 02, 03, 04)
- `YY`: Jahr (zweistellig)
- `KK`: Erste zwei Buchstaben des Kundennamens

**Beispiele:**
- Q1/2024 → ecosio GmbH → `0124EC`
- Q4/2023 → Firma XY → `0423FI`

### Rechnungsdatum
- **Q1** (Jan-Mar) → Rechnungsdatum: 1. April
- **Q2** (Apr-Jun) → Rechnungsdatum: 1. Juli
- **Q3** (Jul-Sep) → Rechnungsdatum: 1. Oktober
- **Q4** (Oct-Dez) → Rechnungsdatum: 1. Januar (Folgejahr)

### Steuerberechnung
- **90% der Summe**: 20% Umsatzsteuer
- **10% der Summe**: 0% Umsatzsteuer
- Automatische Berechnung von Zwischensumme, USt. und Gesamtbetrag

## Datensynchronisation

### Nextcloud-Integration
1. JSON-Datei in Nextcloud-Ordner speichern
2. Pfad in **Einstellungen** → **Daten-Synchronisation** eintragen
3. Datei wird beim Programmstart automatisch geladen
4. Änderungen werden sofort gespeichert

### Datenformat
```json
{
  "customers": [...],
  "settings": {
    "issuer": {...},
    "logoPathWindows": "C:\\...",
    "logoPathMac": "/...",
    "dataFilePath": "..."
  }
}
```

## Technische Details

- **Framework**: Electron + React
- **UI**: Material-UI (MUI)
- **PDF-Generierung**: jsPDF
- **Dateiformate**: PDF, EML, JSON
- **Plattformen**: Windows 10+, macOS 10.14+

## Troubleshooting

### PDF-Generierung funktioniert nicht
- Überprüfen Sie die Speicherpfade der Kunden
- Stellen Sie sicher, dass die Ordner existieren

### Logo wird nicht angezeigt
- Überprüfen Sie den Logo-Pfad in den Einstellungen
- Unterstützte Formate: PNG, JPG, JPEG
- Empfohlene Größe: 200x120 Pixel

### Email-Generierung fehlgeschlagen
- Überprüfen Sie die Email-Adresse des Kunden
- EML-Dateien können mit Standard-Email-Programmen geöffnet werden

### Datensynchronisation
- JSON-Datei muss gültig formatiert sein
- Backup vor Änderungen erstellen
- Bei Problemen: Datei löschen → automatische Neuerstellung

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue in diesem Repository. 