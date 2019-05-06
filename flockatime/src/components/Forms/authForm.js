import React, { useState } from 'react';
import './authForm.css';

import auth from '../../utilities/auth';
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

  function handleAuthSubmit() {
    // call email validator api, etc.
    console.log('email:', email);
    console.log('password:', password);

    if (props.authType === 'signin') {
      auth.signIn(email, password).then(uid => {
        console.log(uid);
        toggleModal();
      }).catch(error => {
        console.log(error);
        // display errors
      });
    } else if (props.authType === 'signup') {
      auth.signUp(email, password).then(uid => {
        console.log(uid);
        toggleModal();
      }).catch(error => {
        console.log(error);
        // display errors
      });
    }
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
      <button type='button' className='btn btn-primary' onClick={handleAuthSubmit}>{btnText}</button>
    </form>
  );
}

export default AuthForm;