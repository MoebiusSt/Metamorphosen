import { useState, useCallback } from 'react';
import albumsData from '../data/albums.js';

const STORAGE_KEY = 'metamorphosen_playlist';

function loadOverrides() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    // Drop overrides where track count no longer matches the base data
    // (happens when tracks are added/removed in albums.js after a deploy)
    const validated = {};
    for (const album of albumsData) {
      const override = stored[album.id];
      if (override && override.length === album.tracks.length) {
        validated[album.id] = override;
      }
    }
    return validated;
  } catch {
    return {};
  }
}

function applyOverrides(overrides) {
  return albumsData.map(album => {
    if (overrides[album.id]) {
      // Always use file paths from albums.js (canonical source), matched by track number.
      // This prevents stale LocalStorage paths (e.g. unencoded filenames) from breaking playback.
      const fileByNumber = Object.fromEntries(album.tracks.map(t => [t.number, t.file]));
      const tracks = overrides[album.id].map(t => ({
        ...t,
        file: fileByNumber[t.number] ?? t.file,
      }));
      return { ...album, tracks };
    }
    return album;
  });
}

function generateAlbumsJs(albums) {
  const lines = ['const albums = ['];
  albums.forEach((album, ai) => {
    lines.push('  {');
    lines.push(`    id: "${album.id}",`);
    lines.push(`    title: "${album.title}",`);
    lines.push(`    genre: "${album.genre}",`);
    lines.push(`    accent: { main: "${album.accent.main}", dim: "${album.accent.dim}", glow: "${album.accent.glow}" },`);
    lines.push(`    cover: "${album.cover}",`);
    lines.push('    tracks: [');
    album.tracks.forEach((track, ti) => {
      const comma = ti < album.tracks.length - 1 ? ',' : '';
      lines.push(`      { number: ${track.number}, title: "${track.title}", file: "${track.file}" }${comma}`);
    });
    lines.push('    ]');
    lines.push(ai < albums.length - 1 ? '  },' : '  }');
  });
  lines.push('];', '', 'export default albums;');
  return lines.join('\n');
}

export default function usePlaylistData() {
  const [overrides, setOverrides] = useState(loadOverrides);

  const albums = applyOverrides(overrides);

  const updateTrackTitle = useCallback((albumId, trackIndex, newTitle) => {
    setOverrides(prev => {
      const base = albumsData.find(a => a.id === albumId);
      const currentTracks = prev[albumId] || base.tracks;
      const updated = currentTracks.map((t, i) =>
        i === trackIndex ? { ...t, title: newTitle } : t
      );
      const next = { ...prev, [albumId]: updated };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reorderTracks = useCallback((albumId, fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    setOverrides(prev => {
      const base = albumsData.find(a => a.id === albumId);
      const currentTracks = [...(prev[albumId] || base.tracks)];
      const [moved] = currentTracks.splice(fromIndex, 1);
      currentTracks.splice(toIndex, 0, moved);
      const next = { ...prev, [albumId]: currentTracks };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const exportAlbumsJs = useCallback(() => {
    return generateAlbumsJs(applyOverrides(overrides));
  }, [overrides]);

  return { albums, updateTrackTitle, reorderTracks, exportAlbumsJs };
}
