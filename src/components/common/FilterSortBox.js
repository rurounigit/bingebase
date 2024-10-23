export const FilterSortBox = ({ width, children }) => {
  return (
    <div className="filter-sort-box" style={{ width: width }}>
      {children}
    </div>
  );
};
