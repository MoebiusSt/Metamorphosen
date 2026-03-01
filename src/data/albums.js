/**
 * Album-Konfiguration – Zentrale Datei für alle Alben und Tracks.
 *
 * So passt du sie an:
 * 1. Lege deine MP3-Dateien in public/music/{genre-id}/ ab
 * 2. Lege ein quadratisches Cover-Bild als cover.jpg in denselben Ordner
 * 3. Trage die Dateinamen und Track-Infos hier ein
 *
 * Dateinamen-Konvention: 01-trackname.mp3, 02-trackname.mp3, ...
 * Cover: cover.jpg (oder .png)
 */

const albums = [
  {
    id: "hiphop",
    title: "Hiphop",
    cover: "music/hiphop/cover.jpg",
    tracks: [
      { number: 1, title: "Betonpoesie", file: "music/hiphop/01-betonpoesie.mp3", duration: "3:42" },
      { number: 2, title: "Nachtschicht", file: "music/hiphop/02-nachtschicht.mp3", duration: "4:15" },
      { number: 3, title: "Kreuzung", file: "music/hiphop/03-kreuzung.mp3", duration: "3:58" },
      { number: 4, title: "Spiegelbild", file: "music/hiphop/04-spiegelbild.mp3", duration: "4:33" },
      { number: 5, title: "Frequenzwechsel", file: "music/hiphop/05-frequenzwechsel.mp3", duration: "3:21" },
    ]
  },
  {
    id: "indietronic",
    title: "Indietronic",
    cover: "music/indietronic/cover.jpg",
    tracks: [
      { number: 1, title: "Signalrauschen", file: "music/indietronic/01-signalrauschen.mp3", duration: "4:08" },
      { number: 2, title: "Lichtmaschine", file: "music/indietronic/02-lichtmaschine.mp3", duration: "3:45" },
      { number: 3, title: "Parallelen", file: "music/indietronic/03-parallelen.mp3", duration: "5:12" },
      { number: 4, title: "Schwebezustand", file: "music/indietronic/04-schwebezustand.mp3", duration: "4:27" },
      { number: 5, title: "Pulsschlag", file: "music/indietronic/05-pulsschlag.mp3", duration: "3:55" },
      { number: 6, title: "Wellenform", file: "music/indietronic/06-wellenform.mp3", duration: "4:40" },
    ]
  },
  {
    id: "post-punk",
    title: "Post-Punk",
    cover: "music/post-punk/cover.jpg",
    tracks: [
      { number: 1, title: "Grauzone", file: "music/post-punk/01-grauzone.mp3", duration: "3:18" },
      { number: 2, title: "Betonwüste", file: "music/post-punk/02-betonwueste.mp3", duration: "4:02" },
      { number: 3, title: "Schattenwurf", file: "music/post-punk/03-schattenwurf.mp3", duration: "3:47" },
      { number: 4, title: "Zerrspiegel", file: "music/post-punk/04-zerrspiegel.mp3", duration: "5:01" },
      { number: 5, title: "Kaltfront", file: "music/post-punk/05-kaltfront.mp3", duration: "3:33" },
    ]
  },
  {
    id: "hamburger-schule",
    title: "Hamburger Schule",
    cover: "music/hamburger-schule/cover.jpg",
    tracks: [
      { number: 1, title: "Diskursverschiebung", file: "music/hamburger-schule/01-diskursverschiebung.mp3", duration: "4:22" },
      { number: 2, title: "Seminarraum", file: "music/hamburger-schule/02-seminarraum.mp3", duration: "3:56" },
      { number: 3, title: "Zitatgewitter", file: "music/hamburger-schule/03-zitatgewitter.mp3", duration: "4:11" },
      { number: 4, title: "Referenzrahmen", file: "music/hamburger-schule/04-referenzrahmen.mp3", duration: "3:44" },
    ]
  },
  {
    id: "chanson",
    title: "Chanson",
    cover: "music/chanson/cover.jpg",
    tracks: [
      { number: 1, title: "Flussaufwärts", file: "music/chanson/01-flussaufwaerts.mp3", duration: "4:35" },
      { number: 2, title: "Regenmantel", file: "music/chanson/02-regenmantel.mp3", duration: "3:28" },
      { number: 3, title: "Abendstunde", file: "music/chanson/03-abendstunde.mp3", duration: "5:02" },
      { number: 4, title: "Schattenspiel", file: "music/chanson/04-schattenspiel.mp3", duration: "4:18" },
      { number: 5, title: "Zwischentöne", file: "music/chanson/05-zwischentoene.mp3", duration: "3:50" },
      { number: 6, title: "Dämmerung", file: "music/chanson/06-daemmerung.mp3", duration: "4:45" },
    ]
  },
];

export default albums;
