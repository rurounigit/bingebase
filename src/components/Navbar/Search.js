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
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearchChange(e.target.value, pages);
      }}
      ref={inputEl}
      autoFocus={true}
    />
  );
};
