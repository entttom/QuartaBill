#!/bin/bash

# QuartaBill - Zertifikats-Setup für macOS Notarisierung
# Dieses Skript hilft beim Vorbereiten der Zertifikate für GitHub Secrets

echo "🔧 QuartaBill macOS Notarisierungs-Setup"
echo "========================================"

echo ""
echo "📋 Schritt 1: P12 Zertifikat erstellen"
echo "Exportiere dein 'Developer ID Application' Zertifikat aus dem Keychain als .p12 Datei"
echo "Wichtig: Verwende ein starkes Passwort!"

echo ""
echo "📋 Schritt 2: P12 zu Base64 konvertieren"
echo "Führe folgenden Befehl aus (ersetze 'pfad/zu/deinem/zertifikat.p12'):"
echo "base64 -i pfad/zu/deinem/zertifikat.p12 | pbcopy"
echo "Das Ergebnis ist jetzt in deiner Zwischenablage für CSC_LINK"

echo ""
echo "📋 Schritt 3: Team ID finden"
echo "Gehe zu https://developer.apple.com/account"
echo "Deine Team ID findest du oben rechts in der Ecke"

echo ""
echo "📋 Schritt 4: GitHub Secrets hinzufügen"
echo "Gehe zu: https://github.com/entttom/QuartaBill/settings/secrets/actions"
echo ""
echo "Füge folgende Secrets hinzu:"
echo "- APPLE_ID: deine@apple-id.com"
echo "- APPLE_ID_PASSWORD: dein-app-spezifisches-passwort"
echo "- APPLE_TEAM_ID: deine-team-id"
echo "- CSC_LINK: das-base64-kodierte-p12-zertifikat"
echo "- CSC_KEY_PASSWORD: passwort-für-p12-zertifikat"

echo ""
echo "✅ Nach dem Setup kannst du einen neuen Release erstellen!"
echo "Die App wird automatisch signiert und notarisiert." 