import { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '../config/firebase.js';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { getTrackDocId } from './useLikes.js';

const COLLECTION = 'playCounts';

export default function usePlayCounts() {
  const [counts, setCounts] = useState({});       // { docId: number }
  const lastRecordedRef = useRef(null);            // prevent double-counting same play

  // Load all play counts once on mount
  useEffect(() => {
    let cancelled = false;
    getDocs(collection(db, COLLECTION))
      .then((snap) => {
        if (cancelled) return;
        const map = {};
        snap.forEach((d) => { map[d.id] = d.data().count ?? 0; });
        setCounts(map);
      })
      .catch((err) => {
        console.warn('Failed to load play counts:', err);
      });
    return () => { cancelled = true; };
  }, []);

  const recordPlay = useCallback((track) => {
    if (!track) return;
    const docId = getTrackDocId(track);

    // Prevent double-recording the exact same track click
    if (lastRecordedRef.current === docId) return;
    lastRecordedRef.current = docId;
    // Reset after a short delay so replaying the same track counts again
    setTimeout(() => {
      if (lastRecordedRef.current === docId) lastRecordedRef.current = null;
    }, 3000);

    // Optimistic UI
    setCounts((prev) => ({
      ...prev,
      [docId]: (prev[docId] ?? 0) + 1,
    }));

    // Firestore write
    const ref = doc(db, COLLECTION, docId);
    const currentCount = counts[docId] ?? 0;

    if (currentCount === 0) {
      setDoc(ref, { count: 1 }).catch((err) =>
        console.warn('Play count write failed:', err),
      );
    } else {
      updateDoc(ref, { count: increment(1) }).catch((err) =>
        console.warn('Play count update failed:', err),
      );
    }
  }, [counts]);

  const getPlayCount = useCallback(
    (track) => counts[getTrackDocId(track)] ?? 0,
    [counts],
  );

  return { recordPlay, getPlayCount };
}
