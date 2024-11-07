import { useEffect } from 'react'; // No need for useState
import { useQueries } from '@tanstack/react-query';
import { Loader } from '../common/Loader';
import { ErrorMessage } from '../common/ErrorMessage';
import { useKey } from '../../hooks/useKey';
import { MovieDetailHeader } from './MovieDetailHeader';
import { MovieDetailsMain } from './MovieDetailsMain';
import { fetchMovieDetails } from '../../services/omdbApi';

export const MovieDetails = ({
  selectedID,
  onCloseMovie,
  onAddMovie,
  onDeleteMovie,
  initialWatched,
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