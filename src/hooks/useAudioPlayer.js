import { useState, useRef, useCallback, useEffect } from 'react';
import albums from '../data/albums.js';

export default function useAudioPlayer() {
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
  };
}
