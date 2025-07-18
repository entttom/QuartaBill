# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [2.0.1] - 2025-01-27

### 🔧 Verbessert
- **Hardcodierte App-Versionen entfernt**: UpdateChecker und BackupService verwenden jetzt zentrale Versionsverwaltung
- **UI-Verbesserungen**: Mehr Platz um Betriebssystem-Badges für bessere Optik und Benutzerfreundlichkeit
- **Konsistente Versionsverwaltung**: Einheitliche Verwendung von APP_VERSION aus src/utils/version.js

### 🐛 Behoben
- **Update-Checker**: Korrekte Versionsvergleiche durch dynamische Version statt hardcodierter '1.3.1'
- **Backup-Service**: Backup-Dateien enthalten jetzt korrekte App-Version statt hardcodierter '1.3.0'
- **Kommentare**: Alle Verweise auf alte Versionen auf 2.0.0 aktualisiert

### 🎨 UI/UX
- **Betriebssystem-Badges**: Erhöhtes Padding und bessere Abstände für professionelleres Aussehen
- **Visuelle Hierarchie**: Klarere Unterscheidung zwischen aktuellem und anderen Betriebssystemen
- **Luftigere Darstellung**: Verbesserte Abstände in Accordion-Bereichen

---

## [2.0.0] - 2025-01-27

### 🎉 Major Release
- **Vollständige Überarbeitung**: Komplette Neustrukturierung der Anwendung für bessere Wartbarkeit und Performance
- **Moderne Architektur**: Umstellung auf React 18 und aktuelle Electron-Version
- **Verbesserte Benutzerfreundlichkeit**: Überarbeitete UI/UX mit Material-UI v5
- **Erweiterte Funktionalität**: Neue Features für professionelle Rechnungserstellung

### ✨ Neu hinzugefügt
- **🌍 Mehrsprachigkeit**: Vollständige deutsche und englische Lokalisierung
- **📱 Responsive Design**: Optimierte Benutzeroberfläche für verschiedene Bildschirmgrößen
- **🔧 Erweiterte Einstellungen**: Umfassende Konfigurationsmöglichkeiten
- **📊 Verbesserte Datenverwaltung**: Robustere Speicherung und Backup-Funktionen
- **🎨 Moderne UI**: Material-UI v5 Design-System für professionelles Aussehen

### 🔧 Verbessert
- **Performance**: Deutlich verbesserte Ladezeiten und Reaktionsgeschwindigkeit
- **Stabilität**: Robustere Fehlerbehandlung und Datenverwaltung
- **Code-Qualität**: Saubere, wartbare Codebase mit modernen Best Practices
- **Dokumentation**: Umfassende Dokumentation und Hilfetexte

### 🐛 Behoben
- **Alle bekannten Bugs**: Behebung aller gemeldeten Probleme aus vorherigen Versionen
- **Kompatibilität**: Verbesserte Kompatibilität mit verschiedenen Betriebssystemen
- **Sicherheit**: Aktualisierte Abhängigkeiten und Sicherheitsverbesserungen

---

## [1.7.7] - 2025-01-02

### 🐛 Behoben
- **EML-Platzhalter-Fehler**: Kritischer Bugfix für nicht funktionierende Platzhalter in E-Mail-Vorlagen
- **Variable-Ersetzung**: E-Mail-Inhalt wird jetzt korrekt mit Platzhaltern verarbeitet (`[Quartal]`, `[Jahr]`, `[Kunde]`, `[Rechnungsnummer]`)
- **Konsistenz**: E-Mail-Betreff und E-Mail-Inhalt verwenden jetzt die gleiche Platzhalter-Verarbeitung

### 🔧 Technische Verbesserungen
- **EmailService**: Erweiterte `generateEmail()` Methode um korrekte Body-Verarbeitung
- **Platzhalter-Engine**: Vereinheitlichte Variable-Ersetzung für alle E-Mail-Komponenten

---

## [1.7.6] - 2025-01-02

### 🔧 Verbessert
- **90/10 Steuersatz-Darstellung**: Der gemischte Steuersatz (90%@20% + 10%@0%) wird nun in der PDF-Rechnung als zwei separate Zeilen angezeigt:
  - "STEUERSATZ von 20%: [Betrag von 90% der Summe]"
  - "STEUERSATZ von 0%: [Betrag von 10% der Summe]"
- **Berechnungsgrundlage**: Nach dem Doppelpunkt wird die Berechnungsgrundlage angezeigt (nicht der Steuerbetrag)
- **Benutzerfreundlichkeit**: Klarere Aufschlüsselung der Steuerberechnung bei gemischten Steuersätzen

---

## [1.7.5] - 2025-01-02

