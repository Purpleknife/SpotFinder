import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { useCookies } from 'react-cookie';

import { useParams, Navigate } from 'react-router-dom';

import './Profile.scss';

import Contributions from './Contributions';
import ProfileInfo from './ProfileInfo';


interface ProfileProps {
  refetch: () => void;
};

export interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  password: string;
  password_confirmation: string;
  profile_image: string;
  province: string;
  username: string;
  city: string;
  country: string;
  email: string;  
};


const Profile = (props: ProfileProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const username = cookies.username;
  const logged_in = cookies.logged_in;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [contributions, setContributions] = useState<any>(null);
  
  const params = useParams(); // Used to dynamically visit other users's profiles.
  console.log('param', params.user_id)

  // Load the user's info: username, profile picture, first and last names, location:
  const LoadUserInfo = async(id: number | string) => {
    return axios.get(`/users/${id}`)
    .then((res) => {
      console.log('info', res.data);
      setUserInfo({
        id: res.data.id,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        password: res.data.password,
        password_confirmation: res.data.password_confirmation,
        profile_image: res.data.profile_image,
        province: res.data.province,
        username: res.data.username,
        city: res.data.city,
        country: res.data.country,
        email: res.data.email
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
  };


  // Load the user's contributions (maps):
  const loadProfileData = async(id: number | string) => {
    return axios.get(`/profile/${id}`)
      .then((res) => {
        console.log('profile', res.data);
        setUserData(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  
  // Load the user's contributions (type of contribution):
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
  const contributionsType = (mapId: number) => {
    for (const index in contributions) {
      if (contributions[index].map_id === mapId) {
        return contributions[index].contribution_type;
      }
    }
  };


  // Get the contribution's date for a specific map.
  const contributionsDate = (mapId: number) => {
    for (const index in contributions) {
      if (contributions[index].map_id === mapId) {
        return contributions[index].date_contributed;
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


  // Get the list of contributions (maps created or edited by the user):
  const dataList = userData?.map((data: Data) => {
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
        pins={data.pins[0] === null ? [] : data.pins} // => When you create a new map, its pins are null.
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
        contributions_type={contributionsType(data.id)}
        contributions_date={contributionsDate(data.id)}
        refetch={props.refetch}
      />
    )
  });



  useEffect(() => {
    document.title = `${username}'s profile`;
  })


  useEffect(() => {
    if (params.user_id) {
      LoadUserInfo(params.user_id);
      loadProfileData(params.user_id);
      loadContributions(params.user_id);
    }
  }, [props.refetch]);


  return (
    <div className='profile'>

      { !logged_in
      ? <Navigate to='/' />
      :

      <div>
        
        { userInfo && 
        
        <ProfileInfo 
          id={userInfo!.id}
          first_name={userInfo!.first_name}
          last_name={userInfo!.last_name}
          password={userInfo!.password}
          password_confirmation={userInfo!.password_confirmation}
          profile_image={userInfo!.profile_image}
          province={userInfo!.province}
          username={userInfo!.username}
          city={userInfo!.city}
          country={userInfo!.country}
          email={userInfo!.email}            
        />}

        <br />
        Contributions:
        {dataList}
      </div>
      }
      
    </div>
  );
}
 
export default Profile;