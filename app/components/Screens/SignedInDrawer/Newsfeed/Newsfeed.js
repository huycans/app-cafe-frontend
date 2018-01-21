//@flow
import * as React from "react";

import { TabNavigator } from "react-navigation";

import FBFeed from "./FBFeed";
import AdminPost from "./AdminPost";

const Newsfeed = TabNavigator(
  {
    FBFeed: {
      screen: FBFeed,
      navigationOptions: {
        tabBarLabel: "Bài đăng"
      }
    },
    AdminPost: {
      screen: AdminPost,
      navigationOptions: {
        tabBarLabel: "Tin tức"
      }
    }
  },
  {
    initialRouteName: "FBFeed",
    swipeEnabled: false,
    animationEnabled: true,
    lazy: true,
    tabBarOptions: {
      style: {
        backgroundColor: "#FCD836"
      },
      indicatorStyle: {
        borderBottomColor: "#4B4B4B",
        borderBottomWidth: 2
      },
      activeTintColor: "#CEb02B"
      // inactiveTintColor: "#FCD836"
    }
  }
);

export default Newsfeed;
