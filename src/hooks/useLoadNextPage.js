import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../services/omdbApi';

export function useLoadNextPage(query, pages) {
  const nextPage = useQuery({
    queryKey: ['nextPage', query, pages.current + 1],
    queryFn: () => fetchMovies(query, pages.current + 1),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    retry: false,
    enabled: query.length >= 3,
  });
  return nextPage;
}
