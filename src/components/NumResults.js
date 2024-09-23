export const NumResults = ({
  movies,
  totalResults,
  isActive = true,
}) => (
  <div style={{ display: 'flex' }}>
    <p
      className="num-results"
      style={{
        padding: '0.8rem',
        opacity: !isActive ? '0.0' : '1',
        cursor: !isActive ? 'default' : 'pointer',
      }}
    >
      showing <strong>{movies.length}</strong> of{' '}
      <strong>{totalResults}</strong> results
    </p>
  </div>
);
