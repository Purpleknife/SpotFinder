import React, { useEffect } from 'react';

import NavBar from "./Navbar";
import Map from './Map';

import axios from 'axios';

const LandingPage = () => {

  const loadAllMaps = () => {
    return axios.get('/maps')
      .then((res) => {
        console.log('maps from front-end', res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    loadAllMaps();
  }, []);


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