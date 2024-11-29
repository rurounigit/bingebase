export const NumResults = ({
  topOpen,
  topClosed,
  isActive = true,
  isFilterFormOpen,
  expandedBox,
  setExpandedBox,
  content,
  onAddAllResults,
  onClearWatched,
  children,
  isDetails = false,
  onDeleteMovie,
  selectedID,
  onCloseMovie,
}) => {
  // true if this component instance (whith the given content) is expanded
  const isExpanded = expandedBox === content;
  // if the content is watched, the direction is left to right,
  // otherwise right to left
  let direction =
    content === 'watched'
      ? isExpanded
        ? 'LeftToRightWatched'
        : 'RightToLeftWatched'
      : isExpanded
      ? 'RightToLeftSearchResults'
      : 'LeftToRightSearchResults';
  if (isDetails) direction = 'RightToLeftDetails';
  if (isDetails && isExpanded) direction = 'LeftToRightDetails';

  // handleExpand is a function that sets the expanded state to the given content
  const handleExpand = () =>
    setExpandedBox((prev) => (prev === content ? '' : content));

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'sticky',
        top: isFilterFormOpen ? topOpen : topClosed,
        display: 'flex',
        border: 'none',
        borderRadius: '0rem',
        borderBottom: '2px solid  var(--color-background-50)',

        zIndex: 2,
        backgroundColor: 'var(--color-background-500)',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          padding: '0.5rem 1rem',
          marginBottom: '0.1rem',
          fontSize: '1.4rem',
          opacity: isActive ? 0.3 : 0,
        }}
      >
        {children}
      </div>
      <button className="btn-toggle-box" onClick={handleExpand}>
        {direction === 'LeftToRightWatched' && (
          <>
            &#8677;
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 'normal',
                marginLeft: '0.5rem',
              }}
            >
              show search results
            </span>
          </>
        )}
        {direction === 'LeftToRightSearchResults' && (
          <>
            &#8677;
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 'normal',
                marginLeft: '0.5rem',
              }}
            >
              expand search results
            </span>
          </>
        )}
        {direction === 'RightToLeftDetails' && (
          <>
            &#8676;
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 'normal',
                marginLeft: '0.5rem',
              }}
            >
              expand details
            </span>
          </>
        )}
        {direction === 'LeftToRightDetails' && (
          <>
            &#8677;
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 'normal',
                marginLeft: '0.5rem',
              }}
            >
              show search results
            </span>
          </>
        )}
        {direction === 'RightToLeftWatched' && (
          <>
            &#8676;{' '}
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 'normal',
                marginLeft: '0.5rem',
              }}
            >
              expand watched
            </span>
          </>
        )}
        {direction === 'RightToLeftSearchResults' && (
          <>
            &#8676;{' '}
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 'normal',
                marginLeft: '0.5rem',
              }}
            >
              show watched
            </span>
          </>
        )}
      </button>
      {content === 'searchResults' && (
        <button
          className="btn-add-all-results"
          onClick={onAddAllResults}
        >
          <span
            style={{
              fontWeight: 'normal',
              fontSize: '1.5rem',
              paddingRight: '0.5rem',
            }}
          >
            ❖{' '}
          </span>{' '}
          add to watched
        </button>
      )}
      {content === 'watched' && !isDetails && (
        <button
          className="btn-add-all-results"
          onClick={onClearWatched}
        >
          <span
            style={{
              fontWeight: 'normal',
              fontSize: '1.5rem',
              paddingRight: '0.5rem',
            }}
          >
            ❖{' '}
          </span>{' '}
          clear
        </button>
      )}
      {content === 'watched' && isDetails && (
        <button
          className="btn-delete-details"
          onClick={() => {
            onDeleteMovie(selectedID);
            onCloseMovie();
          }}
        >
          –
        </button>
      )}
    </div>
  );
};
