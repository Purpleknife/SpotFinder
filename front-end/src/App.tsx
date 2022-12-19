import React, { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import Profile from './components/Profile';
import NavBar from './components/Navbar';
import Map from './components/Map';
import MapView from './components/MapView';

import axios from 'axios';

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
};


const App = () => {
  const [coordinates, setCoordinates] = useState<any>(null);
  const [mapData, setMapData] = useState<any>([]);
  const [refetch, setRefetch] = useState<boolean>(true);

  const loadAllMaps = async() => {
    return axios.get('/maps')
      .then((res) => {
        setMapData(res.data);
        setRefetch(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  
  const allMaps = mapData?.map((mp: Map) => {
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
          refetch={() => setRefetch(true)}
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
          refetch={() => setRefetch(true)}
        />
      )
    }
    
  });


  const getCoordinates = async() => {
    return axios.get('/coordinates')
      .then((res) => {
        setCoordinates(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    loadAllMaps();
  }, [refetch]);

  useEffect(() => {
    getCoordinates();
  }, []);

  //console.log('MAP DATA', mapData);


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <>
            <NavBar coordinates={coordinates} refetch={() => setRefetch(true)} />
            <LandingPage allMaps={allMaps} />
          </>}
        />
        <Route path='/maps/:map_id' element={<>
            <NavBar coordinates={coordinates} refetch={() => setRefetch(true)} />
            <MapPage mapData={mapData} refetch={() => setRefetch(true)} />
          </>} />
        <Route path='/profile/:user_id' element={
          <>
            <NavBar refetch={() => setRefetch(true)} coordinates={coordinates} />
            <Profile refetch={() => setRefetch(true)}/>
          </>} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;