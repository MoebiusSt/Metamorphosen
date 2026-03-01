# Plan: Random-Play Mode + Likes-Machbarkeitsprüfung

---

## Feature 1: Random-Play Mode (Shuffle)

### Konzept

Ein genreübergreifender Shuffle-Modus: Bei Aktivierung wird eine zufällige Warteschlange aus **allen Tracks aller Alben** erstellt. Prev/Next navigieren durch diese feste Liste. Bei Genrewechsel (Track aus anderem Album) werden Genre-Tab, Cover, Accent-Farben und gehighlighteter Track automatisch aktualisiert.

### Betroffene Dateien

| Datei | Änderung |
|---|---|
| `src/hooks/useShuffleMode.js` | **Neu** – Hook für Shuffle-State und Queue-Verwaltung |
| `src/hooks/useAudioPlayer.js` | Erweitern: Shuffle-aware `next()`/`prev()` über Callback-Injection |
| `src/components/App.jsx` | Integration: Shuffle-State, Genre-Sync bei Albumwechsel, erweiterte next/prev |
| `src/components/Header.jsx` | Shuffle-Toggle-Button (rechts, unter dem "?"-Button) |
| `src/styles/app.css` | Styling für Shuffle-Button (aktiv/inaktiv) |

### Detailplan

#### Schritt 1: `useShuffleMode.js` (neuer Hook)

```
State:
  - isShuffleActive: boolean
  - shuffleQueue: Array<{ albumId: string, trackIndex: number }>
  - shufflePosition: number  (Index in der Queue)

Funktionen:
  - toggleShuffle(albums, currentAlbumId, currentTrackIndex):
      → AUS: isShuffleActive = false, queue leeren
      → EIN: Alle Tracks aller Alben sammeln → Fisher-Yates Shuffle
         → Der aktuell spielende Track wird an Position 0 gesetzt
           (damit kein abrupter Wechsel bei Aktivierung)
         → shufflePosition = 0, isShuffleActive = true

  - nextShuffled():
      → shufflePosition + 1
      → Wenn am Ende: Pause (kein Loop), analog zum normalen Modus
      → Return: { albumId, trackIndex } oder null

  - prevShuffled():
      → Wenn audio.currentTime > 3s: Restart (wie normal)
      → Sonst: shufflePosition - 1
      → Wenn < 0: Restart Position 0
      → Return: { albumId, trackIndex }

  - getCurrentShuffled():
      → Return aktuelles Queue-Item
```

#### Schritt 2: `useAudioPlayer.js` anpassen

Minimale Änderung – die bestehende `next()`/`prev()`-Logik bleibt intakt für den normalen Modus. In `App.jsx` werden stattdessen Wrapper-Funktionen erstellt, die je nach Shuffle-State entweder den normalen oder den Shuffle-Pfad nutzen.

Konkret: Ein neues `play(albumId, trackIndex)` wird weiterhin direkt aufgerufen — sowohl im normalen als auch im Shuffle-Modus. Der Unterschied liegt nur darin, **welchen** Track `next/prev` auswählen.

#### Schritt 3: `App.jsx` – Integration

```
Neue Logik:
  - useShuffleMode() einbinden
  - handleNext():
      if (isShuffleActive):
        nextItem = nextShuffled()
        if (nextItem) → play(nextItem.albumId, nextItem.trackIndex)
        if (nextItem.albumId !== activeAlbumId) → setActiveAlbumId(nextItem.albumId)
      else:
        next()  // bestehende Logik

  - handlePrev():
      Analog zu handleNext, aber mit prevShuffled()

  - handleTrackClick(albumId, trackIndex):
      if (isShuffleActive):
        Shuffle deaktivieren (User wählt explizit einen Track)
      play(albumId, trackIndex)

  - handleEnded (auto-advance):
      Die ended-Logik im useAudioPlayer ruft next() auf.
      Problem: Im Shuffle-Modus muss stattdessen handleNext() greifen.
      Lösung: useAudioPlayer bekommt einen optionalen onNext-Callback.
      Wenn gesetzt, wird dieser statt des internen next() bei 'ended' aufgerufen.

  - Genre-Sync:
      Wenn shuffle einen Track aus einem anderen Album spielt:
      → setActiveAlbumId() wird aufgerufen
      → Der useEffect für Accent-Farben greift automatisch
      → GenreTabs zeigt den richtigen Tab als aktiv
      → AlbumView zeigt das richtige Album + gehighlighteten Track
```

#### Schritt 4: `Header.jsx` – Shuffle-Toggle-Button

- Button wird als Prop von App übergeben (`isShuffleActive`, `onToggleShuffle`)
- Position: Absolut positioniert, rechts im Header, unter dem "?"-Button
- Icon: Shuffle-Symbol (gekreuzte Pfeile, SVG)
- Visuell: Im aktiven Zustand Accent-Farbe, analog zum Edit-Toggle

```
Desktop: Rechts oben sichtbar (da "?" dort hidden ist, nimmt Shuffle dessen Platz ein)
Mobile:  Unter dem "?"-Button, ebenfalls rechts, ~56px von oben
```

#### Schritt 5: CSS

```css
.header__shuffle-toggle        /* Basis: wie header__subtitle-toggle */
.header__shuffle-toggle--active /* Accent-Farbe, Glow */
```

- Desktop: `display: flex` (immer sichtbar), `position: absolute; top: 20px; right: 16px;`
- Mobile: `top: 56px; right: 16px;` (unter dem "?"-Button)

### Edge Cases

