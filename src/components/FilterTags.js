import { Button } from './Button';

export const FilterTags = ({ filters, handleRemoveFilters }) => (
  <>
    {Object.keys(filters).map(
      (key) =>
        filters[key] && (
          <Button
            key={key}
            className="btn-filter-tag"
            onClick={() => handleRemoveFilters(key)}
          >
            {filters[key]} &times;
          </Button>
        )
    )}
  </>
);
