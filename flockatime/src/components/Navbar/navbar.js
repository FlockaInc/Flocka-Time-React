import React, { useState, useEffect } from 'react';
import './navbar.css';

import NavItem from '../NavItem/navItem';
import AuthModal from '../AuthModal/authModal';

import ns from '../../utilities/notificationService';

function Navbar() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    ns.addObserver('AUTH_SIGNIN', this, handleAuthSignin);
    ns.addObserver('AUTH_SIGNOUT', this, handleAuthSignout);

    return () => {
      ns.removeObserver(this, 'AUTH_SIGNIN');
      ns.removeObserver(this, 'AUTH_SIGNOUT');
    }
  });

  // props to pass to NavItem - this is a very messy way to do it
  let signOutBtn = {
    element: 'button',
    attr: {
      class: authenticated ? 'btn btn-primary' : 'btn btn-primary d-none',
      type: 'button',
      dataToggle: 'modal',
      dataTarget: '#sign-out-form',
    },
    text: 'Sign Out'
  }

  let signInBtn = {
    element: 'button',
    attr: {
      class: authenticated ? 'btn btn-primary d-none' : 'btn btn-primary',
      type: 'button',
      dataToggle: 'modal',
      dataTarget: '#sign-in-form',
      onClick: toggleAuthModal
    },
    text: 'Sign In'
  }

  let apiBtn = {
    element: 'button',
    attr: {
      class: authenticated ? 'btn btn-primary' : 'btn btn-primary d-none',
      type: 'button',
      dataToggle: 'modal',
      dataTarget: '#apiKey',
      dataState: 'hidden',
      onClick: toggleApiKey
    },
    text: 'API Key'
  }

  function toggleAuthModal() {
    ns.postNotification('AUTH_MODAL_TOGGLE');
  }

  function toggleApiKey() {
    console.log('toggle API key');
  }

  let navItemArr = [signOutBtn, signInBtn, apiBtn]

  function handleAuthSignin() {
    console.log('auth sign in from useEffect');
    setAuthenticated(true);
  }

  function handleAuthSignout() {
    console.log('auth sign out from useEffect');
    setAuthenticated(false);
  }

  function generateNavItems() {
    const navItems = navItemArr.map((item, index) => {
      return (
        <div className='btn-toolbar' key={index} role='toolbar' aria-label='Toolbar with button groups'>
          <NavItem attr={item} />
        </div>
      );
    });
    return navItems;
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <a className='navbar-brand text-white' href='#'>Flocka Time</a>
      <button className="navbar-toggler " type="button" data-toggle="collapse" data-target="#navbarColor01"
        aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className='collapse navbar-collapse' id='navbarColor01'>
        <div className='btn-toolbar ml-auto' role='toolbar' aria-label='Toolbar with button groups'>
          {generateNavItems()}
        </div>
      </div>
      <AuthModal />
    </nav>
  );
}

export default Navbar;