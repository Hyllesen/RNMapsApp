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
import axios from "axios";
import PlaceInput from "./components/PlaceInput";
import PolyLine from "@mapbox/polyline";
import Polyline from "react-native-maps";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMapPermission: false,
      userLatitude: 0,
      userLongitude: 0
    };
    this.locationWatchId = null;
    this.showDirectionsOnMap = this.showDirectionsOnMap.bind(this);
  }

  componentDidMount() {
    this.requestFineLocation();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.locationWatchId);
  }

  async showDirectionsOnMap(placeId) {
    const { userLatitude, userLongitude } = this.state;
    try {
      const result = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=place_id:${placeId}&key=AIzaSyBx4jdXqTV6sX6IiFx1lC50l_0b_32Neys`
      );
      const points = PolyLine.decode(
        result.data.routes[0].overview_polyline.points
      );
      const latLng = points.map(point => ({
        latitude: point[0],
        longitude: point[1]
      }));
      console.log(latLng);
    } catch (err) {
      console.error(err);
    }
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
            >
              <Polyline coordinates={this.state.destinationCoords} />
            </MapScreen>
            <PlaceInput
              showDirectionsOnMap={this.showDirectionsOnMap}
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
