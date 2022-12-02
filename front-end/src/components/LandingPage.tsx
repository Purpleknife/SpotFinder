import React, { useEffect, useState } from 'react';

import Map from './Map';

import axios from 'axios';

import './LandingPage.scss';

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
    username: string;
    date_created: string;
    title: string;
    city: string;
    province: string;
    country: string;
    latitude: number;
    longitude: number;
    pins: any[];
  }

  const generateMapList = () => {
    const allMaps = mapData.map((mp: Map) => {
      return (
        <Map
          key={mp.id}
          id={mp.id}
          creator={mp.creator}
          username={mp.username}
          date_created={mp.date_created}
          title={mp.title}
          city={mp.city}
          province={mp.province}
          country={mp.country}
          latitude={mp.latitude}
          longitude={mp.longitude}
          pins={mp.pins}
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
      <div className='map_container'>
        {mapList}
      </div>

    </div>
  );
}
 
export default LandingPage;