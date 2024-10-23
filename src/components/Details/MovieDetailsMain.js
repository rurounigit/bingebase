import { useState } from 'react';
import { Button } from '../common/Button';
import { StarRating } from '../Watched/StarRating';

export const MovieDetailsMain = ({
  movie,
  onAddMovie,
  savedRating,
  isWatched,
  onCloseMovie,
}) => {
  const { Plot, Plotfull, imdbID, Actors, Director } = movie;
  const [isPlotShort, setIsPlotShort] = useState(true);

  const handleSummary = () => {
    setIsPlotShort(!isPlotShort);
  };

  return (
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
          <Button
            className="btn-add"
            onClick={() => onAddMovie(savedRating, movie)}
          >
            + Add to list
          </Button>
        )}
      </div>
      <p>
        {isPlotShort ? (
          <>
            <em>{Plot}</em>
            <Button className="btn-more" onClick={handleSummary}>
              ...more
            </Button>
          </>
        ) : (
          <>
            <em>{Plotfull}</em>
            <Button className="btn-more" onClick={handleSummary}>
              ...less
            </Button>
          </>
        )}
      </p>

      <p>Starring {Actors}</p>
      <p>Directed by {Director}</p>
    </section>
  );
};
