import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';

/**Firebase initilization is done in firebase.js */
import firebase from '../FirebaseInit/FirebaseInit.js';
import {URL,savedName,timePeriod} from '../../constants/constants.js';
import {storeData, removeData} from '../Storage/Storage';


const googleWbClientID = '301035346897-gbeg8ouav7fbpb28c3q3lk34qoskvrno.apps.googleusercontent.com';
async function getFCMKey() {
    let FCMkey = firebase.messaging().getToken();
    return FCMkey;
}

//verify clientIdToken, FCMkey with server then return server response
async function verifyToken(clientIdToken, FCMkey) {
    console.log('verifying');
    try {
        let response = await fetch(URL, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify({
                "clientIdToken": clientIdToken,
                "fcmKey": FCMkey
            })
        });
        let responseJSON = await response.json();
        console.log('server response in json: ', responseJSON);

        if (responseJSON.status.httpStatus === 200) {
            //make sure there is content inside the response before return it to signin function
            return responseJSON;
        }
        else {
            console.log(responseJSON.message);
            throw "Verification process unsuccessful: " + responseJSON.message;
        }
    }
    catch (error) {
        console.log("Verifying token error", error);
    }
}

//retrieve clientIdToken and FCMkey and send them to server to verify, 
//then save the neccessary data to local storage
async function serverAuth(currentUser) {
    try {
        let clientIdToken = await currentUser.getIdToken(true);

        console.log('clientIDToken', clientIdToken);

        //get fcmkey
        let FCMkey = await getFCMKey();
        console.log('FCMkey', FCMkey);

        //send clientIdToken, FCMkey to server to receive sessionToken and userId
        let serverResponse = await verifyToken(clientIdToken, FCMkey);

        storeData(savedName.userIdFromServer, serverResponse.content.userId, timePeriod.oneMonth);
        //save sessionToken on global, which will disappear when app is destroyed
        global.sessionToken = serverResponse.content.sessionToken;
    }
    catch (error) {
        alert(error.message);
        console.log(error);
    }

}
async function signinFb(navigate){
    try {
        let result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            console.log('Login cancelled');
        }
        else {
            if (result.grantedPermissions)
                console.log(`Login with FB success with permissions: ${result.grantedPermissions.toString()}`);
            // get the access token
            let accessToken = await AccessToken.getCurrentAccessToken();

            // create a new firebase credential with the token
            let credential = null;
            if (accessToken)
                credential = await firebase.auth.FacebookAuthProvider.credential(accessToken.accessToken);

            // login with credential
            let currentUser = await firebase.auth().signInWithCredential(credential);

            // now signed in
            console.log("FBsignin currentUser", currentUser);

            serverAuth(currentUser);

            navigate("SignedInDrawer");
        }
    }
    catch (error) {
        console.log(`Login with FB fail with error: ${error}`);
        alert(error.message);
        console.log(error);
    }

}


//google signin must be configure before login
async function setupGoogleSignin(){
    try {
        await GoogleSignin.hasPlayServices({ autoResolve: true });
        //this method is mandatory
        await GoogleSignin.configure({
            webClientId: googleWbClientID,
            offlineAccess: false
        });
    }
    catch (err) {
        console.log("Play services error", err.code, err.message);
    }
}

async function signinGoogle(navigate) {

    try {
        //This method give you the current user if already login or null if not yet signin.
        let user = await GoogleSignin.currentUserAsync();
        if (user == null) {
            user = await GoogleSignin.signIn();
        }
        console.log(`Successful Google signin with user: ${user}`);

        //link to google firebase
        const credential = firebase.auth.GoogleAuthProvider.credential(user.idToken);

        let currentUser = await firebase.auth().signInWithCredential(credential);
        // now signed in
        console.log("googlesignin currentUser", currentUser);

        serverAuth(currentUser);

        navigate('SignedInDrawer');
    }
    catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('error when signing in with google', errorMessage);
        alert(error.errorMessage);
    }
}

async function signupEmail(email, pass, navigate){

    try {
        console.log("Signing up email...");
        await firebase.auth()
            .createUserWithEmailAndPassword(email, pass);

        let currentUser = firebase.auth().currentUser;
        if (currentUser) {
            // User is signed in
            serverAuth(currentUser);
            navigate('SignedInDrawer');
        }
        else {//if not then go to EmailSignup screen
            navigate('EmailSignup');
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

async function signinEmail(email, pass, navigate) {
    try {
        const currentUser = await firebase.auth().signInWithEmailAndPassword(email, pass);

        serverAuth(currentUser);

        navigate('SignedInDrawer');
    } catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
        alert(errorMessage);
    }
}

async function signout(props, signoutAction) {
    try {
        await firebase.auth().signOut();
        console.log('User has signed out');
        removeData(savedName.userIdFromServer);
        // Navigate to welcome screen using signoutAction
        props.navigation.dispatch(signoutAction);
        
    } catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
    }
}

export { serverAuth, signinFb, verifyToken, setupGoogleSignin, signinGoogle, signupEmail, signinEmail, signout };