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
import useLikes from '../hooks/useLikes.js';
import usePlayCounts from '../hooks/usePlayCounts.js';
import { getPersistedUi, setPersistedUi } from '../utils/persistUi.js';

export default function App() {
  const { albums, updateTrackTitle, reorderTracks, exportAlbumsJs } = usePlaylistData();
  const { isEditMode, showPasswordModal, toggleEditMode, authenticate, closePasswordModal } = useEditMode();
  const {
    isShuffleActive,
    toggleShuffle,
    deactivateShuffle,
    rebaseShuffleQueue,
    nextShuffled,
    prevShuffled,
  } = useShuffleMode();

  const { toggleLike, isLiked, getCount } = useLikes();
  const { recordPlay, getPlayCount } = usePlayCounts();

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
          recordTrackPlay(item.albumId, item.trackIndex);
        }
        // If null → end of shuffle queue, playback stops
      } else {
        // Record play for the next sequential track
        const { currentAlbumId, currentTrackIndex } = playerState;
        const album = albums.find((a) => a.id === currentAlbumId);
        if (album) {
          const nextIdx = currentTrackIndex + 1;
          if (nextIdx < album.tracks.length) {
            recordTrackPlay(currentAlbumId, nextIdx);
          }
        }
        next();
      }
    };
  }, [isShuffleActive, nextShuffled, play, next, playerState, albums, recordPlay]);

  // Shuffle-aware next
  function handleNext() {
    if (isShuffleActive) {
      const item = nextShuffled();
      if (item) {
        play(item.albumId, item.trackIndex);
        setActiveAlbumId(item.albumId);
        recordTrackPlay(item.albumId, item.trackIndex);
      } else {
        pause();
      }
    } else {
      const { currentAlbumId, currentTrackIndex } = playerState;
      const album = albums.find((a) => a.id === currentAlbumId);
      if (album) {
        const nextIdx = currentTrackIndex + 1;
        if (nextIdx < album.tracks.length) {
          recordTrackPlay(currentAlbumId, nextIdx);
        }
      }
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
        recordTrackPlay(item.albumId, item.trackIndex);
      }
    } else {
      const { currentAlbumId, currentTrackIndex } = playerState;
      const album = albums.find((a) => a.id === currentAlbumId);
      if (album) {
        const prevIdx = currentTrackIndex - 1;
        if (prevIdx >= 0) {
          recordTrackPlay(currentAlbumId, prevIdx);
        }
      }
      prev();
    }
  }

  // Helper: record a play count for a given album + track index
  function recordTrackPlay(albumId, trackIndex) {
    const album = albums.find((a) => a.id === albumId);
    if (album && album.tracks[trackIndex]) {
      recordPlay(album.tracks[trackIndex]);
    }
  }

  // When user clicks a track directly, keep shuffle active and rebase queue from that track
  function handleTrackClick(albumId, trackIndex) {
    if (isShuffleActive) {
      rebaseShuffleQueue(albums, albumId, trackIndex);
    }
    play(albumId, trackIndex);
    recordTrackPlay(albumId, trackIndex);
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
          isLiked={isLiked}
          getCount={getCount}
          onToggleLike={toggleLike}
          getPlayCount={getPlayCount}
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
