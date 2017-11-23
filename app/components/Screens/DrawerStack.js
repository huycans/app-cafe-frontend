//@flow
import * as React from "react";
import {
  Image,
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Linking,
  Dimensions
} from "react-native";
import {
  DrawerNavigator,
  NavigationActions,
  StackNavigator
} from "react-navigation";

import * as MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as FontAwesomeIcons from "react-native-vector-icons/FontAwesome";
import * as SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { Profile, PointsExchange, Settings, Newsfeed } from "./SignedInDrawer";

const iconSize = 22;
const SignedInDrawer = DrawerNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "Profile",
        drawerIcon: (): React.Node => (
          <FontAwesomeIcons.default name="user-circle-o" size={iconSize} />
        )
      }
    },
    Newsfeed: {
      screen: Newsfeed,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "TIN TỨC",
        drawerIcon: (): React.Node => (
          <FontAwesomeIcons.default name="newspaper-o" size={iconSize} />
        )
      }
    },
    PointsExchange: {
      screen: PointsExchange,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "ĐỔI ĐIỂM",
        drawerIcon: (): React.Node => (
          <FontAwesomeIcons.default name="exchange" size={iconSize} />
        )
      }
    },
    Settings: {
      screen: Settings,
      navigationOptions: {
        gesturesEnabled: false,
        drawerLabel: "CÀI ĐẶT",
        drawerIcon: (): React.Node => (
          <SimpleLineIcons.default name="settings" size={iconSize} />
        )
      }
    }
  },
  { initialRouteName: "Newsfeed" }
);

type NavOptionsType = {
  headerStyle: { backgroundColor: string },
  title: ?string,
  gesturesEnabled: boolean,
  headerTintColor: string,
  headerLeft: React.Node
};
//the drawers are inside of another stack
const MainDrawerStack = StackNavigator(
  {
    SignedInDrawer: { screen: SignedInDrawer }
  },
  {
    headerMode: "float",
    navigationOptions: ({ navigation }: any): NavOptionsType => ({
      headerStyle: { backgroundColor: "#FCD836" },
      title: null,
      gesturesEnabled: false,
      headerTintColor: "white",
      headerLeft: (
        <MaterialIcons.Button
          name="menu"
          backgroundColor="transparent"
          underlayColor="transparent"
          onPress={() => {
            if (navigation.state.index === 0) {
              navigation.navigate("DrawerOpen");
            } else {
              navigation.navigate("DrawerClose");
            }
          }}
        />
      )
    })
  }
);

export default MainDrawerStack;
