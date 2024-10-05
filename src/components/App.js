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
import { FilterForm } from './FilterForm';
import { OpenFiltersButton } from './OpenFiltersButton';
import { FilterTags } from './FilterTags';

export const KEY = '329428ec';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedID, setSelectedID] = useState(null);
  const [pages, setPages] = useState({ previous: 1, current: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [initialSearchResults, setInitialSearchResults] = useState(
    []
  );
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

  const [yearWatched, setYearWatched] = useState('');
  const [typeWatched, setTypeWatched] = useState('');

  /* const [hasMouseEnteredBox, setHasMouseEnteredBox] = useState(false); */
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

  const uniqueFilters = {
    searchResults: {
      Year: [
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

    // Apply filters to searchResults array
    const filteredMovies = [...searchResults].filter((movie) => {
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

    setSearchResults(
      isReversed ? filteredMovies.reverse() : filteredMovies
    );
  };

  const handleRemoveFilter = (filterKey) => {
    // Update filters state (remove the filter)

    if (filterKey === 'Year') {
      setFilters({ ...filters, Year: '' });
    }
    if (filterKey === 'Type') {
      setFilters({ ...filters, Type: '' });
    }

    const updatedFilters = { ...filters };
    updatedFilters[filterKey] = '';
    setFilters(updatedFilters);

    // Re-apply filters to searchResults array (without the removed filter)
    if (updatedFilters.Year === '' && updatedFilters.Type === '') {
      // If both filters are now empty, reset to original searchResults
      setSearchResults(
        isReversed
          ? [...initialSearchResults].reverse()
          : [...initialSearchResults]
      );
    } else {
      const filteredMovies = [...initialSearchResults].filter(
        (movie) => {
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
        }
      );
      setSearchResults(
        isReversed ? filteredMovies.reverse() : filteredMovies
      );
    }
  };

  const handleApplyFiltersWatched = (newFilters) => {
    setFiltersWatched(newFilters); // Update filters state

    // Apply filters to searchResults array

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

  /* const filter = (list, filters) =>
  list.filter((element) =>
    Object.entries(filters).every(
      ([key, value]) => !value || element[key] === value.split('–')[0]
    )
  ); */

  /*  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters); // Update filters state */

  /*   const handleRemoveFilters = (filterKey) => {
    setFilters({ ...filters, [filterKey]: '' });
  }; */

  /* const sort = (list, prop) => {
  switch (prop) {
    case 'As added':
      return initialSearchResults;
    case 'Title':
      return list.sort((a, b) => a[prop].localeCompare(b[prop]));
    case 'userRating':
      return list.sort((a, b) => b[prop] - a[prop]);
    default:
      return list.sort((a, b) => b[prop].localeCompare(a[prop]));
  }
}; */

  /* const reverse = (list) => {
    list.reverse();
  }; */

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
      // If both filters are now empty, reset to original searchResults
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
      sortedByProp = [...initialSearchResults];
    } else {
      sortedByProp = [...searchResults].sort((a, b) =>
        b[prop].localeCompare(a[prop])
      );
    }

    setSearchResults(
      isReversed ? sortedByProp.reverse() : sortedByProp
    );
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
    const reversed = [...searchResults].reverse();
    setSearchResults(reversed);
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
    setWatchedFiltered((watched) =>
      [...watchedFiltered].filter(
        (movie) => movie.imdbID !== selectedID
      )
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
      setPages({ previous: 1, current: 1 });
      setSearchResults([]);
      setInitialSearchResults([]);
    };
  };

  useEffect(() => {
    const fetchMovies = async () => {
      let n = 0;

      if (query.length === 0) {
        n = pages.current;
      } else if (pages.current < pages.previous) {
        n = pages.current;
        setSearchResults((searchResults) =>
          [...searchResults].slice(
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
          );

          if (!res.ok)
            throw new Error("Couldn't load movie details.");

          const data = await res.json();

          if (data.Response === 'False')
            throw new Error('No results found.');

          setTotalResults(data.totalResults);
          if (isReversed) {
            setInitialSearchResults((searchResults) =>
              [...searchResults, ...data.Search].reverse()
            );

            setSearchResults((searchResults) =>
              [...searchResults, ...data.Search].reverse()
            );
          } else {
            setInitialSearchResults((searchResults) => [
              ...searchResults,
              ...data.Search,
            ]);

            setSearchResults((searchResults) => [
              ...searchResults,
              ...data.Search,
            ]);
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
      setSearchResults([]);
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
          <OpenFiltersButton
            isActive={isActive}
            isFilterFormOpen={isFilterFormOpen}
            handleToggleFilterForm={handleToggleFilterForm}
          />
          <Pages
            isActive={isActive}
            pages={pages}
            setPages={setPages}
            onRemovePage={handleRemovePage}
            onAddPage={handleAddPage}
          />
          <FilterTags
            filters={filters}
            handleRemoveFilter={handleRemoveFilter}
          />
          <Sort
            isActive={isActive}
            onReverse={handleReverse}
            onSortResults={handleSortResults}
            isReversed={isReversed}
            options={sortOptions}
          />
        </FilterSortBox>

        <FilterSortBox>
          <OpenFiltersButton
            isActive={isActiveWatchlist}
            isFilterFormOpen={isFilterFormWatchedOpen}
            handleToggleFilterForm={handleToggleFilterFormWatched}
          />
          <FilterTags
            filters={filtersWatched}
            handleRemoveFilter={handleRemoveFilterWatched}
          />
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
            list={watchedFiltered}
            filters={filtersWatched}
            isOpen={selectedID ? false : isFilterFormWatchedOpen}
            uniqueFilters={uniqueFilters.watched}
          />

          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddMovie={handleAddMovie}
              onDeleteMovie={handleDeleteMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary
                watched={watched}
                isFilterFormWatchedOpen={isFilterFormWatchedOpen}
              />
              <NumResults
                isActive={isActiveWatchlist}
                isFilterFormOpen={isFilterFormWatchedOpen}
                topOpen={'11.8rem'}
                topClosed={'9.6rem'}
              >
                showing <strong>{watchedFiltered.length}</strong> of{' '}
                <strong>{watched.length}</strong> results
              </NumResults>
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
