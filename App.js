import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { Component } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Provider } from "react-redux";
import createStore from "./redux";
import RootContainer from "./navigation/ReduxNavigation";
import firebase from "firebase";
import "firebase/firestore";
import firebaseConfig from "./config/FirebaseConfig";

const store = createStore();

class App extends Component {
  state = {
    isLoadingComplete: false
  };

  componentWillMount() {
    firebase.initializeApp(firebaseConfig);
    const firestore = firebase.firestore();
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={loadResourcesAsync}
          onError={handleLoadingError}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <RootContainer />
        </Provider>
      );
    }
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      ...FontAwesome.font,
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
    })
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
