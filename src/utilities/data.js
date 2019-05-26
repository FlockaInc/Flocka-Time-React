import { firedatabase, database } from './fire';
import ns from './notificationService';
import authService from './auth.js';
import moment from 'moment';

let data = {
  allUserFlockalogs: {},
  usersObject: {}, // Object containing all users and child objects fetched from Firebase
  flockaflag: false,

  createUser: function (email) {
    database.ref("users/" + authService.getCurrentUser().uid + "/").update(email);
  },

  getAllUsers: function () {
    var self = this;
    database.ref('/users').once('value').then(function (snapshot) {
      self.usersObject = snapshot.val();

      ns.postNotification('USERS_FETCHED', null);
    });
  },

  newPrune: function(uid) {
    database.ref('/users/' + uid + '/lastPrune').transaction((timestamp) => {
      if (timestamp) {
        let today = new Date().toLocaleDateString();
        let lastPruneDate = new Date(timestamp).toLocaleDateString();
        
        if (today != lastPruneDate) {
          timestamp = firedatabase.ServerValue.TIMESTAMP;
        }
      }
      return timestamp;
    }) 
  },

  downloadFlockalogs: function () {
    this.allUserFlockalogs = {};
    // download all flockalog data and store in property "allUserFlockalogs" - should be called on page load
    // 15 mins = 900,000 ms
    let flockalogSnapshot = database.ref('/flockalogs').once('value');
    let usersSnapshot = database.ref('/users').once('value');

    var self = this;

    return Promise.all([flockalogSnapshot, usersSnapshot]).then(function (snapshot) {
      var flockalogs = snapshot[0].val();
      var users = snapshot[1].val();

      var allUsers = {};
      for (var uid in flockalogs.users) {
        allUsers[users[uid].email] = [];
        var prevTimestamp = 0;
        var username = '';

        for (var user in users) {
          if (uid === user) {
            username = users[user].email;
          }
        }

        var user = flockalogs.users[uid];
        var currentDay = null;
        var prevDay = null;
        var codeTime = 0;
        var delta = 0;
        for (var pushId in user) {
          var currentTimestamp = user[pushId].timestamp;
          delta = currentTimestamp - prevTimestamp;
          currentDay = moment(currentTimestamp).format('YYYY-MM-DD');

          if (prevTimestamp === 0) {
            prevTimestamp = currentTimestamp;
            prevDay = currentDay;
          } else {
            if (currentDay != prevDay) {
              var dailyTime = {
                time: codeTime,
                date: prevDay
              };
              // allUsers[uid].push(dailyTime);
              allUsers[users[uid].email].push(dailyTime);

              codeTime = 0;
            }

            if (delta <= 900000) {
              // if the gap in saves is less than 15 minutes
              codeTime += delta;
            }
            prevDay = currentDay;
            prevTimestamp = currentTimestamp;
          }
        }

        var dailyTime = {
          time: codeTime,
          date: prevDay
        };
        // allUsers[uid].push(dailyTime);
        allUsers[users[uid].email].push(dailyTime);
      }

      // console.log(allUsers);
      self.allUserFlockalogs = allUsers;
      ns.postNotification('DATA_FLOCKALOGS_DOWNLOADED', null);
    });
  },

  generateFlockaUserObj: function(uid, users, allUsers, flockalogs) {
    var userObj = {};
    var username = users[uid].email;

    // allUsers[users[uid].email] = [];
    var prevTimestamp = 0;

    // for (var user in users) {
    //   if (uid === user) {
    //     username = users[user].email;
    //   }
    // }

    var user = flockalogs.users[uid];
    var currentDay = null;
    var prevDay = null;
    var codeTime = 0;
    var delta = 0;
    for (var pushId in user) {
      var currentTimestamp = user[pushId].timestamp;
      delta = currentTimestamp - prevTimestamp;
      currentDay = moment(currentTimestamp).format('YYYY-MM-DD');

      if (prevTimestamp === 0) {
        prevTimestamp = currentTimestamp;
        prevDay = currentDay;
      } else {
        if (currentDay != prevDay) {
          var dailyTime = {
            time: codeTime,
            date: prevDay
          };
          // allUsers[uid].push(dailyTime);
          allUsers[users[uid].email].push(dailyTime);

          codeTime = 0;
        }

        if (delta <= 900000) {
          // if the gap in saves is less than 15 minutes
          codeTime += delta;
        }
        prevDay = currentDay;
        prevTimestamp = currentTimestamp;
      }
    }

    var dailyTime = {
      time: codeTime,
      date: prevDay
    };
    // allUsers[uid].push(dailyTime);
    allUsers[users[uid].email].push(dailyTime);
  },

  computeUserTime: function () {

  },

  getFlockalogsLeaderboard: function () {
    // ms in a day = 86,400,000
    var keys = Object.keys(this.allUserFlockalogs).slice();
    var leaderboard = [];
    // number of days since the unix epoch
    var today = Math.floor(moment(moment().format('YYYY-MM-DD')).valueOf() / 86400000);
    if (keys.length) {
      for (var username in this.allUserFlockalogs) {
        var user = {
          username: username,
          dailyAvg: 0,
          total: 0
        };
        var dayCount = 0;
        var codeTime = 0;

        let flockalogCopy = this.allUserFlockalogs[username].slice()
        for (var dailyTime of flockalogCopy) {
          var currentDay = Math.floor(moment(dailyTime.date).valueOf() / 86400000);
          var daysFromToday = today - currentDay;

          if (daysFromToday <= 6) {
            codeTime += dailyTime.time;
            dayCount++
          }
        }

        if (codeTime) {
          user.total = codeTime / 1000 / 3600;
          user.dailyAvg = user.total / dayCount;
          leaderboard.push(user);
        }
        
      }

      leaderboard.sort(function (a, b) { return (b.total - a.total) });
    }

    return leaderboard;
  },

  getCurrentUserDailyFlockatime: function () {
    // returns the current user's daily code time for the past 7 days
    // code time reported in hours
    var keys = Object.keys(this.allUserFlockalogs);

    if (keys.length) {
      var email = authService.getCurrentUser().email;
      if (this.allUserFlockalogs[email]) {
        var myFlockalogs = this.allUserFlockalogs[email].slice();
      } else {
        var myFlockalogs = null;
      }

      if (myFlockalogs) {
        var today = Math.floor(moment(moment().format('YYYY-MM-DD')).valueOf() / 86400000);

        const lastSevenDaysFlockalogs = myFlockalogs.filter(log => {
          var currentDay = Math.floor(moment(log.date).valueOf() / 86400000);
          let daysFromToday = today - currentDay;

          return daysFromToday <= 6;
        });

        const lastSevenDaysFlockalogsInHours = lastSevenDaysFlockalogs.map(log => {
          let hours = log.time / 1000 / 3600;
          let date = log.date;

          return {
            time: hours,
            date: date
          };
        })

        // @TODO figure out how to fill in zeros for the correct days
        return lastSevenDaysFlockalogsInHours;
      }
      return null;
    }
  },

  convertTime: function (hours) {
    // takes a floating point value representing hours and converts it to a string
    // in the format of ### hours ## minutes
    var timeString = '';

    var minutes = Math.floor((hours - Math.floor(hours)) * 60);
    hours = Math.floor(hours);

    if (hours !== 0) {
      timeString = hours + ' hrs ';
    }

    if (minutes !== 0) {
      timeString += minutes + ' minutes';
    }

    if (!timeString) {
      timeString = '0 minutes';
    }

    return timeString;
  },
}

export default data;