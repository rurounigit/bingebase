export const NumResults = ({
  topOpen,
  topClosed,
  isActive = true,
  isFilterFormOpen,
  expanded,
  setExpanded,
  content,
  children,
}) => {
  const isExpanded = expanded === content;
  const direction =
    content === 'watched'
      ? isExpanded
        ? 'LeftToRight'
        : 'RightToLeft'
      : isExpanded
      ? 'RightToLeft'
      : 'LeftToRight';

  const handleExpand = () =>
    setExpanded((prev) => (prev === content ? '' : content));

  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'sticky',
        top: isFilterFormOpen ? topOpen : topClosed,
        display: 'flex',
        border: 'none',
        borderRadius: '0rem',
        zIndex: 998, // No need for string '998'
        backgroundColor: 'var(--color-background-500)',
      }}
    >
      <div
        style={{
          margin: '0rem', // This can be removed, margin: 0 is default
          padding: '0.5rem 1rem',
          fontSize: '1.4rem',
          opacity: isActive ? 0.3 : 0, // No need for string '0.3' or '0'
        }}
      >
        {children}
      </div>
      <button className="btn-toggle-box" onClick={handleExpand}>
        {direction === 'LeftToRight' && <>&#8677;</>}
        {direction === 'RightToLeft' && <>&#8676;</>}
      </button>
    </div>
  );
};
