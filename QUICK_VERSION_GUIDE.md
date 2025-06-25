# QuartaBill - Neue Versionsverwaltung

## ✅ **Problem gelöst!**

Die Versionsnummer in der "Über QuartaBill" Ansicht wird jetzt automatisch aus der `package.json` gelesen und zeigt korrekt **Version 1.3.2** an.

## 🚀 **Wie funktioniert es jetzt?**

### Automatische Version-Updates
- **Zentrale Quelle**: `package.json` → Version: `1.3.2`
- **Automatische Anzeige**: Wird überall in der App korrekt angezeigt
- **Beide Sprachen**: Deutsch und Englisch unterstützt

### Version aktualisieren - 3 Wege:

#### 🎯 **Option 1: GitHub Actions (Empfohlen)**
1. Gehe zu: https://github.com/entttom/QuartaBill/actions
2. Wähle **"Update Version"**
3. Klicke **"Run workflow"**
4. Gib neue Version ein (z.B., `1.3.3`)
5. ✅ **Fertig!** - Automatisch: Package.json + Git Tag + GitHub Release

#### 🛠️ **Option 2: Terminal (Schnell)**
```bash
npm version 1.3.3 --no-git-tag-version
git add package.json package-lock.json
git commit -m "🔖 Update version to 1.3.3"
git push origin main
```

#### ⚡ **Option 3: Manuell**
1. Öffne `package.json`
2. Ändere `"version": "1.3.2"` zu `"version": "1.3.3"`
3. Speichern + Commit + Push

## 🔍 **Wo wird die Version angezeigt?**

- **Einstellungen → Über QuartaBill**: `Version 1.3.2 - Für eine effiziente...`
- **Beide Sprachen** automatisch unterstützt
- **Immer aktuell** - keine manuellen Updates mehr nötig

## 📋 **Was passiert bei jedem GitHub Release?**

Wenn Sie die **GitHub Actions** verwenden:
1. ✅ `package.json` wird automatisch aktualisiert
2. ✅ Git-Commit wird erstellt: `🔖 Update version to X.Y.Z`
3. ✅ Git-Tag wird erstellt: `vX.Y.Z`
4. ✅ GitHub Release wird automatisch erstellt
5. ✅ Version wird überall in der App aktualisiert

## 🎉 **Vorteile der neuen Lösung:**

- **Kein manuelles Anpassen** von Versionsnummern in verschiedenen Dateien
- **Automatische Synchronisation** zwischen package.json und UI
- **Bilinguale Unterstützung** ohne Zusatzaufwand
- **GitHub Actions Integration** für einfache Releases
- **Semantic Versioning** Unterstützung

---

**Jetzt testen:** Öffnen Sie QuartaBill → Einstellungen → Über QuartaBill
➡️ Sollte jetzt **"Version 1.3.2"** anzeigen! 🎯 