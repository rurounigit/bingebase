import { Button } from './Button';

export const Pages = ({
  isActive,
  pages,
  setPages,
  onRemovePage,
  onAddPage,
}) => {
  const handleChangePage = (e) => {
    setPages((pages) => ({
      previous: Number(pages.current),
      current: e.target.value < 1 ? 1 : +e.target.value,
    }));
  };

  return (
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
  );
};
