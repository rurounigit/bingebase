export const NumResultsWatchlist = ({
  topOpen,
  topClosed,
  movies,
  totalResults,
  isActive = true,
  isFilterFormOpen,
  children,
}) => (
  <>
    {isActive ? (
      <div
        style={{
          position: 'sticky',
          top: isFilterFormOpen ? '11.8rem' : '9.6rem',
          display: 'flex',
          border: 'none',
          borderRadius: '0rem',
          zIndex: '998',
          backgroundColor: 'var(--color-background-500)',
        }}
      >
        <div
          style={{
            margin: '0rem',
            padding: '0.5rem 1rem 0.5rem 1rem',
            fontSize: '1.4rem',
            opacity: isActive ? '0.3' : '0',
          }}
        >
          {children}
        </div>
      </div>
    ) : null}
  </>
);
