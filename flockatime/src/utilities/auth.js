import { auth, fbProvider } from './fire';
import data from './data';
import ns from './notificationService';

export default {
  uid: "",
  email: "",
  signUp: function (email, password) {
    // Call Firebase method to create user with email and password
    var self = this;
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password).then(function (user) {
        var userId = user.user.uid;
        self.uid = userId;
        var userEmail = user.user.email;
        var emailObj = { email: userEmail };

        data.createUser(emailObj);

        // not sure if userId is the best thing to return
        resolve(userId);
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        reject(errorCode);
      });
    });
  },
  signIn: function (email, password) {
    var self = this;
    return new Promise((resolve, reject) => {
      auth.signInWithEmailAndPassword(email, password).then(credential => {
        var uid = credential.user.uid;
        self.uid = uid;
        resolve(uid);
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        reject(errorCode);
      });
    })
  },
  signOut: function () {
    // @TODO check if user is authenticated with facebook first
    var self = this;
    auth.signOut().then(function () {
      self.uid = "";
      ns.postNotification('AUTH_SIGNOUT', null);
    });
  },
  firebaseAuthListener: auth.onAuthStateChanged(function (user) {
    if (user) {
      ns.postNotification('AUTH_SIGNIN', user.uid);
    }
    else {
      ns.postNotification('AUTH_SIGNOUT', null);
    }
  }),
  checkLoginState: function (event) {
    console.log('checking Facebook Login State');
    if (event.authResponse) {
      console.log(event.authResponse);
      // User is signed-in Facebook.
      var unsubscribe = auth.onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        console.log(firebaseUser);
        // Check if we are already signed-in Firebase with the correct user.
        if (!auth.isUserEqual(event.authResponse, firebaseUser)) {
          // Build Firebase credential with the Facebook auth token.
          var credential = fbProvider.credential(
            event.authResponse.accessToken);
          // Sign in with the credential from the Facebook user.
          auth.signInAndRetrieveDataWithCredential(credential).then(function (cred) {
            // auth.uid = cred.user.uid;
            data.createUser({ email: cred.user.email });
          }).catch(function (error) {
            var errorCode = error.code;
            console.log(errorCode);
          });
        } else {
          // User is already signed-in Firebase with the correct user.
        }
      });
    } else {
      // User is signed-out of Facebook.
      auth.signOut();
    }
  },
  socialMediaSignIn: function () {
    return new Promise((resolve, reject) => {
      auth.signInWithPopup(fbProvider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // console.log(user);
        resolve();
        // ...
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        // console.log(errorCode);
        var errorMessage = error.message;
        // console.log(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // console.log(error);
        reject();
        // ...
      });
    });
  },
  isUserEqual: function (facebookAuthResponse, firebaseUser) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === fbProvider.PROVIDER_ID &&
          providerData[i].uid === facebookAuthResponse.userID) {
          // We don't need to re-auth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  },
  getApiKey: function () {
    return auth.currentUser.uid;
  },
  getCurrentUser: function () {
    return auth.currentUser;
  }
};