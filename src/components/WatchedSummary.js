export const WatchedSummary = ({ watched }) => {
  const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  const ratedMovies = watched.filter((movie) => movie.userRating);
  const moviesWithRuntime = watched.filter(
    (movie) => movie.Runtime !== 'N/A'
  );

  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(1);

  const avgUserRating =
    Math.round(
      average(ratedMovies.map((movie) => movie?.userRating ?? 0)) * 10
    ) / 10;

  const avgRuntime = Math.round(
    average(
      moviesWithRuntime.map((movie) => movie.Runtime.split(' ').at(0))
    )
  );

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};
