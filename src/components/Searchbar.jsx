import { useState } from 'react';
import styles from '../css/Searchbar.module.css';

const Searchbar = ({ onSearch }) => {
  const [term, setTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ term });
  };

  return (
    <div className={styles.searchContainer}>     
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search Tracks"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button className={styles.button} type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default Searchbar;
