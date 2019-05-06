import { database } from './fire';
import ns from './notificationService';
import authService from './auth.js';
import moment from 'moment';

let data = {
  allUserFlockalogs: {},
  usersObject: {}, // Object containing all users and child objects fetched from Firebase
  flockaflag: false,
  
  // function handleSignin() {
  //   // check users node if the currently authenticated user uses vscode
  //   var uid = auth.currentUser.uid;
  //   var self = this;
  //   console.log('data handleSignIn');

  //   database.ref('/users/' + uid).once('value').then(function (userSnapshot) {
  //     var user = userSnapshot.val();
  //     console.log(user);
  //     if (user.flocka !== undefined && user.flocka) {
  //       self.flockaflag = true;
  //       self.downloadFlockalogs();
  //     } else {
  //       self.flockaflag = false;
  //     }
  //   });
  // }
  
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

  downloadFlockalogs: function () {
    this.allUserFlockalogs = {};
    // download all flockalog data and store in property "allUserFlockalogs" - should be called on page load
    // 15 mins = 900,000 ms
    let flockalogSnapshot = database.ref('/flockalogs').once('value');
    let usersSnapshot = database.ref('/users').once('value');

    console.log('downloadFlockalogs');
    var self = this;

    return Promise.all([flockalogSnapshot, usersSnapshot]).then(function (snapshot) {
      var flockalogs = snapshot[0].val();
      var users = snapshot[1].val();

      var allUsers = {};
      for (var uid in flockalogs.users) {
        // allUsers[uid] = [];
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

      console.log(allUsers);

      self.allUserFlockalogs = allUsers;
      ns.postNotification('DATA_FLOCKALOGS_DOWNLOADED', null);
    });
  },

  getFlockalogsLeaderboard: function () {
    // ms in a day = 86,400,000
    var keys = Object.keys(this.allUserFlockalogs);
    var leaderboard = [];
    // number of days since the unix epoch
    var today = Math.floor(moment(moment().format('YYYY-MM-DD')).valueOf() / 86400000);
    console.log('today: ' + today);
    if (keys.length) {
      for (var username in this.allUserFlockalogs) {
        var user = {
          username: username,
          dailyAvg: 0,
          total: 0
        };
        var dayCount = 0;
        var codeTime = 0;
        for (var dailyTime of this.allUserFlockalogs[username]) {
          var currentDay = Math.floor(moment(dailyTime.date).valueOf() / 86400000);
          var daysFromToday = today - currentDay;

          if (daysFromToday <= 6) {
            codeTime += dailyTime.time;
            dayCount++
          }
        }
        user.total = codeTime / 1000 / 3600;
        user.dailyAvg = user.total / dayCount;
        leaderboard.push(user);
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
      var myFlockalogs = this.allUserFlockalogs[email];
      for (var i = 0; i < myFlockalogs.length; i++) {
        myFlockalogs[i].time = myFlockalogs[i].time / 1000 / 3600;
      }

      var lastSevenDaysFlockalogs = [];
      var today = Math.floor(moment(moment().format('YYYY-MM-DD')).valueOf() / 86400000);

      for (var i = 6; i >= 0; i--) {
        var flag = false;
        for (var log of myFlockalogs) {
          var currentDay = Math.floor(moment(log.date).valueOf() / 86400000);
          var daysFromToday = today - currentDay;
          if (daysFromToday === i) {
            lastSevenDaysFlockalogs.push(log);
            flag = true;
          }

          // if (daysFromToday <= 6) {
          // lastSevenDaysFlockalogs.push(log);
          // }
        }
        if (!flag) {
          var zeroLog = {
            date: 'test',
            time: 0
          };
          lastSevenDaysFlockalogs.push(zeroLog);
        }
      }


      console.log(lastSevenDaysFlockalogs);
      return lastSevenDaysFlockalogs;
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
  }
}
// var authObserver = ns.addObserver('AUTH_SIGNIN', this, handleSignin);

export default data;