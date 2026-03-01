import albums from '../data/albums.js';

export default function GenreTabs({ activeAlbumId, onTabChange }) {
  return (
    <nav className="genre-tabs">
      <div className="genre-tabs__scroll">
        {albums.map((album) => (
          <button
            key={album.id}
            className={`genre-tabs__tab ${activeAlbumId === album.id ? 'genre-tabs__tab--active' : ''}`}
            onClick={() => onTabChange(album.id)}
          >
            {album.title}
          </button>
        ))}
      </div>
    </nav>
  );
}
