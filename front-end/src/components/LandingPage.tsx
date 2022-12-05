import React, { useEffect, useState } from 'react';

import Map from './Map';

import axios from 'axios';

import './LandingPage.scss';

interface LandingPageProps {
  mapData: any[];
  refetch: () => void;
}

const LandingPage = (props: LandingPageProps) => {
  const [mapList, setMapList] = useState<any>(null);

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
    const allMaps = props.mapData.map((mp: Map) => {
      if (mp.pins[0] === null) { // => When you create a new map, its pins are null.
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
            pins={[]}
            refetch={props.refetch}
          />
        )
      } else {
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
            refetch={props.refetch}
          />
        )
      }
      
    });
    setMapList(allMaps);
  };

  useEffect(() => {
    if (props.mapData) {
      generateMapList();
    }
  }, [props.mapData]);



  return (
    <div className='landing_page'>
      <div className='map_container'>
        {mapList}
      </div>

    </div>
  );
}
 
export default LandingPage;