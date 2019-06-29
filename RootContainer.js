import React, { Component } from "react";
import { View, StatusBar, SafeAreaView } from "react-native";
import ReduxNavigation from "./Navigation/ReduxNavigation";
import { connect } from "react-redux";

class RootContainer extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="light-content" />
          <ReduxNavigation />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ auth: { loggedIn } }) => ({ loggedIn });

export default connect(
  mapStateToProps,
  null
)(RootContainer);
