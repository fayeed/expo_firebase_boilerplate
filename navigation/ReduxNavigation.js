import * as React from "react";
import { BackHandler, Platform } from "react-native";
import {
  createReactNavigationReduxMiddleware,
  reduxifyNavigator
} from "react-navigation-redux-helpers";
import { connect } from "react-redux";
import AppNavigator from "./AppNavigator";

createReactNavigationReduxMiddleware("root", state => state.nav);

const ReduxAppNavigator = reduxifyNavigator(AppNavigator, "root");

class ReduxNavigation extends React.Component {
  componentDidMount() {
    if (Platform.OS === "ios") return;
    BackHandler.addEventListener("hardwareBackPress", () => {
      const { dispatch, nav } = this.props;
      // change to whatever is your first screen, otherwise unpredictable results may occur
      if (
        nav.routes.length === 1 &&
        nav.routes[0].routeName === "LaunchScreen"
      ) {
        return false;
      }
      // if (shouldCloseApp(nav)) return false
      dispatch({ type: "Navigation/BACK" });
      return true;
    });
  }

  componentWillUnmount() {
    if (Platform.OS === "ios") return;
    BackHandler.removeEventListener("hardwareBackPress", undefined);
  }

  render() {
    const nav = {
      ...this.props.nav,
      index: this.props && this.props.loggedIn ? 1 : 0
    };
    return <ReduxAppNavigator dispatch={this.props.dispatch} state={nav} />;
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  loggedIn: state.auth.loggedIn,
  auth: state.auth
});
export default connect(mapStateToProps)(ReduxNavigation);
