import { useState, useEffect } from 'react';
import { KEY } from './App';
import { StarRating } from './StarRating';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { useKey } from '../hooks/useKey';
import { Button } from './Button';
import { MovieDetailHeader } from './MovieDetailHeader';
import { MovieDetailsMain } from './MovieDetailsMain';

export const MovieDetails = ({
  selectedID,
  onCloseMovie,
  onAddMovie,
  onDeleteMovie,
  watched,
}) => {
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [movie, setMovie] = useState({});
  const { Title, imdbRating } = movie;

  const savedRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating
    ? watched.find((movie) => movie.imdbID === selectedID)?.userRating
    : 0;

  const isWatched = watched.some(
    (watchedMovie) => watchedMovie.imdbID === movie.imdbID
  );

  useKey('Escape', onCloseMovie);

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

  useEffect(() => {
    if (!Title) return;
    document.title = `${Title} | ${
      savedRating ? '🌟' + savedRating : ''
    } ⭐️ ${imdbRating}`;
    return () => (document.title = 'BingeBase');
  }, [Title, savedRating, imdbRating, selectedID]);

  return (
    <div className="details">
      {isLoadingDetails ? (
        <Loader />
      ) : detailError ? (
        <ErrorMessage message={detailError} />
      ) : (
        <>
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
