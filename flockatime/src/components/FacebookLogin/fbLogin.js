import React from 'react';
import FacebookLogin from 'react-facebook-login';

function FBLogin() {
  const responseFacebook = (response) => {
    console.log(response);
  }

  function handleClick() {
    console.log('fb login clicked');
  }

  return (
    <FacebookLogin
      appId="1088597931155576"
      autoLoad={true}
      fields="name,email,picture"
      onClick={handleClick}
      callback={responseFacebook}
    />
  );
}

export default FBLogin;
