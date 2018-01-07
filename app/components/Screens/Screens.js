//@flow
import * as React from "react";
import { Animated, Easing } from "react-native";
import { StackNavigator, addNavigationHelpers } from "react-navigation";
import MainDrawerStack from "./DrawerStack";
import SigninAndSignup from "./SigninAndSignup";
import EmailSignup from "./EmailSignup";
import { connect } from "react-redux";

const noTransitionConfig = (): Object => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
});

type PropType = {
  hasLocalCache: boolean
};

const MainStack = StackNavigator(
  {
    SigninAndSignup: {
      screen: SigninAndSignup,
      navigationOptions: {
        title: "Welcome",
        headerLeft: null,
        header: null
      }
    },
    EmailSignup: {
      screen: EmailSignup,
      navigationOptions: {
        title: "Email Signup",
        header: null
      }
    },
    MainDrawerStack: {
      screen: MainDrawerStack,
      navigationOptions: {
        title: "You are Signed in",
        header: null
      }
    }
  },
  //TODO: find out how to pass hasLocalCache to navigator
  {
    // initialRouteName: props.hasLocalCache
    initialRouteName: false ? "MainDrawerStack" : "SigninAndSignup",
    transitionConfig: noTransitionConfig
  }
);

//adding state to navigator (integrating redux to react navigation)
const Navigator = ({ dispatch, nav }: Object): React.Node => (
  <MainStack navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

const mapStateToProps = (state: Object): { nav: Object } => ({
  nav: state.nav,
  hasLocalCache: state.hasLocalCache
});

const NavigatorWithReduxNav = connect(mapStateToProps)(Navigator);

export default NavigatorWithReduxNav;
