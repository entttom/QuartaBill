# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

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