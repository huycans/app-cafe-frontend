/**
 * @flow
 */

import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
} from 'react-native';
//import * as firebase from "firebase";
import firebase from './components/FirebaseInit/FirebaseInit';
import createNavigationalScreens from "./components/Screens/Screens";
import { serverAuth } from './components/FirebaseAuth/AuthFunctions';
import Loading from './components/Loading/Loading';
import {loadData, removeData} from './components/Storage/Storage';
import {savedName} from './constants/constants';
//import {Spinner} from 'react-native-loading-spinner-overlay';

type State = {
  count: number
};

class MyComponent extends React.Component<void, void, State> {
  state = {
    count: 0,
  };

  componentDidMount() {
    setInterval(() => {
      this.setState(prevState => ({
        count: prevState.count + 1,
      }));
    }, 1000);
  }

  render() {
    return <div>Count: {this.state.count}</div>;
  }
}

<MyComponent />;

type State= {
  isSignedIn: boolean,
  hasLocalCache: boolean
};

export default class CafeApp extends Component<void,void,State> {
  state: State = {
    isSignedIn: null,
    hasLocalCache: false
  } ;
  constructor() {
    super();
    //put state outside for flow
    //  this.state = {
    //    isSignedIn: null,
    //    hasLocalCache: false
    //  };
    this.unsubscribe = null;
    this.checkIfSignedIn = this.checkIfSignedIn.bind(this);
    this.conditionalRender = this.conditionalRender.bind(this);

    if (loadData(savedName.userIdFromServer).name ==='NotFoundError' ){
      state.hasLocalCache = true;
    }
    this.checkIfSignedIn();
  }

  checkIfSignedIn() {
    console.log('checkIfSignedIn');
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

  // componentWillMount() {
  //   this.checkIfSignedIn();
  // }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  conditionalRender(condition, content1, content2) {
    if (condition) return content1;
    else return content2;
  }

  render() {
    let Layout= Loading;
    const {signedIn, hasLocalCache }= this.state;
    console.log('signedIn ',signedIn);
    console.log('hasLocalCache ', hasLocalCache );
    if (this.state.isSignedIn !== null) {
       Layout = createNavigationalScreens(hasLocalCache);
    }
    
    return (
      //signedIn is used in case if the user has outdated local cache 
      //and authorization with firebase failed than return to signinandup screen
     <Layout screenProps = {{signedIn: signedIn}}/>
    );
  }
}

AppRegistry.registerComponent('CafeApp', () => CafeApp);
