import { Movie } from '../Details/Movie';

export const MovieList = ({ searchResults, onSelectMovie }) => (
  <ul className="list list-movies">
    {searchResults?.map((movie) => (
      <Movie
        movie={movie}
        key={movie.imdbID}
        onSelectMovie={onSelectMovie}
      />
    ))}
  </ul>
);
