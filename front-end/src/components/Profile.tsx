import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useCookies } from 'react-cookie';

import './Profile.scss';

import Contributions from './Contributions';


const Profile = () => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const user_id = cookies.user_id;
  const username = cookies.username;

  const [userData, setUserData] = useState<any>(null);
  const [userDataList, setUserDataList] = useState<any>(null);


  const loadProfileData = async() => {
    return axios.get(`/profile/${user_id}`)
      .then((res) => {
        console.log('profile', res.data);
        setUserData(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
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
        />
      )
    });
    setUserDataList(dataList);

  }

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    if (userData) {
      generateUserData();
    }
  }, [userData]);

  return (
    <div className='profile'>
      Hello, {username}!

      <br />
      Contributions:
      {userDataList}
    </div>
  );
}
 
export default Profile;