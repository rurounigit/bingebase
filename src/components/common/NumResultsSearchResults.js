export const NumResultsSearchResults = ({
  firstPage,
  nextPage,
  data,
}) => (
  <>
    {' '}
    showing{' '}
    <strong>
      {nextPage?.isPending
        ? firstPage?.data?.Search?.length
        : data?.length}
    </strong>{' '}
    of <strong>{firstPage?.data?.totalResults}</strong> results
  </>
);
