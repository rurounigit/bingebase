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
import { filter } from '../../services/filter';
import { sort } from '../../services/sort';
import { prepOptions } from '../../services/prepOptions';
import { useLoadFirstPage } from '../../hooks/useLoadFirstPage';
import { useLoadNextPage } from '../../hooks/useLoadNextPage';
import { NumResultsSearchResults } from '../common/NumResultsSearchResults';
import { useQueryClient } from '@tanstack/react-query';
import { useLoadAllDetails } from '../../hooks/useLoadAllDetails';

export const KEY = '329428ec';

export default function App() {
  const [expandedBox, setExpandedBox] = useState('');
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [pages, setPages] = useState({ previous: 1, current: 1 });
  const [searchResultsAll, setSearchResultsAll] = useState([]);
  const [searchResultsDisplayData, setSearchResultsDisplayData] =
    useState([]);
  const [filters, setFilters] = useLocalStorage({}, 'filters');
  const [sortBy, setSortBy] = useLocalStorage('Title', 'sortBy');
  const [isReversed, setIsReversed] = useLocalStorage(
    false,
    'isReversed'
  );
  const [isFilterFormOpen, setIsFilterFormOpen] = useState(false);
  const [
    isAddingAllResultsModalOpen,
    setIsAddingAllResultsModalOpen,
  ] = useState(false);

  // firstPage query / fetching
  const {
    firstPageData,
    firstPageIsFetching,
    firstPageError,
    totalResults,
  } = useLoadFirstPage(query);

  // nextPage query / fetching
  const nextPage = useLoadNextPage(query, pages);
  const nextPageIsPending = nextPage.isPending;
  const nextPageIsFetching = nextPage.isFetching;
  const nextPageStatus = nextPage.status;

  // addAllResults query / fetching
  const isAddingAllResults = useRef(false);
  // get array of all IDs in searchResultsDisplayData
  const allSelectedIDs = searchResultsDisplayData.map(
    (item) => item.imdbID
  );

  const { allDetailsData, allDetailsIsLoading, allDetailsError } =
    useLoadAllDetails(allSelectedIDs, isAddingAllResults);

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

  const prepOptionParamsSearchResults = {
    list: searchResultsDisplayData,
    listForCount: searchResultsAll,
    isMulti: false,
  };

  const prepOptionParamsWatched = {
    list: watched,
    listForCount: initialWatched,
    isMulti: false,
  };

  const prep = (list, prop, isMulti) =>
    prepOptions({ ...list, prop, isMulti });

  const uniqueFilters = {
    searchResults: {
      Year: prep(prepOptionParamsSearchResults, 'Year'),
      Type: prep(prepOptionParamsSearchResults, 'Type'),
    },
    watched: {
      Year: prep(prepOptionParamsWatched, 'Year'),
      Type: prep(prepOptionParamsWatched, 'Type'),
      Genre: prep(prepOptionParamsWatched, 'Genre', true),
      Actors: prep(prepOptionParamsWatched, 'Actors', true),
      Director: prep(prepOptionParamsWatched, 'Director'),
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

  const handleSubmitAddAllResults = () => {
    setIsAddingAllResultsModalOpen(false);
    if (!allDetailsData || allDetailsIsLoading || allDetailsError)
      return;
    setInitialWatched((prevWatched) => {
      const updatedWatched = [...prevWatched];
      allDetailsData.forEach((movie) => {
        const rtRating =
          Number(
            (movie.Ratings?.[1]?.Value || '').replace(/%/g, '')
          ) || 'N/A';
        const newMovie = {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          Runtime: movie.Runtime,
          imdbRating: movie.imdbRating,
          userRating: 0,
          rtRating: isNaN(rtRating) ? 'N/A' : rtRating,
          Rated: movie.Rated,
          Type: movie.Type,
          Genre: movie.Genre,
          Actors: movie.Actors,
          Director: movie.Director,
          imdbVotes: movie.imdbVotes,
        };

        if (
          !updatedWatched.some((m) => m.imdbID === newMovie.imdbID)
        ) {
          updatedWatched.push(newMovie);
        }
      });
      return updatedWatched;
    });
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

  const handleAddAllResults = () => {
    setIsAddingAllResultsModalOpen(true);
    isAddingAllResults.current = true;
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
      rtRating: isNaN(rtRating) ? 'N/A' : rtRating,
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

  const handleClearWatched = () => {
    console.log('clearing watched');
    setInitialWatched([]);
    setWatched([]);
  };

  const handleSelectMovie = (movieID) => {
    setSelectedID((selectedID) =>
      movieID === selectedID ? null : movieID
    );
  };

  function handleCloseMovie() {
    setSelectedID(null);
  }

  // cleanup / reset  before a new search
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

  const queryClient = useQueryClient();

  const handleAddPage = async (pages, totalResults, nextPage) => {
    const isLastPage =
      searchResultsAll.length === Number(totalResults);
    const isQueryLongEnough = query.length >= 3;

    if (isLastPage) {
      return;
    }

    if (isQueryLongEnough) {
      setSearchResultsAll((prev) => [
        ...new Set([
          ...prev,
          ...firstPageData.Search,
          ...nextPage.data.Search,
        ]),
      ]);
    }
  };

  const handleRemovePage = (pages) => {
    const isLastPage =
      searchResultsAll.length === Number(totalResults);
    const isFirstPage = pages.current === 1;
    const hasPagesToRemoveLeft =
      searchResultsAll.length >= pages.current * 10;

    if (isFirstPage) {
      setSearchResultsAll(firstPageData.Search);
      return;
    }
    if (isLastPage) {
      if (hasPagesToRemoveLeft) {
        const remainder = searchResultsAll.length % 10;
        setSearchResultsAll((prev) =>
          prev.slice(0, prev.length - remainder)
        );
      }
    } else if (hasPagesToRemoveLeft) {
      setSearchResultsAll((prev) => prev.slice(0, prev.length - 10));
    }
  };

  // handling filter, sort and invert/reverse order for search results
  useEffect(() => {
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
    } else if (firstPageData?.Search.length) {
      setSearchResultsDisplayData(
        firstPageData ? firstPageData?.Search : []
      );
    }
  }, [firstPageData, filters, sortBy, isReversed, searchResultsAll]);

  // handling filter, sort and invert/reverse order for watched
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
    if (firstPageData?.Search.length) {
      setSearchResultsAll(firstPageData?.Search);
    }
  }, [firstPageData]);

  // update query with a small delay so that we don't get a fetch on every keystroke
  useEffect(() => {
    const id = setTimeout(() => setQuery(input), 300);
    return () => clearTimeout(id);
  }, [input]);

  // adds accumulated pages to the search results
  useEffect(() => {
    if (!firstPageError) {
      const PageDataTuples = queryClient.getQueriesData({
        queryKey: ['nextPage', query],
        predicate: (queryObj) => {
          const [name, query, page] = queryObj.queryKey;
          if (name === 'nextPage' && typeof page === 'number') {
            return page >= 2 && page <= pages.current;
          }
          return false;
        },
      });

      if (PageDataTuples.length > 1) {
        const PageData = PageDataTuples.flatMap(
          ([, data]) => data?.Search ?? []
        );

        setSearchResultsAll((prev) => [
          ...new Set([...prev, ...PageData]),
        ]);
      }
    }
  }, [
    query,
    pages,
    queryClient,
    nextPageIsFetching,
    firstPageError,
    /*  nextPage, */
    nextPage.data,
  ]);

  return (
    <>
      <div
        style={{
          position: 'absolute',
          zIndex: '999',
          display: isAddingAllResultsModalOpen ? 'flex' : 'none',
          left: '20%',
          top: '50%',
          backgroundColor: 'black',
          width: '15rem',
          height: '20rem',
          fontSize: '10rem',
        }}
      >
        Really???
        <button onClick={handleSubmitAddAllResults}>Yea!!</button>
      </div>

      <Navbar>
        <Search
          input={input}
          setInput={setInput}
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
              nextPage={nextPage}
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
              onAddAllResults={handleAddAllResults}
            >
              <NumResultsSearchResults
                firstPageIsFetching={firstPageIsFetching}
                firstPageData={firstPageData}
                nextPageIsPending={nextPageIsPending}
                searchResultsDisplayData={searchResultsDisplayData}
                searchResultsAll={searchResultsAll}
              />
            </NumResults>

            {firstPageIsFetching ? (
              <Loader />
            ) : firstPageError ? (
              <ErrorMessage message={firstPageError.message} />
            ) : (
              <MovieList
                firstPageData={firstPageData}
                onSelectMovie={handleSelectMovie}
                searchResultsDisplayData={searchResultsDisplayData}
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
                searchResultsDisplayData={searchResultsDisplayData}
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
                  onClearWatched={handleClearWatched}
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
