import React, { useState } from 'react';
import './authForm.css';

import FacebookLogin from 'react-facebook-login';
 
// import FBLogin from '../FacebookLogin/fbLogin';

import authService from '../../utilities/auth';
import ns from '../../utilities/notificationService';

function AuthForm(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function onEmailChange(event) {
    setEmail(event.target.value);
  }

  function onPasswordChange(event) {
    setPassword(event.target.value);
  }

  function toggleModal() {
    ns.postNotification('AUTH_MODAL_TOGGLE', null);
  }

  const btnText = props.authType === 'signin' ? 'Sign In' : 'Sign Up';

  function handleAuthSubmit(event) {
    event.preventDefault();
    // call email validator api, etc.

    if (props.authType === 'signin') {
      authService.signIn(email, password).then(uid => {
        toggleModal();
      }).catch(error => {
        console.log(error);
        // display errors
      });
    } else if (props.authType === 'signup') {
      authService.signUp(email, password).then(uid => {
        toggleModal();
      }).catch(error => {
        console.log(error);
        // display errors
      });
    }
  }

  const responseFacebook = (response) => {
    let event = {};
    console.log(response);
    event.response = response;
    authService.checkLoginState(event);
  }

  function facebookLoginTest(event) {
    event.preventDefault();
    authService.socialMediaSignIn().then(() => {
      toggleModal();
    });
  }

  return (
    <form>
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input type='email' className='form-control' id='email' placeholder='email@example.com' value={email} onChange={onEmailChange}></input>
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input type='password' className='form-control' id='password' placeholder='password' value={password} onChange={onPasswordChange}></input>
      </div>
      <button type='submit' className='btn btn-primary' data-textid='submitBtn' onClick={handleAuthSubmit}>{btnText}</button>

      {/* <FacebookLogin
        appId="613416699125829"
        autoLoad={false}
        fields="name,email,picture"
        onClick={facebookLoginTest}
        callback={responseFacebook}
        size='small'
      /> */}

      <button type='submit' className='btn fb-btn' onClick={facebookLoginTest}>Facebook</button>
    </form>
  );
}

export default AuthForm;