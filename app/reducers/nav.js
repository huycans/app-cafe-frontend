import { NavigationActions } from "react-navigation";
import NavigatorWithReduxNav from "../components/Screens/Screens";

const initialState = NavigatorWithReduxNav.router.getStateForAction(
  NavigationActions.init()
);

export default (state = initialState, action) => {
  const nextState = NavigatorWithReduxNav.router.getStateForAction(
    action,
    state
  );
  return nextState || state;
};
