//@flow
import * as React from "react";
import { Animated, Easing } from "react-native";
import { StackNavigator, NavigationActions } from "react-navigation";
import MainDrawerStack from "./DrawerStack";
import SigninAndSignup from "./SigninAndSignup";
import EmailSignup from "./EmailSignup";
import { connect } from "react-redux";
import SplashScreen from "./SplashScreen";
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
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        title: null,
        headerLeft: null,
        header: null
      }
    },
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
  {
    // initialRouteName: props.hasLocalCache ? "MainDrawerStack" : "SigninAndSignup",
    initialRouteName: "SplashScreen",
    transitionConfig: noTransitionConfig
  }
);

const initialState = MainStack.router.getStateForAction(
  NavigationActions.init()
);

export { initialState };
export default MainStack;
