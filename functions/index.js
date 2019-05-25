const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// temporarily using my uid
exports.pruneFlockaLogs = functions.database.ref('/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2/lastPrune').onUpdate((change, context) => {
  const prevChangeTime = change.before.val();
  const newChangeTime = change.after.val();

  const flockaLogsSnapshot = admin.database().ref('/flockalogs/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2').once('value');
  const offsetSnapshot = admin.database().ref('/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2/').once('value');
  
  const userRef = admin.database().ref('/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2/');
  const dailyTimeRef = admin.database().ref('/flockalogs-dailySummary/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2/');

  return Promise.all([flockaLogsSnapshot, offsetSnapshot]).then(data => {
    let flockalogs = data[0];
    let offset = data[1].child('offset').val();
    
    var totalTime = 0;
    var dailyTotal = 0;
    var prevTimestamp = 0;
    var prevDay = null;
    var summaryObj = {};

    var count = 0;

    var now = new Date().getTime() - offset;
    var today = moment(now).format('YYYY-MM-DD');
    var todayCountFromEpoch = Math.floor(now / 86400000);

    console.log(todayCountFromEpoch);

    flockalogs.forEach(child => {
      var timestamp = child.val().timestamp - offset;
      var currentDay = moment(timestamp).format('YYYY-MM-DD');

      var currentDayCountFromEpoch = Math.floor(timestamp / 86400000);
      var daysFromToday = todayCountFromEpoch - currentDayCountFromEpoch;

      if (count == 0) {
        console.log(daysFromToday);
        count++;
      }

      if (daysFromToday > 6) {
        var delta = (timestamp - prevTimestamp);

        if (prevTimestamp === 0) {
          prevTimestamp = timestamp;
          prevDay = currentDay;
        } else {
          if (currentDay != prevDay) {
            summaryObj[prevDay] = dailyTotal;
            dailyTotal = 0;
          }


          // if delta is less than 15 minutes
          if (delta <= 900000) {
            // time in hours
            totalTime += (delta / 1000 / 3600);
            dailyTotal += (delta / 1000 / 3600);
          }

          prevDay = currentDay;
          prevTimestamp = timestamp;
        }
      }
    });

    let totalTimeUpdate = {
      grandTotal: totalTime
    };

    userRef.update(totalTimeUpdate);
    dailyTimeRef.update(summaryObj);
  })
})