const functions = require('firebase-functions');
const admin = require('firebase-admin');
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

  const flockaLogsRef = admin.database().ref('/flockalogs/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2');
  const userRef = admin.database().ref('/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2/');
  const dailyTimeRef = admin.database().ref('/flockalogs-dailySummary/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2/');

  return flockaLogsRef.once('value').then(flockalogs => {
    var totalTime = 0;
    var dailyTotal = 0;
    var prevTimestamp = 0;
    var prevDay = null;
    var summaryObj = {};

    var today = new Date().toLocaleDateString();
    today = Date.parse(today);

    flockalogs.forEach(child => {
      let timestamp = child.val().timestamp;
      let currentDay = new Date(timestamp).toLocaleDateString();
      currentDay = Date.parse(currentDay);

      if (currentDay != prevDay && prevDay != today && prevDay) {
        summaryObj[prevDay] = dailyTotal;
        dailyTotal = 0;
      }

      // delta in minutes
      let delta = (timestamp - prevTimestamp) / 1000 / 60

      if (prevTimestamp !== 0 && delta <= 15) {
        // time in hours
        totalTime += (delta / 60);
        dailyTotal += (delta / 60);
      }

      prevDay = currentDay;
      prevTimestamp = timestamp;
    });

    if (prevDay != today) {
      summaryObj[prevDay] = dailyTotal;
    }

    console.log(summaryObj);

    let totalTimeUpdate = {
      grandTotal: totalTime
    };

    userRef.update(totalTimeUpdate);
    dailyTimeRef.update(summaryObj);
  })
})