### 🐛 Kritischer Bugfix
- **Race Condition behoben**: Lösung des schwerwiegenden Problems beim Laden von Einstellungsdateien
- **Datenverlust verhindert**: Automatisches Speichern wird jetzt pausiert während neue Daten geladen werden
- **Dateisynchronisation**: Keine Überschreibung mehr von extern geladenen Einstellungsdateien
- **Backup-Wiederherstellung**: BackupService verwendet jetzt korrekt externe Einstellungsdateien statt localStorage
- **Cloud-Sync Kompatibilität**: Verbesserte Stabilität bei Cloud-synchronisierten Einstellungsdateien (Dropbox, OneDrive, iCloud)

### 🔧 Technische Verbesserungen
- **App-State Management**: Neues `isLoadingNewData` Flag verhindert Race Conditions
- **File-Watching**: Robustere Überwachung von Dateiänderungen
- **Error Handling**: Bessere Fehlerbehandlung bei Dateisynchronisation

---

## [1.4.0] - 2024-12-23

### ✨ Neu hinzugefügt
- **🐧 Linux-Support**: Vollständige Unterstützung für Linux-Pfade (Logo, PDF, EML)
- **🎯 Intelligente Platform-UI**: Neue PlatformPathFields-Komponente zeigt nur relevante Plattform prominent an
- **📱 Smart Platform Detection**: Automatische Erkennung des aktuellen Betriebssystems
- **🔄 Cross-Platform Compatibility**: Alle Pfad-Einstellungen jetzt für Windows, macOS und Linux
- **🌍 Erweiterte Mehrsprachigkeit**: Vollständig bilinguale Unterstützung für alle neuen Features

### 🔧 Verbessert
- **UI/UX**: Aufklappbare Akkordions reduzieren Interface-Komplexität
- **CustomerManager**: Neue intelligente Pfad-Verwaltung für PDF/EML-Speicherorte
- **SettingsPanel**: Verbesserte Logo-Pfad-Konfiguration mit Platform-Chips
- **Benutzerfreundlichkeit**: Plattform-Icons (Windows, macOS, Linux) für bessere Orientierung
- **Code-Architektur**: Wiederverwendbare PlatformPathFields-Komponente

### 🛠️ Technische Verbesserungen
- **Backend-Services**: PDFService, EmailService und DataService unterstützen Linux
- **Electron-Integration**: Erweiterte Plattform-Erkennung und Pfad-Handling
- **Konsistente API**: Einheitliche Pfad-Verwaltung across alle Plattformen
- **Future-Proof**: Einfach erweiterbar für weitere Plattformen

---

## [1.3.2] - 2024-12-23

### 🔧 Verbessert
- **E-Mail-Variablen**: Vereinheitlichung der Variable-Syntax - alle E-Mail- und Leistungsfelder verwenden jetzt einheitlich eckige Klammern `[Variable]`
- **Benutzerfreundlichkeit**: Neue aufklappbare Hilfe für E-Mail-Variablen in der Kundenverwaltung
- **Konsistenz**: Einheitliche Verwendung von `[Quartal]`, `[Jahr]`, `[Kunde]`, `[Rechnungsnummer]` in allen Bereichen
- **Dokumentation**: Verbesserte In-App-Hilfe mit Beispielen für Variable-Nutzung

---

## [1.3.1] - 2024-12-23

### 🐛 Behoben
- **macOS Code Signing**: Korrektur der Zertifikat-Konfiguration für Gatekeeper-Kompatibilität
- **Sicherheitswarnungen**: Entfernung von macOS-Warnungen bei App-Installation
- **Distribution**: Verwendung des korrekten "Developer ID Application" Zertifikats

---

## [1.3.0] - 2024-12-23

### ✨ Neu hinzugefügt
- **Auto-Update Funktionalität**: Automatische Benachrichtigungen über neue Versionen
- **Erweiterte Export-Optionen**: CSV-Export für Rechnungsdaten
- **Backup & Restore**: Automatische Datensicherung und Wiederherstellung
- **Performance-Verbesserungen**: Optimierte PDF-Generierung
- **Erweiterte Validierung**: Bessere Eingabevalidierung für Kundendaten
- **Tastenkürzel**: Neue Keyboard-Shortcuts für häufige Aktionen
- **Druckvorschau**: Live-Vorschau für Rechnungen vor der PDF-Generierung

### 🔧 Verbessert
- **UI/UX**: Modernisierte Benutzeroberfläche mit verbesserter Navigation
- **Fehlerbehandlung**: Robustere Fehlerbehandlung und bessere Fehlermeldungen
- **Speicher-Optimierung**: Reduzierter Speicherverbrauch bei großen Datenmengen
- **Ladezeiten**: Verbesserte Performance beim App-Start

