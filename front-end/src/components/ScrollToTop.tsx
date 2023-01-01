import React, { useState } from 'react';

import { scrollToTopPage } from '../helpers/helpers';

const ScrollToTop = () => {
  const [scrollVisible, setScrollVisible] = useState<boolean>(false);

  // Setup the 'scroll to top' button at the bottom of the page:
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    
    if (scrolled > 100){
      setScrollVisible(true)
    } 
    
    if (scrolled <= 100){
      setScrollVisible(false)
    }
  };

  window.addEventListener('scroll', toggleVisible);

  return (
    <span 
      className='scroll_up'
      onClick={scrollToTopPage}
      style={{display: scrollVisible ? 'inline' : 'none'}}
    ><i className="fa-solid fa-circle-arrow-up"></i></span>
  );
}
 
export default ScrollToTop;