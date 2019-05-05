import React from 'react';
import './main.css';

import Jumbotron from '../Jumbotron/jumbotron';
import ChartDisplay from '../ChartDisplay/chartDisplay';
// import graph
// import table

function Main() {

  return (
    <div className='main'>
      <Jumbotron />
      <div className='container'>
        <ChartDisplay />
      </div>
    </div>
  )
}

export default Main;