# macOS App-Notarisierung für QuartaBill

Diese Anleitung erklärt, wie du QuartaBill für macOS notarisierst, damit die App problemlos auf allen Mac-Systemen läuft.

## 🎯 Was ist Notarisierung?

Apple's Notarisierung ist ein Sicherheitsprozess, der sicherstellt, dass deine App keine bekannte Malware enthält. Ohne Notarisierung erhalten Benutzer Warnmeldungen beim Öffnen der App.

## 📋 Voraussetzungen

- ✅ Apple Developer Account (bereits vorhanden)
- ✅ Xcode Command Line Tools
- ✅ GitHub Repository mit Actions

## 🔧 Schritt-für-Schritt-Anleitung

### 1. Apple Developer Zertifikat erstellen

1. Gehe zu [Apple Developer Portal](https://developer.apple.com/account/resources/certificates/list)
2. Klicke auf das "+" Symbol
3. Wähle **"Developer ID Application"** (für Distribution außerhalb des App Stores)
4. Folge den Anweisungen zur Zertifikatserstellung
5. Lade das Zertifikat herunter und installiere es im macOS Keychain

### 2. App-spezifisches Passwort erstellen

1. Gehe zu [appleid.apple.com](https://appleid.apple.com/account/manage)
2. Melde dich mit deiner Apple ID an
3. Gehe zu "Anmelden und Sicherheit" → "App-spezifische Passwörter"
4. Erstelle ein neues Passwort mit dem Namen "QuartaBill Notarization"
5. **Wichtig**: Notiere dir das Passwort sofort!

### 3. P12-Zertifikat exportieren

1. Öffne "Schlüsselbundverwaltung" (Keychain Access)
2. Finde dein "Developer ID Application" Zertifikat
3. Rechtsklick → "Exportieren"
4. Speichere als `.p12` Datei mit einem starken Passwort
5. Konvertiere zu Base64:
   ```bash
   base64 -i /pfad/zu/deinem/zertifikat.p12 | pbcopy
   ```

### 4. Team ID finden

1. Gehe zu [Apple Developer Portal](https://developer.apple.com/account)
2. Deine Team ID findest du oben rechts (10-stelliger Code)

### 5. GitHub Secrets konfigurieren

Gehe zu deinem Repository → Settings → Secrets and variables → Actions

Füge folgende Secrets hinzu:

| Secret Name | Beschreibung | Beispiel |
|-------------|--------------|----------|
| `APPLE_ID` | Deine Apple ID E-Mail | `deine@email.com` |
| `APPLE_ID_PASSWORD` | App-spezifisches Passwort | `abcd-efgh-ijkl-mnop` |
| `APPLE_TEAM_ID` | Deine Apple Developer Team ID | `ABCD123456` |
| `CSC_LINK` | Base64-kodiertes P12-Zertifikat | `MIIKsAIBAzCCCm...` |
| `CSC_KEY_PASSWORD` | Passwort für P12-Zertifikat | `dein-starkes-passwort` |

### 6. Release erstellen

Nach dem Setup der Secrets:

1. Erstelle einen neuen Git-Tag:
   ```bash
   git tag v1.2.1
   git push origin v1.2.1
   ```

2. GitHub Actions wird automatisch:
   - Die App builden
   - Code signieren
   - Bei Apple notarisieren
   - Fertiges DMG erstellen

## 🔍 Troubleshooting

### Häufige Probleme

**"No identity found"**
- Überprüfe, ob das P12-Zertifikat korrekt als Base64 kodiert ist
- Stelle sicher, dass das CSC_KEY_PASSWORD korrekt ist

**"Notarization failed"**
- Überprüfe Apple ID und App-spezifisches Passwort
- Stelle sicher, dass die Team ID korrekt ist

**"Timeout during notarization"**
- Apple's Notarisierungsdienst kann manchmal langsam sein
- Der Build-Timeout wurde bereits auf 30 Minuten erhöht

### Logs überprüfen

In GitHub Actions → deinem Workflow → macOS Build-Job findest du detaillierte Logs über den Notarisierungsprozess.

## ✅ Verifikation

Nach erfolgreichem Build kannst du die Notarisierung testen:

1. Lade die DMG-Datei herunter
2. Installiere die App
3. Öffne die App ohne Warnmeldungen

Zur Verifikation im Terminal:
```bash
spctl -a -v /Applications/QuartaBill.app
```

## 🚀 Nächste Schritte

- [ ] Ersten notarisierten Build erstellen
- [ ] App auf verschiedenen macOS-Versionen testen
- [ ] Gatekeeper-Verhalten überprüfen

## 📚 Weiterführende Links

- [Apple Notarization Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [electron-builder Code Signing](https://www.electron.build/code-signing)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) 