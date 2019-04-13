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
      hasMapPermission: false,
      userLatitude: 0,
      userLongitude: 0
    };
    this.locationWatchId = null;
  }

  componentDidMount() {
    this.requestFineLocation();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.locationWatchId);
  }

  hideKeyboard() {
    Keyboard.dismiss();
  }

  getUserPosition() {
    this.setState({ hasMapPermission: true });
    this.locationWatchId = navigator.geolocation.watchPosition(
      pos => {
        this.setState({
          userLatitude: pos.coords.latitude,
          userLongitude: pos.coords.longitude
        });
      },
      err => console.warn(err),
      {
        enableHighAccuracy: true
      }
    );
  }

  async requestFineLocation() {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.getUserPosition();
        }
      } else {
        this.getUserPosition();
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
            <MapScreen
              userLatitude={this.state.userLatitude}
              userLongitude={this.state.userLongitude}
            />
            <PlaceInput
              userLatitude={this.state.userLatitude}
              userLongitude={this.state.userLongitude}
            />
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
