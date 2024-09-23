import { useState, useRef, useEffect } from 'react';
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
import { useLocalStorage } from '../hooks/useLocalStorage';
import { FilterSortBar } from './FilterSortBar';
import { FilterSortBox } from './FilterSortBox';
import { Button } from './Button';
import { FilterSVG } from './FilterSVG';
import { Pages } from './Pages';
import { Sort } from './Sort';

export const KEY = '329428ec';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedID, setSelectedID] = useState(null);
  const [pages, setPages] = useState({ previous: 1, current: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState('');
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [watched, setWatched] = useLocalStorage([], 'watched');
  const [isReversed, setIsReversed] = useState(false);
  const isActive = query.length < 3 ? false : true;
  const isActiveWatchlist = watched.length > 1;

  const handleSortResults = (e) => {
    const prop = e.target.value;
    const sortedByProp = [...movies].sort((a, b) =>
      b[prop].localeCompare(a[prop])
    );
    setMovies(sortedByProp);
  };

  const handleReverse = () => {
    setIsReversed((prev) => !prev);
    const reversed = [...movies].reverse();
    setMovies(reversed);
  };

  const handleAddPage = () => {
    setPages((pages) => ({
      previous: Number(pages.current),
      current:
        Number(pages.current) <= Math.trunc(totalResults / 10)
          ? Number(pages.current) + 1
          : Number(pages.current),
    }));
  };

  const handleRemovePage = () => {
    setPages((pages) => ({
      previous: Number(pages.current),
      current: Number(pages.current) <= 1 ? 1 : +pages.current - 1,
    }));
  };

  const handleAddMovie = (rating, movie) => {
    const newMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Runtime: movie.Runtime,
      imdbRating: movie.imdbRating,
      userRating: rating,
    };

    setWatched((watched) =>
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
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== selectedID)
    );
  };

  const handleSelectMovie = (movieID) => {
    setSelectedID((selectedID) =>
      movieID === selectedID ? null : movieID
    );
  };

  function handleCloseMovie() {
    setSelectedID(null);
  }

  const cleanupRef = useRef();

  const handleSearchChange = async (query, pages) => {
    setPages({ previous: 1, current: 1 });
    setMovies([]);
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    const controller = new AbortController();
    const fetchMovies = async () => {
      let n = 0;

      while (n < pages.current) {
        n++;

        try {
          setIsLoading(true);
          setHasError('');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=${n}`,
            { signal: controller.signal }
          );

          if (!res || !res.ok)
            throw new Error("couldn't load movie details.");

          const data = await res.json();

          if (data.Response === 'False') {
            throw new Error('no results found.');
          }

          setTotalResults(data.totalResults);
          setMovies((movies) => [...movies, ...data.Search]);
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
      }
    };

    if (query.length < 3) {
      setTotalResults(0);
      setMovies([]);
      setHasError('');
      return;
    }

    const timer = setTimeout(fetchMovies, 400);

    cleanupRef.current = () => {
      controller.abort();
      clearTimeout(timer);
    };
  };

  /* fetches additional movies and adds them to the search results
  or removes movies from the search results, based on the current page.
  */

  useEffect(() => {
    const fetchMovies = async () => {
      let n = 0;

      if (query.length === 0) {
        n = pages.current;
      } else if (pages.current < pages.previous) {
        n = pages.current;
        setMovies((movies) =>
          movies.slice(
            0,
            movies.length - (pages.previous - pages.current) * 10
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
          );

          if (!res.ok)
            throw new Error("Couldn't load movie details.");

          const data = await res.json();

          if (data.Response === 'False')
            throw new Error('No results found.');

          setTotalResults(data.totalResults);
          setMovies((movies) => [...movies, ...data.Search]);
          setHasError('');
        } catch (err) {
          if (err.name === 'AbortError') return;
          setHasError(err.message || "Couldn't load movies.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setHasError('');
      return;
    }

    fetchMovies();

    return () => {};
  }, [query, pages]);

  return (
    <>
      <Navbar>
        <Search
          query={query}
          setQuery={setQuery}
          onSearchChange={handleSearchChange}
          pages={pages}
        />
      </Navbar>
      <FilterSortBar>
        <FilterSortBox>
          <Button className={'btn-filter'} isActive={isActive}>
            <FilterSVG />
          </Button>
          <Pages
            isActive={isActive}
            pages={pages}
            setPages={setPages}
            onRemovePage={handleRemovePage}
            onAddPage={handleAddPage}
          />
          <Sort
            isActive={isActive}
            onReverse={handleReverse}
            onSortResults={handleSortResults}
          />
        </FilterSortBox>

        <FilterSortBox>
          <Sort
            isActive={isActiveWatchlist}
            onReverse={handleReverse}
            onSortResults={handleSortResults}
          />
        </FilterSortBox>
      </FilterSortBar>
      <Main>
        <Box>
          <NumResults
            movies={movies}
            totalResults={totalResults}
            isActive={isActive}
          />
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

const Toggle = () => {
  return (
    <div className="checkbox-container">
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  );
};
