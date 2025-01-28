import { useState, useEffect, useRef } from 'react';
import Searchbar from './Searchbar';
import SearchResults from './SearchResults';
import Playlist from './Playlist';
import styles from '../css/App.module.css';
import { initiateSpotifyLogin, handleCallback, isAuthenticated } from '../utils/auth';
import { searchTracks, savePlaylist } from '../utils/spotify';

function App() {
  const [searchResultTracks, setSearchResultTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const authInProgress = useRef(false);

  useEffect(() => {
    const authenticate = async () => {
      // Prevent duplicate auth attempts
      if (authInProgress.current) return;
      authInProgress.current = true;

      try {
        // If we're not authenticated and there's no code in the URL, initiate login
        if (!isAuthenticated() && !window.location.search.includes('code=')) {
          await initiateSpotifyLogin();
          return;
        }

        // If we have a code in the URL, handle the callback
        if (window.location.search.includes('code=')) {
          await handleCallback();
          // Clean up the URL
          window.history.replaceState({}, document.title, '/');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        authInProgress.current = false;
      }
    };

    authenticate();
  }, []);

  const handleSearch = async ({ term }) => {
    if (!term.trim()) {
      setSearchResultTracks([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const tracks = await searchTracks(term);
      setSearchResultTracks(tracks);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search tracks. Please try again.');
      setSearchResultTracks([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async (name, tracks) => {
    if (!name.trim()) {
      setError('Please enter a playlist name');
      return;
    }

    if (!tracks.length) {
      setError('Please add some tracks to your playlist');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await savePlaylist(name, tracks);
      setPlaylistTracks([]); // Clear the playlist after successful save
      // Show success message
      alert('Playlist saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save playlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToPlaylist = (track) => {
    if (!playlistTracks.some(t => t.id === track.id)) {
      setPlaylistTracks([...playlistTracks, track]);
    }
  };

  const handleRemoveFromPlaylist = (track) => {
    setPlaylistTracks(playlistTracks.filter(t => t.id !== track.id));
  };

  if (isLoading) {
    return <div className={styles.container}>
      <div className={styles.loading}>Authenticating with Spotify...</div>
    </div>;
  }

  if (error) {
    return <div className={styles.container}>
      <div className={styles.error}>
        {error}
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Jammming</h1>
      </div>
      <div className={styles.content}>
        <Searchbar onSearch={handleSearch} isSearching={isSearching} />
        <div className={styles.mainContent}>
          <SearchResults
            tracks={searchResultTracks}
            onClick={handleAddToPlaylist}
            isLoading={isSearching}
          />
          <Playlist
            tracks={playlistTracks}
            onSave={handleSave}
            onClick={handleRemoveFromPlaylist}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

export default App; 