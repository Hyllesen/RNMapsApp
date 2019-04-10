import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  Keyboard,
  View,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import MapScreen from "./MapScreen";
import PlaceInput from "./components/PlaceInput";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMapPermission: false
    };
  }

  componentDidMount() {
    this.requestFineLocation();
  }

  hideKeyboard() {
    Keyboard.dismiss();
  }

  async requestFineLocation() {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({ hasMapPermission: true });
        }
      } else {
        this.setState({ hasMapPermission: true });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    if (this.state.hasMapPermission) {
      return (
        <TouchableWithoutFeedback onPress={this.hideKeyboard}>
          <View style={styles.container}>
            <MapScreen />
            <PlaceInput />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
