import { useEffect } from 'react'; // No need for useState
import { useQueries } from '@tanstack/react-query';
import { Loader } from '../common/Loader';
import { ErrorMessage } from '../common/ErrorMessage';
import { useKey } from '../../hooks/useKey';
import { MovieDetailHeader } from './MovieDetailHeader';
import { MovieDetailsMain } from './MovieDetailsMain';
import { fetchMovieDetails } from '../../services/omdbApi';
import { NumResults } from '../common/NumResults';

export const MovieDetails = ({
  selectedID,
  onCloseMovie,
  onAddMovie,
  onDeleteMovie,
  initialWatched,
  searchResultsDisplayData,
  expandedBox,
  setExpandedBox,
  onClearWatched,
  initialWatchedLength,
}) => {
  const savedRating =
    initialWatched.find((movie) => movie.imdbID === selectedID)
      ?.userRating || 0;

  const isWatched = initialWatched
    .map((movie) => movie.imdbID)
    .includes(selectedID);

  useKey('Escape', onCloseMovie);

  const results = useQueries({
    queries: [
      {
        queryKey: ['movieDetails', selectedID, 'shortPlot'],
        queryFn: () => fetchMovieDetails(selectedID, 'short'),
        enabled: !!selectedID,
      },
      {
        queryKey: ['movieDetails', selectedID, 'fullPlot'],
        queryFn: () => fetchMovieDetails(selectedID, 'full'),
        enabled: !!selectedID,
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const error = results.find((result) => result.error)?.error;
  const shortPlotData = results[0].data;
  const fullPlotData = results[1].data;

  const movie =
    shortPlotData && fullPlotData
      ? { ...shortPlotData, Plotfull: fullPlotData.Plot }
      : {};

  useEffect(() => {
    if (shortPlotData?.Title) {
      document.title = `${shortPlotData?.Title} | ${
        savedRating ? '🌟' + savedRating : ''
      } ⭐️ ${shortPlotData?.imdbRating}`;
    }
    return () => (document.title = 'BingeBase');
  }, [shortPlotData, savedRating]);

  return (
    <div className="details header-wrapper">
      <NumResults
        isActive={true}
        isFilterFormOpen={false}
        topOpen={'4.4rem'}
        topClosed={'0rem'}
        isDetails={true}
        expandedBox={expandedBox}
        setExpandedBox={setExpandedBox}
        content="watched"
        onClearWatched={onClearWatched}
        onDeleteMovie={onDeleteMovie}
        selectedID={selectedID}
        onCloseMovie={onCloseMovie}
      >
        showing <strong>1</strong> of{' '}
        <strong>{initialWatched.length}</strong> results
      </NumResults>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : (
        <>
          <button className="btn-back" onClick={onCloseMovie}>
            &larr;
          </button>
          <MovieDetailHeader
            movie={movie}
            onCloseMovie={onCloseMovie}
          />
          <MovieDetailsMain
            movie={movie}
            onAddMovie={onAddMovie}
            savedRating={savedRating}
            isWatched={isWatched}
            onCloseMovie={onCloseMovie}
          />
        </>
      )}
    </div>
  );
};
