import { useState } from 'react';
import Tracklist from './Tracklist';
import styles from '../css/Playlist.module.css';

const Playlist = ({ tracks = [], onSave, onClick }) => {
  const [name, setName] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setName('')
    onSave(name, tracks);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Playlist</h2>
      <form className={styles.form} onSubmit={handleSave}>
        <div>
          <input
            className={styles.input}
            type="text"
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className={styles.saveButton} type="submit">
            Save to Spotify
          </button>
        </div>
      </form>
      <Tracklist tracks={tracks} isPlaylist={true} onClick={onClick} />
    </div>
  );
};

export default Playlist;