import { useState, useEffect, useRef } from 'react';
import { KEY } from '../components/App';

export function useMovies(query, callback) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState('');

  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    callbackRef.current?.();
    const controller = new AbortController();
    const fetchMovies = async () => {
      setSearchResults([]);
      try {
        setIsLoading(true);
        setHasError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res || !res.ok)
          throw new Error("couldn't load movie details.");

        const data = await res.json();

        if (data.Response === 'False')
          throw new Error('no results found.');

        setTotalResults(data.totalResults);
        setSearchResults((searchResults) => [
          ...searchResults,
          ...data.Search,
        ]);
        setHasError('');
      } catch (err) {
        if (err.message === 'Failed to fetch') {
          setHasError("couldn't load movies.");
        } else {
          if (err.message !== 'AbortError') {
            setHasError(err.message);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setSearchResults([]);
      setHasError('');
      return;
    }

    const timer = setTimeout(fetchMovies, 400);
    // Clean up function
    return () => {
      controller.abort(); // Abort the fetch
      clearTimeout(timer); // Clear timeout
    };
  }, [query]);
  return { isLoading, hasError, searchResults, totalResults };
}
