export const Button = ({
  className,
  onClick,
  isActive = true,
  toggleOutline = false,
  toggleTextColor = false,
  toggleTextColors = {
    on: 'var(--color-red)',
    off: 'var(--color-text)',
  },
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!isActive}
      className={className}
      style={{
        opacity: isActive ? '1' : '0.3',
        cursor: isActive ? 'pointer' : 'default',
        outline: toggleOutline
          ? 'var(--color-primary-light) solid 2px'
          : 'none',
        transform: toggleOutline
          ? 'translateX(2px)'
          : 'translateX(0px)',
        color: toggleTextColor
          ? toggleTextColors.on
          : toggleTextColors.off,
      }}
    >
      {children}
    </button>
  );
};
