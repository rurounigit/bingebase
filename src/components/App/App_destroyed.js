import { useEffect, useState } from 'react';

import Navbar from '../Navbar/Navbar';
import Main from '../common/Main';
import Search from '../Navbar/Search';
import NumResults from '../common/NumResults';
import MovieList from '../SearchResults/MovieList';
import WatchedSummary from '../Watched/WatchedSummary';
import WatchedMoviesList from '../Watched/WatchedMoviesList';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import MovieDetails from '../Details/MovieDetails';
import { useMovies } from '../../hooks/legacy/useMovies';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useKey } from '../../hooks/useKey';
import { useLoadFirstPage } from '../../hooks/useLoadFirstPage';
import { useLoadNextPage } from '../../hooks/useLoadNextPage';
import { useLoadAllDetails } from '../../hooks/useLoadAllDetails';
import { usePrefetchNextPage } from '../../hooks/usePrefetchNextPage';
import {
  isMultiSelect,
  prepMultiSelectOptions,
} from '../../services/prepOptions';
import MultiSelectWrapper from '../common/MultiSelectWrapper';
import { filterMovies } from '../../services/filter';
import { sortMovies } from '../../services/sort';
import { FilterSortBar } from '../common/FilterSortBar';

const KEY = 'c6b8e164';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [allSelectedIDs, setAllSelectedIDs] = useState([]);

  const {
    movies,
    isLoading,
    error,
    totalResults,
    totalPages,
    loadFirstPage,
    loadNextPage,
    loadAllDetails,
    prefetchNextPage,
  } = useLoadFirstPage(query, KEY);

  const { watched, addWatchedMovie, deleteWatchedMovie, updateWatchedMovie } =
    useLocalStorage([], 'watched');

  usePrefetchNextPage(prefetchNextPage, totalPages);

  useKey('Escape', handleCloseMovie);

  useEffect(() => {
    function callback(e) {
      if (e.key === 'Escape') {
        handleCloseMovie();
      }
    }

    document.addEventListener('keydown', callback);

    return function () {
      document.removeEventListener('keydown', callback);
    };
  }, []);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  const handleAddAllResults = (movies) => {
    movies.forEach((movie) => {
      handleAddMovie(movie.userRating, movie);
    });
  };

  const handleAddMovie = (rating, movie) => {
    const rtRating =
      Number((movie.Ratings?.[1]?.Value || '').replace(/%/g, '')) || 'N/A';

    const newMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Runtime: movie.Runtime,
      imdbRating: movie.imdbRating,
      userRating: rating,
      rtRating: isNaN(rtRating) ? 'N/A' : rtRating,
      Rated: movie.Rated,
      Type: movie.Type,
      Genre: movie.Genre,
      Actors: movie.Actors,
      Director: movie.Director,
      imdbVotes: movie.imdbVotes,
    };

    setInitialWatched((initialWatched) =>
      initialWatched.some(
        (watchedMovie) => watchedMovie.imdbID === movie.imdbID
      )
        ? initialWatched.map((object) =>
            object.imdbID === movie.imdbID
              ? { ...object, userRating: rating }
              : object
          )
        : [...initialWatched, newMovie]
    );
  };

  return (
    <><Navbar><Search query={query} setQuery={setQuery} /></Navbar>

      <Main><Loader isLoading={isLoading} />

        <ErrorMessage message={error} />

        {!isLoading &amp;&amp; !error &amp;&amp; (
          <NumResults movies={movies} totalResults={totalResults} />
        )}

        <MovieList movies={movies} onSelectMovie={handleSelectMovie} />

        <Pages
          totalPages={totalPages}
          loadNextPage={loadNextPage}
          isLoading={isLoading}
        />
      </Main>

      <MovieDetails
        selectedId={selectedId}
        onCloseMovie={handleCloseMovie}
        onAddWatchedMovie={handleAddMovie}
        watched={watched}
        updateWatchedMovie={updateWatchedMovie}
      />

      <WatchedSummary watched={watched} />

      <WatchedMoviesList
        watched={watched}
        onDeleteWatchedMovie={deleteWatchedMovie}
        onUpdateWatchedMovie={updateWatchedMovie}
      />
    </>
  );
}
