import React from 'react';

import './LandingPage.scss';

interface LandingPageProps {
  allMaps: any[];
}

const LandingPage = (props: LandingPageProps) => {

  return (
    <div className='landing_page'>

      <div className='map_container'>
        {props.allMaps}
      </div>

    </div>
  );
}
 
export default LandingPage;