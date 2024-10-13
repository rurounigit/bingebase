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
          {Object.keys(uniqueFilters).map((key) => (
            <div key={key}>
              <select
                id={key}
                value={filters[key]}
                onChange={handleSelect}
              >
                <option value="">{key}</option>
                {uniqueFilters[key].map(
                  (
                    value // Use uniqueFilters[key] to access the values array
                  ) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  )
                )}
              </select>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};
