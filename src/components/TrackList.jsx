import { useState, useCallback } from 'react';
import TrackItem from './TrackItem.jsx';

export default function TrackList({
  album,
  playerState,
  onTrackClick,
  isEditMode,
  onTitleChange,
  onReorderTracks,
  // like props
  isLiked,
  getCount,
  onToggleLike,
  // play count props
  getPlayCount,
}) {
  const isCurrentAlbum = playerState.currentAlbumId === album.id;

  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index);
    setDropIndex(null);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag ghost
    const ghost = document.createElement('div');
    ghost.style.position = 'absolute';
    ghost.style.top = '-9999px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDropIndex(null);
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    setDropIndex(e.clientY < mid ? index : index + 1);
  }, []);

  // Allow drop on the list container itself (handles the "after last" zone)
  const handleListDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (dragIndex === null || dropIndex === null) return;

    // Adjust for removal of dragged item
    let target = dropIndex > dragIndex ? dropIndex - 1 : dropIndex;
    if (target !== dragIndex) {
      onReorderTracks(album.id, dragIndex, target);
    }
    setDragIndex(null);
    setDropIndex(null);
  }, [dragIndex, dropIndex, album.id, onReorderTracks]);

  const tracks = album.tracks;
  const items = [];

  tracks.forEach((track, index) => {
    // Insert line before this item
    if (isEditMode && dragIndex !== null && dropIndex === index && dropIndex !== dragIndex && dropIndex !== dragIndex + 1) {
      items.push(
        <li key={`insert-${index}`} className="track-list__insert-line" aria-hidden="true" />
      );
    }

    items.push(
      <TrackItem
        key={track.number}
        track={track}
        index={index}
        isFeature={!isEditMode && index === 0}
        isActive={!isEditMode && isCurrentAlbum && playerState.currentTrackIndex === index}
        isPlaying={!isEditMode && isCurrentAlbum && playerState.currentTrackIndex === index && playerState.isPlaying}
        onClick={() => onTrackClick(album.id, index)}
        likeCount={getCount(track)}
        isLiked={isLiked(track)}
        onToggleLike={onToggleLike}
        playCount={getPlayCount(track)}
        isEditMode={isEditMode}
        isDragging={isEditMode && dragIndex === index}
        onTitleChange={(idx, title) => onTitleChange(album.id, idx, title)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={isEditMode ? handleDragOver : undefined}
      />
    );
  });

  // Insert line after last item
  if (isEditMode && dragIndex !== null && dropIndex === tracks.length && dropIndex !== dragIndex + 1) {
    items.push(
      <li key="insert-end" className="track-list__insert-line" aria-hidden="true" />
    );
  }

  return (
    <ul
      className="track-list"
      onDragOver={handleListDragOver}
      onDrop={handleDrop}
    >
      {items}
    </ul>
  );
}
