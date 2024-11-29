import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { KEY } from '../components/App';

export function useLoadFirstPage, callback, pages) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState('');
  const movieListIsEmpty = useRef(true);
  movieListIsEmpty.current = searchResults.length === 0;

  const callbackRef = useRef();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    callbackRef.current?.();
    //const controller = new AbortController();
    // const signal = controller.signal;

    const fetchMovies = async () => {
      let n = 0;

      if (movieListIsEmpty.current && query.length !== 0) {
        n = 0;
      } else if (pages.current < pages.previous) {
        n = pages.current;
        setSearchResults((searchResults) =>
          searchResults.slice(
            0,
            searchResults.length -
              (pages.previous - pages.current) * 10
          )
        );
      } else {
        n = pages.previous;
      }

      while (n < pages.current) {
        n++;

        try {
          setIsLoading(true);
          setHasError('');

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=${n}`
            //{ signal }
          );

          if (!res.ok)
            throw new Error("Couldn't load movie details.");

          const data = await res.json();

          if (data.Response === 'False')
            throw new Error('No results found.');

          setTotalResults(data.totalResults);
          setSearchResults((searchResults) => [
            ...searchResults,
            ...data.Search,
          ]);
          setHasError('');
        } catch (err) {
          if (err.name === 'AbortError') return; // Only handle non-abort errors
          setHasError(err.message || "Couldn't load movies.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (query.length < 3) {
      setSearchResults([]);
      setHasError('');
      return;
    }

    // Debouncing the fetch call
    const timer = setTimeout(fetchMovies, 0);

    // Clean up previous requests if the query or pages change
    return () => {
      //controller.abort(); // Abort the ongoing fetch
      clearTimeout(timer); // Clear the timeout
    };
  }, [query, pages]);

  return { isLoading, hasError, searchResults, totalResults };
}
