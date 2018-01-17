import { NavigationActions } from "react-navigation";
import MainStack from "../components/Screens/Screens";

const initialState = MainStack.router.getStateForAction(
  NavigationActions.init()
);
const nav = (state = initialState, action) => {
  const nextState = MainStack.router.getStateForAction(action, state);
  return nextState || state;
};

export default nav;
