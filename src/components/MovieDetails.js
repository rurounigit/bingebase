import { useState, useEffect } from 'react';
import { KEY } from './App';
import { StarRating } from './StarRating';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { useKey } from '../hooks/useKey';
import { Button } from './Button';
import { PositiveSVG } from './PositiveSVG';
import { NegativeSVG } from './NegativeSVG';

export const MovieDetails = ({
  selectedID,
  onCloseMovie,
  onAddMovie,
  onDeleteMovie,
  watched,
  hasMouseEnteredBox = false,
  onMouseEnterBox,
  onMouseLeaveBox,
}) => {
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [movie, setMovie] = useState({});
  const [plotIsShort, setPlotIsShort] = useState(true);

  const {
    Title,
    Released,
    Runtime,
    Genre,
    Plot,
    Plotfull,
    imdbID,
    imdbRating,
    Actors,
    Director,
    Poster,
    Rated,
    Ratings,
    imdbVotes,
    Awards,
    Type,
  } = movie;

  const savedRating = watched.find(
    (movie) => movie.imdbID === selectedID
  )?.userRating
    ? watched.find((movie) => movie.imdbID === selectedID)?.userRating
    : 0;

  const isWatched = watched.some(
    (watchedMovie) => watchedMovie.imdbID === movie.imdbID
  );

  const addDefaultImg = (e) => {
    e.target.src = 'default-poster.svg';
  };

  const rtRating = Number(Ratings?.[1]?.Value.replace(/%/g, ''));
  let rtState = null;
  if (rtRating >= 60) {
    rtState = 'positive';
  }
  if (rtRating < 60) {
    rtState = 'negative';
  }
  if (rtRating === 0) {
    rtState = null;
  }

  const handleSummary = () => {
    setPlotIsShort(!plotIsShort);
  };

  const getRottenTomatoesUrl = (movie) => {
    // Pass the whole movie object
    const formattedTitle = movie?.Title?.toLowerCase() // Optional chaining
      ?.replace(/[^a-z0-9 ]/g, '')
      ?.replace(/ /g, '_');

    const type = movie?.Type === 'movie' ? 'm' : 'tv'; // Determine type

    return formattedTitle
      ? `https://www.rottentomatoes.com/${type}/${formattedTitle}`
      : ''; // Return empty string if title is undefined
  };

  useKey('Escape', onCloseMovie);

  const fetchMovieData = async (url) => {
    const res = await fetch(url);
    if (!res || !res.ok)
      throw new Error("couldn't load movies details.");
    const data = await res.json();
    if (data.Response === 'False') throw new Error('no results found.');
    return data;
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoadingDetails(true);
        setDetailError('');

        const data = await fetchMovieData(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );
        const data2 = await fetchMovieData(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}&plot=full`
        );

        setMovie({ ...data, Plotfull: data2.Plot });
      } catch (err) {
        if (err.name === 'AbortError') return;
        setDetailError(
          err.message === 'Failed to fetch'
            ? "Could not connect to the movie database. Please check your internet connection."
            : err.message
        );
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
          <header
            onMouseEnter={onMouseEnterBox}
            onMouseLeave={onMouseLeaveBox}
          >
            <button
              className="btn-back"
              onClick={onCloseMovie}
              style={{ opacity: hasMouseEnteredBox ? '1' : '0' }}
            >
              &larr;
            </button>

            <img
              src={Poster}
              alt={Title}
              onError={(e) => addDefaultImg(e)}
            />
            <div className="details-overview">
              <h2>{Title}</h2>
              <p>
                {Released} &bull; {Runtime} &bull;{' '}
                <span style={{ opacity: '0.3' }}>{Rated}</span>
              </p>
              <p>{Genre}</p>
              <p>
                <a
                  href={`https://www.imdb.com/title/${movie.imdbID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>⭐️</span> {imdbRating} IMDb rating{' '}
                  <span
                    style={{ opacity: '0.3' }}
                  >{`(${imdbVotes})`}</span>
                </a>
              </p>
              {movie ? (
                <a
                  href={getRottenTomatoesUrl(movie)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {rtState === 'positive' ? (
                    <PositiveSVG />
                  ) : rtState === 'negative' ? (
                    <NegativeSVG />
                  ) : null}
                  {Ratings?.[1]?.Value}
                </a>
              ) : null}

              <p style={{ opacity: '0.3' }}>{Awards}</p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={onAddMovie}
                key={imdbID}
                rating={savedRating}
                movie={movie}
              />
              {isWatched ? null : (
                <button
                  className="btn-add"
                  onClick={() => onAddMovie(savedRating, movie)}
                >
                  + Add to list
                </button>
              )}
            </div>
            <p>
              {plotIsShort ? (
                <>
                  <em>{Plot}</em>
                  <Button
                    className="btn-more"
                    onClick={handleSummary}
                  >
                    ...more
                  </Button>
                </>
              ) : (
                <>
                  <em>{Plotfull}</em>
                  <Button
                    className="btn-more"
                    onClick={handleSummary}
                  >
                    ...less
                  </Button>
                </>
              )}
            </p>

            <p>Starring {Actors}</p>
            <p>Directed by {Director}</p>
          </section>
        </>
      )}
    </div>
  );
};
