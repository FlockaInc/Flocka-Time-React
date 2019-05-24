import React from 'react';
import FacebookLogin from 'react-facebook-login';

import authService from '../../utilities/auth';

function FBLogin() {
  const responseFacebook = (response) => {
    let event = {};
    console.log(response);
    event.response = response;
    authService.checkLoginState(event);
  }

  function handleClick() {
    console.log('fb login clicked');
  }

  return (
    <FacebookLogin
      appId="613416699125829"
      autoLoad={true}
      fields="name,email,picture"
      // onClick={handleClick}
      callback={responseFacebook}
    />
  );
}

export default FBLogin;
