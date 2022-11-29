import axios from 'axios';
import React, { useEffect } from 'react';

import { useCookies } from 'react-cookie';


const Profile = () => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const user_id = cookies.user_id;
  const username = cookies.username;

  const loadProfileData = async() => {
    return axios.get(`/profile/${user_id}`)
      .then((res) => {
        console.log('profile', res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <div className='profile'>
      Hello, {username}!
    </div>
  );
}
 
export default Profile;