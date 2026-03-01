import { useState } from 'react';

export default function Header() {
  const [subtitleExpanded, setSubtitleExpanded] = useState(false);

  return (
    <header className={`header${subtitleExpanded ? ' header--subtitle-expanded' : ''}`}>
      <h1 className="header__title">Metamorphosen</h1>
      <button
        type="button"
        className="header__subtitle-toggle"
        aria-expanded={subtitleExpanded}
        aria-label={subtitleExpanded ? 'Subtitle ausblenden' : 'Subtitle einblenden'}
        onClick={() => setSubtitleExpanded((e) => !e)}
      >
        ?
      </button>
      <div className="header__subtitle-wrap">
        <div className="header__subtitle-inner">
          <p className="header__subtitle">
            I set out to write a song for my son. The idea was to ironically rewrite the song "Feliz Navidad" to "Methylphenidate,". This, together with the launch of "Sonauto v3", an epoch-making free-to-use AI specialized on music inference gave me reason to play. This turned into a five-day exploration, scratching the surface of its capabilities. How, HOW(!) do they do this?!
          </p>
        </div>
      </div>
    </header>
  );
}
