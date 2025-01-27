import { useState } from 'react';
import Searchbar from './Searchbar';
import SearchResults from './SearchResults';
import Playlist from './Playlist';
import styles from '../css/App.module.css';

function App() {
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const handleSearch = async ({ term }) => {
    console.log('Searching...', { term });

    // Generate some random sample tracks
    const sampleTracks = [
      { id: 1, name: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera' },
      { id: 2, name: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV' },
      { id: 3, name: 'Hotel California', artist: 'Eagles', album: 'Hotel California' },
      { id: 4, name: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction' },
      { id: 5, name: 'Billie Jean', artist: 'Michael Jackson', album: 'Thriller' }
    ];

    setSearchResultTracks(sampleTracks);
  };

  const handleSave = (name, tracks) => {
    console.log('Saving playlist to spotify with name: ' + name + ' and tracks: ' + tracks);
    //TODO: Save to spotify
    setPlaylistTracks([]);
  };

  const handleAddToPlaylist = (track) => {
    track.isAdded = true;
    console.log('Adding track to playlist: ' + track);
    setPlaylistTracks([...playlistTracks, track]);
  };

  const handleRemoveFromPlaylist = (track) => {
    track.isAdded = false;
    console.log('Removing track from playlist: ' + track);
    setPlaylistTracks([...playlistTracks.filter(t => t.id != track.id)]);
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Jammming</h1>
      </div>
      <div className={styles.content}>
        <div>
          <Searchbar onSearch={handleSearch} />
          <SearchResults tracks={searchResultTracks} onAddToPlaylist={handleAddToPlaylist} />
        </div>
        <Playlist tracks={playlistTracks} onSave={handleSave} onRemoveFromPlaylist={handleRemoveFromPlaylist} />
      </div>
    </div>
  );
}

export default App; 