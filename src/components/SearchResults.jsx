import Tracklist from './Tracklist';
import styles from '../css/SearchResults.module.css';

const SearchResults = ({ tracks = [], onClick, isLoading }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Results</h2>
      {isLoading ? (
        <div className={styles.loading}>Searching...</div>
      ) : (
        <Tracklist tracks={tracks} onClick={onClick} />
      )}
    </div>
  );
};

export default SearchResults;