import { useState } from 'react';

const Searchbar = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ term });
  };

  return (
    <div>     
      <form onSubmit={handleSearch}>
        <div>
          <input
            type="text"
            placeholder="Search Tracks"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button type="submit">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Searchbar;
