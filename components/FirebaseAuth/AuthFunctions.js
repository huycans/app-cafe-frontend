import React, { Component } from 'react';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';

/**Firebase initilization is done in firebase.js level */
//import * as firebase from "firebase";
import firebase from './components/FirebaseInit/FirebaseInit.js';
import { URL } from '../../constants/constants.js';

export default class authFunctions {
    static async verifyToken(token) {
        try { 
            let response = await fetch(URL, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    "clientIdToken": token,
                    "fcmKey": "string"
                })
            });
            console.log(response);
        }
        catch (error) {
            console.log(error);
        }
    }
    static async signinFb(navigate) {
        //navigation function, passed down by StackNavigator, used to navigate to other screens
        LoginManager
            .logInWithReadPermissions(['public_profile', 'email'])
            .then((result) => {
                console.log('Trying to log in');
                if (result.isCancelled) {
                    return Promise.resolve('cancelled');
                }
                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                if (data === 'cancelled') return Promise.resolve(data);
                // create a new firebase credential with the token
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
    
                // login with credential
                return firebase.auth().signInWithCredential(credential);
            })
            .then((currentUser) => {
                if (currentUser === 'cancelled') {
                    console.log('Login cancelled');
                } else {
                    // now signed in
                    //console.warn(JSON.stringify(currentUser.toJSON()));
                    console.log(currentUser);
                    //send currentUser to server
                    //verifyToken
    
                    navigate('SignedIn');
                }
            })
            .catch((error) => {
                console.log(`Login fail with error: ${error}`);
            });
    }
    //google signin must be configure before login
    static async setupGoogleSignin() {
        try {
            await GoogleSignin.hasPlayServices({ autoResolve: true });
            //this method is mandatory
            await GoogleSignin.configure({
                webClientId: '301035346897-gbeg8ouav7fbpb28c3q3lk34qoskvrno.apps.googleusercontent.com',
                offlineAccess: false
            });
        }
        catch (err) {
            console.log("Play services error", err.code, err.message);
        }
    }
    
    static async signinGoogle(navigate) {
    
        try {
            //This method give you the current user if already login or null if not yet signin.
            let user = await GoogleSignin.currentUserAsync();
            if (user == null) {
                user = await GoogleSignin.signIn();
            }
            console.log('Successful signin with user: ${user}');
    
            //link to google firebase
            const credential = firebase.auth.GoogleAuthProvider.credential(user.idToken);
            let data = await firebase.auth().signInWithCredential(credential);
            if (data) navigate('SignedIn');
            //send to server
            //verifyToken(data);
        }
        catch (err) {
            console.log('error when signing in', err);
        }
    }
    
    static async signupEmail(email, pass, navigate) {
    
        try {
            await firebase.auth()
                .createUserWithEmailAndPassword(email, pass);
    
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in, redirect to SignedIn screen
                    navigate("SignedIn");
                }
                else {//if not then go to EmailSignup screen
                    navigate('EmailSignup');
                }
            });
        } catch (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else {
                alert(errorMessage);
            }
            // [END_EXCLUDE]
        }
    }
    
    static async signinEmail(email, pass, navigate) {
        const authResult = null;
        try {
            console.log('running');
            const authResult = await firebase.auth().signInWithEmailAndPassword(email, pass);
            console.log('got authResult');
            const tokenEmail = await authResult.getIdToken();
            console.log(tokenEmail);
            //verifyToken(tokenEmail);
            //go to the signed in screen
            navigate('SignedIn');
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
    
            console.log(errorCode, errorMessage);
        }
    }
    
    static async signout(navigate) {
    
        try {
            await firebase.auth().signOut();
            console.log('User has signed out');
            // Navigate to welcome screen
            navigate('SigninAndSignup');
        } catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        }
    }
}
