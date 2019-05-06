import React from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';

function fbLogin() {
  const responseFacebook = (response) => {
    console.log(response);
  }

  function componentClicked() {
    console.log('fb login clicked');
  }

  return (
    <FacebookLogin
      appId="1088597931155576"
      autoLoad={true}
      fields="name,email,picture"
      onClick={componentClicked}
      callback={responseFacebook}
    />
  );
}

export default fbLogin;