1. **Shuffle aktivieren wenn nichts spielt**: Queue wird erstellt, erster Track der Queue wird automatisch abgespielt.
2. **Track manuell auswählen während Shuffle aktiv**: Shuffle wird deaktiviert (klare UX).
3. **Edit-Modus während Shuffle**: Kein Konflikt — Edit betrifft nur Titel/Reihenfolge im Album, Shuffle-Queue referenziert albumId + trackIndex.
4. **Album-Daten ändern sich (localStorage Overrides)**: Queue-Einträge referenzieren `albumId` + `trackIndex`, die sich durch Reorder ändern können. Pragmatisch: Shuffle deaktivieren wenn Edit-Modus aktiviert wird.

---

## Feature 2: Besucher-Likes – Machbarkeitsprüfung

### Anforderung

- Herz-Toggle + Zähler pro Track in der TrackList
- Likes sind **global** (für alle Besucher) und **persistent**

### Problem: GitHub Pages = rein statisch

Die Seite wird als **statische Site auf GitHub Pages** gehostet. Es gibt keinen Server, kein Backend, keine Datenbank. `localStorage` speichert nur lokal im Browser eines einzelnen Besuchers — das erfüllt die Anforderung "für alle Besucher dauerhaft" **nicht**.

### Optionen für globale Persistenz

| Option | Pro | Contra |
|---|---|---|
| **A) Firebase Realtime DB / Firestore** | Kostenloser Tier großzügig (Spark: 1 GB Storage, 50k reads/day). Direkt vom Client nutzbar, Echtzeit-Updates. Gute Doku, SDK klein. | Externes Konto nötig (Google). API-Key im Client-Code (muss mit Security Rules abgesichert werden). Vendor Lock-in. |
| **B) Supabase (PostgreSQL)** | Open-Source-Alternative zu Firebase. REST-API direkt nutzbar. Free Tier: 500 MB, 50k Rows. | Etwas komplexer einzurichten. Auch externes Konto nötig. |
| **C) Upstash Redis (REST)** | Serverless Redis mit REST-API. Sehr schnell, ideal für Counter. Free Tier: 10k Commands/day. | Weniger bekannt. Auch externes Konto. |
| **D) Cloudflare Workers + KV** | Edge-basiert, schnell, free tier gut. | Separate Infrastruktur nötig, Domain-Konfiguration. Nicht trivial mit GitHub Pages. |
| **E) Nur localStorage (lokal)** | Kein Backend nötig, sofort umsetzbar. | **Nicht global** — jeder Besucher sieht nur seine eigenen Likes. Erfüllt die Anforderung NICHT. |
| **F) GitHub API als Storage** | Kein separater Dienst nötig. | Rate-Limiting, Auth-Token nötig, hacky, langsam. Nicht praxistauglich. |

### Empfehlung

**Option A (Firebase Firestore)** ist für diesen Use-Case am besten geeignet:

- **Einfachste Integration**: Firebase JS SDK (`firebase/firestore` Modul, ~12 KB gzipped) direkt im React-Code
- **Echtzeit**: Andere Besucher sehen Like-Updates sofort (Firestore Snapshots)
- **Kostenlos**: Der Spark-Plan reicht für diese App locker aus
- **Security**: Firestore Security Rules erlauben "jeder darf liken" ohne Auth, aber mit Rate-Limiting-Regeln
- **Kein Server nötig**: Alles client-seitig

**Grobe Architektur bei Firebase:**
```
Firestore Collection: "likes"
  Document: "{albumId}_{trackIndex}"
    Fields: { count: number }

Client-Logik:
  - Beim Laden der TrackList: Alle Like-Counts für das aktuelle Album abrufen
  - Herz-Klick: Firestore increment(1) oder increment(-1)
  - localStorage merkt sich, welche Tracks der aktuelle Besucher bereits geliked hat
    (um doppeltes Liken zu verhindern / Toggle-State zu haben)
  - Optional: onSnapshot() für Echtzeit-Updates
```

**Setup-Aufwand:**
1. Firebase-Projekt erstellen (Firebase Console, ~5 Min)
2. Firestore aktivieren (1 Klick)
3. Security Rules schreiben (nur likes-Collection, nur increment erlauben)
4. Firebase Config (API-Keys) in die App einfügen
5. Hook `useLikes.js` implementieren
6. TrackItem um Herz-Button erweitern

### Alternative: Lokale Likes (nur localStorage)

Falls globale Persistenz (vorerst) zu viel Aufwand ist, kann Feature 2 auch als **lokale Likes** implementiert werden:
- Jeder Besucher sieht nur seine eigenen Likes
- Kein externes Backend nötig
- Kann später auf Firebase aufgerüstet werden (gleiche UI-Komponenten, nur Hook-Innenleben tauschen)

---

## Zusammenfassung

| Feature | Machbar? | Aufwand | Abhängigkeit |
|---|---|---|---|
| **1. Random-Play** | Ja, voll machbar | Mittel (neuer Hook + Integration) | Keine externe Abhängigkeit |
| **2. Likes (global)** | Ja, aber braucht externes Backend | Mittel-Hoch (Firebase Setup + Code) | Firebase-Konto + Konfiguration |
| **2b. Likes (lokal)** | Ja, sofort machbar | Gering | Keine |

### Vorgeschlagene Reihenfolge

1. **Random-Play Mode** implementieren (keine externen Abhängigkeiten)
2. **Likes**: Entscheidung ob global (Firebase) oder lokal (localStorage) — dann implementieren
