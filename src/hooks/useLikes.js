import { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase.js';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';

const COLLECTION = 'likes';
const STORAGE_KEY = 'metamorphosen_liked';

/** Extract Firestore document ID from track file path (filename without extension). */
export function getTrackDocId(track) {
  const parts = track.file.split('/');
  return parts[parts.length - 1].replace('.mp3', '');
}

function loadLikedSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveLikedSet(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export default function useLikes() {
  const [counts, setCounts] = useState({});       // { docId: number }
  const [likedSet, setLikedSet] = useState(loadLikedSet); // Set of docIds
  const [loaded, setLoaded] = useState(false);

  // Load all like counts once on mount
  useEffect(() => {
    let cancelled = false;
    getDocs(collection(db, COLLECTION))
      .then((snap) => {
        if (cancelled) return;
        const map = {};
        snap.forEach((d) => { map[d.id] = d.data().count ?? 0; });
        setCounts(map);
        setLoaded(true);
      })
      .catch((err) => {
        console.warn('Failed to load likes:', err);
        setLoaded(true); // degrade gracefully
      });
    return () => { cancelled = true; };
  }, []);

  const toggleLike = useCallback((track) => {
    const docId = getTrackDocId(track);
    const alreadyLiked = likedSet.has(docId);
    const delta = alreadyLiked ? -1 : 1;

    // Optimistic UI update
    setCounts((prev) => ({
      ...prev,
      [docId]: Math.max(0, (prev[docId] ?? 0) + delta),
    }));

    const next = new Set(likedSet);
    if (alreadyLiked) next.delete(docId); else next.add(docId);
    setLikedSet(next);
    saveLikedSet(next);

    // Firestore write
    const ref = doc(db, COLLECTION, docId);
    const currentCount = counts[docId] ?? 0;

    if (currentCount === 0 && !alreadyLiked) {
      // First like ever for this track → create document
      setDoc(ref, { count: 1 }).catch((err) =>
        console.warn('Like write failed:', err),
      );
    } else {
      updateDoc(ref, { count: increment(delta) }).catch((err) =>
        console.warn('Like update failed:', err),
      );
    }
  }, [likedSet, counts]);

  const isLiked = useCallback(
    (track) => likedSet.has(getTrackDocId(track)),
    [likedSet],
  );

  const getCount = useCallback(
    (track) => counts[getTrackDocId(track)] ?? 0,
    [counts],
  );

  return { toggleLike, isLiked, getCount, loaded };
}
