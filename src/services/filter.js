export const filter = (list, filters) => {
  return list.filter((element) =>
    Object.entries(filters).every(([key, value]) => {
      const elementValue = element[key];

      if (Array.isArray(value)) {
        return value.every((filterValue) => {
          return elementValue && elementValue.includes(filterValue);
        });
      } else {
        return elementValue && elementValue.includes(value);
      }
    })
  );
};
