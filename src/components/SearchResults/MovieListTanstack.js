import { Box } from '../common/Box';
import { ErrorMessage } from '../common/ErrorMessage';
import { Loader } from '../common/Loader';
import { NumResults } from '../common/NumResults';
import { MovieList } from './MovieList';

export const MovieListTanstack = ({
  isActive,
  isFilterFormOpen,
  expanded,
  setExpanded,
  firstPage,
  nextPage,
  handleSelectMovie,
  allPages,
  searchResults,
  query,
}) => {
  const { isLoading, error, data } = firstPage;
  const { isPending } = nextPage;
  const isEmpty = !isLoading && data?.Search?.length === 0;

  return (
    <Box isActive={isActive} boxWidth={'100%'}>
      {' '}
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
        showing{' '}
        <strong>
          {/*  {isPending ? data?.Search?.length : allPages.length} */}
          {isPending ? data?.Search?.length : searchResults.length}
        </strong>{' '}
        of <strong>{data?.totalResults}</strong> results
      </NumResults>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : isEmpty ? (
        <ErrorMessage message={'No results found.'} />
      ) : (
        <MovieList
          searchResults={
            /*  allPages.length !== 0 ? allPages : data?.Search */
            query.length >= 3
              ? searchResults.length !== 0
                ? searchResults
                : data?.Search
              : null
          }
          onSelectMovie={handleSelectMovie}
        />
      )}
    </Box>
  );
};
