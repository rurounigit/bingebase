export const prepOptions = (setup) => {
  const { list, listForCount, prop, isMulti } = setup;

  const counts = {};
  (listForCount || []).forEach((movie) => {
    const values =
      movie?.[prop] && movie[prop] !== 'N/A'
        ? isMulti
          ? movie[prop].split(', ')
          : [movie[prop].split('–')[0]]
        : [];

    const uniqueValues = new Set(values); //Deduplicating values within each movie

    uniqueValues.forEach(
      (val) => (counts[val] = (counts[val] || 0) + 1)
    );
  });

  const entries = isMulti
    ? Object.entries(
        list
          .filter((movie) => movie?.[prop] !== 'N/A')
          .flatMap((movie) => movie[prop].split(', '))
          .reduce((propCounts, propValue) => {
            propCounts[propValue] = counts[propValue] || 0; // Use pre-calculated counts
            return propCounts;
          }, {})
      ).sort(([, a], [, b]) => b - a)
    : Object.entries(
        list
          .filter((movie) => movie?.[prop] !== 'N/A')
          .map((movie) => movie?.[prop].split('–')[0])
          .reduce((propCounts, propValue) => {
            propCounts[propValue] = counts[propValue] || 0; // Use pre-calculated counts
            return propCounts;
          }, {})
      ).sort(([a], [b]) => b - a); // Correctly sorting numerically

  return entries.map(([value, count]) => ({ value, count }));
};
