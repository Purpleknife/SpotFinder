import React, { useEffect, useState } from 'react';

import { createAPageArray } from '../helpers/helpers';

// import './Pagination.scss';

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

  // Iterate through our pages array and return a list:
  const pagesList = pages.map((page: number) => {
    return (
      <li 
        key={page}
        onClick={() => props.setCurrentPage(page)}
      >
        {page}
      </li>
    )
  });

  const handlePrevClick = () => {
    if (props.currentPage !== 1) {
      props.setCurrentPage((prev: number) => prev - 1);
    }
  };

  const handleNextClick = () => {
    if (props.currentPage !== maxPageLimit) {
      props.setCurrentPage((prev: number) => prev + 1);
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
    </div>
  );
}
 
export default Pagination;