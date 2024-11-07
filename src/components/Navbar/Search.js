import { useRef } from 'react';

export const Search = ({
  query,
  setQuery,
  onSearchChange,
  pages,
}) => {
  const inputEl = useRef(null);

  return (
    <input
      className="search-navbar"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearchChange(e.target.value);
      }}
      ref={inputEl}
      autoFocus={true}
    />
  );
};
