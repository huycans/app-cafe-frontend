import React, { Component } from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

/**Firebase initilization is done in firebase.js level */
//import * as firebase from "firebase";
import firebase from '../FirebaseInit/FirebaseInit.js';
import URL from '../../constants/constants.js';

const googleWbClientID = '301035346897-gbeg8ouav7fbpb28c3q3lk34qoskvrno.apps.googleusercontent.com';
async function getFCMKey() {
    let FCMkey = firebase.messaging().getToken();
    return FCMkey;
}
function storeSessionData(serverResponse) {
    //nothing yet, just output
    if (serverResponse) {
        console.log(serverResponse.content.sessionToken);//save in memory, react state not possible. maybe in storage
        console.log(serverResponse.content.userId);//save in storage
    }
}
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

async function signinFb(navigate) {
    let clientIdToken = null;
    let accessToken = null;
    let currentUser = null;

    try {
        let result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            console.log('Login cancelled');
        }
        else {
            console.log(`Login with FB success with permissions: ${result.grantedPermissions.toString()}`);
            // get the access token
            accessToken = await AccessToken.getCurrentAccessToken();

            // create a new firebase credential with the token
            const credential = await firebase.auth.FacebookAuthProvider.credential(accessToken.accessToken);

            // login with credential
            currentUser = await firebase.auth().signInWithCredential(credential);

            // now signed in
            console.log("FBsignin currentUser", currentUser);
            clientIdToken = await currentUser.getIdToken();

            console.log('clientIDToken', clientIdToken);

            //get fcmkey
            let FCMkey = await getFCMKey();
            console.log('FCMkey', FCMkey);

            //send clientIdToken, FCMkey to server to receive sessionToken and userId
            let serverResponse = await verifyToken(clientIdToken, FCMkey);
            storeSessionData(serverResponse);

            navigate('SignedIn');
        }
    }
    catch (error) {
        console.log(`Login with FB fail with error: ${error}`);
        alert(error.message);
        console.log(error);
    }

}


//google signin must be configure before login
async function setupGoogleSignin() {
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
        let clientIdToken = await currentUser.getIdToken();
        console.log('clientIDToken', clientIdToken);
        //get FCM key
        let FCMkey = await getFCMKey();
        console.log('FCMkey', FCMkey);

        //send to server
        let serverResponse = await verifyToken(clientIdToken, FCMkey);
        storeSessionData(serverResponse);

        navigate('SignedIn');
    }
    catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('error when signing in with google', errorMessage);
        alert(error.errorMessage);
    }
}

async function signupEmail(email, pass, navigate) {

    try {
        console.log("Signing up email...");
        await firebase.auth()
            .createUserWithEmailAndPassword(email, pass);

        let currentUser = firebase.auth().currentUser;
        if (currentUser) {
            // User is signed in
            let clientIdToken = await currentUser.getIdToken();
            console.log('clientIDToken', clientIdToken);
            //get FCM key
            let FCMkey = await getFCMKey();
            console.log('FCMkey', FCMkey);

            //send to server
            let serverResponse = await verifyToken(clientIdToken, FCMkey);
            storeSessionData(serverResponse);
            navigate('SignedIn');
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
    const authResult = null;
    try {
        const currentUser = await firebase.auth().signInWithEmailAndPassword(email, pass);

        let clientIdToken = await currentUser.getIdToken();
        console.log('clientIDToken', clientIdToken);
        //get FCM key
        let FCMkey = await getFCMKey();
        console.log('FCMkey', FCMkey);

        //send to server
        let serverResponse = await verifyToken(clientIdToken, FCMkey);
        storeSessionData(serverResponse);
        navigate('SignedIn');
    } catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
        alert(errorMessage);
    }
}

async function signout(navigate) {

    try {
        await firebase.auth().signOut();
        console.log('User has signed out');
        // Navigate to welcome screen
        navigate('SigninAndSignup');
    } catch (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
    }
}

export { signinFb, verifyToken, setupGoogleSignin, signinGoogle, signupEmail, signinEmail, signout };