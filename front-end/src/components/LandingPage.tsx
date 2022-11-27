import React from 'react';

import NavBar from "./Navbar";
import Map from './Map';

const LandingPage = () => {
  return (
    <div className='landing_page'>
      <NavBar />

      <div className='map_container'>
        <Map />
      </div>

    </div>
  );
}
 
export default LandingPage;