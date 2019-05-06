import React, { useState } from 'react';
import './authForm.css';

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

  function facebookLoginTest(event) {
    event.preventDefault();
    authService.socialMediaSignIn();
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
      <button type='submit' className='btn btn-primary' onClick={handleAuthSubmit}>{btnText}</button>
      {/* <FBLogin /> */}
      <div className="fb-login-button" data-width="" data-size="large" data-button-type="continue_with" data-auto-logout-link="false" data-use-continue-as="true"></div>
      <button type='submit' className='btn btn-danger' onClick={facebookLoginTest}>Facebook</button>
    </form>
  );
}

export default AuthForm;