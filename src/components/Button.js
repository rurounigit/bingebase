export const Button = ({
  className,
  isActive = true,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!isActive}
      className={className}
      style={{
        opacity: !isActive ? '0.3' : '1',
        cursor: !isActive ? 'default' : 'pointer',
      }}
    >
      {children}
    </button>
  );
};
