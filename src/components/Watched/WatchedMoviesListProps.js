export const WatchedMoviesListProps = ({
  movie,
  watchedShownProps,
  sortByWatched,
}) => {
  const sortedBy = watchedShownProps[movie.imdbID].find(
    (prop) => prop.label === sortByWatched
  );

  return (
    <>
      {sortedBy?.value && sortedBy.value !== 'N/A' && (
        <>
          {sortedBy.icon} {sortedBy.value} {sortedBy.imdbVotes}
        </>
      )}
      {watchedShownProps[movie.imdbID]
        .filter(
          (prop) =>
            prop.label !== sortedBy?.label &&
            prop.value !== '–' &&
            prop.value !== 'N/A' &&
            prop.value !== undefined
        )
        .map((prop) => (
          <p key={prop.label} className={prop.label}>
            {prop.icon}{' '}
            {prop.value !== 'movie' &&
            prop.value !== 'series' &&
            prop.value !== 'game'
              ? prop.value
              : null}{' '}
            {prop.imdbVotes}
          </p>
        ))}
    </>
  );
};
