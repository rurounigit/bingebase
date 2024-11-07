import { useEffect, useMemo } from 'react'; // No need for useState
import { useQueries } from '@tanstack/react-query';
import { KEY } from '../App/App';
import { Loader } from '../common/Loader';
import { ErrorMessage } from '../common/ErrorMessage';
import { useKey } from '../../hooks/useKey';
import { MovieDetailHeader } from './MovieDetailHeader';
import { MovieDetailsMain } from './MovieDetailsMain';

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
        queryFn: async () => {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
          );
          if (!res || !res.ok)
            throw new Error("couldn't load movies details.");
          const data = await res.json();
          if (data.Response === 'False')
            throw new Error('no results found.');
          return data;
        },
        enabled: !!selectedID,
      },
      {
        queryKey: ['movieDetails', selectedID, 'fullPlot'],
        queryFn: async () => {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}&plot=full`
          );
          if (!res || !res.ok)
            throw new Error("couldn't load movies details.");
          const data = await res.json();
          if (data.Response === 'False')
            throw new Error('no results found.');
          return data;
        },
        enabled: !!selectedID,
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const error = results.find((result) => result.error)?.error;
  const shortPlotData = results[0].data;
  const fullPlotData = results[1].data;

  /* const movie =
    shortPlotData && fullPlotData
      ? { ...shortPlotData, Plotfull: fullPlotData.Plot }
      : {};  */

  const movie = useMemo(() => {
    if (shortPlotData) {
      return { ...shortPlotData, Plotfull: fullPlotData?.Plot };
    }
    return {};
  }, [shortPlotData, fullPlotData]);

  useEffect(() => {
    if (movie?.Title) {
      document.title = `${movie.Title} | ${
        savedRating ? '🌟' + savedRating : ''
      } ⭐️ ${movie?.imdbRating}`;
    }
    return () => (document.title = 'BingeBase');
  }, [movie, savedRating]);

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
