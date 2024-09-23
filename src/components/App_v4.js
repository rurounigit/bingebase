import { useState } from 'react';
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
import { useLoadPages } from '../hooks/useLoadPages';
import { useMovies } from '../hooks/useMovies';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const KEY = '329428ec';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedID, setSelectedID] = useState(null);
  const [pages, setPages] = useState({ previous: 1, current: 1 });

  const { isLoading, hasError, movies, totalResults } = useMovies(
    query,
    handleCloseMovie
  );
  const [watched, setWatched] = useLocalStorage([], 'watched');

  const handleAddPage = () => {
    setPages((pages) => ({
      ...pages, // Spread the existing pages object
      previous: Number(pages.current),
      current: Number(pages.current) + 1,
    }));
  };

  const handleRemovePage = () => {
    setPages((pages) => ({
      previous: Number(pages.current),
      current: Number(pages.current) - 1,
    }));
  };

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

  function handleCloseMovie() {
    setSelectedID(null);
  }

  useLoadPages(query, handleCloseMovie, pages);

  /* useEffect(() => {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched]); */

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

  /* const cleanupRef = useRef();

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
  }; */

  return (
    <>
      <Navbar>
        <Search
          query={query}
          setQuery={setQuery}
          //onSearchChange={handleSearchChange}
        />
      </Navbar>
      <Filters
        movies={movies}
        pages={pages}
        setPages={setPages}
        onAddPage={handleAddPage}
        onRemovePage={handleRemovePage}
        totalResults={totalResults}
      ></Filters>
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
}) => {
  const [value, setValue] = useState('fruit');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleChangePage = (e) => {
    setPages((pages) => ({
      previous: Number(pages.current),
      current: Number(e.target.value),
    }));
  };

  return (
    <div className="data-bar">
      <div className="filter">
        <button className="filter-button">
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
        </button>

        <div className="sort">
          <div className="pages">
            pages{' '}
            <button className="btn-add-page" onClick={onRemovePage}>
              –
            </button>
            <input
              value={pages.current}
              onChange={handleChangePage}
            />
            <button className="btn-add-page" onClick={onAddPage}>
              +
            </button>
          </div>
          <label>
            {'sort by '}
            <select value={value} onChange={handleChange}>
              <option value="Name">Name</option>
              <option value="IMDb rating">IMDb rating</option>
              <option value="Rotten Tomatoes rating">
                Rotten Tomatoes rating
              </option>
              <option value="Release date">Release date</option>
              <option value="Number of ratings">
                Number of ratings
              </option>
              <option value="Alphabetical">Alphabetical</option>
              <option value="Runtime">Runtime</option>
            </select>
          </label>
        </div>
      </div>
      <div className="filter">
        <div className="sort">
          <NumResults movies={movies} totalResults={totalResults} />
        </div>
      </div>
    </div>
  );
};
