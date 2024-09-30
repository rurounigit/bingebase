export const FilterFormWatched = ({
  onApplyFiltersWatched,
  watched,
  isFilterFormWatchedOpen,
  yearWatched,
  setYearWatched,
  typeWatched,
  setTypeWatched,
}) => {
  // Get unique years and types from the watched movies array
  const uniqueYears = [
    ...new Set(watched.map((movie) => parseInt(movie.Year, 10))),
  ].sort((a, b) => b - a);
  const uniqueTypes = [...new Set(watched.map((movie) => movie.Type))]
    .sort()
    .reverse();

  const handleSelectYear = (e) => {
    setYearWatched(e.target.value);
    onApplyFiltersWatched({
      year: e.target.value,
      type: typeWatched,
    });
  };

  const handleSelectType = (e) => {
    setTypeWatched(e.target.value);
    onApplyFiltersWatched({
      year: yearWatched,
      type: e.target.value,
    });
  };

  return (
    <div className="modal-content">
      {isFilterFormWatchedOpen ? (
        <>
          <div>
            <select
              id="year"
              value={yearWatched}
              onChange={handleSelectYear}
            >
              <option value="" selected disabled hidden>
                Year
              </option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              id="type"
              value={typeWatched}
              onChange={handleSelectType}
            >
              {' '}
              <option value="" selected disabled hidden>
                Type
              </option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}
    </div>
  );
};
