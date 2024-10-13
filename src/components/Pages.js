import { Button } from './Button';

export const Pages = ({
  isActive,
  pages,
  setPages,
  onPageChange,
  totalResults,
}) => {
  const handleAddPage = () => {
    const newPages = {
      ...pages,
      previous: Number(pages.current),
      current:
        Number(pages.current) <= Math.trunc(totalResults / 10)
          ? Number(pages.current) + 1
          : Number(pages.current),
    };
    setPages(newPages);
    onPageChange(newPages);
  };

  const handleRemovePage = () => {
    const newPages = {
      ...pages,
      previous: Number(pages.current),
      current: Number(pages.current) <= 1 ? 1 : +pages.current - 1,
    };
    setPages(newPages);
    onPageChange(newPages);
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
        onClick={handleRemovePage}
      >
        –
      </Button>
      <input
        id="pages"
        disabled={true}
        value={pages.current}
        /* onChange={handleChangePage} */
        style={{
          opacity: !isActive ? '0.3' : '1',
          cursor: 'default',
        }}
      />
      <Button
        className={'btn-add-page'}
        isActive={isActive}
        onClick={handleAddPage}
      >
        +
      </Button>
    </div>
  );
};
