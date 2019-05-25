const functions = require('firebase-functions');

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
  const totalTimeRef = admin.database().ref('/users/P7HkdSzD2CY9cyVUO1trEjcn8Is2/grandTotal');

  return flockaLogsRef.once('value').then(flockalogs => {
    var totalTime = 0;

    var prevTimestamp = 0;

    flockalogs.forEach(timestamp => {
      let delta = (timestamp - prevTimestamp) / 1000 / 60

      if (prevTimestamp !== 0 && delta <= 15) {
        totalTime += delta;
      }
    });

    totalTimeRef.update(totalTime);
  })
})