export const sort = (list, prop, initialList) => {
  switch (prop) {
    case 'Title':
      return list;
    case 'userRating':
      return list.sort((a, b) => b[prop] - a[prop]);
    case 'rtRating':
      return [...list].sort((a, b) => {
        const aRating = Number(
          (a.rtRating || '').toString().replace(/%/g, '')
        );
        const bRating = Number(
          (b.rtRating || '').toString().replace(/%/g, '')
        );
        return bRating - aRating;
      });
    default:
      return list.sort((a, b) => b[prop].localeCompare(a[prop]));
  }
};
