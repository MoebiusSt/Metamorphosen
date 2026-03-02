import { useState } from 'react';

export default function Header({ isShuffleActive, onToggleShuffle }) {
  const [subtitleExpanded, setSubtitleExpanded] = useState(false);

  return (
    <header className={`header${subtitleExpanded ? ' header--subtitle-expanded' : ''}`}>
      <div className="header__actions-left">
        <button
          type="button"
          className={`header__shuffle-toggle${isShuffleActive ? ' header__shuffle-toggle--active' : ''}`}
          aria-pressed={isShuffleActive}
          aria-label={isShuffleActive ? 'Shuffle deaktivieren' : 'Shuffle aktivieren'}
          title={isShuffleActive ? 'Shuffle deaktivieren' : 'Shuffle aktivieren'}
          onClick={onToggleShuffle}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>
      </div>
      <h1 className="header__title">Metamorphosen</h1>
      <div className="header__actions">
        <button
          type="button"
          className="header__subtitle-toggle"
          aria-expanded={subtitleExpanded}
          aria-label={subtitleExpanded ? 'Subtitle ausblenden' : 'Subtitle einblenden'}
          onClick={() => setSubtitleExpanded((e) => !e)}
        >
          ?
        </button>
      </div>
      <div className="header__subtitle-wrap">
        <div className="header__subtitle-inner">
          <p className="header__subtitle">
            I set out to write a song for my son. The idea was to ironically rewrite the song "Feliz Navidad" to "Methylphenidate,". This, together with the launch of "Sonauto v3", a free-to-use frontier AI model for music inference gave me reason to play. This turned into a five-day exploration, scratching the surface of its capabilities. How, HOW(!) do they do this?! Zero edits were done on the files. (Stephan Möbius, 2026-03-01)
          </p>
        </div>
      </div>
    </header>
  );
}
