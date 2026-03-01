export default function TrackItem({ track, isFeature, isActive, isPlaying, onClick }) {
  return (
    <li
      className={`track-item ${isFeature ? 'track-item--feature' : ''} ${isActive ? 'track-item--active' : ''}`}
      onClick={onClick}
    >
      <span className="track-item__number">
        {isPlaying ? (
          <span className="track-item__eq">
            <span className="track-item__eq-bar" />
            <span className="track-item__eq-bar" />
            <span className="track-item__eq-bar" />
          </span>
        ) : isActive ? (
          <span className="track-item__play-icon">&#9654;</span>
        ) : (
          track.number
        )}
      </span>
      <span className="track-item__title">{track.title}</span>
      <span className="track-item__duration">{track.duration}</span>
    </li>
  );
}
