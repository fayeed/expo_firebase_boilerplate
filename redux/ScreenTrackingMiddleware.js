import { NavigationActions } from "react-navigation";

const getCurrentRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
};

const screenTracking = ({ getState }) => next => action => {
  if (
    action.type !== NavigationActions.NAVIGATE &&
    action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }

  const currentScreen = getCurrentRouteName(getState().nav);
  const result = next(action);
  const nextScreen = getCurrentRouteName(getState().nav);
  if (nextScreen !== currentScreen) {
    try {
      console.log(`NAVIGATING ${currentScreen} to ${nextScreen}`);
    } catch (e) {
      console.log(e);
    }
  }
  return result;
};

export default screenTracking;
