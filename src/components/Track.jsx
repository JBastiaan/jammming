import styles from '../css/Track.module.css';

const Track = ({ track = {}, isPlaylist = false, onClick }) => {
  return (
    <div className={styles.track}>
      <div className={styles.info}>
        <p className={styles.name}>{track.name}</p>
        <p className={styles.artist}>{track.artist}</p>
        <p className={styles.album}>{track.album}</p>
      </div>
      <button className={styles.addButton} onClick={() => onClick(track)}>{isPlaylist ? '-' : '+'}</button>
    </div>
  );
};

export default Track;