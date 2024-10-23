import { Button } from './Button';

export const FilterTags = ({
  filters,
  uniqueFilters,
  handleRemoveFilters,
}) => {
  return (
    <>
      {Object.entries(filters).map(([key, value]) => {
        const matchedFilter = uniqueFilters?.[key]?.find(
          (filter) => filter.value === value
        );

        return matchedFilter ? (
          <Button
            key={key}
            className="btn-filter-tag"
            onClick={() => handleRemoveFilters(key)}
          >
            {matchedFilter.value}
            {matchedFilter.count > 1
              ? ` (${matchedFilter.count})`
              : null}{' '}
            &times;
          </Button>
        ) : null;
      })}
    </>
  );
};
