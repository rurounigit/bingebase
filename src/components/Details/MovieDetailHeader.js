/* import { useState } from 'react'; */
import { NegativeSVG } from '../common/NegativeSVG';
import { PositiveSVG } from '../common/PositiveSVG';

export const MovieDetailHeader = ({ movie, onCloseMovie }) => {
  const {
    Title,
    Released,
    Runtime,
    Genre,
    imdbRating,
    Poster,
    Rated,
    Ratings,
    imdbVotes,
    Awards,
    Type,
  } = movie;

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

  return (
    <header className="header-wrapper">
      <img
        src={Poster}
        alt={Title}
        onError={(e) => addDefaultImg(e)}
      />
      <div className="details-overview">
        <h2>{Title}</h2>
        <p>
          {Released} &bull; {Runtime}
          <span style={{ opacity: '0.4' }}>&bull; {Rated}</span>
        </p>
        <p>
          {Genre}
          <span style={{ opacity: '0.4' }}>&bull; {Type}</span>
        </p>
        <p>
          <a
            href={`https://www.imdb.com/title/${movie.imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>⭐️</span> {imdbRating}
            <span style={{ opacity: '0.4' }}>
              IMDb rating {`(${imdbVotes} votes)`}
            </span>
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
            {Ratings?.[1]?.Value ? (
              <span style={{ opacity: '0.4' }}>
                {' Rotten Tomatoes'}
              </span>
            ) : null}
          </a>
        ) : null}

        <p style={{ opacity: '0.4' }}>{Awards}</p>
      </div>
    </header>
  );
};
