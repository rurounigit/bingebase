import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchMovies } from '../services/omdbApi';

export function useLoadFirstPage(query, pages) {
  const {
    data: firstPageData,
    isFetching: firstPageIsFetching,
    error: firstPageError,
  } = useQuery({
    queryKey: ['firstPage', query],
    queryFn: () => fetchMovies(query),
    enabled: query.length >= 3,
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: Infinity,
  });
  return {
    firstPageData,
    firstPageIsFetching,
    firstPageError,
    totalResults: Number(firstPageData?.totalResults),
  };
}
