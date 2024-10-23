import { useState, useRef, useEffect } from 'react';
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../common/Main';
import { Search } from '../Navbar/Search';
import { NumResults } from '../common/NumResults';
import { Box } from '../common/Box';
import { MovieList } from '../SearchResults/MovieList';
import { WatchedSummary } from '../Watched/WatchedSummary';
import { WatchedMoviesList } from '../Watched/WatchedMoviesList';
import { Loader } from '../common/Loader';
import { ErrorMessage } from '../common/ErrorMessage';
import { MovieDetails } from '../Details/MovieDetails';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { FilterSortBar } from '../common/FilterSortBar';
import { FilterSortBox } from '../common/FilterSortBox';
import { Pages } from '../SearchResults/Pages';
import { Sort } from '../common/Sort';
import { FilterForm } from '../common/FilterForm';
import { OpenFiltersButton } from '../common/OpenFiltersButton';
import { FilterTags } from '../common/FilterTags';

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
  const [isReversed, setIsReversed] = useLocalStorage(
    false,
    'isReversed'
  );
  const [isReversedWatched, setIsReversedWatched] = useLocalStorage(
    false,
    'isReversedWatched'
  );
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [isFilterFormOpenWatched, setIsFilterFormWatchedOpen] =
    useState(false);
  const isActive = query.length < 3 ? false : true;
  const isEmpty = searchResults.length === 0 && isActive;

  /* const prepOptions = (setup) => {
    const { list, prop, isMulti } = setup;
    return (
      isMulti
        ? Object.entries(
            list
              .filter((movie) => movie?.[prop] !== 'N/A')
              .flatMap((movie) => movie?.[prop].split(', '))
              .reduce((propCounts, prop) => {
                propCounts[prop] = (propCounts[prop] || 0) + 1;
                return propCounts;
              }, {})
          ).sort(([, a], [, b]) => b - a)
        : Object.entries(
            list
              .filter((movie) => movie?.[prop] !== 'N/A')
              .map((movie) => movie?.[prop].split('–')[0])
              .reduce((propCounts, prop) => {
                propCounts[prop] = (propCounts[prop] || 0) + 1;
                return propCounts;
              }, {})
          ).sort(([a], [b]) => b - a)
    ).map(([prop, count]) => ({ value: prop, count }));
  }; */

  const prepOptions = (setup) => {
    const { list, listForCount, prop, isMulti } = setup;

    const counts = {};
    (listForCount || []).forEach((movie) => {
      const values =
        movie?.[prop] && movie[prop] !== 'N/A'
          ? isMulti
            ? movie[prop].split(', ')
            : [movie[prop].split('–')[0]]
          : [];

      const uniqueValues = new Set(values); //Deduplicating values within each movie

      uniqueValues.forEach(
        (val) => (counts[val] = (counts[val] || 0) + 1)
      );
    });

    const entries = isMulti
      ? Object.entries(
          list
            .filter((movie) => movie?.[prop] !== 'N/A')
            .flatMap((movie) => movie[prop].split(', '))
            .reduce((propCounts, propValue) => {
              propCounts[propValue] = counts[propValue] || 0; // Use pre-calculated counts
              return propCounts;
            }, {})
        ).sort(([, a], [, b]) => b - a)
      : Object.entries(
          list
            .filter((movie) => movie?.[prop] !== 'N/A')
            .map((movie) => movie?.[prop].split('–')[0])
            .reduce((propCounts, propValue) => {
              propCounts[propValue] = counts[propValue] || 0; // Use pre-calculated counts
              return propCounts;
            }, {})
        ).sort(([a], [b]) => b - a); // Correctly sorting numerically

    return entries.map(([value, count]) => ({ value, count }));
  };

  /* const uniqueFilters = {
    searchResults: {
      Year: prepOptions({
        list: initialSearchResults,
        prop: 'Year',
        isMulti: false,
      }),
      Type: prepOptions({
        list: initialSearchResults,
        prop: 'Type',
        isMulti: false,
      }),
    },
    watched: {
      Year: prepOptions({
        list: initialWatched,
        prop: 'Year',
        isMulti: false,
      }),
      Type: prepOptions({
        list: initialWatched,
        prop: 'Type',
        isMulti: false,
      }),
      Genre: prepOptions({
        list: initialWatched,
        prop: 'Genre',
        isMulti: true,
      }),
      Actors: prepOptions({
        list: initialWatched,
        prop: 'Actors',
        isMulti: true,
      }),
      Director: prepOptions({
        list: initialWatched,
        prop: 'Director',
        isMulti: false,
      }),
        Rated: prepOptions({
        list: watched,
        prop: 'Rated',
        isMulti: false,
      }),
    },
  }; */

  const uniqueFilters = {
    searchResults: {
      Year: prepOptions({
        list: searchResults,
        listForCount: initialSearchResults,
        prop: 'Year',
        isMulti: false,
      }),
      Type: prepOptions({
        list: searchResults,
        listForCount: initialSearchResults,
        prop: 'Type',
        isMulti: false,
      }),
    },
    watched: {
      Year: prepOptions({
        list: watched,
        listForCount: initialWatched,
        prop: 'Year',
        isMulti: false,
      }),
      Type: prepOptions({
        list: watched,
        listForCount: initialWatched,
        prop: 'Type',
        isMulti: false,
      }),
      Genre: prepOptions({
        list: watched,
        listForCount: initialWatched,
        prop: 'Genre',
        isMulti: true,
      }),
      Actors: prepOptions({
        list: watched,
        listForCount: initialWatched,
        prop: 'Actors',
        isMulti: true,
      }),
      Director: prepOptions({
        list: watched,
        listForCount: initialWatched,
        prop: 'Director',
        isMulti: false,
      }),
      /*  Rated: prepOptions({
        list: watched,
        listForCount: initialWatched,
        prop: 'Rated',
        isMulti: false,
      }), */
    },
  };

  const [expanded, setExpanded] = useState('');
  const [filters, setFilters] = useLocalStorage({}, 'filters');
  const [filtersWatched, setFiltersWatched] = useLocalStorage(
    {},
    'filtersWatched'
  );

  const [sortBy, setSortBy] = useLocalStorage('Title', 'sortBy');
  const [sortByWatched, setSortByWatched] = useLocalStorage(
    'As added',
    'sortByWatched'
  );
  const [selectedID, setSelectedID] = useState(null);
  const isActiveWatched =
    (initialWatched.length > 0 && !selectedID) ||
    (watched.length !== 0 && !selectedID);

  const sortOptions = [
    { value: 'Title', label: 'Title', icon: '#️⃣' },
    { value: 'Year', label: 'Year', icon: '🗓️' },
    { value: 'Type', label: 'Type', icon: '🎬' },
  ].filter((option) => filters[option.value] === undefined);

  const sortOptionsWatched = [
    { value: 'As added', label: 'As added', icon: '⤵️' },
    { value: 'Title', label: 'Title', icon: '#️⃣' },
    { value: 'Year', label: 'Year', icon: '🗓️' },
    { value: 'Type', label: 'Type', icon: '🎬' },
    { value: 'imdbRating', label: 'imdb', icon: '⭐️' },
    { value: 'userRating', label: 'user', icon: '🌟' },
  ].filter((option) => filtersWatched[option.value] === undefined);

  console.log('filters:', JSON.stringify(filters, null, 2));
  console.log(
    'uniqueFilters:',
    JSON.stringify(uniqueFilters, null, 2)
  );
  console.log(
    'filtersWatched:',
    JSON.stringify(filtersWatched, null, 2)
  );
  console.log('expanded:', JSON.stringify(expanded, null, 2));

  const filter = (list, filters) => {
    return list.filter((element) =>
      Object.entries(filters).every(([key, value]) => {
        const elementValue = element[key]?.split('–')[0];
        return elementValue && elementValue.includes(value);
      })
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
    setFilters(newFilters);
  };

  const handleApplyFiltersWatched = (newFilters) => {
    setFiltersWatched(newFilters);
  };

  const handleRemoveFilters = (filterKey) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const handleRemoveFilterWatched = (filterKey) => {
    setFiltersWatched((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
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
        {!expanded || expanded === 'searchResults' ? (
          <FilterSortBox
            width={expanded === 'searchResults' ? '100%' : '40%'}
          >
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
              uniqueFilters={uniqueFilters.searchResults}
            />
            <Sort
              isActive={isActive}
              onReverse={handleReverse}
              isReversed={isReversed}
              options={sortOptions}
              setSortBy={setSortBy}
            />
          </FilterSortBox>
        ) : null}
        {!expanded || expanded === 'watched' ? (
          <FilterSortBox
            width={expanded === 'watched' ? '100%' : '60%'}
          >
            <OpenFiltersButton
              isActive={isActiveWatched}
              isFilterFormOpen={isFilterFormOpenWatched}
              handleToggleFilterForm={handleToggleFilterFormWatched}
            />
            <FilterTags
              filters={filtersWatched}
              handleRemoveFilters={handleRemoveFilterWatched}
              uniqueFilters={uniqueFilters.watched}
            />
            <Sort
              isActive={isActiveWatched}
              onReverse={handleReverseWatchlist}
              isReversed={isReversedWatched}
              options={sortOptionsWatched}
              setSortBy={setSortByWatched}
            />
          </FilterSortBox>
        ) : null}
      </FilterSortBar>

      <Main>
        {!expanded || expanded === 'searchResults' ? (
          <Box
            isActive={isActive}
            boxWidth={expanded === 'searchResults' ? '100%' : '40%'}
          >
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
              topOpen={'4.4rem'}
              topClosed={'0rem'}
              expanded={expanded}
              setExpanded={setExpanded}
              content="searchResults"
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
        ) : null}
        {!expanded || expanded === 'watched' ? (
          <Box boxWidth={expanded === 'watched' ? '100%' : '60%'}>
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
                  topClosed={'7.4rem'}
                  expanded={expanded}
                  setExpanded={setExpanded}
                  content="watched"
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
        ) : null}
      </Main>
    </>
  );
}
