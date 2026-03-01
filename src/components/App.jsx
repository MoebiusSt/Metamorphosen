import { useState } from 'react';
import Header from './Header.jsx';
import GenreTabs from './GenreTabs.jsx';
import AlbumView from './AlbumView.jsx';
import Player from './Player.jsx';
import useAudioPlayer from '../hooks/useAudioPlayer.js';
import albums from '../data/albums.js';

export default function App() {
  const [activeAlbumId, setActiveAlbumId] = useState(albums[0].id);
  const { playerState, play, pause, resume, next, prev, seek } = useAudioPlayer();

  return (
    <div className="app">
      <Header />
      <GenreTabs activeAlbumId={activeAlbumId} onTabChange={setActiveAlbumId} />
      <main className="app__main">
        <AlbumView
          activeAlbumId={activeAlbumId}
          playerState={playerState}
          onTrackClick={play}
        />
      </main>
      <Player
        playerState={playerState}
        onPause={pause}
        onResume={resume}
        onNext={next}
        onPrev={prev}
        onSeek={seek}
      />
    </div>
  );
}
