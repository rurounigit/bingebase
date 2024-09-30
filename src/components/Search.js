import { useRef } from 'react';
import { useKey } from '../hooks/useKey';

export const Search = ({
  query,
  setQuery,
  onSearchChange,
  pages,
}) => {
  const inputEl = useRef(null);

  /* useEffect(() => {
    inputEl.current.focus();
  }, []); */

  /* useKey('Enter', () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  }); */

  /* useEffect(() => {
    const callback = (e) => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        if (document.activeElement === inputEl.current) return;
        inputEl.current.focus();
        setQuery('');
      }
    };
    document.addEventListener('keydown', callback);

    return () => document.removeEventListener('keydown', callback);
  }, [setQuery]); */

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
