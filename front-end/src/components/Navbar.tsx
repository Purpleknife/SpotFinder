import React, { useEffect, useState } from 'react';

import './NavBar.scss';

import Button from 'react-bootstrap/Button';

import { useCookies } from 'react-cookie';

import { useNavigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import CreateMap from './CreateMap';

import axios from 'axios';


interface NavBarProps {
  coordinates: any[];
}


const NavBar = (props: NavBarProps) => {
  const [cookies, setCookie, removeCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const username = cookies.username;
  const logged_in = cookies.logged_in;
  const user_id = cookies.user_id;

  const navigate = useNavigate();

  const [showButton, setShowButton] = useState<boolean>(true);
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

  useEffect(() => {
    if (document.title.includes('profile')) {
      setShowButton(false);
    };
  });

  const returnToHomePage = () => {
    navigate('/');
    window.location.reload();
  };


  return (
    <nav>
      <div className='logo' onClick={returnToHomePage}>SpotFinder</div>

      { logged_in
      ?
        <div>
          <Button onClick={handleCreateShow}>
            Create New Map
          </Button>
          <CreateMap handleClose={handleCreateClose} show={showCreate} coordinates={props.coordinates} />

          <span>Welcome, {username}!</span>
          { showButton && <button type='submit' onClick={() => navigate(`/profile/${user_id}`)}>Profile</button>}
          <button type='submit' onClick={logout}>Logout</button>
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