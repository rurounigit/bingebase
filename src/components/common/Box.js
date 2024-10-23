export const Box = ({
  hasToggle = true,
  boxWidth,
  isActive = true,
  children,
}) => {
  return (
    <div
      className="box header-wrapper"
      style={{
        width: boxWidth,
      }}
    >
      {children}
    </div>
  );
};
