import Tracklist from './Tracklist';
import styles from '../css/SearchResults.module.css';

const SearchResults = ({ tracks = [], onAddToPlaylist }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Results</h2>
      <Tracklist tracks={tracks} onAddToPlaylist={onAddToPlaylist} />
    </div>
  );
};

export default SearchResults;