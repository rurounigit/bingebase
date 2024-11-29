import { Movie } from './Movie';

export const MovieList = ({
  firstPageData,
  onSelectMovie,
  searchResultsDisplayData,
  query,
}) => {
  // if the query is at least the characters and there is searchResultsDisplayData, display it
  // otherwise, display the data from the firstPage
  const displayData =
    query.length >= 3
      ? searchResultsDisplayData?.length !== 0
        ? searchResultsDisplayData
        : firstPageData?.Search
      : null;

  return (
    <ul className="list list-movies">
      {displayData?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
};
