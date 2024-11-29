import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../services/omdbApi';

export function usePrefetchNextPage(query, pages) {
  useQuery({
    queryKey: ['nextPage', query, pages.current + 1],
    queryFn: () => fetchMovies(query, pages.current + 1),
    enabled: query.length >= 3,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
}
