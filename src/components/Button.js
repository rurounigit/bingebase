export const Button = ({
  className,
  isActive = true,
  onClick,
  children,
  isFilterFormOpen = false,
  isReversed = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!isActive}
      className={className}
      style={{
        opacity: !isActive ? '0.3' : '1',
        cursor: !isActive ? 'default' : 'pointer',
        outline: isFilterFormOpen
          ? 'var(--color-primary-light) solid 2px'
          : 'none',
        transform: isFilterFormOpen
          ? 'translateX(2px)'
          : 'translateX(0px)',
        color: isReversed
          ? 'var(--color-red)'
          : 'var(--color-text-dark)',
      }}
    >
      {children}
    </button>
  );
};