### 🐛 Behoben
- **PDF-Generierung**: Zuverlässigere PDF-Erstellung bei umfangreichen Rechnungen
- **E-Mail-Export**: Stabilere EML-Datei-Generierung
- **Datenspeicherung**: Korrigierte Speicherung bei speziellen Zeichen

---

## [1.2.12] - 2024-06-23

### ✨ Neu hinzugefügt
- **🍎 macOS Notarisierung**: Vollständige Apple Developer ID Signierung und Notarisierung
- **🔒 Deep Code Signing**: Alle Electron Framework-Komponenten werden signiert
- **📱 Apple Silicon Support**: Native Unterstützung für M1/M2/M3 Macs
- **🚀 Verbesserte CI/CD**: Automatisierte GitHub Actions Pipeline

### 🔧 Verbessert
- **Sicherheit**: Gatekeeper-kompatible macOS Installation ohne Warnungen
- **Distribution**: Signierte Binaries für alle Plattformen
- **Node.js Kompatibilität**: Fixes für Node.js 18 und CommonJS Module

### 🐛 Behoben
- **macOS Installation**: Entfernung von Sicherheitswarnungen
- **Electron Framework**: Alle Binaries werden korrekt signiert
- **Build-Pipeline**: Stabilere automatische Builds

---

## [1.2.11] - 2024-06-22

### ✨ Neu hinzugefügt
- **AfterSign Hook**: Implementierung für umfassendes Binary-Signing
- **macOS Entitlements**: Minimale, aber notwendige Berechtigungen

### 🔧 Verbessert
- **Code Signing**: Rekursive Signierung aller Framework-Komponenten
- **Build-Prozess**: Optimierte electron-builder Konfiguration

---

## [1.2.10] - 2024-06-21

### 🐛 Behoben
- **Notarisierung**: Apple Notarization Logs Analyse und Fehlerbehebung
- **Bundle Identifier**: Korrekte Bundle-ID für externe Distribution

---

## [1.2.9] - 2024-06-20

### ✨ Neu hinzugefügt
- **Apple Developer Integration**: Erste Implementation der macOS Notarisierung
- **Credential Management**: Sichere Verwaltung von Apple Developer Credentials

### 🔧 Verbessert
- **Build-Konfiguration**: Erweiterte macOS Build-Einstellungen

---

## [1.2.8] - 2024-06-19

### 🔧 Verbessert
- **Testing**: Temporäre Deaktivierung der Notarisierung für Tests
- **Debugging**: Erweiterte Logs für Build-Prozess

---

## [1.2.7] - 2024-06-18

### ✨ Neu hinzugefügt
- **Erste Notarisierung**: Initiale macOS Notarization Implementation
- **Team ID Integration**: Apple Developer Team ID Konfiguration

### 🐛 Behoben
- **JSON Parse Errors**: Fehlerbehebung bei Environment Variables

---

## [1.2.6] - 2024-06-17

### ✨ Neu hinzugefügt
- **Erster erfolgreicher Release**: Funktionsfähige Multi-Platform Distribution
- **GitHub Actions**: Vollständige CI/CD Pipeline für alle Plattformen

---

## [1.2.0] - 2024-06-15

### ✨ Neu hinzugefügt
- **🏢 Kundenverwaltung**: Umfassende Verwaltung von Kundendaten und Leistungen
- **📊 Rechnungserstellung**: Batch-Generierung von Quartalsabrechnungen
- **🎨 PDF-Ausgabe**: Professionelle PDF-Rechnungen mit Logo-Integration
- **📧 E-Mail Integration**: Automatische EML-Generierung mit PDF-Anhang
- **⚙️ Einstellungen**: Umfassende Konfigurationsmöglichkeiten
- **💾 Datenverwaltung**: Lokale JSON-basierte Datenspeicherung
- **🎯 Onboarding**: Geführte Ersteinrichtung
- **🌐 Mehrsprachigkeit**: Deutsch/Englisch Unterstützung
- **🔧 Multi-Platform**: Windows, macOS und Linux Support

### 🛠️ Technischer Stack
- **Frontend**: React 18, Material-UI
- **Desktop**: Electron 25
- **PDF**: jsPDF
- **i18n**: i18next
- **Build**: electron-builder

---

## [Unreleased]

### Geplante Features
- [ ] **Windows Code Signing**: Authenticode Signierung für Windows
- [ ] **Plugin-System**: Erweiterbare Architektur
- [ ] **Erweiterte Berichterstellung**: Dashboard und Analytics
- [ ] **Cloud-Synchronisation**: Optionale Cloud-Integration
- [ ] **Mobile App**: React Native Companion App

---

**Legende:**
- ✨ Neu hinzugefügt
- 🔧 Verbessert  
- 🐛 Behoben
- 🗑️ Entfernt
- ⚠️ Deprecated
- 🔒 Sicherheit 