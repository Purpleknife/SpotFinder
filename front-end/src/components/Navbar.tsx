import React, { useEffect, useState } from 'react';

import './NavBar.scss';

import Button from 'react-bootstrap/Button';

import { useCookies } from 'react-cookie';

import { useNavigate, useLocation } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import CreateMap from './CreateMap';

import axios from 'axios';


interface NavBarProps {
  coordinates: any[];
  refetch: () => void;
}


const NavBar = (props: NavBarProps) => {
  const [cookies, setCookie, removeCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const username = cookies.username;
  const logged_in = cookies.logged_in;
  const user_id = cookies.user_id;

  const navigate = useNavigate();
  const location = useLocation();

  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const handleCreateClose = () => setShowCreate(false);
  const handleCreateShow = () => setShowCreate(true);

  const handleRegisterClose = () => setShowRegister(false);
  const handleRegisterShow = () => setShowRegister(true);

  const handleLoginClose = () => setShowLogin(false);
  const handleLoginShow = () => setShowLogin(true);


  const logout =  async() => {
    return axios.get('/logout')
      .then((res) => {
        removeCookie('username', {path: '/'});
        removeCookie('user_id', {path: '/'});
        removeCookie('logged_in', {path: '/'});
        navigate('/');
      })
      .catch((error) => {
        console.log(error.message);
      });
  };



  return (
    <nav>
      <div className='logo' onClick={() => navigate('/')}><i className="fa-solid fa-map-location-dot"></i> SpotFinder</div>

      { logged_in
      ?
        <div className='navbar_btn_lp_after_login'>
          <Button className='create' onClick={handleCreateShow}>
            Create New Map
          </Button>
          <CreateMap refetch={props.refetch} handleClose={handleCreateClose} show={showCreate} coordinates={props.coordinates} />

          
          <span id='welcome'>Welcome, <button type='submit' className='profile_btn' onClick={() => navigate(`/profile/${user_id}`)}>{username}</button>!</span>
          
          <button type='submit' className='logout' onClick={logout}>Logout</button>
        </div>
      :
      <div className='navbar_btn_lp'>
        <Button className='login_and_register' onClick={handleLoginShow}>
          Login
        </Button>
        <Login handleClose={handleLoginClose} show={showLogin}/>
        &nbsp;&nbsp;
        <Button className='login_and_register' onClick={handleRegisterShow}>
          Register
        </Button>
        <Register handleClose={handleRegisterClose} show={showRegister}/>
      </div>
      }
    </nav>
  );
}
 
export default NavBar;