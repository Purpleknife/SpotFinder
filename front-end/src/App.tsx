import React, { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route} from 'react-router-dom';

import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import Profile from './components/Profile';
import NavBar from './components/Navbar';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';

import axios from 'axios';

import moment from "moment";

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

  const [count, setCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get total of maps in the db to setup number of pages dynamically => Pagination :
  const getTotalOfMaps = async() => {
    return axios.get('/maps')
      .then((res) => {
        setCount(res.data.count);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // Load 6 maps at a time in each page:
  const loadAllMaps = async(page: number) => {
    return axios.get(`/map/${page}`)
      .then((res) => {
        setMapData(res.data);
        setRefetch(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  
  const allMaps = mapData?.map((mp: Map) => {
      return (
        <Map
          key={mp.id}
          id={mp.id}
          creator={mp.creator}
          username={mp.username}
          date_created={moment(mp.date_created).format('MMMM Do YYYY, h:mm:ss a')}
          title={mp.title}
          city={mp.city}
          province={mp.province}
          country={mp.country}
          latitude={mp.latitude}
          longitude={mp.longitude}
          pins={mp.pins[0] === null ? [] : mp.pins} // => When you create a new map, its pins are null.
          refetch={() => setRefetch(true)}
        />
      )
  });

  // Get the latitude and longitude of each city:
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
    loadAllMaps(currentPage);
  }, [refetch, currentPage]);

  useEffect(() => {
    getCoordinates();
  }, []);

  useEffect(() => {
    getTotalOfMaps();
  })



  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <>
            <NavBar coordinates={coordinates} refetch={() => setRefetch(true)} />
            <>
              <SearchBar coordinates={coordinates} />
              <LandingPage allMaps={allMaps} />
              <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} count={count} />
            </>
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