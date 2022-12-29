/*
Helper function that returns an array depending on the total of pages,
and the minimun page limit, which is normally 1.
*/

export const createAPageArray = (minPageLimit: number, totalPages: number): number[] => {
  const pages: number[] = [];

  for (let i = minPageLimit; i <= totalPages; i++) {
    pages.push(i);
  }

  return pages;
};