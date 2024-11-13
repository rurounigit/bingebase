/* import React, { useState } from 'react'; */
import { MultiSelect } from 'react-multi-select-component';

/* const options = [
  { label: 'Action', value: 'grapes' },
  { label: 'Drama', value: 'mango' },
  { label: 'Adventure', value: 'strawberry', disabled: true },
]; */

export const MultiSelectWrapper = ({
  id,
  filters,
  onApplyFilters,
  setFilters,
  options,
}) => {
  /*  console.log(`${id} filters: ${JSON.stringify(filters)}`); */
  /*  console.log(`${id} ${JSON.stringify(id)}`); */
  /* const [selected, setSelected] = useState([]); */

  const disableSearch =
    id === 'Type' || id === 'Genre' || options.length < 8;

  /* const selected = (filters[id] || [])
    .map((value) => {
      const option = options.find((option) => option.value === value);
      return option
        ? { label: `${value} (${option.count})`, value }
        : null;
    })
    .filter(Boolean); */

  const selected = (filters[id] || [])
    .map((value) => {
      const option = options.find((option) => option.value === value);
      if (!option) return null;

      let label = value;

      const parts = value.split(' '); // Split the original value, not the label with the count

      if (parts.length > 2) {
        const lastWord = parts.slice(-1);
        const initialLetters = parts
          .slice(0, -1)
          .map((word) => word.charAt(0) + '.');
        label = initialLetters.join(' ') + ' ' + lastWord;
      } else if (parts.length === 2) {
        label = `${parts[0].charAt(0)}. ${parts[1]}`;
      }

      if (option.count !== 1) {
        label += ` (${option.count})`; // Add the count *only once*, after abbreviation logic
      }

      return { label, value };
    })
    .filter(Boolean);

  // ... (customValueRenderer remains the same)

  /* console.log(`${id} selected: ${JSON.stringify(selected)}`); */

  const optionsFormatted = options.map((option) => ({
    label:
      option.count > 1
        ? `${option.value} (${option.count})`
        : option.value,
    value: option.value,
  }));

  /*  console.log(`${id} selected: ${JSON.stringify(selected)}`); */
  /* console.log(`${id} options: ${JSON.stringify(options)}`);
  console.log(
    `${id} optionsFormatted: ${JSON.stringify(optionsFormatted)}`
  ); */ // Log the formatted options

  const handleChange = (selectedOptions) => {
    /*  setSelected(selectedOptions); */
    const selectedValues = selectedOptions.map(
      (option) => option.value
    );
    if (selectedValues.length === 0) {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[id];
        return newFilters;
      });
    } else {
      onApplyFilters({ ...filters, [id]: selectedValues });
    }
  };

  const ArrowRenderer = ({ expanded }) => (
    <>
      {expanded ? (
        <p>
          <i className="arrow down"></i>
        </p>
      ) : (
        <p>
          <i className="arrow up"></i>
        </p>
      )}
    </>
  );
  const CustomClearIcon = () => <div>–</div>;

  const customValueRenderer = (selected, _options) => {
    return selected.length ? selected.map(({ label }) => label) : id;
  };

  /* const customValueRenderer = (selected, _options) => {
    return selected.length
      ? selected.map(({ label }) => {
          if (!label) return ''; // Handle potential null/undefined labels

          const parts = label.split(' ');
          if (parts.length === 2) return label; // Return original label if it's a single word

          return parts[0].charAt(0) + '. ' + parts.slice(1).join(' ');
        })
      : id;
  }; */

  return (
    <div>
      <MultiSelect
        options={optionsFormatted}
        value={selected}
        onChange={handleChange}
        labelledBy="Select"
        ArrowRenderer={ArrowRenderer}
        ClearIcon={<CustomClearIcon />}
        ClearSelectedIcon={null}
        hasSelectAll={false}
        valueRenderer={customValueRenderer}
        disableSearch={disableSearch}
        closeOnChangedValue={true}
      />
    </div>
  );
};
