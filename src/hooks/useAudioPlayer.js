import { useState, useRef, useCallback, useEffect } from 'react';

export default function useAudioPlayer(albums) {
  const audioRef = useRef(null);

  const [playerState, setPlayerState] = useState({
    currentAlbumId: null,
    currentTrackIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  });

  // Initialize Audio object once
  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  const audio = audioRef.current;

  const getAlbum = useCallback((albumId) => {
    return albums.find((a) => a.id === albumId);
  }, []);

  const play = useCallback((albumId, trackIndex) => {
    const album = getAlbum(albumId);
    if (!album || trackIndex < 0 || trackIndex >= album.tracks.length) return;

    const track = album.tracks[trackIndex];
    const base = import.meta.env.BASE_URL;
    audio.src = `${base}${track.file}`;
    audio.load();
    audio.play().catch(() => {});

    setPlayerState((prev) => ({
      ...prev,
      currentAlbumId: albumId,
      currentTrackIndex: trackIndex,
      isPlaying: true,
      currentTime: 0,
      duration: 0,
    }));
  }, [audio, getAlbum]);

  const pause = useCallback(() => {
    audio.pause();
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, [audio]);

  const resume = useCallback(() => {
    audio.play().catch(() => {});
    setPlayerState((prev) => ({ ...prev, isPlaying: true }));
  }, [audio]);

  const next = useCallback(() => {
    setPlayerState((prev) => {
      const album = getAlbum(prev.currentAlbumId);
      if (!album) return prev;

      const nextIndex = prev.currentTrackIndex + 1;
      if (nextIndex >= album.tracks.length) {
        // Last track – stop
        audio.pause();
        return { ...prev, isPlaying: false };
      }

      const track = album.tracks[nextIndex];
      const base = import.meta.env.BASE_URL;
      audio.src = `${base}${track.file}`;
      audio.load();
      audio.play().catch(() => {});

      return {
        ...prev,
        currentTrackIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    });
  }, [audio, getAlbum]);

  const prev = useCallback(() => {
    setPlayerState((prevState) => {
      // If more than 3 seconds in, restart current track
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return { ...prevState, currentTime: 0 };
      }

      const prevIndex = prevState.currentTrackIndex - 1;
      if (prevIndex < 0) {
        // First track – restart from beginning
        audio.currentTime = 0;
        return { ...prevState, currentTime: 0 };
      }

      const album = getAlbum(prevState.currentAlbumId);
      if (!album) return prevState;

      const track = album.tracks[prevIndex];
      const base = import.meta.env.BASE_URL;
      audio.src = `${base}${track.file}`;
      audio.load();
      audio.play().catch(() => {});

      return {
        ...prevState,
        currentTrackIndex: prevIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    });
  }, [audio, getAlbum]);

  const seek = useCallback((time) => {
    audio.currentTime = time;
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  }, [audio]);

  // Called after a drag-drop reorder so the highlighted/active track follows
  // the moved element instead of staying on the old array position.
  const adjustIndexAfterReorder = useCallback((albumId, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setPlayerState((prev) => {
      if (prev.currentAlbumId !== albumId) return prev;
      const ci = prev.currentTrackIndex;
      let newIndex = ci;
      if (ci === fromIndex) {
        // The playing track itself was moved
        newIndex = toIndex;
      } else if (fromIndex < toIndex) {
        // Moved down: items between (fromIndex+1)..toIndex shift up by 1
        if (ci > fromIndex && ci <= toIndex) newIndex = ci - 1;
      } else {
        // Moved up: items between toIndex..(fromIndex-1) shift down by 1
        if (ci >= toIndex && ci < fromIndex) newIndex = ci + 1;
      }
      return { ...prev, currentTrackIndex: newIndex };
    });
  }, []);

  // Event listeners
  useEffect(() => {
    const handleTimeUpdate = () => {
      setPlayerState((prev) => ({ ...prev, currentTime: audio.currentTime }));
    };

    const handleLoadedMetadata = () => {
      setPlayerState((prev) => ({ ...prev, duration: audio.duration }));
    };

    const handleEnded = () => {
      // Auto-next
      next();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio, next]);

  return {
    playerState,
    play,
    pause,
    resume,
    next,
    prev,
    seek,
    adjustIndexAfterReorder,
  };
}
