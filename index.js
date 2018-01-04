/**
 * @flow
 */
import * as React from "react";
import { AppRegistry } from "react-native";
import CafeApp from "./app/CafeApp";
import { Provider, connect } from "react-redux";
import store from "./app/store/store";

AppRegistry.registerComponent("CafeApp", (): any => (
  <Provider store={store}>
    <CafeApp />
  </Provider>
));
