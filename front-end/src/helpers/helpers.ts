/*

createAPageArray: Helper function that returns an array depending on the total of pages,
and the minimun page limit, which is normally 1.

scrollToTopPage: To scroll to the top of the page when navigating the pages (pagination).
*/

export const createAPageArray = (minPageLimit: number, totalPages: number): number[] => {
  const pages: number[] = [];

  for (let i = minPageLimit; i <= totalPages; i++) {
    pages.push(i);
  }

  return pages;
};


export const scrollToTopPage = (): void => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};
