/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Alert
} from 'react-native';
//import * as firebase from "firebase";
import firebase from './components/firebase/firebase.js';

import {StackNavigator} from 'react-navigation';
import createNavigationalScreens from "./components/screens/Screens";

var config = {
  apiKey: "AIzaSyCHZyeWflrZJkJVbR_xiwSBYuwqdF3PBK0",
  authDomain: "app-cafe.firebaseapp.com",
  databaseURL: "https://app-cafe.firebaseio.com",
  projectId: "app-cafe",
  storageBucket: "app-cafe.appspot.com",
  messagingSenderId: "301035346897"
};


//firebase.initializeApp(config);
//firebase.auth().useDeviceLanguage();

export default class CafeApp extends Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false
    }
  }
  checkIfSignedIn() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        this.setState({ isSignedIn: true })
      } else {
        // User is signed out.
        this.setState({ isSignedIn: false })
      }
    });
  }

  componetDidMount() {
    checkIfSignedIn();
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  bold: {
    fontSize: baseFontSize + 10,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: baseFontSize
  },
  button: {
    backgroundColor: "#42f4eb",
    borderRadius: 10,
    margin: 5,
    padding: 5
  },
  input: {
    width: 200
  }
});

AppRegistry.registerComponent('CafeApp', () => CafeApp);
