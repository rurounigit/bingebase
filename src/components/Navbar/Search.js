import { useRef } from 'react';

export const Search = ({
  input,
  setInput,
  onSearchChange,
  pages,
}) => {
  const inputEl = useRef(null);

  return (
    <input
      className="search-navbar"
      type="text"
      placeholder="Search movies..."
      value={input}
      onChange={(e) => {
        setInput(e.target.value);
        onSearchChange(e.target.value);
      }}
      ref={inputEl}
      autoFocus={true}
    />
  );
};
