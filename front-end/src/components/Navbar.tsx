import React, { useState } from 'react';

import './NavBar.scss';

import Button from 'react-bootstrap/Button';

import { useCookies } from 'react-cookie';

import { useNavigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';

const NavBar = () => {
  const [cookies, setCookie] = useCookies(['username', 'user_id', 'logged_in']);
  const username = cookies.username;
  const logged_in = cookies.logged_in;
  const user_id = cookies.user_id;

  const navigate = useNavigate();

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleRegisterClose = () => setShowRegister(false);
  const handleRegisterShow = () => setShowRegister(true);

  const handleLoginClose = () => setShowLogin(false);
  const handleLoginShow = () => setShowLogin(true);

  return (
    <nav>
      <div className='logo'>SpotFinder</div>

      { logged_in
      ?
        <>
          <span>Welcome, {username}!</span>
          <button type='submit' onClick={() => navigate(`/profile/${user_id}`)}>Profile</button>
        </>
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