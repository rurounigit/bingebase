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
import { Button } from './Button';

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
    console.log(prop);
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

  function handleCloseMovie() {
    setSelectedID(null);
  }

  // event handler Version:

  const cleanupRef = useRef();

  const handleSearchChange = async (query, pages, setActive) => {
    setPages((pages) => ({
      previous: 1,
      current: 1,
    }));
    setMovies([]);
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    const controller = new AbortController();
    const fetchMovies = async () => {
      let n = 0;

      /*  if (query.length === 0) {
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
      } */

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

    // Debouncing the fetch call
    const timer = setTimeout(fetchMovies, 0);

    return () => {
      clearTimeout(timer);
    };
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
      <Filters
        movies={movies}
        pages={pages}
        setPages={setPages}
        onAddPage={handleAddPage}
        onRemovePage={handleRemovePage}
        totalResults={totalResults}
        isActive={isActive}
        onSortResults={handleSortResults}
        isReversed={isReversed}
        onReverse={handleReverse}
        isActiveWatchlist={isActiveWatchlist}
      ></Filters>
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

const Filters = ({
  movies,
  pages,
  setPages,
  totalResults,
  onAddPage,
  onRemovePage,
  onSortResults,
  isActive,
  isReversed,
  onReverse,
  isActiveWatchlist,
}) => {
  const [value, setValue] = useState('fruit');

  const handleSelect = (e) => {
    setValue(e.target.value);
    onSortResults(e);
  };

  const handleChangePage = (e) => {
    setPages((pages) => ({
      previous: Number(pages.current),
      current: e.target.value < 1 ? 1 : +e.target.value,
    }));
  };

  return (
    <div className="data-bar">
      <div className="filter">
        <Button className={'btn-filter'} isActive={isActive}>
          <svg
            fill="#ffffff"
            width="20px"
            height="20px"
            viewBox="0 0 33 33"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <g
              id="SVGRepo_bgCarrier"
              strokeWidth="0"
              transform="translate(0,0), scale(1)"
            ></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {' '}
              <title>bars-filter</title>{' '}
              <path d="M30 6.749h-28c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h28c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM24 14.75h-16c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h16c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM19 22.75h-6.053c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h6.053c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0z"></path>{' '}
            </g>
          </svg>
        </Button>

        <div className="sort">
          <div className="pages">
            <label
              htmlFor="pages"
              style={{
                opacity: !isActive ? '0.3' : '1',
                cursor: !isActive ? 'default' : 'pointer',
              }}
            >
              {'pages '}
            </label>
            <Button
              className={'btn-add-page'}
              isActive={isActive}
              onClick={onRemovePage}
            >
              –
            </Button>
            <input
              id="pages"
              disabled={!isActive}
              value={pages.current}
              onChange={handleChangePage}
              style={{
                opacity: !isActive ? '0.3' : '1',
                cursor: !isActive ? 'default' : 'pointer',
              }}
            />
            <Button
              className={'btn-add-page'}
              isActive={isActive}
              onClick={onAddPage}
            >
              +
            </Button>
          </div>
          <label htmlFor="sort">
            <span
              style={{
                opacity: !isActive ? '0.3' : '1',
                cursor: !isActive ? 'default' : 'pointer',
              }}
            >
              {'sort by '}
            </span>
            <select
              id="sort"
              disabled={!isActive}
              value={value}
              onChange={handleSelect}
              style={{
                opacity: !isActive ? '0.3' : '1',
                cursor: !isActive ? 'default' : 'pointer',
              }}
            >
              <option value="Title">Title</option>
              <option value="Year">Year</option>
              <option value="Type">Type</option>
            </select>
          </label>
          <Button
            className="btn-reverse"
            onClick={onReverse}
            isActive={isActive}
          >
            {'\u21F5'}
          </Button>
        </div>
      </div>
      <div className="filter">
        <div className="sort">
          {' '}
          <label htmlFor="sort">
            <span
              style={{
                opacity: !isActiveWatchlist ? '0.3' : '1',
                cursor: !isActiveWatchlist ? 'default' : 'pointer',
              }}
            >
              {'sort by '}
            </span>
            <select
              id="sort"
              disabled={!isActiveWatchlist}
              value={value}
              onChange={handleSelect}
              style={{
                opacity: !isActiveWatchlist ? '0.3' : '1',
                cursor: !isActiveWatchlist ? 'default' : 'pointer',
              }}
            >
              <option value="Title">Title</option>
              <option value="Year">Year</option>
              <option value="Type">Type</option>
            </select>
          </label>
          <Button
            className="btn-reverse"
            onClick={onReverse}
            isActive={isActiveWatchlist}
          >
            {'\u21F5'}
          </Button>
        </div>
      </div>
    </div>
  );
};
