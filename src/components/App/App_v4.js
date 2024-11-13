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
import { fetchMovies } from '../../services/omdbApi';
import { filter } from '../../services/filter';
import { sort } from '../../services/sort';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { NumResultsSearchResults } from '../common/NumResultsSearchResults';

export const KEY = '329428ec';

export default function App() {
  const [expandedBox, setExpandedBox] = useState('');

  const [query, setQuery] = useState('');
  const [pages, setPages] = useState({ previous: 1, current: 1 });
  const [paginationDirection, setPaginationDirection] =
    useState('isFirstPage');

  const [filters, setFilters] = useLocalStorage({}, 'filters');
  const [sortBy, setSortBy] = useLocalStorage('Title', 'sortBy');
  const [isReversed, setIsReversed] = useLocalStorage(
    false,
    'isReversed'
  );

  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);

  const allPages = useRef([]);

  const firstPage = useQuery({
    queryKey: ['firstPage', query],
    queryFn: () => fetchMovies(query),
    enabled: query.length >= 3,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  // Prefetch, helps but doesn't solve the problem
  const queryClient = useQueryClient();

  const nextPage = useQuery({
    queryKey: ['nextPage', query, pages.current],
    queryFn: () => fetchMovies(query, pages.current),
    enabled:
      query.length >= 3 &&
      pages.current > 1 &&
      // if we descrease pages, we don"t want the next page to be fetched
      // it is still in the cache
      paginationDirection === 'increment',
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  let searchResultsDisplayData = [];
  let data = [];

  if (firstPage.isSuccess && nextPage.isSuccess) {
    if (paginationDirection === 'increment') {
      // Add next page results, removing duplicates
      allPages.current = [
        ...new Set([
          ...allPages.current,
          ...firstPage.data.Search,
          ...nextPage.data.Search,
        ]),
      ];
    } else if (
      paginationDirection === 'decrement' &&
      allPages.current.length > pages.current * 10
    ) {
      // Remove items from the end based on page difference
      allPages.current = allPages.current.slice(
        0,
        allPages.current.length -
          (pages.previous - pages.current) * 10
      );
    } else if (
      paginationDirection === 'isLastPage' &&
      allPages.current.length > pages.current * 10
    ) {
      // Reached last page, remove items to align with page size
      const remainder = allPages.current.length % 10;
      allPages.current = allPages.current.slice(
        0,
        allPages.current.length - remainder
      );
    } else if (paginationDirection === 'isFirstPage') {
      // Reset to first page
      allPages.current = firstPage.data.Search;
    }

    data = allPages.current;
  } else if (!firstPage.isPending && firstPage?.data?.Search) {
    data = firstPage.data.Search;
  }

  // Apply filtering, sorting, and reversal if data exists
  if (data.length > 0) {
    searchResultsDisplayData = sort(
      filter(data, filters),
      sortBy,
      data
    );
    if (isReversed) {
      searchResultsDisplayData.reverse();
    }
  }

  const [initialWatched, setInitialWatched] = useLocalStorage(
    [],
    'initialWatched'
  );
  const [watched, setWatched] = useLocalStorage([], 'watched');
  const [isReversedWatched, setIsReversedWatched] = useLocalStorage(
    false,
    'isReversedWatched'
  );

  const [isFilterFormOpenWatched, setIsFilterFormWatchedOpen] =
    useState(false);
  const isActive = query.length < 3 ? false : true;

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

  /*  let searchResultsDisplayData = [];
  let data = [];

  if (allPages.current.length !== 0) {
    data = allPages.current;
  } else if (!firstPage.isPending && firstPage?.data?.Search) {
    data = firstPage?.data?.Search;
  }

  if (data.length > 0) {
    searchResultsDisplayData = sort(
      filter(data, filters),
      sortBy,
      data
    );
    if (isReversed) {
      searchResultsDisplayData.reverse();
    }
  } */

  const uniqueFilters = {
    searchResults: {
      Year: prepOptions({
        list: searchResultsDisplayData,
        listForCount: data,
        prop: 'Year',
        isMulti: false,
      }),
      Type: prepOptions({
        list: searchResultsDisplayData,
        listForCount: data,
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

  /* console.log(
    'uniqueFilters:',
    JSON.stringify(uniqueFilters.searchResults, null, 2)
  ); */

  const [filtersWatched, setFiltersWatched] = useLocalStorage(
    {},
    'filtersWatched'
  );
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

  /* const handleRemoveFilters = (key, valueToRemove) => {
    setFilters((prevFilters) => {
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
  }; */

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

  // onChange Event handler for the Search component to cleanup before a new search
  const cleanupRef = useRef();

  const handleSearchChange = (query) => {
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    cleanupRef.current = () => {
      setIsReversed(false);
      setPages({ previous: 1, current: 1 });
      setPaginationDirection('');
      setSortBy('Title');
      allPages.current = [];
    };
  };

  const handleAddPage = () => {
    const newPages = {
      ...pages,
      previous: Number(pages.current),
      current:
        Number(pages.current) <=
        Math.trunc(firstPage?.data?.totalResults / 10)
          ? Number(pages.current) + 1
          : Number(pages.current),
    };
    setPages(newPages);
  };

  const handleRemovePage = () => {
    if (pages.current > 1) {
      const newPages = {
        ...pages,
        previous: Number(pages.current),
        current: Number(pages.current) <= 1 ? 1 : +pages.current - 1,
      };
      setPages(newPages);
    }
  };

  useEffect(() => {
    const isLastPage =
      searchResultsDisplayData.length ===
      Number(firstPage?.data?.totalResults);
    const isFirstPage = pages.current === 1 && !isLastPage;
    const isIncrement = pages.current > pages.previous;
    const isDecrement = pages.current < pages.previous;
    let newPaginationStatus = '';
    if (isLastPage) {
      newPaginationStatus = 'isLastPage';
    }
    if (isFirstPage) {
      newPaginationStatus = 'isFirstPage';
    }
    if (isIncrement && !isLastPage) {
      newPaginationStatus = 'increment';
    }
    if (isDecrement && !isFirstPage) {
      newPaginationStatus = 'decrement';
    }
    setPaginationDirection(newPaginationStatus);
  }, [pages, firstPage, nextPage, searchResultsDisplayData]);

  useEffect(() => {
    // only prefetch
    // on mount and then if we increment
    // unless we are at the last page
    if (
      (paginationDirection === 'increment' ||
        paginationDirection === 'isFirstPage') &&
      query.length >= 3
    ) {
      const prefetchPages = [
        pages.current + 1,
        pages.current + 2,
        pages.current + 3,
      ];

      prefetchPages.forEach((page) => {
        queryClient.prefetchQuery({
          queryKey: ['nextPage', query, page],
          queryFn: () => fetchMovies(query, page),
          staleTime: Infinity,
        });
      });
    }
  }, [query, pages, queryClient, paginationDirection]);

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
        {!expandedBox || expandedBox === 'searchResults' ? (
          <FilterSortBox
            width={expandedBox === 'searchResults' ? '100%' : '40%'}
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
              totalResults={firstPage.data?.totalResults}
              setPaginationDirection={setPaginationDirection}
              onAddPage={handleAddPage}
              onRemovePage={handleRemovePage}
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
        {!expandedBox || expandedBox === 'watched' ? (
          <FilterSortBox
            width={expandedBox === 'watched' ? '100%' : '60%'}
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
        {!expandedBox || expandedBox === 'searchResults' ? (
          <Box
            isActive={isActive}
            boxWidth={
              expandedBox === 'searchResults' ? '100%' : '40%'
            }
          >
            <FilterForm
              onApplyFilters={handleApplyFilters}
              list={searchResultsDisplayData}
              filters={filters}
              isOpen={isFilterFormOpen}
              uniqueFilters={uniqueFilters.searchResults}
              setFilters={setFilters}
            />
            <NumResults
              isActive={isActive}
              isFilterFormOpen={isFilterFormOpen}
              topOpen={'4.4rem'}
              topClosed={'0rem'}
              expandedBox={expandedBox}
              setExpandedBox={setExpandedBox}
              content="searchResults"
            >
              <NumResultsSearchResults
                firstPage={firstPage}
                nextPage={nextPage}
                data={searchResultsDisplayData}
              />
            </NumResults>

            {firstPage.isLoading ? (
              <Loader />
            ) : firstPage.error ? (
              <ErrorMessage message={firstPage.error} />
            ) : !firstPage.isLoading && data?.Search?.length === 0 ? (
              <ErrorMessage message={'No results found.'} />
            ) : (
              <MovieList
                firstPage={firstPage}
                onSelectMovie={handleSelectMovie}
                data={searchResultsDisplayData}
                query={query}
              />
            )}
          </Box>
        ) : null}
        {!expandedBox || expandedBox === 'watched' ? (
          <Box boxWidth={expandedBox === 'watched' ? '100%' : '60%'}>
            <FilterForm
              onApplyFilters={handleApplyFiltersWatched}
              list={watched}
              filters={filtersWatched}
              isOpen={selectedID ? false : isFilterFormOpenWatched}
              uniqueFilters={uniqueFilters.watched}
              setFilters={setFiltersWatched}
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
                  expandedBox={expandedBox}
                  setExpandedBox={setExpandedBox}
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
