import { useState } from 'react';
import { Button } from './Button';

export const Sort = ({
  isActive,
  onReverse,
  onSortResults,
  isReversed,
  options = [{ value: 'value', label: 'Value' }],
}) => {
  const [value, setValue] = useState(options[0].value);

  const handleSelect = (e) => {
    setValue(e.target.value);
    onSortResults(e);
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
          value={value}
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
          {/*  <option value="Title">🗄️Title</option>
          <option value="Year">🗓️ Year</option>
          <option value="Type">🎬 Type</option>
          <option value="imdbRating">⭐️ imdb</option>
          <option value="userRating">🌟 user</option> */}
        </select>
      </label>
      <Button
        className="btn-reverse"
        onClick={onReverse}
        isActive={isActive}
        isReversed={isReversed}
      >
        {'\u21F5'}
      </Button>
    </div>
  );
};
