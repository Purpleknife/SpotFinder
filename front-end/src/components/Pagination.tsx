import React, { useEffect, useState } from 'react';

import { createAPageArray, scrollToTopPage } from '../helpers/helpers';

interface PaginationProps {
  currentPage: number;
  count: number;
  setCurrentPage: (n: number | ((n: number) => number)) => void;
};


const Pagination = (props: PaginationProps) => {
  const [maxPageLimit, setMaxPageLimit] = useState<number>();

  const limitPerPage: number = 6;
  const minPageLimit: number = 1;
  const totalPages: number = Math.ceil(props.count / limitPerPage);
  
  const pages = createAPageArray(minPageLimit, totalPages);

  useEffect(() => {
    setMaxPageLimit(pages[pages.length - 1]);
  }, [pages]);


  // pagesLeft are the pages that are not the 1st, last or 1st page between 2 page numbers.
  let pagesLeft: boolean = false;


  /* Iterate through our pages array and return a list of pages:
    When isFirstPage, isLastPage and firstPageBetweenTwoNumbers are true,
    it will show the page number. Otherwise, it will show ellipsis.
  */

  const pagesList = pages.map((page: number) => {    
    const isFirstPage: boolean = page === 1;
    const isLastPage: boolean = page === pages.length;
    const firstPageBetweenTwoNumbers: boolean = Math.abs(page - props.currentPage) <= 1; // => If 1st page is 1 and last page is 5, this will be true for page 2.
    
    
    if (isFirstPage || isLastPage || firstPageBetweenTwoNumbers) { 
      return (
        <li
          key={page}
          onClick={() => {props.setCurrentPage(page); scrollToTopPage();}}
        >
          {page}
        </li>
      )
    }
    
    if (!pagesLeft) {
      pagesLeft = true;
      return <li key={page}>&hellip;</li>;
    }
    
  });



  const handlePrevClick = () => {
    if (props.currentPage !== 1) {
      props.setCurrentPage((prev: number) => prev - 1);
      scrollToTopPage();
    }
  };

  const handleNextClick = () => {
    if (props.currentPage !== maxPageLimit) {
      props.setCurrentPage((prev: number) => prev + 1);
      scrollToTopPage();
    }
  };

  
  return (
    <div className='pages_list'>
      <ul>
        <li>
          <button onClick={handlePrevClick} disabled={props.currentPage === minPageLimit}>Prev</button>
        </li>
        {pagesList}
        <li>
          <button onClick={handleNextClick} disabled={props.currentPage === maxPageLimit}>Next</button>
        </li>
      </ul>
      Page: {props.currentPage}
    </div>
  );
}
 
export default Pagination;