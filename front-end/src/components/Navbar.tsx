import React, { useState } from 'react';

import './NavBar.scss';

import Button from 'react-bootstrap/Button';

import Login from './Login';
import Register from './Register';

const NavBar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleRegisterClose = () => setShowRegister(false);
  const handleRegisterShow = () => setShowRegister(true);

  const handleLoginClose = () => setShowLogin(false);
  const handleLoginShow = () => setShowLogin(true);

  return (
    <nav>
      <div className='logo'>SpotFinder</div>

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
    </nav>
  );
}
 
export default NavBar;