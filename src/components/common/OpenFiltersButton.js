import { Button } from './Button';
import { FilterSVG } from './FilterSVG';

export const OpenFiltersButton = ({
  isActive,
  isFilterFormOpen,
  handleToggleFilterForm,
}) => (
  <Button
    className={'btn-filter-form-toggle'}
    isClicked={isFilterFormOpen}
    isActive={isActive}
    onClick={handleToggleFilterForm}
    toggleOutline={isFilterFormOpen}
  >
    <FilterSVG />
  </Button>
);
