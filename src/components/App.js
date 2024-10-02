import { useState, useRef, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Main } from './Main';
import { Search } from './Search';
import { NumResults } from './NumResults';
import { NumResultsWatchlist } from './NumResultsWatchlist';
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
import { FilterForm } from './FilterForm';
import { FilterFormWatched } from './FilterFormWatched';

export const KEY = '329428ec';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedID, setSelectedID] = useState(null);
  const [pages, setPages] = useState({ previous: 1, current: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState('');
  const [movies, setMovies] = useState([]);
  const [prevMovies, setPrevMovies] = useState([]);
  const [watchedFiltered, setWatchedFiltered] = useLocalStorage(
    [],
    'watchedFiltered'
  );
  const [totalResults, setTotalResults] = useState(0);
  const [watched, setWatched] = useLocalStorage([], 'watched');
  const [isReversed, setIsReversed] = useState(false);
  const [isReversedWatchlist, setIsReversedWatchlist] =
    useState(false);
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [isFilterFormWatchedOpen, setIsFilterFormWatchedOpen] =
    useState(false);
  const [filters, setFilters] = useState({ Year: '', Type: '' });
  const [filtersWatched, setFiltersWatched] = useState({
    Year: '',
    Type: '',
    /* runtime: '',
    genre: '',
    imdbRating: '',
    actors: '',
    director: '',
    rated: '',
    ratings: '',
    imdbVotes: '',
    userRating: '',
    rtRating: '', */
  });
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [yearWatched, setYearWatched] = useState('');
  const [typeWatched, setTypeWatched] = useState('');
  const [hasMouseEnteredBox, setHasMouseEnteredBox] = useState(false);
  const isActive = query.length < 3 ? false : true;
  const isActiveWatchlist = watched.length > 0 && !selectedID;
  const sortOptions = [
    { value: 'Title', label: 'Title', icon: '#️⃣' },
    { value: 'Year', label: 'Year', icon: '🗓️' },
    { value: 'Type', label: 'Type', icon: '🎬' },
  ].filter(
    (option) =>
      filters[option.value] === undefined ||
      filters[option.value] === null ||
      filters[option.value] === ''
  );

  const sortOptionsWatched = [
    { value: 'As added', label: 'As added', icon: '⤵️' },
    { value: 'Title', label: 'Title', icon: '#️⃣' },
    { value: 'Year', label: 'Year', icon: '🗓️' },
    { value: 'Type', label: 'Type', icon: '🎬' },
    { value: 'imdbRating', label: 'imdb', icon: '⭐️' },
    { value: 'userRating', label: 'user', icon: '🌟' },
  ].filter(
    (option) =>
      filtersWatched[option.value] === undefined ||
      filtersWatched[option.value] === null ||
      filtersWatched[option.value] === ''
  );

  /*  const prevWatched = useRef([]); */

  const handleMouseEnterBox = () => {
    setHasMouseEnteredBox(true);
  };

  const handleMouseLeaveBox = () => {
    setHasMouseEnteredBox(false);
  };

  const handleToggleFilterFormWatched = () => {
    setIsFilterFormWatchedOpen((isOpen) => !isOpen);
  };

  const handleCloseFilterFormWatched = () => {
    setIsFilterFormWatchedOpen(false);
  };

  const handleToggleFilterForm = () => {
    setIsFilterFormOpen((isOpen) => !isOpen);
  };

  const handleCloseFilterForm = () => {
    setIsFilterFormOpen(false);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters); // Update filters state

    // Apply filters to movies array
    const filteredMovies = [...movies].filter((movie) => {
      let matchesYear = true;
      let matchesType = true;

      if (newFilters.Year !== '') {
        // Use newFilters here
        matchesYear = movie.Year.split('–')[0] === newFilters.Year;
      }

      if (newFilters.Type !== '') {
        // Use newFilters here
        matchesType = movie.Type === newFilters.Type;
      }

      return matchesYear && matchesType;
    });

    setMovies(isReversed ? filteredMovies.reverse() : filteredMovies);
  };

  const handleRemoveFilter = (filterKey) => {
    // Update filters state (remove the filter)

    if (filterKey === 'Year') {
      setYear('');
    }
    if (filterKey === 'Type') {
      setType('');
    }

    const updatedFilters = { ...filters };
    updatedFilters[filterKey] = '';
    setFilters(updatedFilters);

    // Re-apply filters to movies array (without the removed filter)
    if (updatedFilters.Year === '' && updatedFilters.Type === '') {
      // If both filters are now empty, reset to original movies
      setMovies(
        isReversed ? [...prevMovies].reverse() : [...prevMovies]
      );
    } else {
      const filteredMovies = [...prevMovies].filter((movie) => {
        let matchesYear = true;
        let matchesType = true;

        if (updatedFilters.Year !== '') {
          matchesYear =
            movie.Year.split('–')[0] === updatedFilters.Year;
        }
        if (updatedFilters.Type !== '') {
          matchesType = movie.Type === updatedFilters.Type;
        }
        return matchesYear && matchesType;
      });
      setMovies(
        isReversed ? filteredMovies.reverse() : filteredMovies
      );
    }
  };

  const handleApplyFiltersWatched = (newFilters) => {
    setFiltersWatched(newFilters); // Update filters state

    // Apply filters to movies array

    const filteredMovies = [...watched].filter((movie) => {
      let matchesYear = true;
      let matchesType = true;

      if (newFilters.Year !== '') {
        matchesYear = movie.Year.split('–')[0] === newFilters.Year;
      }
      if (newFilters.Type !== '') {
        matchesType = movie.Type === newFilters.Type;
      }
      return matchesYear && matchesType;
    });
    setWatchedFiltered(filteredMovies);
  };

  function filterWatchedMovies(watchedMovies, filters) {
    return watchedMovies.filter((movie) => {
      let matchesFilters = true;

      if (filters.Year && movie.Year !== filters.Year) {
        matchesFilters = false;
      }

      if (filters.Type && movie.Type !== filters.Type) {
        matchesFilters = false;
      }

      // Add more filter conditions as needed

      return matchesFilters;
    });
  }

  const handleRemoveFilterWatched = (filterKey) => {
    // Update filters state (remove the filter)

    if (filterKey === 'Year') {
      setYearWatched('');
    }
    if (filterKey === 'Type') {
      setTypeWatched('');
    }

    const updatedFilters = { ...filtersWatched };
    updatedFilters[filterKey] = '';
    setFiltersWatched(updatedFilters);

    if (updatedFilters.Year === '' && updatedFilters.Type === '') {
      // If both filters are now empty, reset to original movies
      setWatchedFiltered(watched);
    } else {
      const filteredMovies = [...watched].filter((movie) => {
        let matchesYear = true;
        let matchesType = true;

        if (updatedFilters.Year !== '') {
          matchesYear =
            movie.Year.split('–')[0] === updatedFilters.Year;
        }
        if (updatedFilters.Type !== '') {
          matchesType = movie.Type === updatedFilters.Type;
        }
        return matchesYear && matchesType;
      });
      setWatchedFiltered(filteredMovies);
    }
  };

  const handleSortResults = (e) => {
    const prop = e.target.value;
    let sortedByProp = [];
    if (prop === 'Title') {
      sortedByProp = [...prevMovies];
    } else {
      sortedByProp = [...movies].sort((a, b) =>
        b[prop].localeCompare(a[prop])
      );
    }

    setMovies(isReversed ? sortedByProp.reverse() : sortedByProp);
  };

  const handleSortWatchlist = (e) => {
    const prop = e.target.value;

    let sortedByProp = [];
    if (prop === 'As added') {
      sortedByProp = filterWatchedMovies(watched, filtersWatched);
    } else if (prop === 'Title') {
      sortedByProp = [...watchedFiltered].sort((a, b) =>
        a[prop].localeCompare(b[prop])
      );
    } else if (prop === 'userRating') {
      sortedByProp = [...watchedFiltered].sort(
        (a, b) => b[prop] - a[prop]
      );
    } else {
      sortedByProp = [...watchedFiltered].sort((a, b) =>
        b[prop].localeCompare(a[prop])
      );
    }
    setWatchedFiltered(
      isReversedWatchlist ? sortedByProp.reverse() : sortedByProp
    );
  };

  const handleReverse = () => {
    setIsReversed((prev) => !prev);
    const reversed = [...movies].reverse();
    setMovies(reversed);
  };

  const handleReverseWatchlist = () => {
    setIsReversedWatchlist((prev) => !prev);
    const reversed = [...watchedFiltered].reverse();
    setWatchedFiltered(reversed);
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
      rtRating: movie.rtRating,
      Rated: movie.Rated,
      Type: movie.Type,
      Genre: movie.Genre,
      Actors: movie.Actors,
      Director: movie.Director,
      imdbVotes: movie.imdbVotes,
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
      [...watched].filter((movie) => movie.imdbID !== selectedID)
    );
  };

  const handleSelectMovie = (movieID) => {
    setSelectedID((selectedID) =>
      movieID === selectedID ? null : movieID
    );
  };

  function handleCloseMovie() {
    setSelectedID(null);
    handleCloseFilterFormWatched();
  }

  // onChange Event handler for the Search component to fetch movies (with AbortController and Timeout)
  const cleanupRef = useRef();

  const handleSearchChange = async (query, pages) => {
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    const controller = new AbortController();
    const fetchMovies = async () => {
      setIsReversed(false);
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

          setPrevMovies((movies) => [...movies, ...data.Search]);
          //prevMovies.current = [...movies, ...data.Search];
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
      setPages({ previous: 1, current: 1 });
      setMovies([]);
      setPrevMovies([]);
      //prevMovies.current = [];
    };
  };

  /* useEffect(() => {
    if (filtersWatched.year === '' && filtersWatched.type === '') {
      // If both filters are now empty, reset to original movies
      setWatchedFiltered(watched);
    } else {
      const filteredMovies = [...watched].filter((movie) => {
        let matchesYear = true;
        let matchesType = true;

        if (filtersWatched.year !== '') {
          matchesYear =
            movie.Year.split('–')[0] === filtersWatched.year;
        }
        if (filtersWatched.type !== '') {
          matchesType = movie.Type === filtersWatched.type;
        }
        return matchesYear && matchesType;
      });
      setWatchedFiltered(filteredMovies);
    }
  }, [watched, setWatchedFiltered, filtersWatched]); */

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
          [...movies].slice(
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
          if (isReversed) {
            setPrevMovies((movies) =>
              [...movies, ...data.Search].reverse()
            );
            //prevMovies.current = [...movies, ...data.Search];
            setMovies((movies) =>
              [...movies, ...data.Search].reverse()
            );
          } else {
            setPrevMovies((movies) => [...movies, ...data.Search]);
            //prevMovies.current = [...movies, ...data.Search];
            setMovies((movies) => [...movies, ...data.Search]);
          }
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
  }, [query, pages, isReversed]);

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
          <Button
            className={'btn-filter'}
            isFilterFormOpen={isFilterFormOpen}
            isActive={isActive}
            onClick={handleToggleFilterForm}
          >
            <FilterSVG />
          </Button>
          <Pages
            isActive={isActive}
            pages={pages}
            setPages={setPages}
            onRemovePage={handleRemovePage}
            onAddPage={handleAddPage}
          />
          {filters.Year && (
            <Button
              className="btn-filter-tag"
              onClick={() => handleRemoveFilter('Year')}
            >
              {filters.Year} &times;
            </Button>
          )}
          {filters.Type && (
            <Button
              className="btn-filter-tag"
              onClick={() => handleRemoveFilter('Type')}
            >
              {filters.Type} &times;
            </Button>
          )}
          <Sort
            isActive={isActive}
            onReverse={handleReverse}
            onSortResults={handleSortResults}
            isReversed={isReversed}
            options={sortOptions}
          />
        </FilterSortBox>

        <FilterSortBox>
          <Button
            className={'btn-filter'}
            isFilterFormOpen={isFilterFormWatchedOpen}
            isActive={isActiveWatchlist}
            onClick={handleToggleFilterFormWatched}
          >
            <FilterSVG />
          </Button>
          {filtersWatched.Year && (
            <Button
              className="btn-filter-tag"
              onClick={() => handleRemoveFilterWatched('Year')}
            >
              {filtersWatched.Year} &times;
            </Button>
          )}
          {filtersWatched.Type && (
            <Button
              className="btn-filter-tag"
              onClick={() => handleRemoveFilterWatched('Type')}
            >
              {filtersWatched.Type} &times;
            </Button>
          )}
          <Sort
            isActive={isActiveWatchlist}
            onReverse={handleReverseWatchlist}
            onSortResults={handleSortWatchlist}
            isReversed={isReversedWatchlist}
            options={sortOptionsWatched}
          />
        </FilterSortBox>
      </FilterSortBar>

      <Main>
        <Box>
          <FilterForm
            onApplyFilters={handleApplyFilters}
            movies={movies}
            isFilterFormOpen={isFilterFormOpen}
            year={year}
            setYear={setYear}
            type={type}
            setType={setType}
          />
          <NumResults
            isActive={isActive}
            isFilterFormOpen={isFilterFormOpen}
            topOpen={'4.2rem'}
            topClosed={'2.2rem'}
          >
            {' '}
            showing <strong>{movies.length}</strong> of{' '}
            <strong>{totalResults}</strong> results
          </NumResults>

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
          <FilterFormWatched
            onApplyFiltersWatched={handleApplyFiltersWatched}
            watched={watchedFiltered}
            isFilterFormWatchedOpen={
              selectedID ? false : isFilterFormWatchedOpen
            }
            yearWatched={yearWatched}
            setYearWatched={setYearWatched}
            typeWatched={typeWatched}
            setTypeWatched={setTypeWatched}
          />

          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddMovie={handleAddMovie}
              onDeleteMovie={handleDeleteMovie}
              hasMouseEnteredBox={hasMouseEnteredBox}
              watched={watched}
              key={selectedID}
              onMouseEnterBox={handleMouseEnterBox}
              onMouseLeaveBox={handleMouseLeaveBox}
            />
          ) : (
            <>
              <WatchedSummary
                watched={watched}
                isFilterFormWatchedOpen={isFilterFormWatchedOpen}
              />
              <NumResultsWatchlist
                movies={watchedFiltered}
                totalResults={watched.length}
                isActive={isActiveWatchlist}
                isFilterFormOpen={isFilterFormWatchedOpen}
                topOpen={'11.8rem'}
                topClosed={'9.6rem'}
              >
                showing <strong>{watchedFiltered.length}</strong> of{' '}
                <strong>{watched.length}</strong> results
              </NumResultsWatchlist>
              <WatchedMoviesList
                watched={watchedFiltered}
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
