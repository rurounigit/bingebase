import { Movie } from './Movie';

export const MovieList = ({
  firstPage,
  onSelectMovie,
  data,
  query,
}) => {
  // if the query is at least the characters and there is searchResultsDisplayData, display it
  // otherwise, display the data from the firstPage
  const displayData =
    query.length >= 3
      ? data?.length !== 0
        ? data
        : firstPage?.data?.Search
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
