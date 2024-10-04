export const FilterForm = ({
  list,
  filters,
  isOpen = false,
  onApplyFilters,
  uniqueFilters,
}) => {
  const handleSelect = (e) => {
    onApplyFilters({ ...filters, [e.target.id]: e.target.value });
  };

  return (
    <div className="filter-form-content">
      {isOpen ? (
        <>
          {Object.entries(uniqueFilters).map(([key, values]) => (
            <div key={key}>
              <select
                id={key}
                value={filters[key]}
                onChange={handleSelect}
              >
                <option value="" disabled hidden>
                  {key}
                </option>
                {uniqueFilters[key].map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};
