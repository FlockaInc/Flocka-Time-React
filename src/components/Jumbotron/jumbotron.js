import React from 'react';
import './jumbotron.css';

function Jumbotron() {
  // geo API feature will come later

  return (
    <div className='jumbotron jumbotron-fluid'>
      <h1 className='display-3'>FLOCKA TIME</h1>
      <p className='lead'>This is Flocka Time, an easy to use extension for Visual
      Studio Code that tracks you and your friends' coding time. Based off the Waka Time extension.</p>
    </div>
  );
}

export default Jumbotron;