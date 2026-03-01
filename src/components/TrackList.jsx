import TrackItem from './TrackItem.jsx';

export default function TrackList({ album, playerState, onTrackClick }) {
  const isCurrentAlbum = playerState.currentAlbumId === album.id;

  return (
    <ul className="track-list">
      {album.tracks.map((track, index) => (
        <TrackItem
          key={track.number}
          track={track}
          index={index}
          isFeature={index === 0}
          isActive={isCurrentAlbum && playerState.currentTrackIndex === index}
          isPlaying={isCurrentAlbum && playerState.currentTrackIndex === index && playerState.isPlaying}
          onClick={() => onTrackClick(album.id, index)}
        />
      ))}
    </ul>
  );
}
