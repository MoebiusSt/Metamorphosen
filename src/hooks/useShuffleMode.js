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

  // Move the queue pointer to a manually selected track without rebuilding the queue.
  // - If the track is still upcoming (future in queue): advance pointer to it → history intact, queue continues from there.
  // - If already played (past) or not found: leave pointer unchanged → track plays as a manual interrupt,
  //   queue resumes from the next unplayed position when it ends naturally.
  const pointQueueTo = useCallback((albumId, trackIndex) => {
    const queue = queueRef.current;
    const currentPos = positionRef.current;
    const futureIdx = queue.findIndex(
      (it, i) => i > currentPos && it.albumId === albumId && it.trackIndex === trackIndex
    );
    if (futureIdx !== -1) {
      positionRef.current = futureIdx;
    }
    // If in the past or not found: no change – natural end will advance to currentPos+1
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
    pointQueueTo,
    nextShuffled,
    prevShuffled,
    getCurrentShuffled,
  };
}
