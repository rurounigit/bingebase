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
import { prepOptions } from '../../services/prepOptions';
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
  const [nextPageData, setNextPageData] = useState(null);
  const [searchResultsDisplayData, setSearchResultsDisplayData] =
    useState([]);
  const [searchResultsAll, setSearchResultsAll] = useState([]);
  const [filters, setFilters] = useLocalStorage({}, 'filters');
  const [sortBy, setSortBy] = useLocalStorage('Title', 'sortBy');
  const [isReversed, setIsReversed] = useLocalStorage(
    false,
    'isReversed'
  );
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);

  const queryClient = useQueryClient();

  const firstPage = useQuery({
    queryKey: ['firstPage', query],
    queryFn: () => fetchMovies(query),
    enabled: query.length >= 3,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  const firstPageData = firstPage?.data?.Search;
  const totalResults = Number(firstPage?.data?.totalResults);

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

  const listsSearchResults = {
    list: searchResultsDisplayData,
    listForCount: searchResultsAll,
    isMulti: false,
  };

  const listsWatched = {
    list: watched,
    listForCount: initialWatched,
    isMulti: false,
  };

  const uniqueFilters = {
    searchResults: {
      Year: prepOptions({
        ...listsSearchResults,
        prop: 'Year',
      }),
      Type: prepOptions({
        ...listsSearchResults,
        prop: 'Type',
      }),
    },
    watched: {
      Year: prepOptions({
        ...listsWatched,
        prop: 'Year',
      }),
      Type: prepOptions({
        ...listsWatched,
        prop: 'Type',
      }),
      Genre: prepOptions({
        ...listsWatched,
        prop: 'Genre',
        isMulti: true,
      }),
      Actors: prepOptions({
        ...listsWatched,
        prop: 'Actors',
        isMulti: true,
      }),
      Director: prepOptions({
        ...listsWatched,
        prop: 'Director',
      }),
    },
  };

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
      setSortBy('Title');
      setSearchResultsAll([]);
    };
  };

  const handleAddPage = async (pages) => {
    const isLastPage =
      searchResultsAll.length === Number(totalResults);
    const isQueryLongEnough = query.length >= 3;

    if (isLastPage) {
      return;
    }

    if (isQueryLongEnough) {
      try {
        const nextPage = await queryClient.fetchQuery({
          queryKey: ['nextPage', query, pages.current],
          queryFn: () => fetchMovies(query, pages.current),
          placeholderData: queryClient.getQueryData([
            'nextPage',
            query,
            pages.current - 1,
          ]),
          staleTime: Infinity,
        });
        console.log('nextPage query executed');

        setNextPageData(nextPage);
        setSearchResultsAll((prev) => [
          ...new Set([
            ...prev,
            ...firstPage.data.Search,
            ...nextPage.Search,
          ]),
        ]);
      } catch (error) {
        console.error('Error fetching next page:', error);
      }
    }
  };

  const handleRemovePage = (pages) => {
    const isLastPage =
      searchResultsAll.length === Number(totalResults);
    const isFirstPage = pages.current === 1;
    const hasPagesToRemoveLeft =
      searchResultsAll.length >= pages.current * 10;

    console.log('allPages.length', searchResultsAll.length);
    console.log('pages.current', pages.current * 10);

    if (isFirstPage) {
      setSearchResultsAll(firstPageData);
      return;
    }
    if (isLastPage) {
      console.log('last page');
      if (hasPagesToRemoveLeft) {
        console.log('hasPagesToRemoveLeft');
        const remainder = searchResultsAll.length % 10;
        setSearchResultsAll((prev) =>
          prev.slice(0, prev.length - remainder)
        );
      }
    } else if (hasPagesToRemoveLeft) {
      console.log('handleRemovePage');
      setSearchResultsAll((prev) => prev.slice(0, prev.length - 10));
    }
  };

  // handling filter, sort and invert/reverse order for search results
  useEffect(() => {
    console.log('filter, sort and setSearchResultsDisplayData');
    if (searchResultsAll.length > 0) {
      let processedData = sort(
        filter(searchResultsAll, filters),
        sortBy,
        searchResultsAll
      );
      if (isReversed) {
        processedData.reverse();
      }
      setSearchResultsDisplayData(processedData);
    } else {
      setSearchResultsDisplayData(firstPageData ? firstPageData : []);
    }
  }, [firstPageData, filters, sortBy, isReversed, searchResultsAll]);

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

  useEffect(() => {
    setSearchResultsAll(firstPageData ? firstPageData : []);
  }, [firstPageData]);

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
              totalResults={totalResults}
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
                nextPage={nextPageData}
                data={searchResultsDisplayData}
              />
            </NumResults>

            {firstPage.isLoading ? (
              <Loader />
            ) : firstPage.error ? (
              (<ErrorMessage
                message={firstPage.error.message}
              /> /* : !firstPage.isSuccess &&
              searchResultsAll.length === 0 ? (
              <ErrorMessage message={'No results found.'} />
            ) */ /*: !firstPage.isSuccess &&
              searchResultsAll.length === 0 ? (
              <ErrorMessage message={'No results found.'} />
            ) */ /*: !firstPage.isSuccess &&
              searchResultsAll.length === 0 ? (
              <ErrorMessage message={'No results found.'} />
            ) */ /*: !firstPage.isSuccess &&
              searchResultsAll.length === 0 ? (
              <ErrorMessage message={'No results found.'} />
            ) */ /*: !firstPage.isSuccess &&
              searchResultsAll.length === 0 ? (
              <ErrorMessage message={'No results found.'} />
            ) */ /*: !firstPage.isSuccess &&
              searchResultsAll.length === 0 ? (
              <ErrorMessage message={'No results found.'} />
            ) */ /*: !firstPage.isSuccess &&
              searchResultsAll.length === 0 ? (
              <ErrorMessage message={'No results found.'} />
            ) */)
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
