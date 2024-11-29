import { MultiSelectWrapper } from './MultiSelectWrapper';
export const FilterForm = ({
  list,
  filters,
  isOpen = false,
  onApplyFilters,
  uniqueFilters,
  setFilters,
}) => {
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
            .map(([key, values]) => (
              <MultiSelectWrapper
                key={key}
                id={key}
                filters={filters}
                onApplyFilters={onApplyFilters}
                options={values}
                setFilters={setFilters}
              />
            ))}
        </>
      ) : null}
    </div>
  );
};
