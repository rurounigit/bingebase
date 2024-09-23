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

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
  },
];

export const KEY = '329428ec';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
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
