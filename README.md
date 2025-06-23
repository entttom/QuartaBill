# QuartaBill

QuartaBill - Professionelle Quartalsabrechnungen für Arbeitsmediziner

![Build Status](https://github.com/entttom/QuartaBill/workflows/Build%20and%20Release/badge.svg)
![Version](https://img.shields.io/github/v/release/entttom/QuartaBill)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)

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
- **🍎 macOS Notarisierung**: Vollständig signiert und notarisiert für macOS Gatekeeper
- **🔒 Code Signing**: Signierte Binaries für alle Plattformen
- **Deep Signing**: Alle Electron Framework-Komponenten signiert

## 🔧 Entwicklung

### Voraussetzungen
- Node.js 18 oder höher
- npm

### Installation
```bash
git clone https://github.com/entttom/QuartaBill.git
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

## 🏗️ Automatische Builds & Releases

Das Projekt nutzt GitHub Actions für vollständig automatisierte CI/CD:

### 🚀 **Build Pipeline**
- **Push/PR auf main/develop**: Automatische Builds für alle Plattformen
- **Git Tags (v\*)**: Automatische Releases mit signierten Builds
- **Parallel Builds**: Windows, macOS und Linux gleichzeitig
- **Artifacts**: Builds werden 30 Tage lang gespeichert

### 🍎 **macOS Code Signing & Notarisierung**
- **Developer ID Application**: Vollständig signierte .app Bundles
- **Deep Code Signing**: Alle Electron Framework-Binaries signiert
- **Apple Notarisierung**: Automatische Notarisierung über Apple Developer Portal
- **Gatekeeper-kompatibel**: Keine Sicherheitswarnungen bei Installation

### 🔒 **Windows Code Signing** (geplant)
- **Authenticode**: Signierte .exe Dateien
- **SmartScreen-kompatibel**: Vertrauenswürdige Downloads

### Release erstellen
```bash
git tag v1.3.0
git push origin v1.3.0
```

Dies löst automatisch einen Build, Code Signing und Release aus.

## 📦 Downloads

Die neuesten Releases finden Sie unter [**GitHub Releases**](https://github.com/entttom/QuartaBill/releases).

### 🎯 **Aktuelle Version: v1.3.0**

### 🆕 **Neue Features in v1.3.0:**
- **🔄 Auto-Update System**: Automatische Benachrichtigungen über neue Versionen
- **💾 Backup & Restore**: Vollständiges Backup-Management mit automatischen Backups
- **📊 CSV Export**: Export aller Kundendaten in Excel-kompatible CSV-Dateien
- **🎨 Performance-Optimierungen**: Verbesserte PDF-Generierung und App-Performance
- **⌨️ Keyboard-Shortcuts**: Neue Tastenkürzel für effiziente Bedienung
- **🔍 Erweiterte Validierung**: Robustere Eingabevalidierung und Fehlerbehandlung

### Verfügbare Formate:
- **Windows**: 
  - `QuartaBill Setup 1.3.0.exe` (Installer)
  - `QuartaBill 1.3.0.exe` (Portable)
- **macOS**: 
  - `QuartaBill-1.3.0.dmg` (Intel Macs) ✅ **Notarisiert**
  - `QuartaBill-1.3.0-arm64.dmg` (Apple Silicon) ✅ **Notarisiert**
- **Linux**: 
  - `QuartaBill-1.3.0.AppImage` (Universal)
  - `quartabill_1.3.0_amd64.deb` (Debian/Ubuntu)
  - `quartabill-1.3.0.x86_64.rpm` (Red Hat/Fedora)

### 🔒 **Sicherheit**
- ✅ **macOS**: Vollständig signiert und von Apple notarisiert
- ⏳ **Windows**: Code Signing geplant
- ✅ **Linux**: Checksums verfügbar

## 🛠️ Technischer Stack

- **Frontend**: React 18, Material-UI
- **Desktop**: Electron 25
- **PDF-Generierung**: jsPDF
- **Internationalisierung**: i18next
- **Build**: electron-builder mit afterSign hooks
- **CI/CD**: GitHub Actions
- **Code Signing**: 
  - macOS: Apple Developer ID Application
  - Deep Signing aller Electron Framework-Komponenten
- **Notarisierung**: @electron/notarize v2.5.0

## 📋 Systemanforderungen

- **Windows**: Windows 10 oder höher (x64)
- **macOS**: macOS 10.14 oder höher (Intel & Apple Silicon)
- **Linux**: Ubuntu 18.04 oder höher (oder äquivalent, x64)

## 🚀 Erste Schritte

### 1. Installation und Start
1. **QuartaBill herunterladen** von [GitHub Releases](https://github.com/entttom/QuartaBill/releases)
2. **Installation:**
   - **macOS**: `.dmg` mounten und App in Programme-Ordner ziehen
   - **Windows**: `.exe` Installer ausführen oder portable Version entpacken
   - **Linux**: `.AppImage` ausführbar machen oder `.deb`/`.rpm` installieren
3. Beim ersten Start wird das Onboarding gestartet

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

## 🔒 Datenschutz & Sicherheit

- **✅ Lokale Speicherung**: Alle Daten bleiben auf Ihrem Gerät
- **✅ Keine Cloud-Übertragung**: QuartaBill sendet keine Daten an externe Server
- **✅ Optionale Synchronisation**: Sie können selbst entscheiden, ob Sie Daten über Cloud-Dienste synchronisieren
- **✅ DSGVO-konform**: Designed für deutsche Datenschutzanforderungen
- **✅ Code Signing**: Signierte Anwendung für Sicherheit und Vertrauen
- **✅ macOS Notarisierung**: Von Apple überprüft und freigegeben

## 🆘 Support & Hilfe

### Häufige Probleme
- **Logo wird nicht angezeigt**: Überprüfen Sie den Dateipfad in den Einstellungen
- **EML-Generierung fehlgeschlagen**: Stellen Sie sicher, dass EML-Pfade konfiguriert sind
- **PDF nicht gespeichert**: Überprüfen Sie Schreibrechte für den Ausgabeordner
- **macOS Sicherheitswarnung**: Bei älteren Versionen ohne Notarisierung - aktualisieren Sie auf v1.3.0+
- **Backup-Probleme**: Prüfen Sie Schreibrechte im Backup-Verzeichnis
- **CSV-Export Encoding**: Bei Problemen mit Umlauten verwenden Sie UTF-8 kompatible Programme

### Support erhalten
Bei Fragen oder Problemen erstellen Sie bitte ein [**Issue**](https://github.com/entttom/QuartaBill/issues).

### 📈 **Roadmap**
- [ ] Windows Code Signing
- [x] ~~Automatische Update-Benachrichtigungen~~ ✅ **v1.3.0**
- [x] ~~Export/Import-Funktionen~~ ✅ **v1.3.0**
- [x] ~~Backup & Restore System~~ ✅ **v1.3.0**
- [ ] Erweiterte Berichterstellung & Dashboard
- [ ] Plugin-System für Erweiterungen
- [ ] Cloud-Synchronisation (optional)
- [ ] Mobile Companion App

## 📄 Lizenz

Copyright (c) 2024 Dr. Thomas Entner. Alle Rechte vorbehalten.

## 🙏 Danksagungen

Entwickelt mit modernen Web-Technologien für eine effiziente und professionelle Praxisverwaltung. 