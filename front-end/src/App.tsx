import React, { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import Profile from './components/Profile';
import NavBar from './components/Navbar';

import axios from 'axios';

const App = () => {
  const [coordinates, setCoordinates] = useState<any>(null);
  const [mapData, setMapData] = useState<any>([]);
  const [refetch, setRefetch] = useState<boolean>(true);

  //console.log('refecth', refetch);

  const loadAllMaps = async() => {
    return axios.get('/maps')
      .then((res) => {
        //console.log('maps from front-end', res.data);
        setMapData(res.data);
        setRefetch(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  const getCoordinates = async() => {
    return axios.get('/coordinates')
      .then((res) => {
        //console.log('coordinates', res.data);
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


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <>
            <NavBar coordinates={coordinates} refetch={() => setRefetch(true)} />
            <LandingPage mapData={mapData} />
          </>}
        />
        <Route path='/maps/:map_id' element={<>
            <NavBar coordinates={coordinates} refetch={() => setRefetch(true)} />
            <MapPage />
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