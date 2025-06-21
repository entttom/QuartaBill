# QuartaBill

QuartaBill - Professionelle Quartalsabrechnungen für Arbeitsmediziner

![Build Status](https://github.com/YOURUSERNAME/QuartaBill/workflows/Build%20and%20Release/badge.svg)

## 🚀 Entwickelt von Dr. Thomas Entner

Diese Anwendung wurde speziell für Arbeitsmediziner entwickelt, um die quartalsweise Abrechnung ihrer Leistungen zu vereinfachen und zu automatisieren.

## ✨ Features

### 🏢 **Kundenverwaltung**
- **Umfassende Kundendaten**: Name, Adresse, Kontaktdaten, E-Mail
- **Mehrere Leistungspositionen**: Individuelle Services pro Kunde mit verschiedenen Stundensätzen
- **Drag-and-Drop Sortierung**: Einfache Neuanordnung der Leistungspositionen
- **Verschiedene Steuersätze**: 0%, 7%, 19%, 20% pro Position konfigurierbar
- **E-Mail-Templates**: Personalisierte Nachrichten pro Kunde
- **Speicherpfade**: Separate PDF- und EML-Pfade für Windows und Mac

### 📊 **Rechnungserstellung**
- **Batch-Generierung**: Alle Kunden eines Quartals mit einem Klick
- **Anpassbare Rechnungsnummern**: Flexibles Format (z.B. `{QQ}{YY}{KK}` → `0124EC`)
- **Deutsche Steuerberechnung**: Automatischer 90%/10%-Split (20%/0% USt.) oder individuelle Sätze
- **Quartalsweise Datierung**: Automatisch korrekte Rechnungsdaten
- **Logo-Integration**: Firmenbild in Rechnungen (PNG/JPG)

### 🎨 **Professionelle PDF-Ausgabe**
- **Modernes Design**: Sauberes, professionelles Layout
- **Logo-Unterstützung**: Automatisches Laden und Skalieren
- **Responsive Tabellen**: Automatische Anpassung an Inhalt
- **Deutsche Formatierung**: Währung, Datum, Steuersätze
- **Druckoptimiert**: A4-Format, professionelle Schriftarten

### 📧 **E-Mail Integration**
- **Automatische EML-Generierung**: .eml-Dateien mit PDF-Anhang
- **MIME-konforme E-Mails**: RFC-compliant E-Mail-Format
- **Base64-Anhänge**: Sichere PDF-Übertragung
- **Personalisierte Betreffzeilen**: Mit Rechnungsnummer
- **Plattform-übergreifend**: Windows und Mac kompatibel

### ⚙️ **Einstellungen & Konfiguration**
- **Rechnungsersteller-Daten**: Vollständige Firmeninformationen
- **Mehrsprachigkeit**: Deutsch/Englisch (i18next)
- **Dark/Light Mode**: Benutzerfreundliche Themes
- **Datenpfad-Konfiguration**: Flexible Speicherorte
- **Logo-Pfade**: Separate Pfade für verschiedene Systeme
- **Zahlungsbedingungen**: Anpassbare Fristen

### 💾 **Datenverwaltung**
- **Lokale Speicherung**: Alle Daten bleiben auf Ihrem Gerät
- **JSON-basiert**: Einfache, lesbare Datenstruktur
- **Cloud-Sync möglich**: Via Nextcloud, iCloud, Dropbox etc.
- **Backup-freundlich**: Einfache Datensicherung
- **Import/Export**: Datenübertragung zwischen Geräten

### 🎯 **Benutzerfreundlichkeit**
- **Onboarding-System**: Geführte Ersteinrichtung
- **Intuitive Navigation**: Tab-basierte Oberfläche
- **Keyboard-Shortcuts**: Effiziente Bedienung
- **Responsive Design**: Funktioniert auf verschiedenen Bildschirmgrößen
- **Fehlerbehandlung**: Robuste Fehlermeldungen und Fallbacks

### 🔧 **Technische Features**
- **Multi-Platform**: Windows, macOS, Linux
- **Electron-basiert**: Native Desktop-Performance
- **React Frontend**: Moderne, reaktive Benutzeroberfläche
- **Material-UI**: Professionelles Design-System
- **Automatische Updates**: Via GitHub Actions und Releases

## 🔧 Entwicklung

### Voraussetzungen
- Node.js 18 oder höher
- npm

### Installation
```bash
git clone https://github.com/YOURUSERNAME/QuartaBill.git
cd QuartaBill
npm install
```

### Development Server starten
```bash
npm start
```

### Electron App starten
```bash
npm run electron
```

### Builds erstellen
```bash
# Alle Plattformen
npm run dist

# Spezifische Plattformen
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
```

## 🏗️ Automatische Builds

Das Projekt nutzt GitHub Actions für automatische Builds:

- **Push/PR auf main/develop**: Automatische Builds für alle Plattformen
- **Git Tags (v\*)**: Automatische Releases mit Builds für Windows, macOS und Linux
- **Artifacts**: Builds werden 30 Tage lang gespeichert

### Release erstellen
```bash
git tag v1.0.0
git push origin v1.0.0
```

Dies löst automatisch einen Build und Release aus.

## 📦 Downloads

Die neuesten Releases finden Sie unter [Releases](https://github.com/YOURUSERNAME/QuartaBill/releases).

### Verfügbare Formate:
- **Windows**: `.exe` (Installer), `.zip` (Portable)
- **macOS**: `.dmg` (Disk Image)
- **Linux**: `.AppImage`, `.deb`, `.rpm`

## 🛠️ Technischer Stack

- **Frontend**: React 18, Material-UI
- **Desktop**: Electron 25
- **PDF-Generierung**: jsPDF
- **Internationalisierung**: i18next
- **Build**: electron-builder
- **CI/CD**: GitHub Actions

## 📋 Systemanforderungen

- **Windows**: Windows 10 oder höher
- **macOS**: macOS 10.14 oder höher
- **Linux**: Ubuntu 18.04 oder höher (oder äquivalent)

## 🚀 Erste Schritte

### 1. Installation und Start
1. QuartaBill herunterladen und installieren
2. Beim ersten Start wird das Onboarding gestartet

### 2. Grundkonfiguration
1. **Einstellungen** → **Rechnungsersteller**: Ihre Firmendaten eingeben
2. **Einstellungen** → **Pfade & Dateien**: Logo- und Speicherpfade konfigurieren
3. **Einstellungen** → **Rechnungsnummern**: Format anpassen

### 3. Kunden einrichten
1. **Kunden** → **Neuer Kunde**
2. Grunddaten eingeben (Name, Adresse, E-Mail)
3. **Leistungen-Tab**: Services mit Stundensätzen definieren
4. **Pfade-Tab**: Speicherorte für PDFs und E-Mails festlegen

### 4. Erste Rechnungen erstellen
1. **Rechnungen generieren** → Quartal und Jahr wählen
2. Kunden auswählen (alle oder einzelne)
3. **PDF generieren** und optional **E-Mail erstellen** aktivieren
4. **Rechnungen generieren** klicken

## 🔒 Datenschutz

- **Lokale Speicherung**: Alle Daten bleiben auf Ihrem Gerät
- **Keine Cloud-Übertragung**: QuartaBill sendet keine Daten an externe Server
- **Optionale Synchronisation**: Sie können selbst entscheiden, ob Sie Daten über Cloud-Dienste synchronisieren
- **DSGVO-konform**: Designed für deutsche Datenschutzanforderungen

## 🆘 Support & Hilfe

### Häufige Probleme
- **Logo wird nicht angezeigt**: Überprüfen Sie den Dateipfad in den Einstellungen
- **EML-Generierung fehlgeschlagen**: Stellen Sie sicher, dass EML-Pfade konfiguriert sind
- **PDF nicht gespeichert**: Überprüfen Sie Schreibrechte für den Ausgabeordner

### Support erhalten
Bei Fragen oder Problemen erstellen Sie bitte ein [Issue](https://github.com/YOURUSERNAME/QuartaBill/issues).

## 📄 Lizenz

Copyright (c) 2024 Dr. Thomas Entner. Alle Rechte vorbehalten.

## 🙏 Danksagungen

Entwickelt mit modernen Web-Technologien für eine effiziente und professionelle Praxisverwaltung. 