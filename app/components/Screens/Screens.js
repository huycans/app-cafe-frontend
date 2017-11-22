//@flow
import React, { Component } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TextInput,
  Image,
  Animated,
  Easing,
  Button
} from "react-native";
import {
  StackNavigator,
  NavigationActions,
  addNavigationHelpers
} from "react-navigation";
import MainDrawerStack from "./DrawerStack";
import SigninAndSignup from "./SigninAndSignup";
import EmailSignup from "./EmailSignup";
const noTransitionConfig = (): Object => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0
  }
});

const createNavigationalScreens = (hasLocalCache: boolean): Function =>
  StackNavigator(
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

    {
      initialRouteName: hasLocalCache ? "MainDrawerStack" : "SigninAndSignup",
      transitionConfig: noTransitionConfig
    }
  );

export default createNavigationalScreens;
