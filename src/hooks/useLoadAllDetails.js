import { useQueries } from '@tanstack/react-query';
import { fetchMovieDetails } from '../services/omdbApi';

export function useLoadAllDetails(selectedIDs, isAddingAllResults) {
  const allDetails = useQueries({
    queries: selectedIDs?.flatMap((ID) => [
      {
        queryKey: ['movieDetails', ID, 'shortPlot'],
        queryFn: () => fetchMovieDetails(ID, 'short'),
        staleTime: Infinity,
        enabled: isAddingAllResults.current,
      },
      {
        queryKey: ['movieDetails', ID, 'fullPlot'],
        queryFn: () => fetchMovieDetails(ID, 'full'),
        staleTime: Infinity,
        enabled: isAddingAllResults.current,
      },
    ]),
  });

  const allDetailsIsLoading = allDetails.some(
    (result) => result.isLoading
  );
  const allDetailsError = allDetails.find(
    (result) => result.error
  )?.error;
  const allDetailsIsFetching = allDetails.some(
    (result) => result.isFetching
  );
  const allDetailsData = allDetails.reduce((acc, result, index) => {
    if (index % 2 === 0) {
      // Even index: short plot
      const shortPlotData = result.data;
      const fullPlotData = allDetails[index + 1]?.data; // Get next result for full plot

      if (shortPlotData && fullPlotData) {
        acc.push({ ...shortPlotData, Plotfull: fullPlotData.Plot });
      }
    }
    return acc;
  }, []);

  return {
    allDetailsData,
    allDetailsIsLoading,
    allDetailsError,
    allDetailsIsFetching,
  };
}
