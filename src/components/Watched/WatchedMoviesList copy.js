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

  const watchedFormatted = watched.map((movie) => ({
    Title: movie.Title,
    imdbID: movie.imdbID,
    /*  Runtime: movie.Runtime <= 0 ? '–' : movie.Runtime,
    imdbRating:
      movie.imdbRating <= 0
        ? '–'
        : `${movie.imdbRating} (${movie.imdbVotes})`, */
    Poster: movie.Poster,
    /*  userRating: movie.userRating <= 0 ? '–' : movie.userRating,
    rtRating: movie.rtRating,
    Type: movie.Type,
    TypeIcon:
      movie.Type === 'movie'
        ? '🎬'
        : movie.Type === 'series'
        ? '📺'
        : movie.Type === 'game'
        ? '🎮'
        : '',
    Year: movie.Year, */
  }));

  const watchedShownProps = watched.reduce((acc, movie) => {
    acc[movie.imdbID] = [
      {
        icon: '⭐️',
        label: 'imdbRating',
        value: movie.imdbRating <= 0 ? '–' : movie.imdbRating,
        imdbVotes: movie.imdbVotes ? ` (${movie.imdbVotes})` : '',
      },
      {
        icon: '🌟',
        label: 'userRating',
        value: movie.userRating <= 0 ? '–' : movie.userRating,
      },
      { icon: '🍅', label: 'rtRating', value: movie.rtRating },
      { icon: '🗓', label: 'Year', value: movie.Year },
      {
        icon: '⏳',
        label: 'Runtime',
        value: movie.Runtime <= 0 ? '–' : movie.Runtime,
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
        value: '',
      },
    ];
    return acc;
  }, {});

  return (
    <ul className="list list-watched">
      {watchedFormatted.map((movie) => (
        <li
          key={movie.imdbID}
          onClick={() => onSelectMovie(movie.imdbID)}
        >
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            onError={(e) => addDefaultImg(e)}
          />
          <h2>
            {movie.Title}{' '}
            <span style={{ opacity: '0.3', fontSize: '1.2rem' }}>
              ({movie.imdbID})
            </span>
          </h2>
          <div>
            <WatchedMoviesListProps
              movieImdbID={movie.imdbID}
              watchedShownProps={watchedShownProps}
              sortByWatched={sortByWatched}
            />
            {/*  {watched.some(
              (watchedMovie) => watchedMovie.imdbID === movie.imdbID
            ) ? ( */}
            <button
              className="btn-delete-big"
              onClick={(e) => handleDeleteMovie(e, movie.imdbID)}
            >
              –
            </button>
            {/*  ) : null} */}
          </div>
        </li>
      ))}
    </ul>
  );
};

export const WatchedMoviesListProps = ({
  watchedShownProps,
  movieImdbID,
  sortByWatched,
}) => {
  const sortedBy = watchedShownProps[movieImdbID]
    .find((prop) => prop.label === sortByWatched)
    .filter((prop) => prop?.value !== 'N/A');
  /* console.log(JSON.stringify(sortedBy, null, 2)); */
  return (
    <>
      {sortedBy?.icon} {sortedBy?.value} {sortedBy?.imdbVotes}
      {(watchedShownProps[movieImdbID] || [])
        .filter((prop) => prop?.label !== sortedBy?.label)
        .filter((prop) => prop?.value !== 'N/A')
        .map((prop) => (
          <p key={prop?.label}>
            <span>
              {prop?.icon} {prop?.value} {prop?.imdbVotes}
            </span>
          </p>
        ))}
    </>
  );
};
