import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { useCookies } from 'react-cookie';

import { useParams, Navigate } from 'react-router-dom';

import './Profile.scss';

import Contributions from './Contributions';
import NavBar from './Navbar';


const Profile = () => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const username = cookies.username;
  const logged_in = cookies.logged_in;

  const [userData, setUserData] = useState<any>(null);
  const [userDataList, setUserDataList] = useState<any>(null);
  const [contributions, setContributions] = useState<any>(null);

  const params = useParams(); // Used to dynamically visit other users's profiles.

  const loadProfileData = async(id: number | string) => {
    return axios.get(`/profile/${id}`)
      .then((res) => {
        //console.log('profile', res.data);
        setUserData(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  

  const loadContributions = async(id: number | string) => {
    return axios.get(`/contributions/${id}`)
      .then((res) => {
        //console.log('contributions', res.data);
        setContributions(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  // Get the contribution's type (Created Map or Edited Map) for a specific map.
  const organizeContributions = (mapId: number) => {
    for (const index in contributions) {
      if (contributions[index].map_id === mapId) {
        return contributions[index].contribution_type;
      }
    }
  };


  interface Data {
    id: number;
    title: string;
    city: string;
    province: string;
    country: string;
    creator: number;
    date_created: string;
    pins: any[];
    latitude: number;
    longitude: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    profile_image: string;
    user_country: string;
    user_id: number;
    user_province: string;
  }

  const generateUserData = () => {
    const dataList = userData.map((data: Data) => {
      return (
        <Contributions
          key={data.id}
          id={data.id}
          title={data.title}
          city={data.city}
          province={data.province}
          country={data.country}
          creator={data.creator}
          date_created={data.date_created}
          pins={data.pins}
          latitude={data.latitude}
          longitude={data.longitude}
          username={data.username}
          email={data.email}
          first_name={data.first_name}
          last_name={data.last_name}
          password={data.password}
          profile_image={data.profile_image}
          user_country={data.user_country}
          user_id={data.user_id}
          user_province={data.user_province}
          contributions={organizeContributions(data.id)}
        />
      )
    });

    setUserDataList(dataList);
  };

  useEffect(() => {
    document.title = `${username}'s profile`;
  })


  useEffect(() => {
    if (params.user_id) {
      loadProfileData(params.user_id);
      loadContributions(params.user_id);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      generateUserData();
    }
  }, [userData]);

  return (
    <div className='profile'>

      { !logged_in
      ? <Navigate to='/' />
      :

      <div>
        <NavBar />
        Hello, {username}!

        <br />
        Contributions:
        {userDataList}
      </div>
      }
      
    </div>
  );
}
 
export default Profile;