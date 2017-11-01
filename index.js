/**
 * @flow
 */

import * as React from 'react';
import {
  AppRegistry,
  StyleSheet,
} from 'react-native';
//import * as firebase from "firebase";
import firebase from './components/FirebaseInit/FirebaseInit';
import createNavigationalScreens from "./components/Screens/Screens";
import { serverAuth } from './components/FirebaseAuth/AuthFunctions';
import Loading from './components/Loading/Loading';
import { loadData, removeData } from './components/Storage/Storage';
import { savedName } from './constants/constants';

type State = {
  isSignedIn: boolean,
  hasLocalCache: boolean
};

export default class CafeApp extends React.Component<void, State> {
  unsubscribe: ?( () => any );
  checkIfSignedIn: () => void;

  constructor() {
    super();
    //put state outside for flow
    this.state = {
      isSignedIn: null,
      hasLocalCache: false
    };

    this.unsubscribe = null;
    this.checkIfSignedIn = this.checkIfSignedIn.bind(this);

    if (loadData(savedName.userIdFromServer).name === 'NotFoundError') {
      this.state.hasLocalCache = true;
    }
    this.checkIfSignedIn();
  }

  checkIfSignedIn() {
    console.log('checkIfSignedIn');
    //onAuthStateChanged listener will return an unsubscribe function, 
    //Always ensure you unsubscribe from the listener when no longer 
    //needed to prevent updates to components no longer in use
    this.unsubscribe = firebase.auth().onAuthStateChanged((user: Object) => {
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

  // componentWillMount() {
  //   this.checkIfSignedIn();
  // }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render(): any {
    let Layout = Loading;
    const { isSignedIn, hasLocalCache } = this.state;
    console.log('signedIn ', isSignedIn);
    console.log('hasLocalCache ', hasLocalCache);
    if (this.state.isSignedIn !== null) {
      Layout = createNavigationalScreens(hasLocalCache);
    }

    return (
      //signedIn is used in case if the user has outdated local cache 
      //and authorization with firebase failed than return to signinandup screen
      <Layout screenProps={{ isSignedIn: isSignedIn }} />
    );
  }
}

AppRegistry.registerComponent('CafeApp', (): any => CafeApp);
