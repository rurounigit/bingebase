import { useState, useEffect } from 'react';
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
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [movie, setMovie] = useState({});
  const { Title, imdbRating } = movie;

  const savedRating = initialWatched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating
    ? initialWatched.find((movie) => movie.imdbID === selectedID)
        ?.userRating
    : 0;

  const isWatched = initialWatched.some(
    (watchedMovie) => watchedMovie.imdbID === movie.imdbID
  );

  useKey('Escape', onCloseMovie);

  // fetch movie details on selection
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoadingDetails(true);
        setDetailError('');
        let res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );

        if (!res || !res.ok)
          throw new Error("couldn't load movies details.");

        const data = await res.json();

        if (data.Response === 'False')
          throw new Error('no results found.');

        res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}&plot=full`
        );

        if (!res || !res.ok)
          throw new Error("couldn't load movies details.");

        const data2 = await res.json();

        if (data2.Response === 'False')
          throw new Error('no results found.');

        setMovie({ ...data, Plotfull: data2.Plot });
      } catch (err) {
        if (err.message === 'Failed to fetch') {
          setDetailError("couldn't load movie details.");
        } else {
          setDetailError(err.message);
        }
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchMovieDetails();
  }, [selectedID]);

  // update page titel in browser
  useEffect(() => {
    if (!Title) return;
    document.title = `${Title} | ${
      savedRating ? '🌟' + savedRating : ''
    } ⭐️ ${imdbRating}`;
    return () => (document.title = 'BingeBase');
  }, [Title, savedRating, imdbRating, selectedID]);

  return (
    <div className="details header-wrapper">
      {isLoadingDetails ? (
        <Loader />
      ) : detailError ? (
        <ErrorMessage message={detailError} />
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
