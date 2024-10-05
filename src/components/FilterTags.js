import { Button } from './Button';

export const FilterTags = ({ filters, handleRemoveFilter }) => (
  <>
    {Object.keys(filters).map(
      (key) =>
        filters[key] && (
          <Button
            key={key}
            className="btn-filter-tag"
            onClick={() => handleRemoveFilter(key)}
          >
            {filters[key]} &times;
          </Button>
        )
    )}
  </>
);
