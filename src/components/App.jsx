import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './Header.jsx';
import GenreTabs from './GenreTabs.jsx';
import AlbumView from './AlbumView.jsx';
import Player from './Player.jsx';
import EditPasswordModal from './EditPasswordModal.jsx';
import useAudioPlayer from '../hooks/useAudioPlayer.js';
import usePlaylistData from '../hooks/usePlaylistData.js';
import useEditMode from '../hooks/useEditMode.js';
import useShuffleMode from '../hooks/useShuffleMode.js';
import { getPersistedUi, setPersistedUi } from '../utils/persistUi.js';

export default function App() {
  const { albums, updateTrackTitle, reorderTracks, exportAlbumsJs } = usePlaylistData();
  const { isEditMode, showPasswordModal, toggleEditMode, authenticate, closePasswordModal } = useEditMode();
  const {
    isShuffleActive,
    toggleShuffle,
    deactivateShuffle,
    nextShuffled,
    prevShuffled,
  } = useShuffleMode();

  const [activeAlbumId, setActiveAlbumId] = useState(albums[0]?.id ?? null);
  const uiHydratedRef = useRef(false);

  useEffect(() => {
    if (!albums.length || uiHydratedRef.current) return;
    uiHydratedRef.current = true;
    const { activeAlbumId: stored } = getPersistedUi();
    if (stored && albums.some((a) => a.id === stored)) {
      setActiveAlbumId(stored);
    } else {
      setActiveAlbumId(albums[0].id);
    }
  }, [albums]);

  useEffect(() => {
    if (activeAlbumId) setPersistedUi({ activeAlbumId });
  }, [activeAlbumId]);

  // Stable ref for the ended handler — updated via effect to avoid lint issues
  const endedHandlerRef = useRef(null);

  // Stable callback passed to useAudioPlayer (never changes identity)
  const handleEnded = useCallback(() => {
    endedHandlerRef.current?.();
  }, []);

  const { playerState, play, pause, resume, next, prev, seek, adjustIndexAfterReorder } =
    useAudioPlayer(albums, { onEndedOverride: handleEnded });

  // Keep endedHandlerRef up to date via effect
  useEffect(() => {
    endedHandlerRef.current = () => {
      if (isShuffleActive) {
        const item = nextShuffled();
        if (item) {
          play(item.albumId, item.trackIndex);
          setActiveAlbumId(item.albumId);
        }
        // If null → end of shuffle queue, playback stops
      } else {
        next();
      }
    };
  }, [isShuffleActive, nextShuffled, play, next]);

  // Shuffle-aware next
  function handleNext() {
    if (isShuffleActive) {
      const item = nextShuffled();
      if (item) {
        play(item.albumId, item.trackIndex);
        setActiveAlbumId(item.albumId);
      } else {
        pause();
      }
    } else {
      next();
    }
  }

  // Shuffle-aware prev
  function handlePrev() {
    if (isShuffleActive) {
      const item = prevShuffled();
      if (item) {
        play(item.albumId, item.trackIndex);
        setActiveAlbumId(item.albumId);
      }
    } else {
      prev();
    }
  }

  // When user clicks a track directly, deactivate shuffle
  function handleTrackClick(albumId, trackIndex) {
    if (isShuffleActive) {
      deactivateShuffle();
    }
    play(albumId, trackIndex);
  }

  // Toggle shuffle
  function handleToggleShuffle() {
    const { currentAlbumId, currentTrackIndex } = playerState;
    toggleShuffle(albums, currentAlbumId, currentTrackIndex);
  }

  // Deactivate shuffle when entering edit mode
  function handleToggleEditMode() {
    if (!isEditMode && isShuffleActive) {
      deactivateShuffle();
    }
    toggleEditMode();
  }

  function handleReorderTracks(albumId, fromIndex, toIndex) {
    reorderTracks(albumId, fromIndex, toIndex);
    adjustIndexAfterReorder(albumId, fromIndex, toIndex);
  }

  const activeAlbum = albums.find((a) => a.id === activeAlbumId);

  useEffect(() => {
    if (activeAlbum?.accent) {
      const root = document.documentElement;
      root.style.setProperty('--accent', activeAlbum.accent.main);
      root.style.setProperty('--accent-dim', activeAlbum.accent.dim);
      root.style.setProperty('--accent-glow', activeAlbum.accent.glow);
    }
  }, [activeAlbumId, activeAlbum]);

  return (
    <div className="app">
      <Header
        isShuffleActive={isShuffleActive}
        onToggleShuffle={handleToggleShuffle}
      />
      <GenreTabs activeAlbumId={activeAlbumId} onTabChange={setActiveAlbumId} albums={albums} />
      <main className="app__main">
        <AlbumView
          album={activeAlbum}
          playerState={playerState}
          onTrackClick={handleTrackClick}
          isEditMode={isEditMode}
          onToggleEditMode={handleToggleEditMode}
          onTitleChange={updateTrackTitle}
          onReorderTracks={handleReorderTracks}
          onExport={exportAlbumsJs}
        />
      </main>
      <Player
        playerState={playerState}
        albums={albums}
        onPause={pause}
        onResume={resume}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={seek}
      />
      {showPasswordModal && (
        <EditPasswordModal
          onAuthenticate={authenticate}
          onClose={closePasswordModal}
        />
      )}
    </div>
  );
}
