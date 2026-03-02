import { useState, useCallback, useRef } from 'react';

/**
 * Fisher-Yates shuffle (in-place).
 */
function fisherYates(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Build a shuffled queue of all tracks across all albums.
 * If a current track is playing, place it at position 0.
 */
function buildQueue(albums, currentAlbumId, currentTrackIndex) {
  const items = [];
  for (const album of albums) {
    for (let i = 0; i < album.tracks.length; i++) {
      items.push({ albumId: album.id, trackIndex: i });
    }
  }

  fisherYates(items);

  // Move the currently playing track to position 0 (if any)
  if (currentAlbumId != null && currentTrackIndex != null) {
    const idx = items.findIndex(
      (it) => it.albumId === currentAlbumId && it.trackIndex === currentTrackIndex
    );
    if (idx > 0) {
      const [item] = items.splice(idx, 1);
      items.unshift(item);
    }
  }

  return items;
}

export default function useShuffleMode() {
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  const queueRef = useRef([]);
  const positionRef = useRef(0);
  // Force re-render counter (lightweight way to notify consumers)
  const [, setTick] = useState(0);

  const toggleShuffle = useCallback((albums, currentAlbumId, currentTrackIndex) => {
    setIsShuffleActive((prev) => {
      if (prev) {
        // Turning off
        queueRef.current = [];
        positionRef.current = 0;
        return false;
      }
      // Turning on
      queueRef.current = buildQueue(albums, currentAlbumId, currentTrackIndex);
      positionRef.current = 0;
      return true;
    });
    setTick((t) => t + 1);
  }, []);

  const deactivateShuffle = useCallback(() => {
    setIsShuffleActive(false);
    queueRef.current = [];
    positionRef.current = 0;
  }, []);

  // Rebuild the shuffle queue with a newly selected track at position 0,
  // keeping shuffle mode active (used when user manually clicks a track).
  const rebaseShuffleQueue = useCallback((albums, albumId, trackIndex) => {
    queueRef.current = buildQueue(albums, albumId, trackIndex);
    positionRef.current = 0;
    setTick((t) => t + 1);
  }, []);

  const nextShuffled = useCallback(() => {
    const queue = queueRef.current;
    const next = positionRef.current + 1;
    if (next >= queue.length) return null; // end of queue
    positionRef.current = next;
    return queue[next];
  }, []);

  const prevShuffled = useCallback(() => {
    const queue = queueRef.current;
    const prev = positionRef.current - 1;
    if (prev < 0) {
      // Stay at position 0 → restart current track (caller handles audio restart)
      return queue[0] ?? null;
    }
    positionRef.current = prev;
    return queue[prev];
  }, []);

  const getCurrentShuffled = useCallback(() => {
    return queueRef.current[positionRef.current] ?? null;
  }, []);

  return {
    isShuffleActive,
    toggleShuffle,
    deactivateShuffle,
    rebaseShuffleQueue,
    nextShuffled,
    prevShuffled,
    getCurrentShuffled,
  };
}
