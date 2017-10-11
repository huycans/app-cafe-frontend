/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
} from 'react-native';
//import * as firebase from "firebase";
import firebase from './components/FirebaseInit/FirebaseInit.js';

import createNavigationalScreens from "./components/Screens/Screens";

export default class CafeApp extends Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      sessionToken: '',
    };
    this.checkIfSignedIn = this.checkIfSignedIn.bind(this);
    this.saveSessionToken = this.saveSessionToken.bind(this);
  }

  saveSessionToken(sToken) {
    console.log('setting state');
    this.setState({ sessionToken: sToken });
  }

  checkIfSignedIn() {
    console.log("checking authstate");
    let user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
      // User is signed in.
      console.log('User had signed in');
      this.setState({ isSignedIn: true });
    } else {
      // User is signed out.
      this.setState({ isSignedIn: false });
    }
  }

  componentWillMount() {
    this.checkIfSignedIn();
  }

  render() {
    const signedIn = this.state.isSignedIn;
    const Layout = createNavigationalScreens(signedIn);

    return (
      <Layout screenProps={{ saveSessionToken: this.saveSessionToken }} />

    );
  }
}

AppRegistry.registerComponent('CafeApp', () => CafeApp);
