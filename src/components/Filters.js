import { useState } from 'react';
import { Button } from './Button';

export const Filters = ({
  movies,
  pages,
  setPages,
  totalResults,
  onAddPage,
  onRemovePage,
  onSortResults,
  isActive,
  isReversed,
  onReverse,
  isActiveWatchlist,
}) => {
  const [value, setValue] = useState('fruit');

  const handleSelect = (e) => {
    setValue(e.target.value);
    onSortResults(e);
  };

  const handleChangePage = (e) => {
    setPages((pages) => ({
      previous: Number(pages.current),
      current: e.target.value < 1 ? 1 : +e.target.value,
    }));
  };

  return (
    <div className="data-bar">
      <div className="filter">
        <Button className={'btn-filter'} isActive={isActive}>
          <svg
            fill="#ffffff"
            width="20px"
            height="20px"
            viewBox="0 0 33 33"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#ffffff"
          >
            <g
              id="SVGRepo_bgCarrier"
              strokeWidth="0"
              transform="translate(0,0), scale(1)"
            ></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {' '}
              <title>bars-filter</title>{' '}
              <path d="M30 6.749h-28c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h28c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM24 14.75h-16c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h16c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0zM19 22.75h-6.053c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h6.053c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0z"></path>{' '}
            </g>
          </svg>
        </Button>

        <div className="sort">
          <div className="pages">
            <label
              htmlFor="pages"
              style={{
                opacity: !isActive ? '0.3' : '1',
                cursor: !isActive ? 'default' : 'pointer',
              }}
            >
              {'pages '}
            </label>
            <Button
              className={'btn-add-page'}
              isActive={isActive}
              onClick={onRemovePage}
            >
              –
            </Button>
            <input
              id="pages"
              disabled={!isActive}
              value={pages.current}
              onChange={handleChangePage}
              style={{
                opacity: !isActive ? '0.3' : '1',
                cursor: !isActive ? 'default' : 'pointer',
              }}
            />
            <Button
              className={'btn-add-page'}
              isActive={isActive}
              onClick={onAddPage}
            >
              +
            </Button>
          </div>
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
              <option value="Title">Title</option>
              <option value="Year">Year</option>
              <option value="Type">Type</option>
            </select>
          </label>
          <Button
            className="btn-reverse"
            onClick={onReverse}
            isActive={isActive}
          >
            {'\u21F5'}
          </Button>
        </div>
      </div>
      <div className="filter">
        <div className="sort">
          {' '}
          <label htmlFor="sort">
            <span
              style={{
                opacity: !isActiveWatchlist ? '0.3' : '1',
                cursor: !isActiveWatchlist ? 'default' : 'pointer',
              }}
            >
              {'sort by '}
            </span>
            <select
              id="sort"
              disabled={!isActiveWatchlist}
              value={value}
              onChange={handleSelect}
              style={{
                opacity: !isActiveWatchlist ? '0.3' : '1',
                cursor: !isActiveWatchlist ? 'default' : 'pointer',
              }}
            >
              <option value="Title">Title</option>
              <option value="Year">Year</option>
              <option value="Type">Type</option>
            </select>
          </label>
          <Button
            className="btn-reverse"
            onClick={onReverse}
            isActive={isActiveWatchlist}
          >
            {'\u21F5'}
          </Button>
        </div>
      </div>
    </div>
  );
};
