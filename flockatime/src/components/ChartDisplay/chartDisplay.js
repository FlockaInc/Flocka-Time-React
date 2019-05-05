import React from 'react';
import './chartDisplay.css';

import BarGraph from '../BarGraph/barGraph';

function ChartDisplay() {

  function generateChart() {
    // getData and generate chart with d3
    return null;
  }

  return (
    <div className='row'>
      <div className='col-1'></div>
      <div className='col-10'>
        {generateChart()}
      </div>
      <div className='col-1'></div>
    </div>
  );
}

export default ChartDisplay;