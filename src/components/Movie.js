export const Movie = ({ movie, onSelectMovie }) => {
  const addDefaultImg = (e) => {
    e.target.src = 'default-poster.png';
  };

  return (
    <li
      key={movie.imdbID}
      onClick={() => onSelectMovie(movie.imdbID)}
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
        onError={(e) => addDefaultImg(e)}
      ></img>
      <h3>{movie.Title}</h3>
      <div
        style={{ gridColumn: '2 / -1', width: 'calc(100% - 1rem)' }}
      >
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
        <span
          style={{
            fontSize: '1.5rem',
            marginLeft: 'auto',
            opacity: '0.2',
          }}
        >
          {movie.Type}
        </span>
      </div>
    </li>
  );
};
