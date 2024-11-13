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
  const [paginationDirection, setPaginationDirection] = useState('');
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
    //  refetchOnMount: false,
  });

  // Prefetch, helps but doesn't solve the problem
  const queryClient = useQueryClient();

  useEffect(() => {
    if (query.length >= 3) {
      const prefetchPages = [
        pages.current + 1,
        pages.current + 2,
        pages.current + 3,
      ];

      prefetchPages.forEach((page) => {
        queryClient.prefetchQuery({
          queryKey: ['nextPage', query, page],
          queryFn: () => fetchMovies(query, page),
          // Optional: Add staleTime and other options as needed
          staleTime: Infinity,
        });
      });
    }
  }, [query, pages, queryClient]);

  const nextPage = useQuery({
    queryKey: ['nextPage', query, pages.current],
    queryFn: () => fetchMovies(query, pages.current),
    enabled:
      query.length >= 3 &&
      pages.current > 1 &&
      // if we descrease pages, we don"t want the next page to be fetched
      // it is still in the cache
      /*  pages.current > pages.previous, */
      paginationDirection === 'increment',
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  let searchResultsDisplayData = [];
  let data = [];

  /*  // Compose AllPages and determine data source
  if (firstPage.isSuccess && nextPage.isSuccess) {
    // if increases page number, add next 10 results and filter out duplicates
    if (pages.current > pages.previous) {
      allPages.current = [
        ...new Set([
          ...allPages.current,
          ...firstPage.data.Search,
          ...nextPage.data.Search,
        ]),
      ];
      // if descreases page number, if more than 10 items, left, remove previous 10 results
    } else if (pages.current < pages.previous) {
      if (allPages.current.length > pages.current * 10) {
        allPages.current = [...allPages.current].slice(
          0,
          allPages.current.length -
            (pages.previous - pages.current) * 10
        );
      }
    } else if (pages.current === pages.previous) {
      allPages.current = firstPage.data.Search;
    }

    data = allPages.current; // Use allPages if available
  } else if (!firstPage.isPending && firstPage?.data?.Search) {
    data = firstPage.data.Search; // Use firstPage if allPages isn't ready
  }

  // Filtering, Sorting, and Reversal (if data exists)
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

  /* global BigInt */

  /*  console.log(
    allPages.current.length -
      Number(BigInt(allPages.current.length) / BigInt(10)) * 10
  ); */

  // Compose AllPages and determine data source

  if (firstPage.isSuccess && nextPage.isSuccess) {
    console.log('firstPage.isSuccess && nextPage.isSuccess');
    // if  page number increments, add next 10 results and filter out duplicates
    if (
      paginationDirection === 'increment' &&
      !nextPage.isPlaceholderData
    ) {
      console.log('paginationDirection === increment');
      allPages.current = [
        ...new Set([
          ...allPages.current,
          ...firstPage.data.Search,
          ...nextPage.data.Search,
        ]),
      ];
      console.log('pages added');
      // if descreases page number
    } else if (paginationDirection === 'decrement') {
      console.log('PaginationDirection === decrement');
      console.log(
        'allPages.current.length:',
        allPages.current.length
      );
      console.log('pages.current:', pages.current);
      console.log(
        'fistPage.data.totalResults:',
        firstPage.data.totalResults
      );
      // if more than 10 items left
      if (allPages.current.length > pages.current * 10) {
        console.log('more than ten items left in allPages.current');
        // if the user reached the last page
        if (
          allPages.current.length ===
          Number(firstPage.data.totalResults)
        ) {
          console.log('last page');
          // don't remove 10 items, remove number of times till reaching a multiple of 10
          allPages.current = [...allPages.current].slice(
            0,
            allPages.current.length -
              (allPages.current.length -
                Number(BigInt(allPages.current.length) / BigInt(10)) *
                  10)
          );
        } else {
          console.log('not last page, remove 10 items');
          allPages.current = [...allPages.current].slice(
            0,
            allPages.current.length -
              (pages.previous - pages.current) * 10
          );
        }
      }
      console.log('pages removed');
    } else if (pages.current === 1) {
      console.log('pages.current === 1');
      allPages.current = firstPage.data.Search;
      console.log('set allPages to firstPage');
    }

    data = allPages.current; // Use allPages if available
  } else if (!firstPage.isPending && firstPage?.data?.Search) {
    data = firstPage.data.Search; // Use firstPage if allPages isn't ready
  }

  // Filtering, Sorting, and Reversal (if data exists)
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

  /* console.log(
    'allPages.current:',
    JSON.stringify(allPages.current, null, 2)
  );
  console.log('query:', JSON.stringify(query, null, 2));
  console.log('pages:', JSON.stringify(pages, null, 2));
  console.log('firstPage:', JSON.stringify(firstPage, null, 2));
  console.log('nextPage:', JSON.stringify(nextPage, null, 2)); */
  console.log(
    'searchResultsDisplayData:',
    JSON.stringify(searchResultsDisplayData, null, 2)
  );
  console.log(
    'allPages.current:',
    JSON.stringify(allPages.current, null, 2)
  );

  /*  // compose AllPages depending on availability of firstPage and nextPage and of page number change direction
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
      if (allPages.current.length > pages.current * 10) {
        allPages.current = [...allPages.current].slice(
          0,
          allPages.current.length -
            (pages.previous - pages.current) * 10
        );
      }
    }
  } */

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

  console.log(
    'uniqueFilters:',
    JSON.stringify(uniqueFilters.searchResults, null, 2)
  );

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

  /* const handlePageChange = async (newPages) => {
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
  }; */

  /* // handling filter, sort and invert/reverse order for searchResults
  useEffect(() => {
    setSearchResults((prevlist) => {
      if (!initialSearchResults) return prevlist;
      let newList = filter(initialSearchResults, filters);
      newList = sort(newList, sortBy, initialSearchResults);
      if (isReversed) newList = [...newList].reverse();

      return newList;
    });
  }, [filters, initialSearchResults, isReversed, sortBy]); */

  /*  let searchResultsDisplayData = [];
  if (allPages.current.length !== 0) {
    searchResultsDisplayData = isReversed
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
    searchResultsDisplayData = isReversed
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

  /* let searchResultsDisplayData = [];
  const data =
    allPages.current.length !== 0
      ? allPages.current
      : firstPage.isPending
      ? []
      : firstPage?.data?.Search;

  if (data.length > 0) {
    searchResultsDisplayData = sort(filter(data, filters), sortBy, data);
    if (isReversed) {
      searchResultsDisplayData.reverse();
    }
  } */

  /* let searchResultsDisplayData = [];
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
