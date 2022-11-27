import React, { useEffect, useState } from 'react';

import NavBar from "./Navbar";
import Map from './Map';

import axios from 'axios';

const LandingPage = () => {
  const [mapList, setMapList] = useState<any>(null);
  const [mapData, setMapData] = useState<any>(null);

  const loadAllMaps = async() => {
    return axios.get('/maps')
      .then((res) => {
        console.log('maps from front-end', res.data);
        setMapData(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  interface Map {
    id: number;
    creator: number;
    date_created: string;
    title: string;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
  }

  const generateMapList = () => {
    const allMaps = mapData.map((mp: Map) => {
      return (
        <Map
          key={mp.id}
          id={mp.id}
          creator={mp.creator}
          date_created={mp.date_created}
          title={mp.title}
          city={mp.city}
          province={mp.province}
          country={mp.country}
          latitude={mp.latitude}
          longitude={mp.longitude}
        />
      )
    });
    setMapList(allMaps);
  };

  useEffect(() => {
    if (mapData) {
      generateMapList();
    }
  }, [mapData]);

  useEffect(() => {
    loadAllMaps();
  }, []);


  return (
    <div className='landing_page'>
      <NavBar />

      <div className='map_container'>
        {mapList}
      </div>

    </div>
  );
}
 
export default LandingPage;