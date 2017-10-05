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
      isSignedIn: false
    };
    this.checkIfSignedIn = this.checkIfSignedIn.bind(this);
  }

  checkIfSignedIn() {
    console.log("checking authstate");
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        this.setState({ isSignedIn: true });
      } else {
        // User is signed out.
        this.setState({ isSignedIn: false });
      }
    });
  }

  componetDidMount() {
    this.checkIfSignedIn();
  }

  render() {
    const signedIn = this.state.isSignedIn;
    const Layout = createNavigationalScreens(signedIn);

    return (
      <Layout />

    );
  }
}

const baseFontSize = 16;
AppRegistry.registerComponent('CafeApp', () => CafeApp);
