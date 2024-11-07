/* const KEY = process.env.REACT_APP_OMDB_API_KEY; */ // Make sure to define this in your environment

import { KEY } from '../components/App/App';

const fetchData = async (url) => {
  const res = await fetch(url);
  if (!res || !res.ok) {
    throw new Error("Couldn't load movie details.");
  }
  const data = await res.json();
  if (data.Response === 'False') {
    throw new Error('No results found.');
  }
  return data;
};

export const fetchMovieDetails = async (movieId, plot = 'short') => {
  const url = `http://www.omdbapi.com/?apikey=${KEY}&i=${movieId}&plot=${plot}`;
  return fetchData(url);
};

export const fetchMovies = async (query, page = 1) => {
  const url = `http://www.omdbapi.com/?apikey=${KEY}&s=${query}&page=${page}`;
  return fetchData(url);
};
