import Track from './Track';

const Tracklist = ({ tracks = [], isPlaylist = false, onClick }) => {
  return (
    <div>
      {tracks.length > 0 ? (
        tracks.map((track) => (
          <Track key={track.id} track={track} isPlaylist={isPlaylist} onClick={onClick} />
        ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Tracklist;