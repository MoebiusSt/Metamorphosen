import { useState, useEffect } from 'react';
import Header from './Header.jsx';
import GenreTabs from './GenreTabs.jsx';
import AlbumView from './AlbumView.jsx';
import Player from './Player.jsx';
import EditPasswordModal from './EditPasswordModal.jsx';
import useAudioPlayer from '../hooks/useAudioPlayer.js';
import usePlaylistData from '../hooks/usePlaylistData.js';
import useEditMode from '../hooks/useEditMode.js';

export default function App() {
  const { albums, updateTrackTitle, reorderTracks, exportAlbumsJs } = usePlaylistData();
  const { isEditMode, showPasswordModal, toggleEditMode, authenticate, closePasswordModal } = useEditMode();

  const [activeAlbumId, setActiveAlbumId] = useState(albums[0].id);
  const { playerState, play, pause, resume, next, prev, seek } = useAudioPlayer(albums);

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
      <Header />
      <GenreTabs activeAlbumId={activeAlbumId} onTabChange={setActiveAlbumId} albums={albums} />
      <main className="app__main">
        <AlbumView
          album={activeAlbum}
          playerState={playerState}
          onTrackClick={play}
          isEditMode={isEditMode}
          onToggleEditMode={toggleEditMode}
          onTitleChange={updateTrackTitle}
          onReorderTracks={reorderTracks}
          onExport={exportAlbumsJs}
        />
      </main>
      <Player
        playerState={playerState}
        albums={albums}
        onPause={pause}
        onResume={resume}
        onNext={next}
        onPrev={prev}
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
