/**
 * @flow
 */
import * as React from "react";
import { AppRegistry } from "react-native";
import CafeApp from "./app/CafeApp";
import { addNavigationHelpers } from "react-navigation";
import { Provider, connect } from "react-redux";
import store from "./app/store/store";

const App = ({ dispatch, nav }: Object): React.Node => (
  <CafeApp navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

const mapStateToProps = (state: Object): { nav: Object } => ({
  nav: state.nav
});
const AppWithNavigation = connect(mapStateToProps)(App);

AppRegistry.registerComponent("CafeApp", (): any => (
  <Provider store={store}>
    <AppWithNavigation />
  </Provider>
));
