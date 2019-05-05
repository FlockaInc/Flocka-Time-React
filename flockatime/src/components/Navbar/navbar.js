import React, { useEffect } from 'react';
import './navbar.css';

import NavItem from '../NavItem/navItem';

import ns from '../../utilities/notificationService';

function Navbar() {
  useEffect(() => {
    console.log('useEffect');
    ns.addObserver('AUTH_SIGNIN', this, handleAuthSignin);

    return () => {
      ns.removeObserver(this, 'AUTH_SIGNIN');
    }
  })

  // props to pass to NavItem - this is a very messy way to do it
  let signOutBtn = {
    element: 'button',
    attr: {
      class: 'btn btn-primary signOutButton hide',
      type: 'button',
      dataToggle: 'modal',
      dataTarget: '#sign-out-form',
    },
    text: 'Sign Out'
  }

  let signInBtn = {
    element: 'button',
    attr: {
      class: 'btn btn-primary signInButton hide',
      type: 'button',
      dataToggle: 'modal',
      dataTarget: '#sign-in-form',
    },
    text: 'Sign In'
  }

  let apiBtn = {
    element: 'button',
    attr: {
      class: 'btn btn-primary apiKey hide',
      type: 'button',
      dataToggle: 'modal',
      dataTarget: '#apiKey',
      dataState: 'hidden'
    },
    text: 'API Key'
  }

  let navItemArr = [signOutBtn, signInBtn, apiBtn]

  function handleAuthSignin() {
    console.log('auth sign in from useEffect');
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
    </nav>
  );
}

export default Navbar;