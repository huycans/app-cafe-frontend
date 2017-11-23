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
}): Promise<void> {
  try {
    let clientIdToken = await currentUser.getIdToken(true);

    console.log("clientIDToken", clientIdToken);

    //get fcmKey
    let FCMkey = await getFCMKey();
    console.log("FCMkey", FCMkey);

    //send clientIdToken, FCMkey to server to receive sessionToken and userId
    let serverResponse = await verifyToken(clientIdToken, FCMkey);
    console.log("server Response ", serverResponse);
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

    let userData = await getUserData(
      serverResponse.content.userId,
      serverResponse.content.sessionToken,
      FCMkey
    );
    console.log("user data:", userData);
  } catch (error) {
    alert(error.message);
    console.log("Error while auth with server: ", error);
  }
}
async function signinFb(navigation: Function): Promise<void> {
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
      let currentUser = await firebase.auth().signInWithCredential(credential);

      // now signed in
      console.log("FBsignin currentUser", currentUser);

      await serverAuth(currentUser);

      navigation.dispatch(signinAction);
      //navigation.navigate('MainDrawerStack');
    }
  } catch (error) {
    console.log(`Login with FB fail with error: ${error}`);
    alert(error.message);
    console.log(error);
  }
}

//google signin must be configure before login
async function setupGoogleSignin(): Promise<void> {
  try {
    await GoogleSignin.hasPlayServices({ autoResolve: true });
    //this method is mandatory
    await GoogleSignin.configure({
      webClientId: googleWbClientID,
      offlineAccess: false
    });
  } catch (err) {
    console.log("Play services error", err.code, err.message);
  }
}

async function signinGoogle(navigation: Function): Promise<void> {
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

    let currentUser = await firebase.auth().signInWithCredential(credential);
    // now signed in
    console.log("googlesignin currentUser", currentUser);

    await serverAuth(currentUser);

    navigation.dispatch(signinAction);
  } catch (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("error when signing in with google", errorMessage);
    alert(error.errorMessage);
  }
}

async function signupEmail(
  email: string,
  pass: string,
  navigation: Function
): Promise<void> {
  try {
    console.log("Signing up email...");
    await firebase.auth().createUserWithEmailAndPassword(email, pass);

    let currentUser = firebase.auth().currentUser;
    if (currentUser) {
      // User is signed in
      await serverAuth(currentUser);

      navigation.dispatch(signinAction);
    } else {
      //if not then go to EmailSignup screen
      navigation.navigate("EmailSignup");
    }
  } catch (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    alert(errorMessage);
    // [END_EXCLUDE]
  }
}

async function signinEmail(
  email: string,
  pass: string,
  navigation: Function
): Promise<void> {
  try {
    const currentUser = await firebase
      .auth()
      .signInWithEmailAndPassword(email, pass);

    await serverAuth(currentUser);

    navigation.dispatch(signinAction);
  } catch (error) {
    var errorCode = error.code;
    var errorMessage = error.message;

    console.log(errorCode, errorMessage);
    alert(errorMessage);
  }
}

async function signout(
  props: Object,
  signoutAction: NavigationActions
): Promise<void> {
  try {
    await firebase.auth().signOut();
    console.log("User has signed out");
    clearAllData();
    // Navigate to welcome screen using signoutAction
    props.navigation.dispatch(signoutAction);
  } catch (error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    alert(errorMessage);
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
  setupGoogleSignin,
  signinGoogle,
  signupEmail,
  signinEmail,
  signout
};
