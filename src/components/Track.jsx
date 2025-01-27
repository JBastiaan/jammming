import styles from '../css/Track.module.css';

const Track = ({ track = {}, onAddToPlaylist, onRemoveFromPlaylist }) => {
  return (
    <div className={styles.track}>
      <div className={styles.info}>
        <p className={styles.name}>{track.name}</p>
        <p className={styles.artist}>{track.artist}</p>
        <p className={styles.album}>{track.album}</p>
      </div>
      {track.isAdded ? (
        <button className={styles.addButton} onClick={() => onRemoveFromPlaylist(track)}>-</button>
      ) : (
        <button className={styles.addButton} onClick={() => onAddToPlaylist(track)}>+</button>
      )}
    </div>
  );
};

export default Track;