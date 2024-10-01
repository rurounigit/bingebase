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
              <span>
                {movie.userRating === 0
                  ? 'no user rating'
                  : movie.userRating}
              </span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime}</span>
            </p>
            <p>
              <span style={{ opacity: '0.3' }}>🗓️</span>
              <span style={{ opacity: '0.3' }}>{movie.Year}</span>
            </p>
            <p>
              <span style={{ opacity: '0.3' }}>
                {movie.Type === 'movie' && '🎬'}
                {movie.Type === 'series' && '📺'}
                {movie.Type === 'game' && '🎮'}
              </span>
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
