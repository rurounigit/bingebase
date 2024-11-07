import { useState, useRef, useEffect } from 'react';
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../common/Main';
import { Search } from '../Navbar/Search';
import { NumResults } from '../common/NumResults';
import { Box } from '../common/Box';
import { MovieList } from '../SearchResults/MovieList';
import { MovieListTanstack } from '../SearchResults/MovieListTanstack';
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
import { fetchMovies } from '../../services/omdbApi';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const KEY = '329428ec';

export default function App() {
  const [query, setQuery] = useState('');
  const [isLoadingLegacy, setIsLoadingLegacy] = useState(false);
  const [hasError, setHasError] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [pages, setPages] = useState({ previous: 1, current: 1 });
  const [initialSearchResults, setInitialSearchResults] = useState(
    []
  );

  const allPages = useRef([]);

  const firstPage = useQuery({
    queryKey: ['firstPage', query],
    queryFn: () => fetchMovies(query),
    enabled: query.length >= 3,
    placeholderData: keepPreviousData,
  });

  const nextPage = useQuery({
    queryKey: ['nextPage', query, pages.current],
    queryFn: () => fetchMovies(query, pages.current),
    enabled: query.length >= 3 && pages.current > 1,
    placeholderData: keepPreviousData,
  });

  /* if (firstPage?.data?.Search && nextPage?.data?.Search) { */
  if (firstPage.isSuccess && nextPage.isSuccess) {
    if (pages.current > pages.previous) {
      allPages.current = [
        ...new Set([
          ...allPages.current,
          ...firstPage.data.Search,
          ...nextPage.data.Search,
        ]),
      ];
    } else {
      console.log(
        'allPages.current.length:' + allPages.current.length
      );
      if (allPages.current.length > pages.current * 10) {
        allPages.current = [...allPages.current].slice(
          0,
          allPages.current.length -
            (pages.previous - pages.current) * 10
        );
      }
    }
  }

  /*   console.log(
    'firstPage.data:',
    JSON.stringify(firstPage.data, null, 2)
  );
  console.log(
    'nextPage.data:',
    JSON.stringify(nextPage.data, null, 2)
  ); */
  console.log(
    'allPages.current:',
    JSON.stringify(allPages.current, null, 2)
  );

  /* const {
    isLoading,
    isFetching,
    isPending,
    error,
    data,
    isPlaceholderData,
  } = useQueries({
    queries: [
      {
        queryKey: ['searchResults', query],
        queryFn: () => fetchMovies(query),
        enabled: query.length >= 3,
        placeholderData: keepPreviousData,
      },
      {
        queryKey: ['additionalPages', query, pages.current],
        queryFn: () => fetchMovies(query, pages.current),
        enabled: query.length >= 3 && pages.current > 1, // Only runs when main query is also enabled
        placeholderData: keepPreviousData,
      },
    ],
  }); */

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
    { value: 'imdbRating', label: 'IMdb Rating', icon: '⭐️' },
    { value: 'userRating', label: 'User Rating', icon: '🌟' },
    { value: 'rtRating', label: 'Rotten Tomatoes', icon: '🍅' },
    { value: 'Year', label: 'Year', icon: '🗓️' },
    { value: 'Type', label: 'Type', icon: '🎬' },
    { value: 'Title', label: 'Title', icon: '#️⃣' },
  ].filter((option) => filtersWatched[option.value] === undefined);

  /* console.log(JSON.stringify(sortOptionsWatched)); */

  const filter = (list, filters) => {
    return list.filter((element) =>
      Object.entries(filters).every(([key, value]) => {
        const elementValue = element[key];

        if (Array.isArray(value)) {
          // Handle multi-value filters (e.g., Genre, Actors)
          return value.every((filterValue) => {
            // Check if EVERY filter value is present
            return elementValue && elementValue.includes(filterValue);
          });
        } else {
          // Handle single-value filters (e.g., Year, Type)
          return elementValue && elementValue.includes(value);
        }
      })
    );
  };

  const sort = (list, prop, initialList) => {
    switch (prop) {
      case 'Title':
        return list;
      case 'userRating':
        return list.sort((a, b) => b[prop] - a[prop]);
      case 'rtRating':
        return [...list].sort((a, b) => {
          const aRating = Number(
            (a.rtRating || '').toString().replace(/%/g, '')
          );
          const bRating = Number(
            (b.rtRating || '').toString().replace(/%/g, '')
          );
          return bRating - aRating;
        });
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

  const handleRemoveFilterWatched = (key, valueToRemove) => {
    setFiltersWatched((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (valueToRemove !== undefined) {
        // Check if valueToRemove is provided (meaning it's an array filter)
        updatedFilters[key] = updatedFilters[key].filter(
          (value) => value !== valueToRemove
        );
        if (updatedFilters[key].length === 0) {
          // Remove the key if the array becomes empty
          delete updatedFilters[key];
        }
      } else {
        delete updatedFilters[key];
      }

      return updatedFilters;
    });
  };

  const handleReverse = () => {
    setIsReversed((prev) => !prev);
  };

  const handleReverseWatchlist = () => {
    setIsReversedWatched((prev) => !prev);
  };

  const handleAddMovie = (rating, movie) => {
    const rtRating =
      Number((movie.Ratings?.[1]?.Value || '').replace(/%/g, '')) ||
      'N/A';

    const newMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Runtime: movie.Runtime,
      imdbRating: movie.imdbRating,
      userRating: rating,
      rtRating: isNaN(rtRating) ? 'N/A' : rtRating, // Handle NaN
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
        setIsLoadingLegacy(true);
        setHasError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=1`,
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
        setIsLoadingLegacy(false);
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
      setSortBy('Title');
      allPages.current = [];
    };
  };

  /*  setIsLoading(isLoading); */

  // ... (Remove the cleanupRef and its related logic) ...

  /*  // event handler to load more pages or remove pages
  const handlePageChange = async (newPages) => {
    const current = newPages.current;
    const previous = newPages.previous;
    let n = 0;

    // query is empty, so the page doesn't change (loop below to fetch more data will not run)
    if (query.length === 0) {
      n = current;
      // direction is remove page, so we remove the number of pages (a 10 items) that we went down
      // (loop below to fetch more data will not run)
    } else if (current < previous) {
      n = current;
      const newSearchResults = (searchResults) =>
        [...initialSearchResults].slice(
          0,
          initialSearchResults.length - (previous - current) * 10
        );
      // update initialSearchResults (for holding all results)
      // searchResults (for holding the results after filtering and sorting)
      // is updated by the useEffect further down)
      setInitialSearchResults(newSearchResults);
      // direction is add page, so we set n to the previous page number and we
      // loop through all pages from the previous page to the current page below
    } else {
      n = previous;
      if (current !== searchResults.length) {
        n = 1;
      }

    }


    while (n < current) {
      // the first page is already loaded in the other event handler for the Search component
      // so we add 1 to the page number
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

        // update totalResults
        setTotalResults(data.totalResults);

         // Filter out duplicate results based on imdbID
        const newResults = data.Search.filter(
          (newResult) =>
            !initialSearchResults.some(
              (existingResult) =>
                existingResult.imdbID === newResult.imdbID
            )
        );



          // add the new results/items to the already existing values in initialSearchResults
        //const newSearchResults = (searchResults) => [
        //  ...initialSearchResults,
        //  ...data.Search,
        //];

        // Add the unique new results
        const updatedSearchResults = [
          ...initialSearchResults,
          ...newResults,
        ];

        setInitialSearchResults(updatedSearchResults);

        // setInitialSearchResults(newSearchResults);

        setHasError('');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setHasError(err.message || "Couldn't load movies.");
      } finally {
        setIsLoading(false);
      }
    }
  }; */

  const handlePageChange = async (newPages) => {
    const current = newPages.current;
    const previous = newPages.previous;
    let n = 0;

    if (query.length === 0) {
      n = current;
    } else if (current < previous) {
      n = current;
      const newSearchResults = [...initialSearchResults].slice(
        0,
        initialSearchResults.length - (previous - current) * 10
      );
      setInitialSearchResults(newSearchResults);
    } else {
      n = previous;
    }

    let tempResults = [];

    while (n < current) {
      let currentTempResults = [...tempResults];
      n++;

      try {
        setIsLoadingLegacy(true);
        setHasError('');

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=${n}`
        );

        if (!res.ok) throw new Error("Couldn't load movie details.");

        const data = await res.json();

        if (data.Response === 'False')
          throw new Error('No results found.');

        const newResults = data.Search.filter(
          (newResult) =>
            !currentTempResults.some(
              (existingResult) =>
                existingResult.imdbID === newResult.imdbID
            )
        );
        tempResults = [...tempResults, ...newResults];
      } catch (err) {
        if (err.name === 'AbortError') return;
        setHasError(err.message || "Couldn't load movies.");
        //Important: break out of the loop on error
        break;
      } finally {
        setIsLoadingLegacy(false);
      }
    } // End of the while loop

    setInitialSearchResults((prevResults) => [
      ...prevResults,
      ...tempResults,
    ]);

    //Set TotalResults outside the loop
    try {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=1`
      );
      if (!res.ok) throw new Error("Couldn't load movie details.");
      const data = await res.json();
      setTotalResults(data.totalResults);
    } catch (error) {
      console.error('Failed to fetch total results', error);
    }
  };

  // handling filter, sort and invert/reverse order for searchResults
  useEffect(() => {
    setSearchResults((prevlist) => {
      if (!initialSearchResults) return prevlist;
      let newList = filter(initialSearchResults, filters);
      newList = sort(newList, sortBy, initialSearchResults);
      if (isReversed) newList = [...newList].reverse();

      return newList;
    });
  }, [filters, initialSearchResults, isReversed, sortBy]);

  /*  let searchResultsTanstack = [];
  if (allPages.current.length !== 0) {
    searchResultsTanstack = isReversed
      ? sort(
          filter(allPages.current, filters),
          sortBy,
          allPages.current
        )
          .slice()
          .reverse()
      : sort(
          filter(allPages.current, filters),
          sortBy,
          allPages.current
        );
  } else if (!firstPage.isPending) {
    searchResultsTanstack = isReversed
      ? sort(
          filter(firstPage?.data?.Search, filters),
          sortBy,
          firstPage.data?.Search
        )
          .slice()
          .reverse()
      : sort(
          filter(firstPage?.data?.Search, filters),
          sortBy,
          firstPage?.data?.Search
        );
  } */

  /* let searchResultsTanstack = [];
  const data =
    allPages.current.length !== 0
      ? allPages.current
      : firstPage.isPending
      ? []
      : firstPage?.data?.Search;

  if (data.length > 0) {
    searchResultsTanstack = sort(filter(data, filters), sortBy, data);
    if (isReversed) {
      searchResultsTanstack.reverse();
    }
  } */

  let searchResultsTanstack = [];
  let data = [];

  if (allPages.current.length !== 0) {
    data = allPages.current;
  } else if (!firstPage.isPending && firstPage?.data?.Search) {
    data = firstPage?.data?.Search;
  }

  if (data.length > 0) {
    searchResultsTanstack = sort(filter(data, filters), sortBy, data);
    if (isReversed) {
      searchResultsTanstack.reverse();
    }
  }

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
              sortBy={sortBy}
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
              sortBy={sortByWatched}
            />
          </FilterSortBox>
        ) : null}
      </FilterSortBar>

      <Main>
        {!expanded || expanded === 'searchResults' ? (
          <>
            {/*  <Box
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
                showing <strong>
                  {searchResults.length}
                </strong> of <strong>{totalResults}</strong> results
              </NumResults>

              {isLoadingLegacy ? (
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
            </Box> */}
            <Box
              isActive={isActive}
              boxWidth={expanded === 'searchResults' ? '100%' : '40%'}
            >
              <MovieListTanstack
                isActive={isActive}
                isFilterFormOpen={isFilterFormOpen}
                expanded={expanded}
                setExpanded={setExpanded}
                firstPage={firstPage}
                nextPage={nextPage}
                handleSelectMovie={handleSelectMovie}
                allPages={allPages.current}
                searchResults={searchResultsTanstack}
                query={query}
              />
            </Box>
          </>
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
                  sortByWatched={sortByWatched}
                />
              </>
            )}
          </Box>
        ) : null}
      </Main>
    </>
  );
}
