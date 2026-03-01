import albums from '../data/albums.js';
import Scrubber from './Scrubber.jsx';

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Player({ playerState, onPause, onResume, onNext, onPrev, onSeek }) {
  const { currentAlbumId, currentTrackIndex, isPlaying, currentTime, duration } = playerState;

  const album = albums.find((a) => a.id === currentAlbumId);
  const track = album?.tracks[currentTrackIndex];

  // Don't show player until a track has been selected
  if (!album || !track) {
    return (
      <div className="player player--empty">
        <div className="player__inner">
          <span className="player__placeholder">Wähle einen Track aus, um die Wiedergabe zu starten</span>
        </div>
      </div>
    );
  }

  const base = import.meta.env.BASE_URL;

  return (
    <div className="player">
      <Scrubber currentTime={currentTime} duration={duration} onSeek={onSeek} />
      <div className="player__inner">
        <div className="player__info">
          <img
            className="player__cover"
            src={`${base}${album.cover}`}
            alt={album.title}
          />
          <div className="player__text">
            <span className="player__track-title">{track.title}</span>
            <span className="player__album-title">{album.title}</span>
          </div>
        </div>

        <div className="player__controls">
          <button className="player__btn" onClick={onPrev} aria-label="Vorheriger Track">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>
          <button
            className="player__btn player__btn--play"
            onClick={isPlaying ? onPause : onResume}
            aria-label={isPlaying ? 'Pause' : 'Abspielen'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button className="player__btn" onClick={onNext} aria-label="Nächster Track">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        <div className="player__time">
          <span>{formatTime(currentTime)}</span>
          <span className="player__time-sep">/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
