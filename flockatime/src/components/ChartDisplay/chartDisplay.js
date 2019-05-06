import React, { useState, useEffect } from 'react';
import './chartDisplay.css';

import BarGraph from '../BarGraph/barGraph';

import ns from '../../utilities/notificationService';
import ds from '../../utilities/data';

function ChartDisplay() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userDailyTime, setUserDailyTime] = useState(null);

  useEffect(() => {
    ns.addObserver('AUTH_SIGNIN', this, handleSignIn);
    ns.addObserver('AUTH_SIGNOUT', this, handleSignOut);
    ns.addObserver('DATA_FLOCKALOGS_DOWNLOADED', this, handleFlockaLogData);

    return () => {
      ns.removeObserver(this, 'AUTH_SIGNIN');
      ns.removeObserver(this, 'AUTH_SIGNOUT');
      ns.removeObserver(this, 'DATA_FLOCKALOGS_DOWNLOADED');
    }
  }, []);

  function handleSignIn() {
    setAuthenticated(true);
  }

  function handleSignOut() {
    setAuthenticated(false);
  }

  function handleFlockaLogData() {
    setUserDailyTime(ds.getCurrentUserDailyFlockatime());
  }

  function generateChart() {
    if (authenticated && userDailyTime) {
      return (
        <BarGraph userDailyTime={userDailyTime} />
      )
    }

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