export const FilterForm = ({
  onApplyFilters,
  movies,
  isFilterFormOpen,
  year,
  setYear,
  type,
  setType,
}) => {
  // Get unique years and types from the movies array
  const uniqueYears = [
    ...new Set(movies.map((movie) => parseInt(movie.Year, 10))),
  ].sort((a, b) => b - a);
  const uniqueTypes = [...new Set(movies.map((movie) => movie.Type))]
    .sort()
    .reverse();

  const handleSelectYear = (e) => {
    setYear(e.target.value);
    onApplyFilters({ year: e.target.value, type });
  };

  const handleSelectType = (e) => {
    setType(e.target.value);
    onApplyFilters({ year, type: e.target.value });
  };

  return (
    <div className="modal-content">
      {isFilterFormOpen ? (
        <>
          <div>
            <select
              id="year"
              value={year}
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
              value={type}
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
