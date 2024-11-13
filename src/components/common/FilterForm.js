import { MultiSelectWrapper } from './MultiSelectWrapper';
export const FilterForm = ({
  list,
  filters,
  isOpen = false,
  onApplyFilters,
  uniqueFilters,
  setFilters,
}) => {
  /* const handleSelect = (e) => {
    onApplyFilters({ ...filters, [e.target.id]: e.target.value });
  }; */

  return (
    <div
      className="filter-form-content"
      style={{
        padding: isOpen ? '1rem' : '0',
        borderBottom: isOpen
          ? '2px solid var(--color-highlight)'
          : '0',
      }}
    >
      {isOpen ? (
        <>
          {Object.entries(uniqueFilters)
            .sort(([, a], [, b]) => {
              const maxCountA = Math.max(
                ...a.map((item) => item.count)
              );
              const maxCountB = Math.max(
                ...b.map((item) => item.count)
              );
              return maxCountB - maxCountA;
            })
            .map(
              (
                [key, values] // Use destructuring here
              ) => (
                /* key !== 'Actors' && key !== 'Genre' ? (
                  <div key={key}>
                    <select
                      id={key}
                      value={filters[key] ? filters[key] : key}
                      onChange={handleSelect}
                    >
                      <option value="">{key}</option>{' '}
                      {values.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.value}{' '}
                          {item.count > 1 ? `(${item.count})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : */ <MultiSelectWrapper
                  key={key}
                  id={key}
                  filters={filters}
                  onApplyFilters={onApplyFilters}
                  options={values}
                  setFilters={setFilters}
                />
              )
            )}
        </>
      ) : null}
    </div>
  );
};
