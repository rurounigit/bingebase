export const WatchedMoviesList = ({
  watched,
  onSelectMovie,
  onDeleteMovie,
}) => {
  const handleDeleteMovie = (e, movieID) => {
    onDeleteMovie(movieID);
    e.stopPropagation();
  };

  const addDefaultImg = (e) => {
    e.target.src = 'default-poster.png';
  };

  return (
    <ul className="list list-watched">
      {watched.map((movie) => (
        <li
          key={movie.imdbID}
          onClick={() => onSelectMovie(movie.imdbID)}
        >
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            onError={(e) => addDefaultImg(e)}
          />
          <h2>{movie.Title}</h2>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie?.userRating ?? 'no user rating'}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime}</span>
            </p>
            {watched.some(
              (watchedMovie) => watchedMovie.imdbID === movie.imdbID
            ) ? (
              <button
                className="btn-delete-big"
                onClick={(e) => handleDeleteMovie(e, movie.imdbID)}
              >
                –
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
};
