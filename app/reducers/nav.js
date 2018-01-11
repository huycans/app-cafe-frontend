import MainStack, { initialState } from "../components/Screens/Screens";

export default (state = initialState, action) => {
  const nextState = MainStack.router.getStateForAction(action, state);
  return nextState || state;
};
