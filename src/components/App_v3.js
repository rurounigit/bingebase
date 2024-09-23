import { useState, useEffect, useRef } from 'react';
import { Navbar } from './Navbar';
import { Main } from './Main';
import { Search } from './Search';
import { NumResults } from './NumResults';
import { Box } from './Box';
import { MovieList } from './MovieList';
import { WatchedSummary } from './WatchedSummary';
import { WatchedMoviesList } from './WatchedMoviesList';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { MovieDetails } from './MovieDetails';

export const KEY = '329428ec';

export default function App() {
  const [movies, setMovies] = useState([]);
  //const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(() => {
    const storedWatchlist = localStorage.getItem('watched');
    return JSON.parse(storedWatchlist);
  });
  const [isLoading, setIsLoading] = useState(false);

  const [hasError, setHasError] = useState('');

  const [query, setQuery] = useState('');
  const [selectedID, setSelectedID] = useState(null);

  const handleAddMovie = (rating, movie) => {
    const newMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      runtime: movie.Runtime,
      imdbRating: movie.imdbRating,
      userRating: rating,
    };

    setWatched(
      watched.some(
        (watchedMovie) => watchedMovie.imdbID === movie.imdbID
      )
        ? watched.map((object) =>
            object.imdbID === movie.imdbID
              ? { ...object, userRating: rating }
              : object
          )
        : [...watched, newMovie]
    );
    /*  localStorage.setItem(
      'watched',
      JSON.stringify([...watched, newMovie])
    ); */
  };

  const handleDeleteMovie = (selectedID) => {
    setWatched(
      watched.filter((movie) => movie.imdbID !== selectedID)
    );
  };

  const handleSelectMovie = (movieID) => {
    setSelectedID((selectedID) =>
      movieID === selectedID ? null : movieID
    );
  };

  const handleCloseMovie = () => {
    setSelectedID(null);
  };

  useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]);

  // useEffect Version:

  /* useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async () => {
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

        setMovies(data.Search);
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
      setMovies([]);
      setHasError('');
      return;
    }

    const timer = setTimeout(fetchMovies, 400);
    // Clean up function
    return () => {
      controller.abort(); // Abort the fetch
      clearTimeout(timer); // Clear timeout
    };
  }, [query]); */

  // event handler Version:

  const cleanupRef = useRef();

  const handleSearchChange = async (query) => {
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    const controller = new AbortController();
    const fetchMovies = async () => {
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

        setMovies(data.Search);
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
      setMovies([]);
      setHasError('');
      return;
    }

    const timer = setTimeout(fetchMovies, 400);
    // Clean up function

    cleanupRef.current = () => {
      controller.abort();
      clearTimeout(timer);
    }; // Clear timeout
  };

  return (
    <>
      <Navbar>
        <Search
          query={query}
          setQuery={setQuery}
          onSearchChange={handleSearchChange}
        />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : hasError ? (
            <ErrorMessage message={hasError} />
          ) : (
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectMovie}
            />
          )}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddMovie={handleAddMovie}
              onDeleteMovie={handleDeleteMovie}
              watched={watched}
              key={selectedID}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onSelectMovie={handleSelectMovie}
                onDeleteMovie={handleDeleteMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
