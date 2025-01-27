import Track from './Track';

const Tracklist = ({ tracks = [], onAddToPlaylist, onRemoveFromPlaylist }) => {
  return (
    <div>
      {tracks.length > 0 ? (
        tracks.map((track) => (
          <Track key={track.id} track={track} onAddToPlaylist={onAddToPlaylist} onRemoveFromPlaylist={onRemoveFromPlaylist} />
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Tracklist;