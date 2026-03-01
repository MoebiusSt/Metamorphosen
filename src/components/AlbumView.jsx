import albums from '../data/albums.js';
import TrackList from './TrackList.jsx';

export default function AlbumView({ activeAlbumId, playerState, onTrackClick }) {
  const album = albums.find((a) => a.id === activeAlbumId);
  if (!album) return null;

  const base = import.meta.env.BASE_URL;

  return (
    <div className="album-view">
      <div className="album-view__cover-wrap">
        <img
          className="album-view__cover"
          src={`${base}${album.cover}`}
          alt={`${album.title} Cover`}
        />
      </div>
      <h2 className="album-view__title">{album.title}</h2>
      <TrackList
        album={album}
        playerState={playerState}
        onTrackClick={onTrackClick}
      />
    </div>
  );
}
