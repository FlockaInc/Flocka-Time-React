import React, { useState, useEffect } from 'react';
import './coderTable.css';

import CoderRow from '../CoderRow/coderRow';

import ds from '../../utilities/data';
import ns from '../../utilities/notificationService';
import authService from '../../utilities/auth';

function CoderTable() {
  const [authenticated, setAuthenticated] = useState(false);
  const [flockaData, setFlockaData] = useState(null);
  const [userData, setUserData] = useState(null);

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
    ds.downloadFlockalogs();
  }

  function handleSignOut() {
    setAuthenticated(false);
    setFlockaData(null);
    setUserData(null)
  }

  function handleFlockaLogData() {
    let leaderboard = ds.getFlockalogsLeaderboard()
    setFlockaData(leaderboard);
    console.log(leaderboard);
  }

  function generateCoderRows() {
    if (authenticated && flockaData) {
      const leaderboard = flockaData.map((user, index) => {
        var rank = index + 1
        var username = user.username;
        var dailyAvg = ds.convertTime(user.dailyAvg);
        var total = ds.convertTime(user.total);

        return (
          <CoderRow rank={rank} key={index} username={username} dailyAvg={dailyAvg} total={total} />
        );
      });

      return (leaderboard);
    } else {
      return null;
    }
  }

  return (
    <table className='table table-hover table-sm text-white leaderboard my-3'>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Programmer</th>
          <th>Hours Coded</th>
          <th>Daily Average</th>
        </tr>
      </thead>
      <tbody>
        {generateCoderRows()}
      </tbody>
    </table>
  )
}

export default CoderTable;