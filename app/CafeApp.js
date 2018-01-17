/**
 * @flow
 */

import * as React from "react";
import { Text, View } from "react-native";
import { connect, Provider } from "react-redux";

import MainStack from "./components/Screens/Screens";
import { serverAuth } from "./components/FirebaseAuth/AuthFunctions";
// import { savedName } from "./constants/constants";
import { startupSigninRequest, unsubscribe } from "./actions/auth";
import { addNavigationHelpers } from "react-navigation";
import { AlertProvider, connectAlert } from "./components/Alert";
import store from "./store/store";
import Loading from "./components/Loading/Loading";

type StateType = {
  errorMessage: string
};

type PropType = {
  dispatch: (() => { type: string }) => any,
  isSignedIn: boolean,
  hasLocalCache: boolean,
  isOnline: boolean,
  hasCheckNetworkStatus: boolean,
  errorMessage: string,
  alertWithType: Function,
  signingIn: boolean
};

class App extends React.Component<PropType, StateType> {
  checkLocalCache: Function;
  // checkNetworkStatus: Function;
  unsubscribe: ?Function;
  handleSignInCheck: Function;
  handleNetworkStatusChange: Function;
  constructor() {
    super();
    this.state = {
      // isSignedIn: null,
      // hasLocalCache: false,
      // isOnline: false,
      // hasCheckNetworkStatus: false
      errorMessage: ""
    };
  }

  componentWillMount() {
    //start the startup signin request routine
    this.props.dispatch(startupSigninRequest());
  }

  componentWillReceiveProps(nextProps: PropType) {
    //if new error message is different than current one, display it
    if (nextProps.errorMessage !== this.props.errorMessage)
      this.setState({
        errorMessage: nextProps.errorMessage
      });
  }

  componentWillUnmount() {
    console.log("Unmounting");
    this.props.dispatch(unsubscribe());
  }
  render(): any {
    console.log("rendering");
    // let Layout = Loading;
    const {
      isSignedIn,
      hasLocalCache,
      isOnline,
      signingIn,
      hasCheckNetworkStatus
    } = this.props;
    const { errorMessage } = this.state;
    const NetworkErrorMsg = (): React.Node => (
      <View
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <Text style={{ fontSize: 20, textAlign: "center" }}>
          Connection error: Please check your internet connection
        </Text>
      </View>
    );

    if (
      isSignedIn === null &&
      isOnline === false &&
      hasCheckNetworkStatus === true
    ) {
      return <NetworkErrorMsg />;
    }

    // adding state to navigator (integrating redux to react navigation)
    const Navigator = ({ dispatch, nav }: Object): React.Node => (
      <MainStack navigation={addNavigationHelpers({ dispatch, state: nav })} />
    );

    const mapStateToProps = (state: Object): { nav: Object } => ({
      nav: state.nav
    });

    const NavigatorWithReduxNav = connect(mapStateToProps)(Navigator);

    //error message display
    if (errorMessage) {
      this.props.alertWithType("error", "Error", errorMessage);
    }

    //FIXME: doesn't work
    console.log("signingIn", signingIn);
    if (signingIn) return <Loading />;
    return (
      //isSignedIn is used in case if the user has outdated local cache
      //and authorization with firebase failed than return to signinandup screen
      // <NavigatorWithReduxNav screenProps={{ isSignedIn: isSignedIn }} />
      <NavigatorWithReduxNav />
    );
  }
}

const mapStateToProps = (state: Object): Object => {
  const {
    isSignedIn,
    hasLocalCache,
    isOnline,
    hasCheckNetworkStatus,
    errorMessage,
    signingIn
  } = state.auth;
  return {
    isSignedIn,
    hasLocalCache,
    isOnline,
    hasCheckNetworkStatus,
    errorMessage,
    signingIn
  };
};

const CafeApp = connect(mapStateToProps)(connectAlert(App));

export default (): React.Node => (
  <Provider store={store}>
    <AlertProvider>
      <CafeApp />
    </AlertProvider>
  </Provider>
);
