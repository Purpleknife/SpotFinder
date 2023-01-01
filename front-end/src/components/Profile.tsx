import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { useCookies } from 'react-cookie';

import { useParams, Navigate } from 'react-router-dom';

import './Profile.scss';

import Contributions from './Contributions';
import ProfileInfo from './ProfileInfo';
import Favorites from './Favorites';

import moment from "moment";


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
};

interface Fav {
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
  first_name: string;
  last_name: string;
  profile_image: string;
  user_country: string;
  user_id: number;
  date_liked: number;
  map_id_liked: number;
};


const Profile = (props: ProfileProps) => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const username = cookies.username;
  const logged_in = cookies.logged_in;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [contributions, setContributions] = useState<any>(null);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [totalFavorites, setTotalFavorites] = useState<number>(0);
  const [favorites, setFavorites] = useState<any>(null);

  const [showContri, setShowContri] = useState<boolean>(false);
  const [showFav, setShowFav] = useState<boolean>(true);

  const [loadCounter, setLoadCounter] = useState<number>(1);
  
  const params = useParams(); // Used to dynamically visit other users's profiles.

  // Load the user's info: username, profile picture, first and last names, location:
  const LoadUserInfo = async(id: number | string) => {
    return axios.get(`/users/${id}`)
    .then((res) => {
      //console.log('info', res.data);
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
    return axios.get(`/profile/${id}/${loadCounter}`)
      .then((res) => {
        //console.log('profile', res.data);
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
        setTotalContributions(res.data.length);
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
        date_created={moment(data.date_created).format('MMMM Do YYYY, h:mm:ss a')}
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
        contributions_date={moment(contributionsDate(data.id)).format('MMMM Do YYYY, h:mm:ss a')}
        refetch={props.refetch}
      />
    )
  });


  // Load the user's favorites maps (maps liked):
  const loadFavorites = async(id: number | string) => {
    return axios.get(`/favorites/${id}/${loadCounter}`)
      .then((res) => {
        //console.log('favorites', res.data);
        setFavorites(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  // Get the list of favorite maps (maps liked by the user):
  const favList = favorites?.map((fav: Fav) => {
    return (
      <Favorites
        key={fav.id}
        id={fav.id}
        title={fav.title}
        city={fav.city}
        province={fav.province}
        country={fav.country}
        creator={fav.creator}
        date_created={moment(fav.date_created).format('MMMM Do YYYY, h:mm:ss a')}
        pins={fav.pins[0] === null ? [] : fav.pins} // => When you create a new map, its pins are null.
        latitude={fav.latitude}
        longitude={fav.longitude}
        username={fav.username}
        first_name={fav.first_name}
        last_name={fav.last_name}
        profile_image={fav.profile_image}
        user_country={fav.user_country}
        user_id={fav.user_id}
        date_liked={moment(fav.date_liked).format('MMMM Do YYYY, h:mm:ss a')}
        map_id_liked={fav.map_id_liked}
        refetch={props.refetch}
      />
    )
  });


  // Load the number of the user's favorites maps (maps liked):
  const loadFavoritesCount = async(id: number | string) => {
    return axios.get(`/maps_liked/${id}`)
      .then((res) => {
        //console.log('favorites', res.data);
        setTotalFavorites(res.data.count);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  useEffect(() => {
    document.title = `${username}'s profile`;
  });


  useEffect(() => {
    if (params.user_id) {
      LoadUserInfo(params.user_id);
      loadContributions(params.user_id);
      loadFavorites(params.user_id);
      loadFavoritesCount(params.user_id);
    }
  }, [props.refetch]);

  useEffect(() => {
    if (params.user_id) {
      loadProfileData(params.user_id);
    }
  }, [props.refetch, loadCounter]);


  return (
    <>

      { !logged_in
      ? <Navigate to='/' />
      :
      <div className='profile'>
        <div className='profile_info'>
          
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
            totalContributions={totalContributions}
            totalFavorites={totalFavorites}
            showFav={() => {setShowFav(true); setShowContri(false); setLoadCounter(1);}}
            showContri={() => {setShowContri(true); setShowFav(false); setLoadCounter(1);}}
          />}
        </div>

          <br />

          {showContri && <div className='contri_profile'>
            <div className='contri_title'><i className="fa-solid fa-list"></i> Contributions:</div>
            {dataList}

            <div
              className='load_more'
              onClick={() => setLoadCounter((prev: number) => prev + 1)}
            >
              Load more...
            </div>
          </div>}

          {showFav && <div className='fav_profile'>
            <div className='fav_title'><i className="fa-solid fa-heart"></i> Favorites:</div>
            {favList}

            <div
              className='load_more'
              onClick={() => setLoadCounter((prev: number) => prev + 1)}
            >
              Load more...
            </div>
          </div>}

          
        </div>
      }
      
    </>
  );
}
 
export default Profile;