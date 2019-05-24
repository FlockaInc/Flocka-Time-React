import React from 'react';
import './main.css';

import Jumbotron from '../Jumbotron/jumbotron';
import ChartDisplay from '../ChartDisplay/chartDisplay';
// import graph
import CoderTable from '../CoderTable/coderTable';

function Main() {

  return (
    <div className='main'>
      <Jumbotron />
      <div className='container'>
        <ChartDisplay />
        <CoderTable />
      </div>
    </div>
  )
}

export default Main;