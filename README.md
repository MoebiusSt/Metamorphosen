# Metamorphosen

Ein React-basierter MP3-Album-Player, gehostet auf GitHub Pages. Fünf Genre-Alben werden über horizontale Tabs gewechselt. Ein persistenter Bottom-Player spielt Audio albumübergreifend weiter.

## Genres

- **Hiphop**
- **Indietronic**
- **Post-Punk**
- **Hamburger Schule**
- **Chanson**

## Eigene Musik einpflegen

1. Lege deine MP3-Dateien in `public/music/{genre-id}/` ab (z.B. `public/music/hiphop/`)
2. Benenne sie als `01-trackname.mp3`, `02-trackname.mp3`, ...
3. Lege ein quadratisches Cover-Bild als `cover.jpg` in denselben Ordner
4. Bearbeite `src/data/albums.js` und trage die Dateinamen und Track-Infos ein

## Entwicklung

```bash
npm install
npm run dev
```

## Deployment auf GitHub Pages

### Option 1: Manuell via gh-pages

```bash
npm run deploy
```

### Option 2: Automatisch via GitHub Actions

Push auf `main` triggert automatisch den Build und das Deployment. Voraussetzung: GitHub Pages muss in den Repository-Settings auf "GitHub Actions" als Source konfiguriert sein.

## Tech-Stack

- React 19 mit Hooks
- Vite als Bundler
- Globales CSS mit Custom Properties
- gh-pages / GitHub Actions für Deployment
