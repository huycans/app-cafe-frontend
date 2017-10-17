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
import firebase from './components/FirebaseInit/FirebaseInit';
import createNavigationalScreens from "./components/Screens/Screens";
import storage from './components/Storage/Storage';
import { serverAuth, loadData } from './components/FirebaseAuth/AuthFunctions';
export default class CafeApp extends Component {
  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      //when user signin automatically using onAuthStateChanged without visiting SigninAndUp screen, this is set to true
      //used for signout function
      autoSignin : false
    };
    this.unsubscribe = null;
    this.checkIfSignedIn = this.checkIfSignedIn.bind(this);
  }

  checkIfSignedIn() {
    console.log('checkIfSignedIn');
    // let userObject = await loadData('userObject');
    // console.log(userObject);
    // if (userObject){
    //   serverAuth(userObject);
    //   this.setState({isSignedIn: true});
    // }
    // else {
    //   this.setState({isSignedIn: false});
    // }\

    //onAuthStateChanged listener will return an unsubscribe function, 
    //Always ensure you unsubscribe from the listener when no longer 
    //needed to prevent updates to components no longer in use
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //user is signed in
        serverAuth(user);
        this.setState({ isSignedIn: true });
      }
      else {
        //no user is signed in
        //redundant, only for completion
        this.setState({ isSignedIn: false });
      }
    });
  }

  componentDidMount() {
    this.checkIfSignedIn();
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const signedIn = this.state.isSignedIn;
    const Layout = createNavigationalScreens(signedIn);

    return (
      <Layout screenProps={{ autoSignin: this.state.autoSignin }} />

    );
  }
}

AppRegistry.registerComponent('CafeApp', () => CafeApp);
