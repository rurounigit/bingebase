import { Button } from './Button';

export const FilterTags = ({
  filters,
  uniqueFilters,
  handleRemoveFilters,
}) => {
  return (
    <div className="filter-tags">
      {Object.entries(filters).map(([key, value]) => {
        const isArray = Array.isArray(value);
        const valuesToCheck = isArray ? value : [value];

        return valuesToCheck.map((val) => {
          // No need for index if not used in the key
          const matchedFilter = uniqueFilters?.[key]?.find(
            (filter) => filter.value === val
          );

          return matchedFilter ? (
            <Button
              key={`${key}-${isArray ? val : ''}`} // Use the value itself for array keys, more robust
              className="btn-filter-tag"
              onClick={() =>
                handleRemoveFilters(key, isArray ? val : undefined)
              }
            >
              {matchedFilter.value}
              {matchedFilter.count > 1
                ? ` (${matchedFilter.count})`
                : null}{' '}
              &times;
            </Button>
          ) : null;
        });
      })}
    </div>
  );
};
