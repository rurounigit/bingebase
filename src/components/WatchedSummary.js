export const WatchedSummary = ({
  watched,
  isFilterFormOpenWatched,
}) => {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  const ratedMovies = watched.filter((movie) => movie.userRating);
  const moviesWithRuntime = watched.filter(
    (movie) => movie.Runtime !== 'N/A'
  );
  const moviesWithImdbRating = watched.filter(
    (movie) => movie.imdbRating !== 'N/A'
  );

  const avgImdbRating = average(
    moviesWithImdbRating.map((movie) => movie.imdbRating)
  ).toFixed(1);

  const avgUserRating =
    Math.round(
      average(ratedMovies.map((movie) => movie?.userRating ?? 0)) * 10
    ) / 10;

  const avgRuntime = Math.round(
    average(
      moviesWithRuntime.map((movie) =>
        movie?.Runtime.split(' ').at(0)
      )
    )
  );

  return (
    <div
      style={{
        position: 'sticky',
        top: isFilterFormOpenWatched ? '4.4rem' : '2.2rem',

        /*  padding: '1.4rem 3.2rem 1.4rem 3.2rem', */
        backgroundColor: 'var(--color-background-500',
        borderRadius: '0.0',
        zIndex: '999',
      }}
    >
      <div className="summary">
        <h2>Watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length <= 0 ? '–' : watched.length}</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating <= 0 ? '–' : avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating <= 0 ? '–' : avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime <= 0 ? '–' : avgRuntime}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
