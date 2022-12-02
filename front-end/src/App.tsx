import React, { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import Profile from './components/Profile';
import NavBar from './components/Navbar';

import axios from 'axios';

const App = () => {
  const [coordinates, setCoordinates] = useState<any>(null);

  const getCoordinates = async() => {
    return axios.get('/coordinates')
      .then((res) => {
        console.log('coordinates', res.data);
        setCoordinates(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  useEffect(() => {
    getCoordinates();
  }, []);


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <>
            <NavBar coordinates={coordinates} />
            <LandingPage />
          </>}
        />
        <Route path='/maps/:map_id' element={<MapPage />} />
        <Route path='/profile/:user_id' element={<><NavBar coordinates={coordinates} /><Profile /></>} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;