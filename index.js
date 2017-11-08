/**
 * @flow
 */

import * as React from 'react';
import {
  AppRegistry
} from 'react-native';
import firebase from './components/FirebaseInit/FirebaseInit';
import createNavigationalScreens from "./components/Screens/Screens";
import { serverAuth } from './components/FirebaseAuth/AuthFunctions';
import Loading from './components/Loading/Loading';
import { loadData, removeData } from './components/Storage/Storage';
import { savedName } from './constants/constants';

type StateType = {
  isSignedIn: boolean,
  hasLocalCache: boolean
};

export default class CafeApp extends React.Component<void, StateType> {
  unsubscribe: ?(() => any);
  checkIfSignedIn: () => void;

  constructor() {
    super();
    this.state = {
      isSignedIn: null,
      hasLocalCache: false
    };

    this.unsubscribe = null;
    this.checkIfSignedIn = this.checkIfSignedIn.bind(this);
    this.checkLocalCache = this.checkLocalCache.bind(this);
    removeData(savedName.userIdFromServer);
    removeData(savedName.userIdFromServer);
    removeData(savedName.userIdFromServer);
    this.checkLocalCache();
    this.checkIfSignedIn();
  }

  async checkLocalCache(): void {
    try {
      let loadResult = await loadData(savedName.userIdFromServer);
      console.log("loadResult", loadResult);
      if (typeof (loadResult) === "string")
        this.setState({ hasLocalCache: true });
    } catch (error) {
      if (error.name === "NotFoundError") {
        this.setState({ hasLocalCache: false });
      }
    }
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

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render(): any {
    //this.checkLocalCache();
    console.log("rendering");
    let Layout = Loading;
    const { isSignedIn, hasLocalCache } = this.state;
    console.log('signedIn ', isSignedIn);
    console.log('hasLocalCache ', hasLocalCache);
    if (this.state.isSignedIn !== null) {
      Layout = createNavigationalScreens(hasLocalCache: boolean);
    }

    return (
      //isSignedIn is used in case if the user has outdated local cache 
      //and authorization with firebase failed than return to signinandup screen
      <Layout screenProps={{ isSignedIn: isSignedIn }} />
    );
  }
}

AppRegistry.registerComponent('CafeApp', (): any => CafeApp);