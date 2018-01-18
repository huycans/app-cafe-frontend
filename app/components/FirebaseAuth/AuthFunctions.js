//@flow
import { AccessToken, LoginManager } from "react-native-fbsdk";
import { GoogleSignin } from "react-native-google-signin";

/**Firebase initilization is done in firebase.js */
import firebase from "../FirebaseInit/FirebaseInit.js";
import { savedName } from "../../constants/constants.js";
import { storeData, clearAllData } from "../Storage/Storage";
import { NavigationActions } from "react-navigation";
import { getUserData, secureConnect, verifyToken } from "../ServerCommsFuncs";
const googleWbClientID =
  "301035346897-gbeg8ouav7fbpb28c3q3lk34qoskvrno.apps.googleusercontent.com";

async function getFCMKey(): Promise<string> {
  let FCMkey = firebase.messaging().getToken();
  return FCMkey;
}

const signinAction = NavigationActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "MainDrawerStack" })]
});

//retrieve clientIdToken and FCMkey and send them to server to verify,
//then save the neccessary data to local storage
async function serverAuth(currentUser: {
  content: {},
  getIdToken: Function
}): Promise<Object> {
  try {
    let clientIdToken = await currentUser.getIdToken(true);

    console.log("clientIDToken", clientIdToken);

    //get fcmKey
    let FCMkey = await getFCMKey();
    console.log("FCMkey", FCMkey);

    //send clientIdToken, FCMkey to server to receive sessionToken and userId
    let serverResponse = await verifyToken(clientIdToken, FCMkey);
    console.log("server Response ", serverResponse);

    //TODO: maybe store.dispatch these to store
    //if serverResponse is valid, save these data to local storage
    if (serverResponse.content) {
      await storeData(
        savedName.userIdFromServer,
        serverResponse.content.userId
      );
      await storeData(
        savedName.sessionToken,
        serverResponse.content.sessionToken
      );
      await storeData(
        savedName.userKeyFromServer,
        serverResponse.content.userKey
      );
      await storeData(savedName.FCMkey, FCMkey);
    } else {
      throw Error("Veryfing failed: no content exist");
    }

    //retrieve user data (name, avatarUrl...) from server
    let userServerObj = await getUserData(
      serverResponse.content.userId,
      serverResponse.content.sessionToken,
      FCMkey
    );

    return userServerObj;
  } catch (error) {
    console.log("Error while auth with server: ", error);
    throw error.message;
  }
}

async function signinFb(): Promise<Object> {
  try {
    let result = await LoginManager.logInWithReadPermissions([
      "public_profile",
      "email"
    ]);

    if (result.isCancelled) {
      console.log("Login cancelled");
    } else {
      if (result.grantedPermissions)
        console.log(
          `Login with FB success with permissions: ${result.grantedPermissions.toString()}`
        );
      // get the access token
      let accessToken = await AccessToken.getCurrentAccessToken();

      // create a new firebase credential with the token
      let credential = null;
      if (accessToken)
        credential = await firebase.auth.FacebookAuthProvider.credential(
          accessToken.accessToken
        );

      // login with credential
      let userFirebaseObj = await firebase
        .auth()
        .signInWithCredential(credential);
      let userServerObj = await serverAuth(userFirebaseObj);
      return { userFirebaseObj, userServerObj };
      // // now signed in
      // console.log("FBsignin currentUser", currentUser);

      // navigation.dispatch(signinAction);
    }
  } catch (error) {
    console.log(`Login with FB fail with error: ${error}`);
    throw error.message;
  }
}

//google signin must be configure before login
//this is an immediate function, it will run the moment it is defined
(async function setupGoogleSignin(): Promise<void> {
  try {
    console.log("Configure google signin");
    await GoogleSignin.hasPlayServices({ autoResolve: true });
    //this method is mandatory
    await GoogleSignin.configure({
      webClientId: googleWbClientID,
      offlineAccess: false
    });
  } catch (err) {
    console.log("Play services error", err.code, err.message);
    throw err.message;
  }
})();

async function signinGoogle(): Promise<Object> {
  try {
    //This method give you the current user if already login or null if not yet signin.
    let user = await GoogleSignin.currentUserAsync();
    if (user == null) {
      user = await GoogleSignin.signIn();
    }
    console.log(`Successful Google signin with user: ${user}`);

    //link to google firebase
    const credential = firebase.auth.GoogleAuthProvider.credential(
      user.idToken
    );

    //retrieve user objects
    let userFirebaseObj = await firebase
      .auth()
      .signInWithCredential(credential);
    let userServerObj = await serverAuth(userFirebaseObj);
    return { userFirebaseObj, userServerObj };
  } catch (error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    console.log("error when signing in with google", errorMessage);
    throw errorMessage;
  }
}

async function signupEmail(email: string, password: string): Promise<Object> {
  try {
    console.log("Signing up email...");
    await firebase.auth().createUserWithEmailAndPassword(email, password);

    let userFirebaseObj = await firebase.auth().currentUser;
    console.log("currentUser", userFirebaseObj);
    if (userFirebaseObj) {
      // User is signed in

      let userServerObj = await serverAuth(userFirebaseObj);
      return { userFirebaseObj, userServerObj };

      // navigation.dispatch(signinAction);
    } else {
      //if not then return this string, signup saga will navigate to EmailSignup screen
      return "none";
    }
  } catch (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    throw errorMessage;
  }
}

async function signinEmail(email: string, pass: string): Promise<Object> {
  try {
    const userFirebaseObj = await firebase
      .auth()
      .signInWithEmailAndPassword(email, pass);

    let userServerObj = await serverAuth(userFirebaseObj);
    return { userFirebaseObj, userServerObj };
    // navigation.dispatch(signinAction);
  } catch (error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode, errorMessage);
    throw errorMessage;
  }
}

async function signout(): Promise<void> {
  try {
    await firebase.auth().signOut();
    console.log("User has signed out");
    clearAllData();
    // Navigate to welcome screen using signoutAction
    // props.navigation.dispatch(signoutAction);
  } catch (error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    throw errorMessage;
  }
}

// You can pass down the root navigation object as a prop on your child routes. Instead of using component name in your route config, you can render a component.

// Stack Navigator
// - Login
// - Password
// - Main(Drawer Navigator)
//    - Profile Screen // signout button

//  Main: {
//       screen: ({ navigation }) =>
//         <Main screenProps={{ rootNavigation: navigation }} />,
//     }

// Account:

// onPress={() => {
//             props.rootNavigation.dispatch(
//               NavigationActions.reset({
//                 index: 0,
//                 actions: [NavigationActions.navigate({ routeName: 'Login' })]
//               })
//             )
// }}
export {
  secureConnect,
  getUserData,
  serverAuth,
  signinFb,
  verifyToken,
  // setupGoogleSignin,
  signinGoogle,
  signupEmail,
  signinEmail,
  signout
};
