/**
 * @flow
 */

import * as React from "react";
import { AppRegistry, NetInfo } from "react-native";
import firebase from "./components/FirebaseInit/FirebaseInit";
import createNavigationalScreens from "./components/Screens/Screens";
import { serverAuth } from "./components/FirebaseAuth/AuthFunctions";
import Loading from "./components/Loading/Loading";
import { loadData } from "./components/Storage/Storage";
import { savedName } from "./constants/constants";

type StateType = {
  isSignedIn: ?boolean,
  hasLocalCache: boolean,
  isOnline: boolean
};

export default class CafeApp extends React.Component<void, StateType> {
  setSignedIn: Function;
  checkLocalCache: Function;
  checkNetworkStatus: Function;
  unsubscribe: Function;
  handleSignInCheck: Function;
  handleNetworkStatusChange: Function;
  constructor() {
    super();
    this.state = {
      isSignedIn: null,
      hasLocalCache: false,
      isOnline: false
    };
    //set up or bind neccessary functions
    //this.unsubscribe = null;
    this.setSignedIn = this.setSignedIn.bind(this);
    this.checkLocalCache = this.checkLocalCache.bind(this);
    this.checkNetworkStatus = this.checkNetworkStatus.bind(this);
    this.handleSignInCheck = this.handleSignInCheck.bind(this);
    this.handleNetworkStatusChange = this.handleNetworkStatusChange.bind(this);
  }

  componentDidMount() {
    //check for internet connection
    this.checkNetworkStatus().then((isConnected: boolean) => {
      this.setState({ isOnline: isConnected }, () => {
        //this is a callback, called after this.setState({ isOnline: isConnected }) is done
        if (this.state.isOnline) {
          //if there is internet connection, check if user is signed in
          console.log("Check If Signed In");
          //onAuthStateChanged listener will return an unsubscribe function,
          //Always ensure you unsubscribe from the listener when no longer
          //needed to prevent updates to components no longer in use
          var user = null;
          this.unsubscribe = firebase
            .auth()
            .onAuthStateChanged((currentUser: Object) => {
              //set the variable to process outside of this callback in this.handleSignInCheck because
              //call setstate in here cause problems with react-navigation
              user = currentUser;
            });
          this.handleSignInCheck(user);
        } else {
          //if user is offline, check if there is local cache(saved user data on device)
          //if cache exist, send user to signed in screen
          this.checkLocalCache();
        }
      });
    });

    //set up an event listener for network changes
    NetInfo.addEventListener(
      "connectionChange",
      this.handleNetworkStatusChange
    );
  }

  handleSignInCheck(user: Object) {
    if (user) {
      //if user is signed in
      serverAuth(user);
      this.setState({ hasLocalCache: true });
      this.setState({ isSignedIn: true });
    } else {
      //no user is signed in
      //redundant, only for completion
      this.setState({ isSignedIn: false });
    }
  }

  handleNetworkStatusChange(connectionInfo: Object) {
    if (connectionInfo.type === "none") this.setState({ isOnline: false });
    else this.setState({ isOnline: true });
    console.log("Network status is " + connectionInfo.type);
  }

  setSignedIn(isSignedIn: boolean) {
    this.setState({ isSignedIn: isSignedIn });
  }

  async checkNetworkStatus(): Promise<boolean> {
    let isConnected: boolean = await NetInfo.isConnected.fetch();
    console.log("Network status is " + (isConnected ? "online" : "offline"));
    return isConnected;
  }

  async checkLocalCache(): Promise<void> {
    //check local cache
    try {
      let loadUserId = await loadData(savedName.userIdFromServer);
      let loadSessionToken = await loadData(savedName.sessionToken);
      if (
        typeof loadUserId === "string" &&
        typeof loadSessionToken === "string"
      )
        this.setState({ hasLocalCache: true });
    } catch (error) {
      if (error.name === "NotFoundError") {
        this.setState({ hasLocalCache: false });
      }
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    NetInfo.removeEventListener(
      "connectionChange",
      this.handleNetworkStatusChange
    );
  }

  render(): any {
    console.log("rendering");
    let Layout = Loading;
    const { isSignedIn, hasLocalCache } = this.state;
    console.log("signedIn ", isSignedIn);
    console.log("hasLocalCache ", hasLocalCache);
    if (isSignedIn !== null) {
      Layout = createNavigationalScreens(hasLocalCache);
    }

    return (
      //isSignedIn is used in case if the user has outdated local cache
      //and authorization with firebase failed than return to signinandup screen
      <Layout screenProps={{ isSignedIn: isSignedIn }} />
    );
  }
}

AppRegistry.registerComponent("CafeApp", (): any => CafeApp);
