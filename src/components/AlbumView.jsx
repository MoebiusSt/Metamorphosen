import { useState } from 'react';
import TrackList from './TrackList.jsx';

export default function AlbumView({
  album,
  playerState,
  onTrackClick,
  isEditMode,
  onToggleEditMode,
  onTitleChange,
  onReorderTracks,
  onExport,
}) {
  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!album) return null;

  const base = import.meta.env.BASE_URL;

  function handleExportClick() {
    const code = onExport();
    setExportText(code);
    setShowExport(true);
    setCopied(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="album-view">
      <div className="album-view__cover-wrap">
        <img
          className="album-view__cover"
          src={`${base}${album.cover}`}
          alt={`${album.title} Cover`}
        />
      </div>

      <div className="album-view__title-row">
        <h2 className="album-view__title">{album.title}</h2>
        <button
          className={`edit-toggle${isEditMode ? ' edit-toggle--active' : ''}`}
          onClick={onToggleEditMode}
          title={isEditMode ? 'Edit-Modus beenden' : 'Edit-Modus'}
          aria-label={isEditMode ? 'Edit-Modus beenden' : 'Edit-Modus'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354l-1.086-1.086zM11.189 6.25 9.75 4.811 3.569 10.99a.252.252 0 0 0-.063.108l-.655 2.29 2.29-.656a.25.25 0 0 0 .108-.062l6.18-6.18-.24-.24z"/>
          </svg>
        </button>
      </div>

      {isEditMode && (
        <div className="edit-toolbar">
          <span className="edit-toolbar__hint">Titel anklicken zum Bearbeiten · Ziehen zum Sortieren</span>
          <button className="edit-toolbar__export-btn" onClick={handleExportClick}>
            albums.js exportieren
          </button>
        </div>
      )}

      <TrackList
        album={album}
        playerState={playerState}
        onTrackClick={onTrackClick}
        isEditMode={isEditMode}
        onTitleChange={onTitleChange}
        onReorderTracks={onReorderTracks}
      />

      {showExport && (
        <div className="modal-overlay" onClick={() => setShowExport(false)}>
          <div className="modal modal--export" onClick={e => e.stopPropagation()}>
            <h3 className="modal__title">albums.js Export</h3>
            <p className="modal__desc">Inhalt kopieren und in <code>src/data/albums.js</code> einfügen.</p>
            <textarea
              className="modal__textarea"
              value={exportText}
              readOnly
              spellCheck={false}
            />
            <div className="modal__actions">
              <button className="modal__btn modal__btn--cancel" onClick={() => setShowExport(false)}>
                Schließen
              </button>
              <button className="modal__btn modal__btn--confirm" onClick={handleCopy}>
                {copied ? 'Kopiert!' : 'In Zwischenablage'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
