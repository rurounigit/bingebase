import { WatchedMoviesListProps } from './WatchedMoviesListProps'; // Import the separated component

export const WatchedMoviesList = ({
  watched,
  onSelectMovie,
  onDeleteMovie,
  sortByWatched,
}) => {
  const handleDeleteMovie = (e, movieID) => {
    onDeleteMovie(movieID);
    e.stopPropagation();
  };

  const addDefaultImg = (e) => {
    e.target.src = 'default-poster.png';
  };

  const watchedShownProps = watched.reduce((acc, movie) => {
    acc[movie.imdbID] = [
      {
        icon: '⭐️',
        label: 'imdbRating',
        value: movie.imdbRating <= 0 ? 'N/A' : movie.imdbRating,
        imdbVotes: movie.imdbVotes ? ` (${movie.imdbVotes})` : '',
      },
      {
        icon: '🌟',
        label: 'userRating',
        value: movie.userRating <= 0 ? 'N/A' : movie.userRating,
      },
      {
        icon: '🍅',
        label: 'rtRating',
        value: movie.rtRating <= 0 ? 'N/A' : movie.rtRating,
      },
      { icon: '🗓', label: 'Year', value: movie.Year },
      {
        icon: '⏳',
        label: 'Runtime',
        value: movie.Runtime <= 0 ? 'N/A' : movie.Runtime, // Handle N/A and <= 0
      },
      {
        icon:
          movie.Type === 'movie'
            ? '🎬'
            : movie.Type === 'series'
            ? '📺'
            : movie.Type === 'game'
            ? '🎮'
            : '',
        label: 'Type',
        value: movie.Type, // Include the Type value
      },
    ];
    return acc;
  }, {});

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
            onError={addDefaultImg}
          />
          <h2>
            {movie.Title}{' '}
            <span style={{ opacity: '0.3', fontSize: '1.2rem' }}>
              ({movie.imdbID})
            </span>
          </h2>
          <div>
            <WatchedMoviesListProps
              movie={movie} // Pass the whole movie object
              watchedShownProps={watchedShownProps}
              sortByWatched={sortByWatched}
            />
            <button
              className="btn-delete-big"
              onClick={(e) => handleDeleteMovie(e, movie.imdbID)}
            >
              –
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
