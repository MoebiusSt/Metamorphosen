import { useState, useRef, useEffect } from 'react';

export default function TrackItem({
  track,
  index,
  isFeature,
  isActive,
  isPlaying,
  onClick,
  // edit mode props
  isEditMode,
  isDragging,
  onTitleChange,
  onDragStart,
  onDragEnd,
  onDragOver,
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(track.title);
  const inputRef = useRef(null);

  // Sync if title changes externally
  useEffect(() => {
    if (!editing) setEditValue(track.title);
  }, [track.title, editing]);

  function handleTitleClick(e) {
    if (!isEditMode) return;
    e.stopPropagation();
    setEditValue(track.title);
    setEditing(true);
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      // place cursor at end
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }, [editing]);

  function commitEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== track.title) {
      onTitleChange(index, trimmed);
    }
    setEditing(false);
  }

  function cancelEdit() {
    setEditValue(track.title);
    setEditing(false);
  }

  function handleInputKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }

  function handleItemClick(e) {
    if (isEditMode) return; // prevent playback in edit mode
    onClick(e);
  }

  const classNames = [
    'track-item',
    isFeature ? 'track-item--feature' : '',
    isActive ? 'track-item--active' : '',
    isEditMode ? 'track-item--edit' : '',
    isDragging ? 'track-item--dragging' : '',
  ].filter(Boolean).join(' ');

  return (
    <li
      className={classNames}
      onClick={handleItemClick}
      draggable={isEditMode}
      onDragStart={isEditMode ? (e) => onDragStart(e, index) : undefined}
      onDragEnd={isEditMode ? onDragEnd : undefined}
      onDragOver={isEditMode && onDragOver ? (e) => onDragOver(e, index) : undefined}
    >
      {isEditMode && (
        <span className="track-item__drag-handle" title="Verschieben">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="2" width="10" height="2" rx="1"/>
            <rect x="2" y="6" width="10" height="2" rx="1"/>
            <rect x="2" y="10" width="10" height="2" rx="1"/>
          </svg>
        </span>
      )}
      <span className="track-item__number">
        {!isEditMode && isPlaying ? (
          <span className="track-item__eq">
            <span className="track-item__eq-bar" />
            <span className="track-item__eq-bar" />
            <span className="track-item__eq-bar" />
          </span>
        ) : !isEditMode && isActive ? (
          <span className="track-item__play-icon">&#9654;</span>
        ) : (
          index + 1
        )}
      </span>
      <span className="track-item__title">
        {editing ? (
          <span className="track-item__edit-row">
            <input
              ref={inputRef}
              className="track-item__title-input"
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onClick={e => e.stopPropagation()}
            />
            <button
              className="track-item__edit-btn track-item__edit-btn--confirm"
              onMouseDown={e => e.preventDefault()}
              onClick={e => { e.stopPropagation(); commitEdit(); }}
              title="Bestätigen (Enter)"
              aria-label="Bestätigen"
            >✓</button>
            <button
              className="track-item__edit-btn track-item__edit-btn--cancel"
              onMouseDown={e => e.preventDefault()}
              onClick={e => { e.stopPropagation(); cancelEdit(); }}
              title="Abbrechen (Esc)"
              aria-label="Abbrechen"
            >✕</button>
          </span>
        ) : (
          <>
            <span
              className={isEditMode ? 'track-item__title-text track-item__title-text--editable' : 'track-item__title-text'}
              onClick={handleTitleClick}
            >
              {track.title}
            </span>
            {isEditMode && (
              <span className="track-item__source-number" aria-label={`Source track ${track.number}`}>
                {track.number}
              </span>
            )}
          </>
        )}
      </span>
      <span className="track-item__duration">{track.duration}</span>
    </li>
  );
}
