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
import { Pages } from './Pages';
import { Sort } from './Sort';
import { FilterForm } from './FilterForm';
import { OpenFiltersButton } from './OpenFiltersButton';
import { FilterTags } from './FilterTags';

export const KEY = '329428ec';

export default function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [pages, setPages] = useState({ previous: 1, current: 1 });
  const [initialSearchResults, setInitialSearchResults] = useState(
    []
  );
  const [searchResults, setSearchResults] = useState([]);
  const [initialWatched, setInitialWatched] = useLocalStorage(
    [],
    'initialWatched'
  );
  const [watched, setWatched] = useLocalStorage([], 'watched');
  const [isReversed, setIsReversed] = useState(false);
  const [isReversedWatched, setIsReversedWatched] = useState(false);
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [isFilterFormOpenWatched, setIsFilterFormWatchedOpen] =
    useState(false);
  const [filters, setFilters] = useState({
    Year: '',
    Type: '',
  });
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
  const [sortBy, setSortBy] = useState('Title');
  const [sortByWatched, setSortByWatched] = useState('As added');
  const [selectedID, setSelectedID] = useState(null);

  const isActive = query.length < 3 ? false : true;
  const isActiveWatched = initialWatched.length > 0 && !selectedID;
  const isEmpty = searchResults.length === 0 && isActive;

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

  const uniqueFilters = {
    searchResults: {
      Year: isEmpty
        ? []
        : [
            ...new Set(
              searchResults.map((movie) => parseInt(movie.Year, 10))
            ),
          ].sort((a, b) => b - a),
      Type: [...new Set(searchResults.map((movie) => movie.Type))]
        .sort()
        .reverse(),
    },
    watched: {
      Year: [
        ...new Set(watched.map((movie) => parseInt(movie.Year, 10))),
      ].sort((a, b) => b - a),
      Type: [...new Set(watched.map((movie) => movie.Type))]
        .sort()
        .reverse(),
    },
  };

  const filter = (list, filters) => {
    return list.filter((element) =>
      Object.entries(filters).every(
        ([key, value]) =>
          !value || element[key].split('–')[0] === value
      )
    );
  };

  const sort = (list, prop, initialList) => {
    switch (prop) {
      case 'Title':
        return list.sort((a, b) => b[prop].localeCompare(a[prop]));
      case 'userRating':
        return list.sort((a, b) => b[prop] - a[prop]);
      default:
        return list.sort((a, b) => b[prop].localeCompare(a[prop]));
    }
  };

  const handleToggleFilterForm = () => {
    setIsFilterFormOpen((isOpen) => !isOpen);
  };

  const handleToggleFilterFormWatched = () => {
    setIsFilterFormWatchedOpen((isOpen) => !isOpen);
  };

  const handleCloseFilterFormWatched = () => {
    setIsFilterFormWatchedOpen(false);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters); // Update filters state
  };

  const handleApplyFiltersWatched = (newFilters) => {
    setFiltersWatched(newFilters); // Update filters state
  };

  const handleRemoveFilters = (filterKey) => {
    setFilters({ ...filters, [filterKey]: '' });
  };

  const handleRemoveFilterWatched = (filterKey) => {
    setFiltersWatched({ ...filtersWatched, [filterKey]: '' });
  };

  const handleReverse = () => {
    setIsReversed((prev) => !prev);
  };

  const handleReverseWatchlist = () => {
    setIsReversedWatched((prev) => !prev);
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

    setInitialWatched((initialWatched) =>
      initialWatched.some(
        (watchedMovie) => watchedMovie.imdbID === movie.imdbID
      )
        ? initialWatched.map((object) =>
            object.imdbID === movie.imdbID
              ? { ...object, userRating: rating }
              : object
          )
        : [...initialWatched, newMovie]
    );
  };

  const handleDeleteMovie = (selectedID) => {
    setInitialWatched((initialWatched) =>
      [...initialWatched].filter(
        (movie) => movie.imdbID !== selectedID
      )
    );
    setWatched((initialWatched) =>
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

  // onChange Event handler for the Search component to fetch searchResults (with AbortController and Timeout)
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

        if (data.Response === 'False') {
          throw new Error('no results found.');
        }

        setTotalResults(data.totalResults);

        setInitialSearchResults((searchResults) => [
          ...searchResults,
          ...data.Search,
        ]);

        setSearchResults((searchResults) => [
          ...searchResults,
          ...data.Search,
        ]);
        setHasError('');
      } catch (err) {
        if (err.message === 'Failed to fetch') {
          setHasError("couldn't load searchResults.");
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
      setTotalResults(0);
      setSearchResults([]);
      setHasError('');
      return;
    }

    const timer = setTimeout(fetchMovies, 400);

    cleanupRef.current = () => {
      controller.abort();
      clearTimeout(timer);
      setIsReversed(false);
      setPages({ previous: 1, current: 1 });
      setSearchResults([]);
      setInitialSearchResults([]);
    };
  };
  // event handler to load more pages or remove pages from searchResults
  const handlePageChange = async (newPages) => {
    let n = 0;
    console.log(`handlePageChange ${newPages}`);
    if (query.length === 0) {
      n = newPages.current;
    } else if (newPages.current < newPages.previous) {
      n = newPages.current;
      const newSearchResults = (searchResults) =>
        [...searchResults].slice(
          0,
          searchResults.length -
            (newPages.previous - newPages.current) * 10
        );
      setSearchResults(newSearchResults);
      setInitialSearchResults(newSearchResults);
    } else {
      n = newPages.previous;
    }

    while (n < newPages.current) {
      n++;

      try {
        setIsLoading(true);
        setHasError('');

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=${n}`
        );

        if (!res.ok) throw new Error("Couldn't load movie details.");

        const data = await res.json();

        if (data.Response === 'False')
          throw new Error('No results found.');

        setTotalResults(data.totalResults);
        const newSearchResults = (searchResults) => [
          ...searchResults,
          ...data.Search,
        ];
        setInitialSearchResults(newSearchResults);
        setSearchResults(newSearchResults);

        setHasError('');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setHasError(err.message || "Couldn't load movies.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  // handling filter, sort and invert/reverse order for searchResults
  useEffect(() => {
    setSearchResults((prevlist) => {
      let newList = filter(initialSearchResults, filters);
      newList = sort(newList, sortBy, initialSearchResults);
      if (isReversed) newList = [...newList].reverse();

      return newList;
    });
  }, [filters, initialSearchResults, isReversed, sortBy]);

  // handling filter, sort and invert/reverse order for watchlistFiltered
  useEffect(() => {
    setWatched((prevList) => {
      let newList = filter(initialWatched, filtersWatched);
      if (sortByWatched !== 'As added') {
        newList = sort(newList, sortByWatched, initialWatched);
      }
      if (isReversedWatched) {
        newList = [...newList].reverse();
      }
      return newList;
    });
  }, [
    filtersWatched,
    setWatched,
    initialWatched,
    isReversedWatched,
    sortByWatched,
  ]);

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
          <OpenFiltersButton
            isActive={isActive}
            isFilterFormOpen={isFilterFormOpen}
            handleToggleFilterForm={handleToggleFilterForm}
          />
          <Pages
            isActive={isActive}
            pages={pages}
            setPages={setPages}
            onPageChange={handlePageChange}
            totalResults={totalResults}
          />
          <FilterTags
            filters={filters}
            handleRemoveFilters={handleRemoveFilters}
          />
          <Sort
            isActive={isActive}
            onReverse={handleReverse}
            isReversed={isReversed}
            options={sortOptions}
            setSortBy={setSortBy}
          />
        </FilterSortBox>

        <FilterSortBox>
          <OpenFiltersButton
            isActive={isActiveWatched}
            isFilterFormOpen={isFilterFormOpenWatched}
            handleToggleFilterForm={handleToggleFilterFormWatched}
          />
          <FilterTags
            filters={filtersWatched}
            handleRemoveFilters={handleRemoveFilterWatched}
          />
          <Sort
            isActive={isActiveWatched}
            onReverse={handleReverseWatchlist}
            isReversed={isReversedWatched}
            options={sortOptionsWatched}
            setSortBy={setSortByWatched}
          />
        </FilterSortBox>
      </FilterSortBar>

      <Main>
        <Box>
          <FilterForm
            onApplyFilters={handleApplyFilters}
            list={searchResults}
            filters={filters}
            isOpen={isFilterFormOpen}
            uniqueFilters={uniqueFilters.searchResults}
          />
          <NumResults
            isActive={isActive}
            isFilterFormOpen={isFilterFormOpen}
            topOpen={'4.2rem'}
            topClosed={'2.2rem'}
          >
            {' '}
            showing <strong>{searchResults.length}</strong> of{' '}
            <strong>{totalResults}</strong> results
          </NumResults>

          {isLoading ? (
            <Loader />
          ) : hasError ? (
            <ErrorMessage message={hasError} />
          ) : isEmpty ? (
            <ErrorMessage message={'No results found.'} />
          ) : (
            <MovieList
              searchResults={searchResults}
              onSelectMovie={handleSelectMovie}
            />
          )}
        </Box>
        <Box>
          <FilterForm
            onApplyFilters={handleApplyFiltersWatched}
            list={watched}
            filters={filtersWatched}
            isOpen={selectedID ? false : isFilterFormOpenWatched}
            uniqueFilters={uniqueFilters.watched}
          />

          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddMovie={handleAddMovie}
              onDeleteMovie={handleDeleteMovie}
              initialWatched={initialWatched}
            />
          ) : (
            <>
              <WatchedSummary
                watched={watched}
                isFilterFormOpenWatched={isFilterFormOpenWatched}
              />
              <NumResults
                isActive={isActiveWatched}
                isFilterFormOpen={isFilterFormOpenWatched}
                topOpen={'11.8rem'}
                topClosed={'9.6rem'}
              >
                showing <strong>{watched.length}</strong> of{' '}
                <strong>{initialWatched.length}</strong> results
              </NumResults>
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
