import { Button } from './Button';

export const Sort = ({
  isActive,
  onReverse,
  isReversed,
  options = [{ value: 'value', label: 'Value' }],
  setSortBy,
  sortBy,
}) => {
  const handleSelect = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="sort">
      <label htmlFor="sort">
        <span
          style={{
            opacity: !isActive ? '0.3' : '1',
            cursor: !isActive ? 'default' : 'pointer',
          }}
        >
          {'sort by '}
        </span>
        <select
          id="sort"
          disabled={!isActive}
          value={sortBy}
          onChange={handleSelect}
          style={{
            opacity: !isActive ? '0.3' : '1',
            cursor: !isActive ? 'default' : 'pointer',
          }}
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>
      </label>
      <Button
        className="btn-reverse"
        onClick={onReverse}
        isActive={isActive}
        toggleTextColor={isReversed}
      >
        {'\u21F5'}
      </Button>
    </div>
  );
};
