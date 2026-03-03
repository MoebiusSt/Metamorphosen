/**
 * Album-Konfiguration – Zentrale Datei für alle Alben und Tracks.
 *
 * Dateinamen-Schema: Metamorphosen__{Albumname}_{Tracknummer}.mp3
 * Cover: cover.jpg in jedem Genre-Ordner
 *
 * Die duration-Werte werden zur Laufzeit aus den Audio-Metadaten gelesen.
 */

const albums = [
  {
    id: "hiphop",
    title: "Vielleicht ein bisschen drauf",
    genre: "Hiphop",
    accent: { main: "#2dd4a8", dim: "#0d9373", glow: "rgba(45, 212, 168, 0.15)" },
    cover: "music/hiphop/cover.jpg",
    tracks: [
      { number: 1, title: "Wiederaufnahme Hammer", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_01.mp3" },
      { number: 15, title: "Nichts verbrennt", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_15.mp3" },
      { number: 4, title: "Fröhlich reguliert", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_04.mp3" },
      { number: 5, title: "Kleine Døse", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_05.mp3" },
      { number: 7, title: "Komm schon", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_21.mp3" },
      { number: 12, title: "Vielleicht Grad", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_12.mp3" },
      { number: 14, title: "Bisschen rauf, bisschen runter", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_14.mp3" },
      { number: 8, title: "Verlohrn (Posse Cut)", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_08.mp3" },
      { number: 9, title: "Reich mir Hand (Dub Mix)", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_09.mp3" },
      { number: 13, title: "Corazon, Amigo (Fest. Gaststars)", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_13.mp3" },
      { number: 11, title: "Und tāglich gib uns... (Bonustrack)", file: "music/hiphop/Metamorphosen__Vielleicht-ein-bisschen-drauf_11.mp3" }
    ]
  },
  {
    id: "indietronic",
    title: "Transfusion de concentration",
    genre: "Indietronic",
    accent: { main: "#a78bfa", dim: "#7c3aed", glow: "rgba(167, 139, 250, 0.15)" },
    cover: "music/indietronic/cover.jpg",
    tracks: [
      { number: 1, title: "Modified Release", file: "music/indietronic/Metamorphosen__Transfusion-de-concentration_01.mp3" },
      { number: 8, title: "Up a bit, down a bit", file: "music/indietronic/Metamorphosen__Transfusion-de-concentration_08.mp3" },
      { number: 3, title: "Transfusion of Concentration", file: "music/indietronic/Metamorphosen__Transfusion-de-concentration_03.mp3" },
      { number: 6, title: "Liquid light", file: "music/indietronic/Metamorphosen__Transfusion-de-concentration_06.mp3" },
      { number: 4, title: "Train of thought", file: "music/indietronic/Metamorphosen__Transfusion-de-concentration_04.mp3" },
      { number: 2, title: "Interlude", file: "music/indietronic/Metamorphosen__Transfusion-de-concentration_02.mp3" },
      { number: 5, title: "Coalescing Formulations", file: "music/indietronic/Metamorphosen__Transfusion-de-concentration_05.mp3" },
      { number: 7, title: "The focus gift", file: "music/indietronic/Metamorphosen__Transfusion-de-concentration_07.mp3" }
    ]
  },
  {
    id: "post-punk",
    title: "Un Año Estimulante",
    genre: "Post-Punk",
    accent: { main: "#f87171", dim: "#dc2626", glow: "rgba(248, 113, 113, 0.15)" },
    cover: "music/post-punk/cover.jpg",
    tracks: [
      { number: 1, title: "Brightly they say!", file: "music/post-punk/Metamorphosen__Un-Año-Estimulante_01.mp3" },
      { number: 2, title: "Dopamin", file: "music/post-punk/Metamorphosen__Un-Año-Estimulante_02.mp3" },
      { number: 5, title: "Merry treatment", file: "music/post-punk/Metamorphosen__Un-Año-Estimulante_05.mp3" },
      { number: 7, title: "Steady pulse", file: "music/post-punk/Metamorphosen__Un-Año-Estimulante_07.mp3" },
      { number: 3, title: "Station Station", file: "music/post-punk/Metamorphosen__Un-Año-Estimulante_03.mp3" },
      { number: 4, title: "Unfocused Kids", file: "music/post-punk/Metamorphosen__Un-Año-Estimulante_04.mp3" },
      { number: 6, title: "Fast like lightning", file: "music/post-punk/Metamorphosen__Un-Año-Estimulante_06.mp3" },
      { number: 8, title: "Better mint", file: "music/post-punk/Metamorphosen__Un-Año-Estimulante_08.mp3" }
    ]
  },
  {
    id: "hamburger-schule",
    title: "Im Kreissaal der Gedanken",
    genre: "Hamburger Schule",
    accent: { main: "#fbbf24", dim: "#d97706", glow: "rgba(251, 191, 36, 0.15)" },
    cover: "music/hamburger-schule/cover.jpg",
    tracks: [
      { number: 1, title: "Sternenlicht", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_01.mp3" },
      { number: 2, title: "Año Prospero", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_02.mp3" },
      { number: 3, title: "Retardiertes", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_03.mp3" },
      { number: 5, title: "Hey, Du Kleine", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_05.mp3" },
      { number: 6, title: "Geschluckt es", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_06.mp3" },
      { number: 7, title: "Der Schritt zur Tat", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_07.mp3" },
      { number: 8, title: "Samt im Getriebe", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_08.mp3" },
      { number: 9, title: "Charlotte und Farben", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_09.mp3" },
      { number: 4, title: "Endlich funktioniert's!", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_04.mp3" },
      { number: 10, title: "Auf dem Boden der Tatsachen", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_10.mp3" },
      { number: 11, title: "Lucido", file: "music/hamburger-schule/Metamorphosen__Im_Kreissaal_der_Gedanken_11.mp3" }
    ]
  },
  {
    id: "chanson",
    title: "The grand focus",
    genre: "Chanson",
    accent: { main: "#f472b6", dim: "#db2777", glow: "rgba(244, 114, 182, 0.15)" },
    cover: "music/chanson/cover.jpg",
    tracks: [
      { number: 1, title: "Lightning strikes", file: "music/chanson/Metamorphosen__The-grand-focus_01.mp3" },
      { number: 3, title: "The focused year", file: "music/chanson/Metamorphosen__The-grand-focus_03.mp3" },
      { number: 4, title: "Methylphenidato", file: "music/chanson/Metamorphosen__The-grand-focus_04.mp3" },
      { number: 5, title: "So much was lost", file: "music/chanson/Metamorphosen__The-grand-focus_02.mp3" },
      { number: 2, title: "The Curtain", file: "music/chanson/Metamorphosen__The-grand-focus_05.mp3" }
    ]
  },
  {
    id: "diverse",
    title: "Aggregatzustände",
    genre: "Diverse",
    accent: { main: "#38bdf8", dim: "#0284c7", glow: "rgba(56, 189, 248, 0.15)" },
    cover: "music/diverse/cover.jpg",
    tracks: [
      { number: 1, title: "Jazzed up", file: "music/diverse/Metamorphosen__Un-Ano-Estimulante_01.mp3" },
      { number: 2, title: "Feliz Phenidat", file: "music/diverse/Metamorphosen__Un-Ano-Estimulante_02.mp3" }
    ]
  }
];

export default albums;
