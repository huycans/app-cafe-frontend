/**
 * @flow
 */
import * as React from "react";
import { AppRegistry } from "react-native";
import CafeApp from "./app/CafeApp";
import { Provider } from "react-redux";
import store from "./app/store/store";

console.log(store, typeof store);
console.log(CafeApp, typeof CafeApp);
AppRegistry.registerComponent("CafeApp", (): any => (
  <Provider store={store}>
    <CafeApp />
  </Provider>
));
