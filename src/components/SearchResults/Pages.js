import { Button } from '../common/Button';

export const Pages = ({
  isActive,
  pages,
  setPages,
  totalResults,
  onAddPage,
  onRemovePage,
  nextPage,
}) => {
  const handleAddPage = () => {
    const totalPages = Math.trunc(Number(totalResults) / 10);

    setPages((prevPages) => {
      const newCurrent =
        prevPages.current <= totalPages
          ? prevPages.current + 1
          : prevPages.current;

      const updatedPages = {
        ...prevPages,
        previous: prevPages.current,
        current: newCurrent,
      };
      onAddPage(updatedPages, totalResults, nextPage);
      return updatedPages;
    });
  };

  const handleRemovePage = () => {
    if (pages.current > 1) {
      const newPages = {
        ...pages,
        previous: Number(pages.current),
        current: Number(pages.current) <= 1 ? 1 : +pages.current - 1,
      };
      setPages(newPages);
      onRemovePage(newPages, totalResults);
    }
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
